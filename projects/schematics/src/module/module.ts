import { addImportToModule, addDeclarationToModule, addExportToModule } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { InsertChange, Change } from '@schematics/angular/utility/change';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

import * as ts from 'typescript';

import { getProjectMainFile, getProjectFromWorkspace, getWorkspaceConfigGracefully } from '../project';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

export function addModuleImportToRootModule(options: any, moduleName: string, modulePath: string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project = getProjectFromWorkspace(workspace, options.project);
    const appModulePath = getAppModulePath(host, getProjectMainFile(project));

    if (!hasNgModuleImport(host, appModulePath, moduleName)) {
      // not add the module if the project already use
      addModuleImportToModule(host, appModulePath, moduleName, modulePath);
    }

    return host;
  };
}

/** Reads file given path and returns TypeScript source file. */
export function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);

  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }

  return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}

/** */
export function addModuleImportToModule(tree: Tree, modulePath: string, moduleName: string, importPath: string) {
  const moduleSource = getSourceFile(tree, modulePath);

  const changes = addImportToModule(moduleSource as any, modulePath, moduleName, importPath);

  return insertInModule(tree, changes, modulePath);
}

/** */
export function addDeclarationComponentToModule(
  tree: Tree,
  modulePath: string,
  moduleName: string,
  importPath: string
) {
  const moduleSource = getSourceFile(tree, modulePath);

  const changes = addDeclarationToModule(moduleSource as any, modulePath, moduleName, importPath);

  return insertInModule(tree, changes, modulePath);
}

/** */
export function addExportComponentToModule(tree: Tree, modulePath: string, moduleName: string, importPath: string) {
  const moduleSource = getSourceFile(tree, modulePath);

  const changes = addExportToModule(moduleSource as any, modulePath, moduleName, importPath);

  return insertInModule(tree, changes, modulePath);
}

/**
 * Whether the Angular module in the given path imports the specified module class name.
 */
export function hasNgModuleImport(tree: Tree, modulePath: string, className: string): boolean {
  const moduleFileContent = tree.read(modulePath);

  if (!moduleFileContent) {
    throw new SchematicsException(`Could not read Angular module file: ${modulePath}`);
  }

  const parsedFile = ts.createSourceFile(modulePath, moduleFileContent.toString(), ts.ScriptTarget.Latest, true);
  const ngModuleMetadata = findNgModuleMetadata(parsedFile);

  if (!ngModuleMetadata) {
    throw new SchematicsException(`Could not find NgModule declaration inside: '${modulePath}'`);
  }

  for (const property of ngModuleMetadata.properties) {
    if (
      !ts.isPropertyAssignment(property) ||
      property.name.getText() !== 'imports' ||
      !ts.isArrayLiteralExpression(property.initializer)
    ) {
      continue;
    }

    if (property.initializer.elements.some(element => element.getText() === className)) {
      return true;
    }
  }

  return false;
}

/**
 * Finds a NgModule declaration within the specified TypeScript node and returns the
 * corresponding metadata for it. This function searches breadth first because
 * NgModule's are usually not nested within other expressions or declarations.
 */
function findNgModuleMetadata(rootNode: ts.Node): ts.ObjectLiteralExpression | null {
  // Add immediate child nodes of the root node to the queue.
  const nodeQueue: Array<ts.Node> = [...rootNode.getChildren()];

  while (nodeQueue.length) {
    const node = nodeQueue.shift()!;

    if (ts.isDecorator(node) && ts.isCallExpression(node.expression) && isNgModuleCallExpression(node.expression)) {
      return node.expression.arguments[0] as ts.ObjectLiteralExpression;
    } else {
      nodeQueue.push(...node.getChildren());
    }
  }

  return null;
}

/** Whether the specified call expression is referring to a NgModule definition. */
function isNgModuleCallExpression(callExpression: ts.CallExpression): boolean {
  if (!callExpression.arguments.length || !ts.isObjectLiteralExpression(callExpression.arguments[0])) {
    return false;
  }

  const decoratorIdentifier = resolveIdentifierOfExpression(callExpression.expression);
  return decoratorIdentifier ? decoratorIdentifier.text === 'NgModule' : false;
}

/**
 * Resolves the last identifier that is part of the given expression. This helps resolving
 * identifiers of nested property access expressions (e.g. myNamespace.core.NgModule).
 */
function resolveIdentifierOfExpression(expression: ts.Expression): ts.Identifier | null {
  if (ts.isIdentifier(expression)) {
    return expression;
  } else if (ts.isPropertyAccessExpression(expression)) {
    return <any>expression.name;
  }
  return null;
}

function insertInModule(tree: Tree, changes: Array<Change>, modulePath: string) {
  const recorder = tree.beginUpdate(modulePath);

  changes.forEach(change => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  tree.commitUpdate(recorder);
}
