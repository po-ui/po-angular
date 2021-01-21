import { chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { ReplaceChanges } from '@po-ui/ng-schematics/replace';
import { getWorkspaceConfigGracefully } from '@po-ui/ng-schematics/project';
import { updatePackageJson } from '@po-ui/ng-schematics/package-config';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { replaceChanges, updateDepedenciesVersion } from './changes';

export function updateToV3() {
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
      const entryFolderProject = project.projectType === 'library' ? 'lib' : 'app';
      const sourceDir = `${project.sourceRoot}/${entryFolderProject}`;

      applyUpdateInContent(tree, sourceDir);
    }
  };
}

function applyUpdateInContent(tree: Tree, path: string) {
  const directory = tree.getDir(path);
  if (directory.subfiles.length) {
    directory.subfiles.forEach(file => {
      const filePath = path + '/' + file;
      const content = tree.read(filePath)!.toString('utf-8');
      if (!content) {
        return;
      }

      let updated = content;

      if (file.endsWith('.html') || file.endsWith('.ts')) {
        updated = replaceWithChanges(replaceChanges, updated);

        if (updated !== content) {
          tree.overwrite(filePath, updated);
        }
      }
    });
  }

  if (directory.subdirs.length) {
    directory.subdirs.forEach(subDir => {
      applyUpdateInContent(tree, path + '/' + subDir);
    });
  }
}

function replaceWithChanges(replaces: Array<ReplaceChanges>, content: string = '') {
  replaces.forEach(({ replace, replaceWith }) => {
    const regex = new RegExp(replace, 'gi');
    content = content.replace(regex, <string>replaceWith);
  });

  return content;
}
