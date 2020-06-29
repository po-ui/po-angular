import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson } from '@po-ui/ng-schematics/package-config';
import { addModuleImportToRootModule } from '@po-ui/ng-schematics/module/module';

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
    addModuleImportToRootModule(options, poStorageModuleName, poStorageModuleSourcePath),
    addModuleImportToRootModule(options, poPoSyncModuleName, poPoSyncModuleSourcePath)
  ]);
}

function addPoPackageAndInstall(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, '@po-ui/ng-sync', '0.0.0-PLACEHOLDER');
    // install packages
    context.addTask(new NodePackageInstallTask());
    // Log de processamento
    context.logger.info(
      'Sync added successfully, please execute the command `ionic cordova plugin add cordova-plugin-network-information`'
    );
  };
}
