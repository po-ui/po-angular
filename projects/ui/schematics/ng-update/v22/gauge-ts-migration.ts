import * as ts from 'typescript';

import { gaugeSymbolMap, gaugeSymbolsWithoutEquivalent, PO_UI_PACKAGE } from './changes';
import { MigrationWarning } from './migration-report';

/**
 * Resultado da transformação de um arquivo TypeScript pela Schematic_Migracao.
 *
 * A função `migrateTypeScriptContent` é pura (string → string): recebe o
 * conteúdo original e devolve o conteúdo transformado, um indicador de
 * alteração e a lista de Casos_Nao_Migravel encontrados.
 */
export interface TsMigrationResult {
  /** Conteúdo do arquivo após a transformação (idêntico ao original se nada mudou). */
  content: string;
  /** `true` somente quando alguma transformação foi efetivamente aplicada. */
  changed: boolean;
  /** Casos_Nao_Migravel identificados (ex.: símbolo gauge sem equivalente). */
  warnings: Array<MigrationWarning>;
}

/** Edição textual pontual a ser aplicada sobre o conteúdo original. */
interface TextEdit {
  start: number;
  end: number;
  text: string;
}

/** Informações de um símbolo gauge encontrado em uma declaração de importação. */
interface GaugeSpecifierInfo {
  specifier: ts.ImportSpecifier;
  /** Nome importado (lado esquerdo de `as`, ou o próprio nome). */
  importedName: string;
  /** Nome local usado nas referências (lado direito de `as`, ou o próprio nome). */
  localName: string;
  /** Indica se o import usa alias (`PoGaugeModule as Foo`). */
  aliased: boolean;
  namedImports: ts.NamedImports;
  decl: ts.ImportDeclaration;
}

/**
 * Transforma referências ao `po-gauge` em referências equivalentes ao
 * `po-chart` em um arquivo TypeScript.
 *
 * Comportamento (Req. 4.1–4.4, 4.6, 5.1–5.3):
 * - Localiza `ImportDeclaration` de `@po-ui/ng-components` que contenham
 *   símbolos gauge e substitui os símbolos com equivalente conhecido
 *   (`gaugeSymbolMap`), preservando os demais símbolos do mesmo import.
 * - Atualiza as referências desses símbolos no restante do arquivo
 *   (`declarations`/`imports`/`exports` de `@NgModule` e `imports` de
 *   componentes standalone / configuração da aplicação).
 * - Se um símbolo gauge importado NÃO possui equivalente
 *   (`gaugeSymbolsWithoutEquivalent`), o arquivo é mantido inalterado e um
 *   `MigrationWarning` é registrado (Req. 4.4).
 * - Deduplica símbolos-alvo já importados, evitando imports/itens duplicados
 *   (idempotência, Req. 7.4).
 * - Preserva indentação, quebras de linha e a ordenação das importações não
 *   relacionadas ao gauge (Req. 4.6).
 *
 * @param source Conteúdo original do arquivo `.ts`.
 * @param isStandalone Indica se o projeto é standalone (mantido por contrato de
 *   interface; a transformação de referências é a mesma para ambas as
 *   arquiteturas).
 */
