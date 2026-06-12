import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('sidemenu:', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0'
  };

  const applicationOptions: any = {
    name: 'po',
    style: 'css',
    skipTests: false
  };

  const sidemenuOptions: any = {
    appName: 'AppName',
    style: 'css',
    skipTests: false,
    project: 'po'
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic('@schematics/angular', 'application', applicationOptions, appTree);
  });

  describe('auto-detected style on a project using the current Angular convention:', () => {
    it('should create the app files without type suffix and use the `App` class', async () => {
      const tree = await runner.runSchematic('sidemenu', sidemenuOptions, appTree);

      const appDir = `/projects/${sidemenuOptions.project}/src/app`;

      expect(tree.files).toContain(`${appDir}/app.ts`);
      expect(tree.files).toContain(`${appDir}/app.html`);
      expect(tree.files).toContain(`${appDir}/app.${sidemenuOptions.style}`);
      expect(getFileContent(tree, `${appDir}/app.ts`)).toContain('export class App {');
    });

    it('should contain `po-wrapper`, `po-toolbar` and `po-menu` in the app template', async () => {
      const tree = await runner.runSchematic('sidemenu', sidemenuOptions, appTree);

      const fileContent = getFileContent(tree, `/projects/${sidemenuOptions.project}/src/app/app.html`);

      expect(fileContent).toContain('<div class="po-wrapper">');
      expect(fileContent).toContain('po-toolbar');
      expect(fileContent).toContain('<po-menu [p-menus]="menus"></po-menu>');
    });
  });

  describe('fileNameStyleGuide 2016 (classic suffixes):', () => {
    it('should create the app files with the `.component` suffix and use the `AppComponent` class', async () => {
      const options = { ...sidemenuOptions, fileNameStyleGuide: '2016' };
      const tree = await runner.runSchematic('sidemenu', options, appTree);

      const appDir = `/projects/${sidemenuOptions.project}/src/app`;

      expect(tree.files).toContain(`${appDir}/app.component.ts`);
      expect(tree.files).toContain(`${appDir}/app.component.html`);
      expect(tree.files).toContain(`${appDir}/app.component.${sidemenuOptions.style}`);
      expect(getFileContent(tree, `${appDir}/app.component.ts`)).toContain('export class AppComponent {');
    });
  });

  describe('auto-detected style on a project using the classic (2016) convention:', () => {
    beforeEach(() => {
      appTree.overwrite(
        '/projects/po/src/main.ts',
        `import { bootstrapApplication } from '@angular/platform-browser';\n` +
          `import { App } from './app/app.component';\n` +
          `import { appConfig } from './app/app.config';\n` +
          `bootstrapApplication(App, appConfig);\n`
      );
      appTree.create(
        '/projects/po/src/app/app.component.ts',
        `import { Component } from '@angular/core';\n@Component({ selector: 'app-root', template: '' })\nexport class App {}\n`
      );
    });

    it('should generate the app files with the classic `.component` suffix without passing the option', async () => {
      const tree = await runner.runSchematic('sidemenu', sidemenuOptions, appTree);

      expect(tree.files).toContain(`/projects/${sidemenuOptions.project}/src/app/app.component.ts`);
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
