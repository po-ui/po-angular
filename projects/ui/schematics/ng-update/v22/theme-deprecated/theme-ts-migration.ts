import * as ts from 'typescript';

import {
  PO_THEME_DEFAULT_DEPRECATED,
  PO_THEME_SERVICE,
  PO_UI_PACKAGE,
  themeDeprecatedSymbolMap,
  themeSymbolsWithoutDeprecated
} from './changes';
import {
  appendSpecifiersEdit,
  applyEdits,
  collectImports,
  getNamedImports,
  getNamespaceImport,
  importedNameOf,
  lineOf,
  parseSource,
  removeDeclarationEdit,
  removeSpecifierEdit,
  TextEdit,
  ThemeMigrationResult,
  ThemeMigrationWarning
} from './ts-utils';

const SET_DEFAULT_THEME = 'setDefaultTheme';

/**
 * Reaponta, em um arquivo TypeScript, as constantes do tema padrão para as
 * equivalentes do tema anterior (`*Deprecated`).
 *
 * Considera apenas símbolos importados de `@po-ui/ng-components`:
 * - import sem alias: renomeia o import e todas as referências ao símbolo
 *   (resolvidas pelo `TypeChecker`, ignorando propriedades e declarações
 *   locais com o mesmo nome). Em shorthand, `{ poThemeDefault }` vira
 *   `{ poThemeDefault: poThemeDefaultDeprecated }`;
 * - import com alias: troca apenas o nome importado;
 * - import de namespace: `po.poThemeDefault` vira `po.poThemeDefaultDeprecated`;
 * - re-exportação: `export { poThemeDefault } from '@po-ui/ng-components'` vira
 *   `export { poThemeDefaultDeprecated as poThemeDefault } ...`, preservando a
 *   API pública do arquivo;
 * - não duplica um import depreciado já existente.
 *
 * Quando o arquivo importa o `PoThemeService`, `<expr>.setDefaultTheme(arg)`
 * vira `<expr>.setTheme(poThemeDefaultDeprecated, arg)`, garantindo o import.
 *
 * Gera advertências para `poThemeSharedBase` (sem versão anterior) e para
 * `setDefaultTheme` em arquivos que não importam o `PoThemeService`.
 */
export function migrateThemeTsContent(source: string): ThemeMigrationResult {
  const warnings: Array<ThemeMigrationWarning> = [];

  if (!source.includes(PO_UI_PACKAGE) && !source.includes(SET_DEFAULT_THEME)) {
    return { content: source, changed: false, warnings };
  }

  const sourceFile = parseSource(source);
  const poImports = collectImports(sourceFile, PO_UI_PACKAGE);
  const edits: Array<TextEdit> = [];

  const importState = buildImportEdits(sourceFile, poImports, edits, warnings);

  if (importState.renameByImport.size > 0 || importState.namespaces.size > 0) {
    const checker = createChecker(sourceFile);
    buildReferenceEdits(sourceFile, checker, importState, edits, warnings);
  }

  buildReExportEdits(sourceFile, edits);
  buildSetDefaultThemeEdits(sourceFile, poImports, importState, edits, warnings);

  if (edits.length === 0) {
    return { content: source, changed: false, warnings };
  }

  const content = applyEdits(source, edits);
  return { content, changed: content !== source, warnings };
}

/**
 * Indica se o arquivo importa o `PoThemeService` de `@po-ui/ng-components`
 * (por nome ou por namespace).
 */
export function importsPoThemeService(source: string): boolean {
  if (!source.includes(PO_UI_PACKAGE) || !source.includes(PO_THEME_SERVICE)) {
    return false;
  }

  const sourceFile = parseSource(source);
  return collectImports(sourceFile, PO_UI_PACKAGE).some(
    decl =>
      getNamedImports(decl)?.elements.some(element => importedNameOf(element) === PO_THEME_SERVICE) ||
      (getNamespaceImport(decl) !== undefined && source.includes(`.${PO_THEME_SERVICE}`))
  );
}