export function migrateTypeScriptContent(source: string, isStandalone: boolean): TsMigrationResult {
  void isStandalone;

  const warnings: Array<MigrationWarning> = [];
  const sourceFile = ts.createSourceFile('file.ts', source, ts.ScriptTarget.Latest, /* setParentNodes */ true);

  const poUiImports = collectPoUiImports(sourceFile);

  if (poUiImports.length === 0) {
    return { content: source, changed: false, warnings };
  }

  const gaugeSpecifiers: Array<GaugeSpecifierInfo> = [];
  const withoutEquivalent: Array<ts.ImportSpecifier> = [];
  const allImportedNames = new Set<string>();

  for (const decl of poUiImports) {
    const named = getNamedImports(decl);
    if (!named) {
      continue;
    }

    for (const element of named.elements) {
      const importedName = (element.propertyName ?? element.name).text;
      const localName = element.name.text;
      allImportedNames.add(localName);

      if (Object.prototype.hasOwnProperty.call(gaugeSymbolMap, importedName)) {
        gaugeSpecifiers.push({
          specifier: element,
          importedName,
          localName,
          aliased: element.propertyName !== undefined,
          namedImports: named,
          decl
        });
      } else if (gaugeSymbolsWithoutEquivalent.includes(importedName)) {
        withoutEquivalent.push(element);
      }
    }
  }

  // Req. 4.4 — símbolo gauge sem equivalente: mantém o arquivo inalterado e
  // registra advertência para revisão manual.
  if (withoutEquivalent.length > 0) {
    for (const element of withoutEquivalent) {
      const importedName = (element.propertyName ?? element.name).text;
      warnings.push({
        filePath: '',
        line: lineOf(sourceFile, element),
        reason:
          `O símbolo "${importedName}" do po-gauge não possui equivalente no po-chart. ` +
          `Revise manualmente este arquivo antes de removê-lo.`
      });
    }

    return { content: source, changed: false, warnings };
  }

  if (gaugeSpecifiers.length === 0) {
    return { content: source, changed: false, warnings };
  }

  const edits: Array<TextEdit> = [];

  // Nomes locais (sem alias) que serão substituídos por seu equivalente nas
  // referências ao longo do arquivo.
  const referenceRenameMap = new Map<string, string>();

  buildImportEdits(sourceFile, gaugeSpecifiers, allImportedNames, referenceRenameMap, edits);

  buildReferenceEdits(sourceFile, poUiImports, referenceRenameMap, edits);

  if (edits.length === 0) {
    return { content: source, changed: false, warnings };
  }

  const content = applyEdits(source, edits);

  return { content, changed: content !== source, warnings };
}

/** Coleta as `ImportDeclaration` cujo módulo é `@po-ui/ng-components`. */
function collectPoUiImports(sourceFile: ts.SourceFile): Array<ts.ImportDeclaration> {
  const imports: Array<ts.ImportDeclaration> = [];

  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === PO_UI_PACKAGE
    ) {
      imports.push(statement);
    }
  }

  return imports;
}

/** Retorna os `NamedImports` de uma declaração, quando existirem. */
function getNamedImports(decl: ts.ImportDeclaration): ts.NamedImports | undefined {
  const bindings = decl.importClause?.namedBindings;
  return bindings && ts.isNamedImports(bindings) ? bindings : undefined;
}

/**
 * Gera as edições sobre as declarações de importação, renomeando ou removendo
 * (deduplicando) os símbolos gauge, e alimenta o mapa de renomeação de
 * referências.
 */
