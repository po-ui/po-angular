import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

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
    name: 'po',
    style: 'css',
    skipTests: false
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise();
    appTree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', componentOptions, appTree)
      .toPromise();
  });

  describe('Dependencies:', () => {
    it('should update package.json with @po-ui/ng-templates dependency and run nodePackageInstall', async () => {
      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();

      const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
      const dependencies = packageJson.dependencies;

      expect(dependencies['@po-ui/ng-templates']).toBeDefined();
      expect(Object.keys(dependencies)).toEqual(Object.keys(dependencies).sort());
      expect(runner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });
  });

  describe('Imports:', () => {
    it('should add the PoTemplatesModule to the project module', async () => {
      const poTemplatesModuleName = 'PoTemplatesModule';

      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();
      const fileContent = getFileContent(tree, `projects/${componentOptions.name}/src/app/app.module.ts`);

      expect(fileContent).toContain(poTemplatesModuleName);
    });
  });

  describe('Theme configuration:', () => {
    const defaultThemePath = './node_modules/@po-ui/style/css/po-theme-default.min.css';

    it('should add default theme in styles of build project', async () => {
      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();

      const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
      const project = getProjectFromWorkspace(workspace);

      expectProjectStyleFile(project, defaultThemePath);
    });

    it('shouldn`t add a theme file in styles of build project multiple times', async () => {
      writeStyleFileToWorkspace(appTree, defaultThemePath);

      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();

      const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
      const project = getProjectFromWorkspace(workspace);
      const styles = getProjectTargetOptions(project, 'build').styles;

      expect(styles).toEqual([`projects/${componentOptions.name}/src/styles.css`, defaultThemePath]);
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
  const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
  const project = getProjectFromWorkspace(workspace);
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.styles) {
    buildOptions.styles = [stylePath];
  } else {
    buildOptions.styles.push(stylePath);
  }

  tree.overwrite('/angular.json', JSON.stringify(workspace, null, 2));
}
