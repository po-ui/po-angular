import { Rule, Tree } from '@angular-devkit/schematics';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { addRootProvider } from '@schematics/angular/utility';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { findAppConfig } from '@schematics/angular/utility/standalone/app_config';
import { findBootstrapApplicationCall } from '@schematics/angular/utility/standalone/util';
import { getProjectFromWorkspace, getProjectMainFile, getWorkspaceConfigGracefully } from '../project';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';

export function importProvidersFrom(
  options: any,
  moduleName: string,
  packageName: string,
  argsImportProvidersFrom: string
) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFile(project);

    if (!isStandaloneApp(host, browserEntryPoint)) {
      return host;
    }

    return addProvider(host, options.project, browserEntryPoint, moduleName, packageName, argsImportProvidersFrom);
  };
}

function addProvider(
  host: Tree,
  projectName: string,
  mainPath: string,
  moduleName: string,
  packageName: string,
  argsImportProvidersFrom: string
): Rule {
  const bootstrapCall = findBootstrapApplicationCall(host, mainPath);
  const appConfig = findAppConfig(bootstrapCall, host, mainPath)?.filePath || mainPath;
  addImport(host, appConfig, moduleName, packageName);

  return addRootProvider(
    projectName,
    ({ code, external }) => code`${external('importProvidersFrom', '@angular/core')}(${argsImportProvidersFrom})`
  );
}

function addImport(host: Tree, filePath: string, symbolName: string, moduleName: string): void {
  const moduleSource = getTsSourceFile(host, filePath);
  const change = insertImport(moduleSource, filePath, symbolName, moduleName);

  if (change) {
    const recorder = host.beginUpdate(filePath);
    applyToUpdateRecorder(recorder, [change]);
    host.commitUpdate(recorder);
  }
}

function getTsSourceFile(host: Tree, path: string): ts.SourceFile {
  const content = host.readText(path);
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return source;
}
