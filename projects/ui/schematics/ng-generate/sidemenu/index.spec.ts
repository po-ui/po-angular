import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Tree } from '@angular-devkit/schematics';

import * as path from 'path';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('sidemenu:', () => {
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

  describe('Imports:', () => {
    it('should add the RouterModule to the project module', () => {
      const routerModuleName = 'RouterModule';

      const tree = runner.runSchematic('sidemenu', componentOptions, appTree);
      const fileContent = getFileContent(tree, `projects/${componentOptions.project}/src/app/app.module.ts`);

      expect(fileContent).toContain(routerModuleName);
    });
  });

  describe('Component: ', () => {
    it('should create app.component.ts|html|css', () => {
      const tree = runner.runSchematic('sidemenu', componentOptions, appTree);

      const files: Array<string> = tree.files;

      expect(files).toContain(`/projects/${componentOptions.project}/src/app/app.component.ts`);
      expect(files).toContain(`/projects/${componentOptions.project}/src/app/app.component.html`);
      expect(files).toContain(`/projects/${componentOptions.project}/src/app/app.component.${componentOptions.style}`);
    });

    it('should contains `po-wrapper`, `po-toolbar` and `po-menu` in app.component.html', () => {
      const poWrapper = '<div class="po-wrapper">';
      const poToolbar = 'po-toolbar';
      const poMenu = '<po-menu [p-menus]="menus"></po-menu>';

      const htmlComponent = `projects/${componentOptions.project}/src/app/app.component.html`;

      const tree = runner.runSchematic('sidemenu', componentOptions, appTree);

      const fileContent = getFileContent(tree, htmlComponent);

      expect(fileContent).toContain(poWrapper);
      expect(fileContent).toContain(poToolbar);
      expect(fileContent).toContain(poMenu);
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
