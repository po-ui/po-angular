import * as ts from 'typescript';

import { PO_THEME_DEFAULT_DEPRECATED, PO_THEME_SERVICE, PO_UI_PACKAGE } from './changes';
import {
  addImportLinesEdit,
  appendSpecifiersEdit,
  applyEdits,
  collectImports,
  findLocalImportName,
  getNamedImports,
  parseSource,
  TextEdit,
  ThemeMigrationResult
} from './ts-utils';

const ANGULAR_CORE = '@angular/core';
const SERVICE_FIELD = 'poThemeService';

/** Comentário inserido antes da chamada, para facilitar a volta ao novo tema. */
export const DEPRECATED_THEME_COMMENT =
  '// Tema anterior do PO UI (depreciado, remoção na v24). Remova esta chamada para usar o novo tema padrão.';

/**
 * Injeta o `PoThemeService` no componente principal e aplica o tema anterior
 * (`poThemeDefaultDeprecated`) no construtor.
 *
 * - Adiciona os imports de `inject` (`@angular/core`) e de `PoThemeService` e
 *   `poThemeDefaultDeprecated` (`@po-ui/ng-components`), reaproveitando os já
 *   existentes (inclusive com alias).
 * - Adiciona o campo `private readonly poThemeService = inject(PoThemeService);`
 *   no início da classe.
 * - Insere a chamada `this.poThemeService.setTheme(poThemeDefaultDeprecated);`
 *   no início do construtor, logo após o `super()`, se houver. Sem construtor,
 *   cria um após as propriedades da classe.
 *
 * Não altera o arquivo quando a chamada já existe (idempotência) e devolve uma
 * advertência quando não encontra a classe com `@Component` ou quando a classe
 * já possui um membro `poThemeService`.
 *
 * @param source Conteúdo do arquivo do componente.
 * @param className Nome da classe do componente principal. Sem ele, usa a
 *   primeira classe com `@Component` do arquivo.
 */
export function injectDeprecatedTheme(source: string, className?: string): ThemeMigrationResult {
  const sourceFile = parseSource(source);
  const component = findComponentClass(sourceFile, className);

  if (!component) {
    const target = className ? `a classe "${className}" com @Component` : 'uma classe com @Component';
    return warn(source, 1, `Não foi possível localizar ${target}. Aplique o tema anterior manualmente.`);
  }

  const deprecatedLocal = findLocalImportName(sourceFile, PO_UI_PACKAGE, PO_THEME_DEFAULT_DEPRECATED);
  if (deprecatedLocal && callsSetThemeWith(component, deprecatedLocal)) {
    return { content: source, changed: false, warnings: [] };
  }

  if (
    component.members.some(member => member.name && ts.isIdentifier(member.name) && member.name.text === SERVICE_FIELD)
  ) {
    return warn(
      source,
      lineOfNode(sourceFile, component),
      `A classe "${component.name?.text}" já possui o membro "${SERVICE_FIELD}". Aplique o tema anterior manualmente.`
    );
  }

  const edits: Array<TextEdit> = [];
  const names = addImports(sourceFile, edits);

  const indent = detectMemberIndent(sourceFile, component);
  const innerIndent = indent + (indent || '  ');
  const call = `this.${SERVICE_FIELD}.setTheme(${names.deprecated});`;
  const field = `private readonly ${SERVICE_FIELD} = ${names.inject}(${names.service});`;

  const openBrace = component.members.pos;
  const constructorDecl = component.members.find(ts.isConstructorDeclaration);

  if (constructorDecl?.body) {
    edits.push({ start: openBrace, end: openBrace, text: `\n${indent}${field}\n` });
    edits.push(constructorCallEdit(sourceFile, constructorDecl.body, indent, innerIndent, call));
  } else {
    const ctor = [
      `${indent}constructor() {`,
      `${innerIndent}${DEPRECATED_THEME_COMMENT}`,
      `${innerIndent}${call}`,
      `${indent}}`
    ].join('\n');
    const lastProperty = lastLeadingProperty(component);
    const closeBrace = component.getEnd() - 1;

    if (lastProperty) {
      edits.push({ start: openBrace, end: openBrace, text: `\n${indent}${field}\n` });
      edits.push({ start: lastProperty.getEnd(), end: lastProperty.getEnd(), text: `\n\n${ctor}` });
    } else if (component.members.length === 0 && isBlank(source, openBrace, closeBrace)) {
      const classIndent = indentationAt(source, component.getStart(sourceFile));
      edits.push({ start: openBrace, end: closeBrace, text: `\n${indent}${field}\n\n${ctor}\n${classIndent}` });
    } else {
      edits.push({ start: openBrace, end: openBrace, text: `\n${indent}${field}\n\n${ctor}\n` });
    }
  }

  const content = applyEdits(source, edits);
  return { content, changed: content !== source, warnings: [] };
}