/** Estado dos imports de `@po-ui/ng-components` após o planejamento das edições. */
interface ImportState {
  /** Identificador do import sem alias -> nome que as referências passam a usar. */
  renameByImport: Map<ts.Identifier, string>;
  /** Identificadores dos namespaces (`import * as po`). */
  namespaces: Set<string>;
  /** Nomes locais importados do PO UI que existirão após a migração. */
  localNamesAfter: Set<string>;
  /** Nome local do `poThemeDefaultDeprecated` após a migração, se existir. */
  deprecatedThemeLocal?: string;
}

function buildImportEdits(
  sourceFile: ts.SourceFile,
  poImports: Array<ts.ImportDeclaration>,
  edits: Array<TextEdit>,
  warnings: Array<ThemeMigrationWarning>
): ImportState {
  const state: ImportState = {
    renameByImport: new Map(),
    namespaces: new Set(),
    localNamesAfter: new Set()
  };

  // Nomes que permanecem como estão (não mapeados ou com alias).
  for (const decl of poImports) {
    const namespace = getNamespaceImport(decl);
    if (namespace) {
      state.namespaces.add(namespace.text);
    }

    for (const element of getNamedImports(decl)?.elements ?? []) {
      const importedName = importedNameOf(element);
      const mapped = hasMapping(importedName);

      if (!mapped || element.propertyName) {
        state.localNamesAfter.add(element.name.text);
      }

      if (importedName === PO_THEME_DEFAULT_DEPRECATED) {
        state.deprecatedThemeLocal = element.name.text;
      }

      if (themeSymbolsWithoutDeprecated.includes(importedName)) {
        warnings.push(withoutDeprecatedWarning(sourceFile, element, importedName));
      }
    }
  }

  for (const decl of poImports) {
    const named = getNamedImports(decl);
    if (!named) {
      continue;
    }

    const mappedElements = named.elements.filter(element => hasMapping(importedNameOf(element)));
    const removed = new Set<ts.ImportSpecifier>();
    const elementEdits: Array<TextEdit> = [];

    for (const element of mappedElements) {
      const target = themeDeprecatedSymbolMap[importedNameOf(element)];

      if (element.propertyName) {
        // `poThemeDefault as x` -> `poThemeDefaultDeprecated as x`
        elementEdits.push(replaceNodeEdit(sourceFile, element.propertyName, target));
        if (target === PO_THEME_DEFAULT_DEPRECATED) {
          state.deprecatedThemeLocal = element.name.text;
        }
        continue;
      }

      state.renameByImport.set(element.name, target);

      if (state.localNamesAfter.has(target)) {
        removed.add(element);
      } else {
        elementEdits.push(replaceNodeEdit(sourceFile, element.name, target));
        state.localNamesAfter.add(target);
        if (target === PO_THEME_DEFAULT_DEPRECATED) {
          state.deprecatedThemeLocal = target;
        }
      }
    }

    const allRemoved = removed.size > 0 && named.elements.every(element => removed.has(element));

    if (allRemoved && !decl.importClause?.name) {
      edits.push(removeDeclarationEdit(sourceFile, decl));
      continue;
    }

    removed.forEach(element => {
      if (allRemoved) {
        // Import com default + nomeados: mantém o especificador como alias.
        const target = themeDeprecatedSymbolMap[importedNameOf(element)];
        elementEdits.push(replaceNodeEdit(sourceFile, element.name, `${target} as ${element.name.text}`));
        state.renameByImport.delete(element.name);
      } else {
        elementEdits.push(removeSpecifierEdit(sourceFile, named, element));
      }
    });

    edits.push(...elementEdits);
  }

  return state;
}

