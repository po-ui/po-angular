import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson } from '../utils/package-config';

/**
 * Scaffolds the basics of a PO application, this includes:
 *  - Imports PoModule to app root module;
 *  - Install dependencies;
 *  - Configure theme style in project workspace;
 */
export default function(options: any): Rule {
  return chain([
    addPoPackageAndInstall(),
    schematic('ng-add-setup-project', {
      ...options
    })
  ]);
}

function addPoPackageAndInstall(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, '@portinari/portinari-ui', '0.0.0-PLACEHOLDER');

    // install packages
    context.addTask(new NodePackageInstallTask());
  };
}
