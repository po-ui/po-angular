import { chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { strings } from '@angular-devkit/core';

import { getWorkspaceConfigGracefully } from '../utils/project';
import { updatePackageJson } from '../utils/package-config';

import { replaceChanges, ReplaceChanges, tsLint, regexPackages, changesComponents } from './changes';

export function updateToV2() {
  return chain([
    updatePackageJson('0.0.0-PLACEHOLDER'),
    replaceTsLint(),
    replaceAgularJson(),
    createUpgradeRule(),
    postUpdate()
  ]);
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

function replaceAgularJson() {
  return (tree: Tree) => {
    const file = 'angular.json';

    if (tree.exists(file)) {
      const sourceText = tree.read(file)!.toString('utf-8');
      let updated = sourceText;

      if (updated) {
        updated = updated.replace(regexPackages, replacePackages).replace(/portinari\-theme/g, 'po-theme');
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
    content = content.replace(regex, replaceWith);
  });

  return content;
}

function replacePackages(foundString: string, _, pkg: string) {
  const org = '@po-ui';

  if (pkg === 'ui') {
    return `${org}/ng-components`;
  } else if (pkg === 'style') {
    return `${org}/style`;
  } else if (pkg) {
    return `${org}/ng-${pkg}`;
  }

  return foundString;
}