function buildReferenceEdits(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  state: ImportState,
  edits: Array<TextEdit>,
  warnings: Array<ThemeMigrationWarning>
): void {
  const targetBySymbol = new Map<ts.Symbol, string>();
  state.renameByImport.forEach((target, identifier) => {
    const symbol = checker.getSymbolAtLocation(identifier);
    if (symbol) {
      targetBySymbol.set(symbol, target);
    }
  });

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) || (ts.isExportDeclaration(node) && node.moduleSpecifier)) {
      return;
    }

    if (
      (ts.isPropertyAccessExpression(node) || ts.isQualifiedName(node)) &&
      handleNamespaceAccess(sourceFile, node, state, edits, warnings)
    ) {
      return;
    }

    if (ts.isIdentifier(node) && targetBySymbol.size > 0) {
      const edit = referenceEdit(sourceFile, checker, node, targetBySymbol);
      if (edit) {
        edits.push(edit);
      }
      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

/** `po.poThemeDefault` / `typeof po.poThemeDefault` -> `po.poThemeDefaultDeprecated`. */
function handleNamespaceAccess(
  sourceFile: ts.SourceFile,
  node: ts.PropertyAccessExpression | ts.QualifiedName,
  state: ImportState,
  edits: Array<TextEdit>,
  warnings: Array<ThemeMigrationWarning>
): boolean {
  const left = ts.isPropertyAccessExpression(node) ? node.expression : node.left;
  const right = ts.isPropertyAccessExpression(node) ? node.name : node.right;

  if (!ts.isIdentifier(left) || !state.namespaces.has(left.text) || !ts.isIdentifier(right)) {
    return false;
  }

  if (hasMapping(right.text)) {
    edits.push(replaceNodeEdit(sourceFile, right, themeDeprecatedSymbolMap[right.text]));
    return true;
  }

  if (themeSymbolsWithoutDeprecated.includes(right.text)) {
    warnings.push(withoutDeprecatedWarning(sourceFile, right, right.text));
    return true;
  }

  return false;
}

/** Edição de uma referência a símbolo importado sem alias. */
function referenceEdit(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  node: ts.Identifier,
  targetBySymbol: Map<ts.Symbol, string>
): TextEdit | undefined {
  const parent = node.parent;

  // `{ poThemeDefault }` -> `{ poThemeDefault: poThemeDefaultDeprecated }`
  if (parent && ts.isShorthandPropertyAssignment(parent) && parent.name === node) {
    const symbol = checker.getShorthandAssignmentValueSymbol(parent);
    const target = symbol && targetBySymbol.get(symbol);
    return target ? replaceNodeEdit(sourceFile, node, `${node.text}: ${target}`) : undefined;
  }

  // `export { poThemeDefault }` -> `export { poThemeDefaultDeprecated as poThemeDefault }`
  if (parent && ts.isExportSpecifier(parent)) {
    const isLocalName = parent.propertyName ? parent.propertyName === node : parent.name === node;
    const symbol = isLocalName ? checker.getExportSpecifierLocalTargetSymbol(parent) : undefined;
    const target = symbol && targetBySymbol.get(symbol);

    if (!target) {
      return undefined;
    }

    return parent.propertyName
      ? replaceNodeEdit(sourceFile, node, target)
      : replaceNodeEdit(sourceFile, node, `${target} as ${node.text}`);
  }

  const symbol = checker.getSymbolAtLocation(node);
  const target = symbol && targetBySymbol.get(symbol);
  return target ? replaceNodeEdit(sourceFile, node, target) : undefined;
}

/** `export { poThemeDefault } from '@po-ui/ng-components'`. */
function buildReExportEdits(sourceFile: ts.SourceFile, edits: Array<TextEdit>): void {
  for (const statement of sourceFile.statements) {
    if (
      !ts.isExportDeclaration(statement) ||
      !statement.moduleSpecifier ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== PO_UI_PACKAGE ||
      !statement.exportClause ||
      !ts.isNamedExports(statement.exportClause)
    ) {
      continue;
    }

    for (const element of statement.exportClause.elements) {
      const importedName = importedNameOf(element);
      if (!hasMapping(importedName)) {
        continue;
      }

      const target = themeDeprecatedSymbolMap[importedName];
      edits.push(
        element.propertyName
          ? replaceNodeEdit(sourceFile, element.propertyName, target)
          : replaceNodeEdit(sourceFile, element.name, `${target} as ${element.name.text}`)
      );
    }
  }
}

/** `<expr>.setDefaultTheme(arg)` -> `<expr>.setTheme(poThemeDefaultDeprecated, arg)`. */
function buildSetDefaultThemeEdits(
  sourceFile: ts.SourceFile,
  poImports: Array<ts.ImportDeclaration>,
  state: ImportState,
  edits: Array<TextEdit>,
  warnings: Array<ThemeMigrationWarning>
): void {
  const calls: Array<ts.CallExpression> = [];
  const collect = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === SET_DEFAULT_THEME
    ) {
      calls.push(node);
    }
    ts.forEachChild(node, collect);
  };
  collect(sourceFile);

  if (calls.length === 0) {
    return;
  }

  const serviceImports = poImports
    .map(getNamedImports)
    .find(named => named?.elements.some(element => importedNameOf(element) === PO_THEME_SERVICE));
  const namespace = state.namespaces.values().next().value as string | undefined;

  if (!serviceImports && !namespace) {
    calls.forEach(call =>
      warnings.push({
        filePath: '',
        line: lineOf(sourceFile, call),
        reason:
          `A chamada "${SET_DEFAULT_THEME}" não foi migrada porque o arquivo não importa o ` +
          `"${PO_THEME_SERVICE}" de "${PO_UI_PACKAGE}". Se ela pertence ao serviço de tema, troque por ` +
          `"setTheme(${PO_THEME_DEFAULT_DEPRECATED}, <tipo>)".`
      })
    );
    return;
  }

  let reference = state.deprecatedThemeLocal;

  if (!reference && serviceImports) {
    edits.push(appendSpecifiersEdit(serviceImports, [PO_THEME_DEFAULT_DEPRECATED]));
    reference = PO_THEME_DEFAULT_DEPRECATED;
  } else if (!reference) {
    reference = `${namespace}.${PO_THEME_DEFAULT_DEPRECATED}`;
  }

  for (const call of calls) {
    const access = call.expression as ts.PropertyAccessExpression;
    edits.push(replaceNodeEdit(sourceFile, access.name, 'setTheme'));

    if (call.arguments.length > 0) {
      const start = call.arguments[0].getStart(sourceFile);
      edits.push({ start, end: start, text: `${reference}, ` });
    } else {
      edits.push({ start: call.arguments.pos, end: call.arguments.pos, text: reference });
    }
  }
}