function buildImportEdits(
  sourceFile: ts.SourceFile,
  gaugeSpecifiers: Array<GaugeSpecifierInfo>,
  allImportedNames: Set<string>,
  referenceRenameMap: Map<string, string>,
  edits: Array<TextEdit>
): void {
  // Alvos já presentes como símbolos importados que NÃO são símbolos gauge.
  const gaugeLocalNames = new Set(gaugeSpecifiers.map(info => info.localName));
  const presentTargets = new Set<string>();
  allImportedNames.forEach(name => {
    if (!gaugeLocalNames.has(name)) {
      presentTargets.add(name);
    }
  });

  // Índice: declaração -> símbolos gauge que serão removidos (dedup).
  const removedByDecl = new Map<ts.ImportDeclaration, Set<ts.ImportSpecifier>>();
  const declSpecifierEdits: Array<{ info: GaugeSpecifierInfo; remove: boolean; target: string }> = [];

  for (const info of gaugeSpecifiers) {
    const target = gaugeSymbolMap[info.importedName];

    if (info.aliased) {
      // Import com alias: renomeia apenas o nome importado, preservando o alias
      // local. As referências (que usam o alias) permanecem inalteradas.
      declSpecifierEdits.push({ info, remove: false, target });
      continue;
    }

    // Referências ao símbolo gauge passam a apontar para o equivalente.
    referenceRenameMap.set(info.localName, target);

    // Dedup: se o alvo já é importado, remove o símbolo gauge em vez de renomear.
    const alreadyPresent = presentTargets.has(target);

    if (alreadyPresent) {
      declSpecifierEdits.push({ info, remove: true, target });
      const set = removedByDecl.get(info.decl) ?? new Set<ts.ImportSpecifier>();
      set.add(info.specifier);
      removedByDecl.set(info.decl, set);
    } else {
      declSpecifierEdits.push({ info, remove: false, target });
      presentTargets.add(target);
    }
  }

  // Declarações cujos elementos serão TODOS removidos são apagadas por inteiro.
  const fullyRemovedDecls = new Set<ts.ImportDeclaration>();
  removedByDecl.forEach((removedSet, decl) => {
    const named = getNamedImports(decl);
    if (named && named.elements.every(element => removedSet.has(element))) {
      fullyRemovedDecls.add(decl);
    }
  });

  for (const decl of fullyRemovedDecls) {
    edits.push(removeDeclarationEdit(sourceFile, decl));
  }

  for (const { info, remove, target } of declSpecifierEdits) {
    if (fullyRemovedDecls.has(info.decl)) {
      continue;
    }

    if (remove) {
      edits.push(removeSpecifierEdit(sourceFile, info.namedImports, info.specifier));
    } else if (info.aliased && info.specifier.propertyName) {
      edits.push({
        start: info.specifier.propertyName.getStart(sourceFile),
        end: info.specifier.propertyName.getEnd(),
        text: target
      });
    } else {
      edits.push({
        start: info.specifier.name.getStart(sourceFile),
        end: info.specifier.name.getEnd(),
        text: target
      });
    }
  }
}

/**
 * Gera as edições sobre as referências dos símbolos gauge no corpo do arquivo
 * (fora das declarações de importação), com deduplicação dentro de arrays.
 */
