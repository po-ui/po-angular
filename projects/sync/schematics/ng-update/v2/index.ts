import { chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { getWorkspaceConfigGracefully } from '@po-ui/ng-schematics/project';
import { replaceInFile, ReplaceChanges } from '@po-ui/ng-schematics/replace';
import { sortObjectByKeys } from '@po-ui/ng-schematics/package-config';

import { dependeciesChanges, replaceChanges, tsLintChanges, regexPackages } from './changes';

export function updateToV2() {
  return chain([
    updatePackageJson('0.0.0-PLACEHOLDER', dependeciesChanges),
    replaceInFile('tslint.json', tsLintChanges),
    createUpgradeRule(),
    postUpdate()
  ]);
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
    content = content.replace(regex, <string>replaceWith);
  });

  return content;
}

export function updatePackageJson(version: string, dependenciesMap: { [key: string]: string }) {
  return (tree: Tree): Tree => {
    if (tree.exists('package.json')) {
      const sourceText = tree.read('package.json')!.toString('utf-8');
      const json = JSON.parse(sourceText);

      if (!json.dependencies) {
        json.dependencies = {};
      }

      Object.keys(dependenciesMap).forEach(pkg => {
        const previousPackage = pkg;
        const newPackage = dependenciesMap[pkg];

        if (json.dependencies[previousPackage]) {
          json.dependencies[newPackage] = version;

          delete json.dependencies[previousPackage];
        }
      });

      if (json.devDependencies['@portinari/tslint']) {
        json.devDependencies['@po-ui/ng-tslint'] = '2.0.0';

        delete json.devDependencies['@portinari/tslint'];
      }

      json.dependencies = sortObjectByKeys(json.dependencies);
      json.devDependencies = sortObjectByKeys(json.devDependencies);

      tree.overwrite('package.json', JSON.stringify(json, null, 2));
    }

    return tree;
  };
}