function hasMapping(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(themeDeprecatedSymbolMap, name);
}

function replaceNodeEdit(sourceFile: ts.SourceFile, node: ts.Node, text: string): TextEdit {
  return { start: node.getStart(sourceFile), end: node.getEnd(), text };
}

function withoutDeprecatedWarning(sourceFile: ts.SourceFile, node: ts.Node, name: string): ThemeMigrationWarning {
  return {
    filePath: '',
    line: lineOf(sourceFile, node),
    reason:
      `"${name}" faz parte do novo tema padrão e não possui equivalente no tema anterior. ` +
      `Revise manualmente este uso.`
  };
}

/**
 * Cria um `TypeChecker` apenas para o arquivo informado, sem resolver módulos
 * nem carregar a `lib`. Suficiente para ligar cada referência ao símbolo do
 * seu import (inclusive com sombreamento por declarações locais).
 */
function createChecker(sourceFile: ts.SourceFile): ts.TypeChecker {
  const fileName = sourceFile.fileName;
  const host: ts.CompilerHost = {
    getSourceFile: name => (name === fileName ? sourceFile : undefined),
    getDefaultLibFileName: () => 'lib.d.ts',
    writeFile: () => undefined,
    getCurrentDirectory: () => '/',
    getCanonicalFileName: name => name,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
    fileExists: name => name === fileName,
    readFile: () => undefined
  };

  const program = ts.createProgram({
    rootNames: [fileName],
    options: { noLib: true, noResolve: true, types: [], target: ts.ScriptTarget.Latest },
    host
  });

  return program.getTypeChecker();
}
