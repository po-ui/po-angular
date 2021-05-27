import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { Tree } from '@angular-devkit/schematics';

import {
  getProjectFromWorkspace,
  getProjectTargetOptions,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';

import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('Schematic: ng-add', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0'
  };

  const componentOptions: any = {
    name: 'po'
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise();
    appTree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', componentOptions, appTree)
      .toPromise();
  });

  describe('Dependencies:', () => {
    it('should update package.json with @po-ui/ng-code-editor dependency and run nodePackageInstall', async () => {
      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();

      const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
      const dependencies = packageJson.dependencies;

      expect(dependencies['@po-ui/ng-code-editor']).toBeDefined();
      expect(Object.keys(dependencies)).toEqual(Object.keys(dependencies).sort());
      expect(runner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });
  });

  describe('Imports:', () => {
    it('should add the PoCodeEditorModule to the project module', async () => {
      const poCodeEditorModuleName = 'PoCodeEditorModule';

      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();
      const fileContent = getFileContent(tree, `projects/${componentOptions.name}/src/app/app.module.ts`);

      expect(fileContent).toContain(poCodeEditorModuleName);
    });
  });

  describe('Theme configuration:', () => {
    const defaultThemePath = './node_modules/@po-ui/style/css/po-theme-default.min.css';

    it('should add default theme in styles of build project', async () => {
      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();

      const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
      const project = getProjectFromWorkspace(workspace);

      expectProjectPropertyFile(project, defaultThemePath, 'styles');
    });

    it('shouldn`t add a theme file in styles of build project multiple times', async () => {
      writePropertiesFileToWorkspace(appTree, defaultThemePath, 'styles');

      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();

      const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
      const project = getProjectFromWorkspace(workspace);
      const styles = getProjectTargetOptions(project, 'build').styles;

      expect(styles).toEqual([`projects/${componentOptions.name}/src/styles.css`, defaultThemePath]);
    });
  });

  describe('Assets configuration:', () => {
    const defaultAssetsPath = {
      'glob': '**/*',
      'input': 'node_modules/monaco-editor/min',
      'output': '/assets/monaco/'
    };

    it('should add assets of build project', async () => {
      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();

      const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
      const project = getProjectFromWorkspace(workspace);
      const assets = getProjectTargetOptions(project, 'build').assets;

      const hasMonacoAssets = assets.some(
        element => typeof element === 'object' && JSON.stringify(element) === JSON.stringify(defaultAssetsPath)
      );

      expect(hasMonacoAssets).toBe(true);
    });

    it('shouldn`t add a monaco assets file in assets of build project multiple times', async () => {
      writePropertiesFileToWorkspace(appTree, `${defaultAssetsPath}`, 'assets');

      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();

      const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
      const project = getProjectFromWorkspace(workspace);
      const assets = getProjectTargetOptions(project, 'build').assets;

      const getMonacoAssets = assets.filter(element => JSON.stringify(element) === JSON.stringify(defaultAssetsPath));

      expect(getMonacoAssets.length).toBe(1);
    });
  });
});

/** Gets the content of a specified file from a schematic tree. */
function getFileContent(tree: Tree, filePath: string): string {
  const contentBuffer = tree.read(filePath);

  if (!contentBuffer) {
    throw new Error(`Cannot read "${filePath}" because it does not exist.`);
  }

  return contentBuffer.toString();
}

/** Expects the given file to be in the property of the specified workspace project. */
function expectProjectPropertyFile(project: WorkspaceProject, filePath: string, property) {
  expect(getProjectTargetOptions(project, 'build')[property]).toContain(
    filePath,
    `Expected "${filePath}" to be added to the project ${property} in the workspace.`
  );
}

function writePropertiesFileToWorkspace(tree: Tree, filePath: string, property) {
  const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
  const project = getProjectFromWorkspace(workspace);
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions[property]) {
    buildOptions[property] = [filePath];
  } else {
    buildOptions[property].push(filePath);
  }

  tree.overwrite('/angular.json', JSON.stringify(workspace, null, 2));
}
