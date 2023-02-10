import { chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';

import { getWorkspaceConfigGracefully, getProjectMainFile } from '@po-ui/ng-schematics/project';
import { addModuleImportToModule } from '@po-ui/ng-schematics/module';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import { updatePackageJson } from '@po-ui/ng-schematics/package-config';

import { updateDepedenciesVersion, httpClientModuleName, httpClientModuleSourcePath } from './changes';

export default function () {
  return chain([updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion), createUpgradeRule(), postUpdate()]);
}

function postUpdate() {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}

function createUpgradeRule() {
  return (tree: Tree, context: SchematicContext) => {
    const logger = context.logger;
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);

    if (workspace === null) {
      logger.error('Não foi possível encontrar o arquivo de configuração de workspace.');
      return;
    }

    const projectNames = Object.keys(workspace.projects);
    for (const projectName of projectNames) {
      const project = workspace.projects[projectName];

      const appModulePath = getAppModulePath(tree, getProjectMainFile(project));

      //adiciona httpClientModule no app
      addModuleImportToModule(tree, appModulePath, httpClientModuleName, httpClientModuleSourcePath);
    }
  };
}
