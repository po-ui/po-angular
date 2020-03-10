import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Tree } from '@angular-devkit/schematics';

import * as path from 'path';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('po-page-edit:', () => {
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

  it('should create <name> component', () => {
    const componentName = 'supply';
    const tree = runner.runSchematic('po-page-edit', { ...componentOptions, name: componentName }, appTree);

    const files: Array<string> = tree.files;

    const fullFilePath = (ext: string) =>
      `/projects/${componentOptions.project}/src/app/${componentName}/${componentName}.component.${ext}`;

    expect(files).toContain(fullFilePath('ts'));
    expect(files).toContain(fullFilePath('html'));
    expect(files).toContain(fullFilePath('spec.ts'));
    expect(files).toContain(fullFilePath(componentOptions.style));
  });

  it('should create <name> component and <name> module', () => {
    const componentName = 'supply';
    const createModule = true;

    const options = { ...componentOptions, name: componentName, createModule };

    const tree = runner.runSchematic('po-page-edit', options, appTree);

    const files: Array<string> = tree.files;

    expect(files).toContain(`/projects/${options.project}/src/app/${componentName}/${componentName}.module.ts`);
  });

  it('should add declaration component in closest module by default', async () => {
    const options = { ...componentOptions, name: 'customers' };
    const tree = runner.runSchematic('po-page-edit', options, appTree);

    const moduleContent = getFileContent(tree, `/projects/${componentOptions.name}/src/app/app.module.ts`);

    expect(moduleContent).toMatch(/import.*CustomersComponent.*from '.\/customers\/customers.component'/);
    expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+CustomersComponent\r?\n/m);
  });

  it('should import <name> component module if createModule is true', () => {
    const options = { ...componentOptions, name: 'customers', createModule: true };

    const tree = runner.runSchematic('po-page-edit', options, appTree);
    const moduleContent = getFileContent(tree, `/projects/${componentOptions.name}/src/app/app.module.ts`);

    expect(moduleContent).toMatch(/import.*CustomersModule.*from '.\/customers\/customers.module'/);
    expect(moduleContent).toMatch(/imports:\s*\[[^\]]+?,\r?\n\s+CustomersModule\r?\n/m);
  });

  it('should generate component.less if style is `less`', () => {
    const options = { ...componentOptions, name: 'customers', style: 'less' };
    const tree = runner.runSchematic('po-page-edit', options, appTree);

    const files = tree.files;

    expect(files).toContain(
      `/projects/${componentOptions.name}/src/app/customers/customers.component.${options.style}`
    );
  });

  it('should generate component with stylesheet `css` if options.style is empty', () => {
    const options = { ...componentOptions, name: 'customers', style: '' };

    const tree = runner.runSchematic('po-page-edit', options, appTree);
    const files = tree.files;

    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/customers.component.css`);
  });

  it('shouldn`t generate component spec if `skipTests` is true', () => {
    const options = { ...componentOptions, name: 'customers', skipTests: true };
    const tree = runner.runSchematic('po-page-edit', options, appTree);

    const files = tree.files;

    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/customers.component.ts`);
    expect(files).not.toContain(`/projects/${componentOptions.name}/src/app/customers/customers.component.spec.ts`);
  });

  it('should generate component in path informed', () => {
    // create customers component module to use with path option
    const options = { ...componentOptions, name: 'customers', createModule: true };
    runner.runSchematic('po-page-edit', options, appTree);

    const optionsPath = {
      ...componentOptions,
      name: 'wms',
      path: `/projects/${componentOptions.name}/src/app/customers`
    };

    const treePath = runner.runSchematic('po-page-edit', optionsPath, appTree);

    const files = treePath.files;

    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.component.spec.ts`);
    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.component.ts`);
    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.component.html`);
    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.component.${options.style}`);
  });

  it('should use the custom prefix when create component', () => {
    const prefix = 'wms';

    const options = { ...componentOptions, name: 'customers', prefix };
    const tree = runner.runSchematic('po-page-edit', options, appTree);

    const componentContent = getFileContent(
      tree,
      `/projects/${componentOptions.name}/src/app/customers/customers.component.ts`
    );

    expect(componentContent).toMatch(new RegExp(`selector: '${prefix}-customers'`));
  });

  it('should use the default prefix when create component if prefix is null', () => {
    const prefix = undefined;

    const options = { ...componentOptions, name: 'customers', sample: true, prefix };
    const tree = runner.runSchematic('po-page-edit', options, appTree);

    const componentContent = getFileContent(
      tree,
      `/projects/${componentOptions.name}/src/app/customers/customers.component.ts`
    );

    expect(componentContent).toMatch(new RegExp(`selector: 'app-customers'`));
  });

  it('should use only the name how prefix when create component if prefix is ""', () => {
    const prefix = '';

    const options = { ...componentOptions, name: 'customers', prefix };
    const tree = runner.runSchematic('po-page-edit', options, appTree);

    const componentContent = getFileContent(
      tree,
      `/projects/${componentOptions.name}/src/app/customers/customers.component.ts`
    );

    expect(componentContent).toMatch(new RegExp(`selector: 'customers'`));
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
