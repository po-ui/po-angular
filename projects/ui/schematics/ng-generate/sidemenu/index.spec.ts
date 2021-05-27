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

  describe('Imports:', () => {
    it('should add the RouterModule to the project module', async () => {
      const routerModuleName = 'RouterModule';

      const tree = await runner.runSchematicAsync('sidemenu', componentOptions, appTree).toPromise();
      const fileContent = getFileContent(tree, `projects/${componentOptions.name}/src/app/app.module.ts`);

      expect(fileContent).toContain(routerModuleName);
    });
  });

  describe('Component: ', () => {
    it('should create app.component.ts|html|css', async () => {
      const tree = await runner.runSchematicAsync('sidemenu', componentOptions, appTree).toPromise();

      const files: Array<string> = tree.files;

      expect(files).toContain(`/projects/${componentOptions.name}/src/app/app.component.ts`);
      expect(files).toContain(`/projects/${componentOptions.name}/src/app/app.component.html`);
      expect(files).toContain(`/projects/${componentOptions.name}/src/app/app.component.${componentOptions.style}`);
    });

    it('should contains `po-wrapper`, `po-toolbar` and `po-menu` in app.component.html', async () => {
      const poWrapper = '<div class="po-wrapper">';
      const poToolbar = 'po-toolbar';
      const poMenu = '<po-menu [p-menus]="menus"></po-menu>';

      const htmlComponent = `projects/${componentOptions.name}/src/app/app.component.html`;

      const tree = await runner.runSchematicAsync('sidemenu', componentOptions, appTree).toPromise();

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
