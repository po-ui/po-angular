import { chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { getWorkspaceConfigGracefully } from '../utils/project';
import { updatePackageJson } from '../utils/package-config';

import { replaceChanges, ReplaceChanges, tsLint, regexPackages } from './changes';

export function updateToV2() {
  return chain([updatePackageJson('0.0.0-PLACEHOLDER'), replaceTsLint(), createUpgradeRule(), postUpdate()]);
}

function postUpdate() {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}

function replaceTsLint() {
  return (tree: Tree) => {
    const file = 'tslint.json';

    if (tree.exists(file)) {
      const sourceText = tree.read(file)!.toString('utf-8');
      let updated = sourceText;

      if (updated) {
        updated = updated.replace(tsLint.replace, tsLint.replaceWith);
      }

      if (updated !== sourceText) {
        tree.overwrite(file, updated);
      }
    }
    return tree;
  };
}

function createUpgradeRule() {
  return (tree: Tree, context: SchematicContext) => {
    const logger = context.logger;
    const workspace = getWorkspaceConfigGracefully(tree);

    if (workspace === null) {
      logger.error('Não foi possível encontrar o arquivo de configuração de workspace.');
      return;
    }

    const projectNames = Object.keys(workspace.projects);
    for (const projectName of projectNames) {
      const project = workspace.projects[projectName];

      applyUpdateInContent(tree, project.sourceRoot!);
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

      if (file.endsWith('.ts')) {
        updated = updated.replace(regexPackages, '@po-ui/ng-$1');
      }

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
    content = content.replace(regex, replaceWith);
  });

  return content;
}
