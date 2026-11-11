import { Tree } from '@angular-devkit/schematics';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
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
 * Detects the name of the root component class already used by the project, so a schematic
 * that overwrites the root component keeps the class name expected by the existing imports.
 *
 * - Standalone apps bootstrap the component directly (`bootstrapApplication(App)`), so the
 *   bootstrapped symbol is the component name (e.g. `App` or `AppComponent`).
 * - NgModule apps bootstrap the module (`bootstrapModule(AppModule)`), so the component is
 *   read from the `bootstrap: [...]` array of the module's `@NgModule` decorator.
 *
 * Returns `undefined` when the name can not be resolved, so callers can fall back to their
 * own convention.
 */
export function detectRootComponentClassName(host: Tree, mainPath: string): string | undefined {
  const mainSource = readSourceFile(host, mainPath);

  if (!mainSource) {
    return undefined;
  }

  const bootstrapCall = getBootstrapCall(mainSource);

  if (!bootstrapCall) {
    return undefined;
  }

  // Standalone: the bootstrapped symbol is the root component itself.
  if (bootstrapCall.callName === 'bootstrapApplication') {
    return bootstrapCall.symbolName;
  }

  // NgModule: resolve the module file and read the bootstrap component from its decorator.
  let appModulePath: string;

  try {
    appModulePath = getAppModulePath(host, mainPath);
  } catch {
    return undefined;
  }

  const moduleSource = readSourceFile(host, appModulePath);

  if (!moduleSource) {
    return undefined;
  }

  return getNgModuleBootstrapComponent(moduleSource);
}

/**
 * Reads the main file and returns the module specifier of the imported symbol that is passed
 * to `bootstrapApplication(...)` (standalone) or `bootstrapModule(...)` (NgModule).
 */
function getBootstrapImportPath(host: Tree, mainPath: string): string | undefined {
  const source = readSourceFile(host, mainPath);

  if (!source) {
    return undefined;
  }

  const bootstrapSymbol = getBootstrappedSymbolName(source);

  if (!bootstrapSymbol) {
    return undefined;
  }

  return getImportSpecifierForSymbol(source, bootstrapSymbol);
}

/** Describes the bootstrap call found in a main file. */
interface BootstrapCall {
  /** The bootstrap function name: `bootstrapApplication` (standalone) or `bootstrapModule` (NgModule). */
  callName: 'bootstrapApplication' | 'bootstrapModule';
  /** The identifier passed as the first argument (the root component or the root module). */
  symbolName: string;
}

/**
 * Finds the bootstrap call in the source and returns the function name along with the
 * symbol passed as its first argument.
 */
function getBootstrapCall(source: ts.SourceFile): BootstrapCall | undefined {
  let result: BootstrapCall | undefined;

  const visit = (node: ts.Node): void => {
    if (result) {
      return;
    }

    if (ts.isCallExpression(node)) {
      // The bootstrap call may be a direct identifier (`bootstrapApplication(...)`) or a
      // chained method (`platformBrowser().bootstrapModule(...)`), where the callee is a
      // property access expression. Resolve the called name from either shape.
      const callee = node.expression;
      const calledName = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : undefined;

      if (calledName === 'bootstrapApplication' || calledName === 'bootstrapModule') {
        const firstArgument = node.arguments[0];

        if (firstArgument && ts.isIdentifier(firstArgument)) {
          result = { callName: calledName, symbolName: firstArgument.text };
          return;
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(source, visit);

  return result;
}

/** Finds the name of the symbol bootstrapped in the given source (component or module). */
function getBootstrappedSymbolName(source: ts.SourceFile): string | undefined {
  return getBootstrapCall(source)?.symbolName;
}

/**
 * Extracts the first component name listed in the `bootstrap: [...]` array of an `@NgModule`
 * decorator found in the given module source.
 */
function getNgModuleBootstrapComponent(source: ts.SourceFile): string | undefined {
  let componentName: string | undefined;

  const visit = (node: ts.Node): void => {
    if (componentName) {
      return;
    }

    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === 'bootstrap') {
      if (ts.isArrayLiteralExpression(node.initializer)) {
        const firstElement = node.initializer.elements[0];

        if (firstElement && ts.isIdentifier(firstElement)) {
          componentName = firstElement.text;
          return;
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(source, visit);

  return componentName;
}

/** Reads a file from the tree and parses it into a TypeScript source file. */
function readSourceFile(host: Tree, filePath: string): ts.SourceFile | undefined {
  if (!host.exists(filePath)) {
    return undefined;
  }

  const content = host.read(filePath)?.toString('utf-8');

  if (!content) {
    return undefined;
  }

  return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
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
