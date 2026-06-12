import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('po-page-detail:', () => {
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

  const componentOptions: any = {
    name: 'po',
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
    it('should create <name> component files without type suffix', async () => {
      const componentName = 'supply';
      const tree = await runner.runSchematic('po-page-detail', { ...componentOptions, name: componentName }, appTree);

      const files: Array<string> = tree.files;

      const fullFilePath = (ext: string) =>
        `/projects/${componentOptions.name}/src/app/${componentName}/${componentName}.${ext}`;

      expect(files).toContain(fullFilePath('ts'));
      expect(files).toContain(fullFilePath('html'));
      expect(files).toContain(fullFilePath('spec.ts'));
      expect(files).toContain(fullFilePath(componentOptions.style));
    });

    it('should reference sibling files without type suffix in the component file', async () => {
      const tree = await runner.runSchematic('po-page-detail', { ...componentOptions, name: 'customers' }, appTree);

      const componentContent = getFileContent(
        tree,
        `/projects/${componentOptions.name}/src/app/customers/customers.ts`
      );

      expect(componentContent).toMatch(/templateUrl: '.\/customers.html'/);
      expect(componentContent).toMatch(/styleUrls: \['.\/customers.css'\]/);
    });

    it('should generate stylesheet with `less` extension if style is `less`', async () => {
      const options = { ...componentOptions, name: 'customers', style: 'less' };
      const tree = await runner.runSchematic('po-page-detail', options, appTree);

      expect(tree.files).toContain(`/projects/${componentOptions.name}/src/app/customers/customers.${options.style}`);
    });

    it('shouldn`t generate component spec if `skipTests` is true', async () => {
      const options = { ...componentOptions, name: 'customers', skipTests: true };
      const tree = await runner.runSchematic('po-page-detail', options, appTree);

      expect(tree.files).toContain(`/projects/${componentOptions.name}/src/app/customers/customers.ts`);
      expect(tree.files).not.toContain(`/projects/${componentOptions.name}/src/app/customers/customers.spec.ts`);
    });

    it('should generate component in path informed', async () => {
      const optionsPath = {
        ...componentOptions,
        name: 'wms',
        path: `/projects/${componentOptions.name}/src/app/customers`
      };

      const treePath = await runner.runSchematic('po-page-detail', optionsPath, appTree);

      expect(treePath.files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.ts`);
      expect(treePath.files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.html`);
    });

    it('should use the custom prefix when create component', async () => {
      const prefix = 'wms';
      const tree = await runner.runSchematic('po-page-detail', { ...componentOptions, name: 'customers', prefix }, appTree);

      const componentContent = getFileContent(
        tree,
        `/projects/${componentOptions.name}/src/app/customers/customers.ts`
      );

      expect(componentContent).toMatch(new RegExp(`selector: '${prefix}-customers'`));
    });
  });

  describe('fileNameStyleGuide 2016 (classic suffixes):', () => {
    it('should create <name> component files with the `.component` suffix', async () => {
      const componentName = 'supply';
      const options = { ...componentOptions, name: componentName, fileNameStyleGuide: '2016' };
      const tree = await runner.runSchematic('po-page-detail', options, appTree);

      const fullFilePath = (ext: string) =>
        `/projects/${componentOptions.name}/src/app/${componentName}/${componentName}.component.${ext}`;

      expect(tree.files).toContain(fullFilePath('ts'));
      expect(tree.files).toContain(fullFilePath('html'));
      expect(tree.files).toContain(fullFilePath('spec.ts'));
      expect(tree.files).toContain(fullFilePath(componentOptions.style));
    });

    it('should reference sibling files with the `.component` suffix in the component file', async () => {
      const options = { ...componentOptions, name: 'customers', fileNameStyleGuide: '2016' };
      const tree = await runner.runSchematic('po-page-detail', options, appTree);

      const componentContent = getFileContent(
        tree,
        `/projects/${componentOptions.name}/src/app/customers/customers.component.ts`
      );

      expect(componentContent).toMatch(/templateUrl: '.\/customers.component.html'/);
      expect(componentContent).toMatch(/styleUrls: \['.\/customers.component.css'\]/);
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

    it('should generate files with the classic `.component` suffix without passing the option', async () => {
      const tree = await runner.runSchematic('po-page-detail', { ...componentOptions, name: 'customers' }, appTree);

      expect(tree.files).toContain(`/projects/${componentOptions.name}/src/app/customers/customers.component.ts`);
      expect(tree.files).not.toContain(`/projects/${componentOptions.name}/src/app/customers/customers.ts`);
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
