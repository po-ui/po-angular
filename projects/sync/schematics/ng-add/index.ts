import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson } from '@po-ui/ng-schematics/package-config';

/**
 * Scaffolds the basics of the PO Sync, this includes:
 *  - Install dependencies;
 *  - Imports PoStorageModule and PoSyncModule to app root module;
 */
export default function (options: any): Rule {
  return chain([
    addPoPackageAndInstall(),
    schematic('ng-add-setup-project', {
      ...options
    })
  ]);
}

function addPoPackageAndInstall(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, '@po-ui/ng-sync', '0.0.0-PLACEHOLDER');

    // install packages
    context.addTask(new NodePackageInstallTask());
  };
}
