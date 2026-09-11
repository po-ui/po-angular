import { chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { updatePackageJson } from '@po-ui/ng-schematics/package-config';

import { updateDepedenciesVersion } from './changes';

export default function () {
  return chain([updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion), postUpdate()]);
}

function postUpdate() {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}
