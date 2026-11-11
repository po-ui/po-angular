import * as ts from 'typescript';

/** Advertência de um caso que exige revisão manual. */
export interface ThemeMigrationWarning {
  /** Caminho do arquivo. As funções puras deixam vazio e a regra preenche. */
  filePath: string;
  /** Linha (1-indexada) do trecho. */
  line: number;
  /** Motivo da revisão manual. */
  reason: string;
}

/** Resultado das transformações puras (string para string). */
export interface ThemeMigrationResult {
  /** Conteúdo transformado (idêntico ao original quando nada mudou). */
  content: string;
  /** `true` somente quando alguma transformação foi aplicada. */
  changed: boolean;
  /** Casos que exigem revisão manual. */
  warnings: Array<ThemeMigrationWarning>;
}

/** Edição textual pontual sobre o conteúdo original. */
export interface TextEdit {
  start: number;
  end: number;
  text: string;
}

/** Cria a AST de um arquivo com os nós pais preenchidos. */
export function parseSource(source: string, fileName = '/file.ts'): ts.SourceFile {
  return ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

/** Retorna as `ImportDeclaration` do módulo informado. */
export function collectImports(sourceFile: ts.SourceFile, moduleName: string): Array<ts.ImportDeclaration> {
  return sourceFile.statements.filter(
    (statement): statement is ts.ImportDeclaration =>
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === moduleName
  );
}

/** Retorna os `NamedImports` de uma declaração, quando existirem. */
export function getNamedImports(decl: ts.ImportDeclaration): ts.NamedImports | undefined {
  const bindings = decl.importClause?.namedBindings;
  return bindings && ts.isNamedImports(bindings) ? bindings : undefined;
}

/** Retorna o nome local do namespace (`import * as po`), quando existir. */
export function getNamespaceImport(decl: ts.ImportDeclaration): ts.Identifier | undefined {
  const bindings = decl.importClause?.namedBindings;
  return bindings && ts.isNamespaceImport(bindings) ? bindings.name : undefined;
}

/** Nome importado de um especificador (lado esquerdo do `as`). */
export function importedNameOf(specifier: ts.ImportSpecifier | ts.ExportSpecifier): string {
  return (specifier.propertyName ?? specifier.name).text;
}

/**
 * Localiza o nome local de um símbolo importado do módulo informado.
 * Retorna `undefined` se o símbolo não é importado.
 */
export function findLocalImportName(
  sourceFile: ts.SourceFile,
  moduleName: string,
  importedName: string
): string | undefined {
  for (const decl of collectImports(sourceFile, moduleName)) {
    const element = getNamedImports(decl)?.elements.find(item => importedNameOf(item) === importedName);
    if (element) {
      return element.name.text;
    }
  }
  return undefined;
}

/** Edição que remove um `ImportSpecifier`, cuidando das vírgulas. */
export function removeSpecifierEdit(
  sourceFile: ts.SourceFile,
  named: ts.NamedImports,
  element: ts.ImportSpecifier
): TextEdit {
  const elements = named.elements;
  const index = elements.indexOf(element);

  if (index < elements.length - 1) {
    return { start: element.getStart(sourceFile), end: elements[index + 1].getStart(sourceFile), text: '' };
  }

  return { start: elements[index - 1].getEnd(), end: element.getEnd(), text: '' };
}

/** Edição que remove uma `ImportDeclaration` inteira, incluindo a quebra de linha seguinte. */
export function removeDeclarationEdit(sourceFile: ts.SourceFile, decl: ts.ImportDeclaration): TextEdit {
  const text = sourceFile.getFullText();
  const start = decl.getStart(sourceFile);
  let end = decl.getEnd();

  if (text[end] === '\r' && text[end + 1] === '\n') {
    end += 2;
  } else if (text[end] === '\n') {
    end += 1;
  }

  return { start, end, text: '' };
}

/**
 * Edição que acrescenta símbolos a um import nomeado existente, depois do
 * último elemento (preserva vírgula final e quebras de linha).
 */
export function appendSpecifiersEdit(named: ts.NamedImports, names: Array<string>): TextEdit {
  const last = named.elements[named.elements.length - 1];
  const text = names.map(name => `, ${name}`).join('');

  return { start: last.getEnd(), end: last.getEnd(), text };
}

/** Edição que insere novas linhas de import depois do último import do arquivo. */
export function addImportLinesEdit(
  sourceFile: ts.SourceFile,
  imports: Array<{ names: Array<string>; moduleName: string }>
): TextEdit {
  const lines = imports.map(({ names, moduleName }) => `import { ${names.join(', ')} } from '${moduleName}';`);
  const declarations = sourceFile.statements.filter(ts.isImportDeclaration);

  if (declarations.length === 0) {
    return { start: 0, end: 0, text: `${lines.join('\n')}\n\n` };
  }

  const end = declarations[declarations.length - 1].getEnd();
  return { start: end, end, text: lines.map(line => `\n${line}`).join('') };
}

/** Linha (1-indexada) em que o nó inicia. */
export function lineOf(sourceFile: ts.SourceFile, node: ts.Node): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

/** Aplica as edições do fim para o início, preservando os offsets. */
export function applyEdits(source: string, edits: Array<TextEdit>): string {
  const ordered = [...edits].sort((a, b) => b.start - a.start || b.end - a.end);

  let result = source;
  for (const edit of ordered) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  }

  return result;
}
