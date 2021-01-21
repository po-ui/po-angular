import { chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { strings } from '@angular-devkit/core';

import { ReplaceChanges, replaceInFile } from '@po-ui/ng-schematics/replace';
import { getWorkspaceConfigGracefully } from '@po-ui/ng-schematics/project';
import { sortObjectByKeys } from '@po-ui/ng-schematics/package-config';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import {
  angularJsonReplaces,
  replaceChanges,
  tsLintReplaces,
  regexPackages,
  changesComponents,
  dependeciesChanges,
  replacePackages
} from './changes';

export function updateToV2() {
  return chain([
    updatePackageJson('0.0.0-PLACEHOLDER', dependeciesChanges),
    replaceInFile('tslint.json', tsLintReplaces),
    replaceInFile('angular.json', angularJsonReplaces),
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

      if (file.endsWith('.ts')) {
        updated = updated.replace(regexPackages, replacePackages);
      }

      if (file.endsWith('.html') || file.endsWith('.ts')) {
        updated = addFunctionsOnPage(file, filePath, tree, updated);
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

function getUsedFunctions(content: string, searchActions) {
  const foundUsedFunctions: Array<string> = [];

  if (!content) {
    return foundUsedFunctions;
  }

  searchActions.forEach((searchContent: string) => {
    const regex = new RegExp(`${searchContent}\\(`);
    if (content.search(regex) > -1) {
      foundUsedFunctions.push(searchContent);
    }
  });

  return foundUsedFunctions;
}

function addFunctionsOnPage(file, filePath, tree, content) {
  let tsSource;

  changesComponents.forEach(({ component, actions }) => {
    const isHTML = file.endsWith('.html');
    const searchTagComponent = `<${component}`;
    const foundComponentPosition = content.search(searchTagComponent);

    if (foundComponentPosition > -1) {
      if (isHTML) {
        const typeScriptFileName = filePath.substring(0, filePath.lastIndexOf('.'));
        tsSource = tree.read(`${typeScriptFileName}.ts`)!.toString('utf-8');
      }

      const usedFunctions = getUsedFunctions(isHTML ? tsSource : content, actions);

      usedFunctions.forEach(usedFunction => {
        const dasherizeFunction = strings.dasherize(usedFunction);

        content =
          content.slice(0, foundComponentPosition + searchTagComponent.length) +
          ` (p-${dasherizeFunction})="${usedFunction}()"` +
          content.slice(foundComponentPosition + searchTagComponent.length);
      });
    }
  });

  return content;
}

function replaceWithChanges(replaces: Array<ReplaceChanges>, content: string = '') {
  replaces.forEach(({ replace, replaceWith }) => {
    const regex = new RegExp(replace, 'gi');
    content = content.replace(regex, <string>replaceWith);
  });

  return content;
}

function updatePackageJson(version: string, dependenciesChanges: { [key: string]: string }) {
  return (tree: Tree): Tree => {
    if (tree.exists('package.json')) {
      const sourceText = tree.read('package.json')!.toString('utf-8');
      const json = JSON.parse(sourceText);

      if (!json.dependencies) {
        json.dependencies = {};
      }

      // necessario apenas quando migrar para @po-ui/ng-components
      if (json.dependencies['@po-ui/ng-components']) {
        delete json.dependencies['@po-ui/ng-components'];
      }

      Object.keys(dependenciesChanges).forEach(pkg => {
        const previousPackage = pkg;
        const newPackage = dependenciesChanges[pkg];

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
