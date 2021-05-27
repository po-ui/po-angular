import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Tree } from '@angular-devkit/schematics';

import * as path from 'path';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('po-page-job-scheduler:', () => {
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

  it('should create <name> component', async () => {
    const componentName = 'supply';
    const tree = await runner
      .runSchematicAsync('po-page-job-scheduler', { ...componentOptions, name: componentName }, appTree)
      .toPromise();

    const files: Array<string> = tree.files;

    const fullFilePath = (ext: string) =>
      `/projects/${componentOptions.name}/src/app/${componentName}/${componentName}.component.${ext}`;

    expect(files).toContain(fullFilePath('ts'));
    expect(files).toContain(fullFilePath('html'));
    expect(files).toContain(fullFilePath('spec.ts'));
    expect(files).toContain(fullFilePath(componentOptions.style));
  });

  it('should create <name> component and <name> module', async () => {
    const componentName = 'supply';
    const createModule = true;

    const options = { ...componentOptions, name: componentName, createModule, project: 'po' };

    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();

    const files: Array<string> = tree.files;

    expect(files).toContain(`/projects/${options.project}/src/app/${componentName}/${componentName}.module.ts`);
  });

  it('should add declaration component in closest module by default', async () => {
    const options = { ...componentOptions, name: 'customers' };
    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();

    const moduleContent = getFileContent(tree, `/projects/${componentOptions.name}/src/app/app.module.ts`);

    expect(moduleContent).toMatch(/import.*CustomersComponent.*from '.\/customers\/customers.component'/);
    expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+CustomersComponent\r?\n/m);
  });

  it('should import <name> component module if createModule is true', async () => {
    const options = { ...componentOptions, name: 'customers', createModule: true };

    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();
    const moduleContent = getFileContent(tree, `/projects/${componentOptions.name}/src/app/app.module.ts`);

    expect(moduleContent).toMatch(/import.*CustomersModule.*from '.\/customers\/customers.module'/);
    expect(moduleContent).toMatch(/imports:\s*\[[^\]]+?,\r?\n\s+CustomersModule\r?\n/m);
  });

  it('should generate component.less if style is `less`', async () => {
    const options = { ...componentOptions, name: 'customers', style: 'less' };
    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();

    const files = tree.files;

    expect(files).toContain(
      `/projects/${componentOptions.name}/src/app/customers/customers.component.${options.style}`
    );
  });

  it('should generate component with stylesheet `css` if options.style is empty', async () => {
    const options = { ...componentOptions, name: 'customers', style: '' };

    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();
    const files = tree.files;

    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/customers.component.css`);
  });

  it('shouldn`t generate component spec if `skipTests` is true', async () => {
    const options = { ...componentOptions, name: 'customers', skipTests: true };
    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();

    const files = tree.files;

    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/customers.component.ts`);
    expect(files).not.toContain(`/projects/${componentOptions.name}/src/app/customers/customers.component.spec.ts`);
  });

  it('should generate component in path informed', async () => {
    // create customers component module to use with path option
    const options = { ...componentOptions, name: 'customers', createModule: true };
    await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();

    const optionsPath = {
      ...componentOptions,
      name: 'wms',
      path: `/projects/${componentOptions.name}/src/app/customers`
    };

    const treePath = await runner.runSchematicAsync('po-page-job-scheduler', optionsPath, appTree).toPromise();

    const files = treePath.files;

    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.component.spec.ts`);
    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.component.ts`);
    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.component.html`);
    expect(files).toContain(`/projects/${componentOptions.name}/src/app/customers/wms/wms.component.${options.style}`);
  });

  it('should use the custom prefix when create component', async () => {
    const prefix = 'wms';

    const options = { ...componentOptions, name: 'customers', prefix };
    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();

    const componentContent = getFileContent(
      tree,
      `/projects/${componentOptions.name}/src/app/customers/customers.component.ts`
    );

    expect(componentContent).toMatch(new RegExp(`selector: '${prefix}-customers'`));
  });

  it('should use the default prefix when create component if prefix is null', async () => {
    const prefix = undefined;

    const options = { ...componentOptions, name: 'customers', sample: true, prefix };
    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();

    const componentContent = getFileContent(
      tree,
      `/projects/${componentOptions.name}/src/app/customers/customers.component.ts`
    );

    expect(componentContent).toMatch(new RegExp(`selector: 'app-customers'`));
  });

  it('should use only the name how prefix when create component if prefix is ""', async () => {
    const prefix = '';

    const options = { ...componentOptions, name: 'customers', prefix };
    const tree = await runner.runSchematicAsync('po-page-job-scheduler', options, appTree).toPromise();

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
