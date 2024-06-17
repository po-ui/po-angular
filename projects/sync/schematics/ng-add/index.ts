import { chain, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addModuleImportToModule, hasNgModuleImport } from '@po-ui/ng-schematics/module';
import { addPackageToPackageJson } from '@po-ui/ng-schematics/package-config';
import {
  getProjectFromWorkspace,
  getProjectTargetOptions,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

/** PO Module name that will be inserted into app root module */
const poStorageModuleName = 'PoStorageModule.forRoot()';
const poStorageModuleSourcePath = '@po-ui/ng-storage';
const poPoSyncModuleName = 'PoSyncModule';
const poPoSyncModuleSourcePath = '@po-ui/ng-sync';

/**
 * Scaffolds the basics of the PO Sync, this includes:
 *  - Install dependencies;
 *  - Imports PoStorageModule and PoSyncModule to app root module;
 */
export default function (options: any): Rule {
  return chain([
    addPoPackageAndInstall(),
    addModuleImportToRootModuleSync(options, poStorageModuleName, poStorageModuleSourcePath),
    addModuleImportToRootModuleSync(options, poPoSyncModuleName, poPoSyncModuleSourcePath)
  ]);
}

function addPoPackageAndInstall(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, '@po-ui/ng-sync', '0.0.0-PLACEHOLDER');
    // install packages
    context.addTask(new NodePackageInstallTask());
  };
}

export function addModuleImportToRootModuleSync(options: any, moduleName: string, modulePath: string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFileSync(project);

    const appModulePath = getAppModulePath(host, browserEntryPoint);
    if (!hasNgModuleImport(host, appModulePath, moduleName)) {
      // not add the module if the project already use
      addModuleImportToModule(host, appModulePath, moduleName, modulePath);
    }

    return host;
  };
}

/** Looks for the main TypeScript file in the given project and returns its path. */
export function getProjectMainFileSync(project: WorkspaceProject): string {
  const buildOptions = getProjectTargetOptions(project, 'build');
  if (!buildOptions.main) {
    throw new SchematicsException(
      `Could not find the project main file inside of the ` + `workspace config (${project.sourceRoot})`
    );
  }

  return buildOptions.main;
}
