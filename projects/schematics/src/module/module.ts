import { addDeclarationToModule, addExportToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange, Change } from '@schematics/angular/utility/change';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

import * as ts from 'typescript';

/** Reads file given path and returns TypeScript source file. */
export function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);

  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }

  return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
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


function insertInModule(tree: Tree, changes: Array<Change>, modulePath: string) {
  const recorder = tree.beginUpdate(modulePath);

  changes.forEach(change => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  tree.commitUpdate(recorder);
}