function buildReferenceEdits(
  sourceFile: ts.SourceFile,
  poUiImports: Array<ts.ImportDeclaration>,
  referenceRenameMap: Map<string, string>,
  edits: Array<TextEdit>
): void {
  if (referenceRenameMap.size === 0) {
    return;
  }

  const importRanges = poUiImports.map(decl => ({ start: decl.getStart(sourceFile), end: decl.getEnd() }));
  // Rastreia os alvos já presentes/emitidos por array, para evitar duplicatas
  // em listas como `declarations`/`imports`/`exports`.
  const emittedTargetsByArray = new Map<ts.ArrayLiteralExpression, Set<string>>();

  const visit = (node: ts.Node): void => {
    if (ts.isIdentifier(node) && referenceRenameMap.has(node.text) && !isWithinRanges(node, sourceFile, importRanges)) {
      if (isRenameableReference(node)) {
        // O `!` é necessário sob strictNullChecks (build de schematics): a
        // condição do `if` acima garante que a chave existe no mapa.
        const target = referenceRenameMap.get(node.text)!;
        const array = getContainingArrayElement(node);

        if (array) {
          const emitted = emittedTargetsByArray.get(array) ?? collectExistingArrayNames(array, referenceRenameMap);
          emittedTargetsByArray.set(array, emitted);

          if (emitted.has(target)) {
            // Alvo já presente no array: remove o elemento gauge (dedup).
            edits.push(removeArrayElementEdit(sourceFile, array, node));
            return;
          }

          emitted.add(target);
        }

        edits.push({ start: node.getStart(sourceFile), end: node.getEnd(), text: target });
      }
      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

/** Verifica se o identificador é uma referência renomeável (não é chave/propriedade). */
function isRenameableReference(node: ts.Identifier): boolean {
  const parent = node.parent;

  if (!parent) {
    return true;
  }

  // `obj.PoGaugeModule` — não é referência ao símbolo importado.
  if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
    return false;
  }

  // `{ PoGaugeModule: ... }` — chave de objeto, não é referência.
  if (ts.isPropertyAssignment(parent) && parent.name === node) {
    return false;
  }

  // `PoGaugeModule.prop` como qualificador de tipo.
  if (ts.isQualifiedName(parent) && parent.right === node) {
    return false;
  }

  return true;
}

/** Retorna o `ArrayLiteralExpression` do qual o nó é elemento direto, se houver. */
function getContainingArrayElement(node: ts.Node): ts.ArrayLiteralExpression | undefined {
  const parent = node.parent;
  if (parent && ts.isArrayLiteralExpression(parent) && parent.elements.indexOf(node as ts.Expression) !== -1) {
    return parent;
  }
  return undefined;
}

/** Coleta os nomes já existentes em um array, mapeando símbolos gauge para seus alvos. */
function collectExistingArrayNames(
  array: ts.ArrayLiteralExpression,
  referenceRenameMap: Map<string, string>
): Set<string> {
  const names = new Set<string>();

  for (const element of array.elements) {
    // Nomes que não são gauge já contam como presentes com seu próprio nome.
    if (ts.isIdentifier(element) && !referenceRenameMap.has(element.text)) {
      names.add(element.text);
    }
  }

  return names;
}

/** Indica se um nó está contido em alguma das faixas informadas. */
function isWithinRanges(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  ranges: Array<{ start: number; end: number }>
): boolean {
  const start = node.getStart(sourceFile);
  return ranges.some(range => start >= range.start && start < range.end);
}

/** Cria uma edição que remove um `ImportSpecifier`, cuidando das vírgulas. */
function removeSpecifierEdit(sourceFile: ts.SourceFile, named: ts.NamedImports, element: ts.ImportSpecifier): TextEdit {
  const elements = named.elements;
  const index = elements.indexOf(element);

  if (index < elements.length - 1) {
    // Remove do início do elemento até o início do próximo (inclui a vírgula).
    return { start: element.getStart(sourceFile), end: elements[index + 1].getStart(sourceFile), text: '' };
  }

  // Último elemento: remove do fim do elemento anterior (inclui a vírgula).
  return { start: elements[index - 1].getEnd(), end: element.getEnd(), text: '' };
}

/** Cria uma edição que remove um elemento de array, cuidando das vírgulas. */
function removeArrayElementEdit(
  sourceFile: ts.SourceFile,
  array: ts.ArrayLiteralExpression,
  element: ts.Node
): TextEdit {
  const elements = array.elements;
  const index = elements.indexOf(element as ts.Expression);

  if (index < elements.length - 1) {
    return { start: element.getStart(sourceFile), end: elements[index + 1].getStart(sourceFile), text: '' };
  }

  if (index > 0) {
    return { start: elements[index - 1].getEnd(), end: element.getEnd(), text: '' };
  }

  // Único elemento do array.
  return { start: element.getStart(sourceFile), end: element.getEnd(), text: '' };
}

/** Cria uma edição que remove uma `ImportDeclaration` inteira, incluindo a quebra de linha. */
function removeDeclarationEdit(sourceFile: ts.SourceFile, decl: ts.ImportDeclaration): TextEdit {
  const start = decl.getStart(sourceFile);
  let end = decl.getEnd();

  const text = sourceFile.getFullText();
  // Consome uma eventual quebra de linha subsequente para não deixar linha vazia.
  if (text[end] === '\r' && text[end + 1] === '\n') {
    end += 2;
  } else if (text[end] === '\n' || text[end] === '\r') {
    end += 1;
  }

  return { start, end, text: '' };
}

/** Número da linha (1-indexado) em que o nó inicia. */
function lineOf(sourceFile: ts.SourceFile, node: ts.Node): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

/** Aplica as edições sobre o conteúdo, do fim para o início, preservando offsets. */
function applyEdits(source: string, edits: Array<TextEdit>): string {
  const ordered = [...edits].sort((a, b) => b.start - a.start);

  let result = source;
  for (const edit of ordered) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  }

  return result;
}
