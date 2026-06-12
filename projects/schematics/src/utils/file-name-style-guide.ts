import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

/**
 * Supported Angular file name style guides.
 *
 * - `2016`: classic Angular Style Guide, file names include the type suffix
 *   (e.g. `app.component.ts`, `app.module.ts`).
 * - `2025`: current Angular convention, file names omit the type suffix
 *   (e.g. `app.ts`, `app-module.ts`).
 */
export type FileNameStyleGuide = '2016' | '2025';

/**
 * The file name suffixes applied to generated files for each style guide.
 */
export interface FileNameSuffixes {
  componentSuffix: string;
  moduleSuffix: string;
  routingModuleSuffix: string;
}

/**
 * Returns the file name suffixes to apply to generated files for the given style guide.
 */
export function getFileNameSuffixes(styleGuide: FileNameStyleGuide): FileNameSuffixes {
  const isStyleGuide2016 = styleGuide === '2016';

  return {
    componentSuffix: isStyleGuide2016 ? '.component' : '',
    moduleSuffix: isStyleGuide2016 ? '.module' : '-module',
    routingModuleSuffix: isStyleGuide2016 ? '-routing.module' : '-routing-module'
  };
}

/**
 * Detects the file name style guide already used by the project by inspecting the root
 * symbol (component or module) bootstrapped in the given main file.
 *
 * The import path of the bootstrapped symbol reveals the convention:
 * - `./app/app.component` or `./app/app.module` => `2016`
 * - `./app/app` or `./app/app-module` => `2025`
 *
 * When the main file can not be read or parsed, it falls back to `2025` (the current default).
 */
export function detectFileNameStyleGuide(host: Tree, mainPath: string): FileNameStyleGuide {
  const bootstrapImportPath = getBootstrapImportPath(host, mainPath);

  if (!bootstrapImportPath) {
    return '2025';
  }

  const fileName = bootstrapImportPath.split('/').pop() ?? '';

  return fileName.endsWith('.component') || fileName.endsWith('.module') ? '2016' : '2025';
}

/**
 * Reads the main file and returns the module specifier of the imported symbol that is passed
 * to `bootstrapApplication(...)` (standalone) or `bootstrapModule(...)` (NgModule).
 */
function getBootstrapImportPath(host: Tree, mainPath: string): string | undefined {
  if (!host.exists(mainPath)) {
    return undefined;
  }

  const content = host.read(mainPath)?.toString('utf-8');

  if (!content) {
    return undefined;
  }

  const source = ts.createSourceFile(mainPath, content, ts.ScriptTarget.Latest, true);
  const bootstrapSymbol = getBootstrappedSymbolName(source);

  if (!bootstrapSymbol) {
    return undefined;
  }

  return getImportSpecifierForSymbol(source, bootstrapSymbol);
}

/**
 * Finds the name of the symbol passed as the first argument to a `bootstrapApplication` or
 * `bootstrapModule` call.
 */
function getBootstrappedSymbolName(source: ts.SourceFile): string | undefined {
  let symbolName: string | undefined;

  const visit = (node: ts.Node): void => {
    if (symbolName) {
      return;
    }

    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      (node.expression.text === 'bootstrapApplication' || node.expression.text === 'bootstrapModule')
    ) {
      const firstArgument = node.arguments[0];

      if (firstArgument && ts.isIdentifier(firstArgument)) {
        symbolName = firstArgument.text;
        return;
      }
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(source, visit);

  return symbolName;
}

/**
 * Returns the module specifier used to import the given symbol name.
 */
function getImportSpecifierForSymbol(source: ts.SourceFile, symbolName: string): string | undefined {
  for (const statement of source.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !statement.importClause ||
      !statement.importClause.namedBindings ||
      !ts.isNamedImports(statement.importClause.namedBindings) ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      continue;
    }

    const importsSymbol = statement.importClause.namedBindings.elements.some(
      element => element.name.text === symbolName
    );

    if (importsSymbol) {
      return statement.moduleSpecifier.text;
    }
  }

  return undefined;
}
