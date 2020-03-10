import { getWorkspace } from '@schematics/angular/utility/config';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Tree } from '@angular-devkit/schematics';
import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';

import * as path from 'path';

import { getProjectFromWorkspace, getProjectTargetOptions } from '../utils/project';

const collectionPath = path.join(__dirname, '../collection.json');

describe('Schematic: ng-add', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0'
  };

  const componentOptions: any = {
    name: 'po',
    appName: 'po',
    project: 'po',
    style: 'css',
    skipTests: false
  };

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = runner.runExternalSchematic('@schematics/angular', 'application', componentOptions, appTree);
  });

  describe('Dependencies:', () => {
    it('should update package.json with @portinari/portinari-ui dependency and run nodePackageInstall', () => {
      const tree = runner.runSchematic('ng-add', componentOptions, appTree);

      const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
      const dependencies = packageJson.dependencies;
      // const angularCoreVersion = dependencies['@angular/core'];

      // expect(dependencies['@angular/core']).toBe(angularCoreVersion);
      expect(dependencies['@portinari/portinari-ui']).toBeDefined();
      expect(Object.keys(dependencies)).toEqual(Object.keys(dependencies).sort());
      expect(runner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });
  });

  describe('Imports:', () => {
    it('should add the PoModule to the project module', () => {
      const poModuleName = 'PoModule';

      const tree = runner.runSchematic('ng-add-setup-project', componentOptions, appTree);
      const fileContent = getFileContent(tree, `projects/${componentOptions.appName}/src/app/app.module.ts`);

      expect(fileContent).toContain(poModuleName);
    });
  });

  describe('Theme configuration:', () => {
    const defaultThemePath = './node_modules/@portinari/style/css/po-theme-default.min.css';

    it('should add default theme in styles of build project', () => {
      const tree = runner.runSchematic('ng-add-setup-project', componentOptions, appTree);

      const workspace = getWorkspace(tree);
      const project = getProjectFromWorkspace(workspace);

      expectProjectStyleFile(project, defaultThemePath);
    });

    it('shouldn`t add a theme file in styles of build project multiple times', () => {
      writeStyleFileToWorkspace(appTree, defaultThemePath);

      const tree = runner.runSchematic('ng-add-setup-project', componentOptions, appTree);

      const workspace = getWorkspace(tree);
      const project = getProjectFromWorkspace(workspace);
      const styles = getProjectTargetOptions(project, 'build').styles;

      expect(styles).toEqual([`projects/${componentOptions.appName}/src/styles.css`, defaultThemePath]);
    });
  });
});

/** Expects the given file to be in the styles of the specified workspace project. */
function expectProjectStyleFile(project: WorkspaceProject, filePath: string) {
  expect(getProjectTargetOptions(project, 'build').styles).toContain(
    filePath,
    `Expected "${filePath}" to be added to the project styles in the workspace.`
  );
}

/** Gets the content of a specified file from a schematic tree. */
function getFileContent(tree: Tree, filePath: string): string {
  const contentBuffer = tree.read(filePath);

  if (!contentBuffer) {
    throw new Error(`Cannot read "${filePath}" because it does not exist.`);
  }

  return contentBuffer.toString();
}

/** Writes a specific style file to the workspace in the given tree */
function writeStyleFileToWorkspace(tree: Tree, stylePath: string) {
  const workspace = getWorkspace(tree);
  const project = getProjectFromWorkspace(workspace);
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.styles) {
    buildOptions.styles = [stylePath];
  } else {
    buildOptions.styles.push(stylePath);
  }

  tree.overwrite('/angular.json', JSON.stringify(workspace, null, 2));
}