/** Localiza a classe com `@Component` (opcionalmente pelo nome). */
function findComponentClass(sourceFile: ts.SourceFile, className?: string): ts.ClassDeclaration | undefined {
  return sourceFile.statements.find(
    (statement): statement is ts.ClassDeclaration =>
      ts.isClassDeclaration(statement) &&
      (!className || statement.name?.text === className) &&
      (ts.getDecorators(statement) ?? []).some(
        decorator =>
          ts.isCallExpression(decorator.expression) &&
          ts.isIdentifier(decorator.expression.expression) &&
          decorator.expression.expression.text === 'Component'
      )
  );
}

/** Indica se a classe já chama `.setTheme(<deprecated>...)`. */
function callsSetThemeWith(component: ts.ClassDeclaration, deprecatedLocal: string): boolean {
  let found = false;
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'setTheme' &&
      node.arguments[0] &&
      ts.isIdentifier(node.arguments[0]) &&
      node.arguments[0].text === deprecatedLocal
    ) {
      found = true;
    }
    if (!found) {
      ts.forEachChild(node, visit);
    }
  };
  visit(component);
  return found;
}

interface LocalNames {
  inject: string;
  service: string;
  deprecated: string;
}

/** Garante os imports necessários e devolve os nomes locais a usar. */
function addImports(sourceFile: ts.SourceFile, edits: Array<TextEdit>): LocalNames {
  const injectLocal = findLocalImportName(sourceFile, ANGULAR_CORE, 'inject');
  const serviceLocal = findLocalImportName(sourceFile, PO_UI_PACKAGE, PO_THEME_SERVICE);
  const deprecatedLocal = findLocalImportName(sourceFile, PO_UI_PACKAGE, PO_THEME_DEFAULT_DEPRECATED);

  const missing: Array<{ names: Array<string>; moduleName: string }> = [
    { moduleName: ANGULAR_CORE, names: injectLocal ? [] : ['inject'] },
    {
      moduleName: PO_UI_PACKAGE,
      names: [...(serviceLocal ? [] : [PO_THEME_SERVICE]), ...(deprecatedLocal ? [] : [PO_THEME_DEFAULT_DEPRECATED])]
    }
  ];

  const newLines: Array<{ names: Array<string>; moduleName: string }> = [];

  for (const item of missing.filter(entry => entry.names.length > 0)) {
    const named = collectImports(sourceFile, item.moduleName)
      .map(getNamedImports)
      .find(bindings => bindings && bindings.elements.length > 0);

    if (named) {
      edits.push(appendSpecifiersEdit(named, item.names));
    } else {
      newLines.push(item);
    }
  }

  if (newLines.length > 0) {
    edits.push(addImportLinesEdit(sourceFile, newLines));
  }

  return {
    inject: injectLocal ?? 'inject',
    service: serviceLocal ?? PO_THEME_SERVICE,
    deprecated: deprecatedLocal ?? PO_THEME_DEFAULT_DEPRECATED
  };
}

/** Edição que insere a chamada no construtor (após o `super()`, se houver). */
function constructorCallEdit(
  sourceFile: ts.SourceFile,
  body: ts.Block,
  indent: string,
  innerIndent: string,
  call: string
): TextEdit {
  const text = `\n${innerIndent}${DEPRECATED_THEME_COMMENT}\n${innerIndent}${call}`;
  const superCall = body.statements.find(
    statement =>
      ts.isExpressionStatement(statement) &&
      ts.isCallExpression(statement.expression) &&
      statement.expression.expression.kind === ts.SyntaxKind.SuperKeyword
  );

  if (superCall) {
    return { start: superCall.getEnd(), end: superCall.getEnd(), text };
  }

  const open = body.getStart(sourceFile) + 1;
  const close = body.getEnd() - 1;

  if (body.statements.length === 0 && isBlank(sourceFile.getFullText(), open, close)) {
    return { start: open, end: close, text: `${text}\n${indent}` };
  }

  return { start: open, end: open, text };
}

/** Última propriedade de um bloco contínuo de propriedades no início da classe. */
function lastLeadingProperty(component: ts.ClassDeclaration): ts.ClassElement | undefined {
  let last: ts.ClassElement | undefined;
  for (const member of component.members) {
    if (!ts.isPropertyDeclaration(member)) {
      break;
    }
    last = member;
  }
  return last;
}

/** Indentação dos membros da classe (padrão: 2 espaços a partir da classe). */
function detectMemberIndent(sourceFile: ts.SourceFile, component: ts.ClassDeclaration): string {
  const text = sourceFile.getFullText();
  const reference = component.members[0];

  if (reference) {
    return indentationAt(text, reference.getStart(sourceFile));
  }

  return `${indentationAt(text, component.getStart(sourceFile))}  `;
}

function indentationAt(text: string, position: number): string {
  const lineStart = text.lastIndexOf('\n', position - 1) + 1;
  const match = /^[ \t]*/.exec(text.slice(lineStart, position));
  return match ? match[0] : '';
}

function isBlank(text: string, start: number, end: number): boolean {
  return text.slice(start, end).trim() === '';
}

function lineOfNode(sourceFile: ts.SourceFile, node: ts.Node): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function warn(source: string, line: number, reason: string): ThemeMigrationResult {
  return { content: source, changed: false, warnings: [{ filePath: '', line, reason }] };
}
