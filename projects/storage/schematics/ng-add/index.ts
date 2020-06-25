import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson } from '@po-ui/ng-schematics/package-config';
import { addModuleImportToRootModule } from '@po-ui/ng-schematics/module/module';

/** PO Module name that will be inserted into app root module */
const poStorageModuleName = 'PoStorageModule.forRoot()';
const poStorageModuleSourcePath = '@po-ui/ng-storage';

/**
 * Scaffolds the basics of the PO Storage, this includes:
 *  - Install dependencies;
 *  - Imports PoStorageModule to app root module;
 */
export default function (options: any): Rule {
  return chain([
    addPoPackageAndInstall(),
    addModuleImportToRootModule(options, poStorageModuleName, poStorageModuleSourcePath)
  ]);
}

function addPoPackageAndInstall(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, '@po-ui/ng-storage', '0.0.0-PLACEHOLDER');

    // install packages
    context.addTask(new NodePackageInstallTask());
  };
}
