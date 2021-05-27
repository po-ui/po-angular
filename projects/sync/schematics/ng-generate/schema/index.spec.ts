import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Tree } from '@angular-devkit/schematics';

import * as path from 'path';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('schema:', () => {
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

  it('should create sync schema', async () => {
    const schemaName = 'supply';
    const tree = await runner
      .runSchematicAsync('schema', { ...componentOptions, name: schemaName }, appTree)
      .toPromise();

    const files: Array<string> = tree.files;

    const fullFilePath = `/projects/${componentOptions.name}/src/app/${schemaName}/${schemaName}.constants.ts`;

    const schemaContent = getFileContent(
      tree,
      `/projects/${componentOptions.name}/src/app/${schemaName}/${schemaName}.constants.ts`
    );

    expect(files).toContain(fullFilePath);
    expect(schemaContent).toMatch(new RegExp(`name: '${schemaName}'`));
    expect(schemaContent).toMatch(new RegExp(`export const ${schemaName}Schema: PoSyncSchema`));
  });

  /** Gets the content of a specified file from a schematic tree. */
  function getFileContent(tree: Tree, filePath: string): string {
    const contentBuffer = tree.read(filePath);

    if (!contentBuffer) {
      throw new Error(`Cannot read "${filePath}" because it does not exist.`);
    }

    return contentBuffer.toString();
  }
});
