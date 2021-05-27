import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Tree } from '@angular-devkit/schematics';

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
  let infoOutput: Array<string>;

  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise();
    appTree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', componentOptions, appTree)
      .toPromise();

    infoOutput = [];
    runner.logger.subscribe(e => {
      if (e.level === 'info') {
        infoOutput.push(e.message);
      }
    });
  });

  describe('Dependencies:', () => {
    it('should update package.json with @po-ui/ng-sync dependencies and run nodePackageInstall', async () => {
      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();
      const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
      const dependencies = packageJson.dependencies;
      const info =
        'Sync added successfully, please execute the command `ionic cordova plugin add cordova-plugin-network-information`';

      expect(dependencies['@po-ui/ng-sync']).toBeDefined();
      expect(Object.keys(dependencies)).toEqual(Object.keys(dependencies).sort());
      expect(runner.tasks.some(task => task.name === 'node-package')).toBe(true);
      expect(infoOutput.length).toBe(1);
      expect(infoOutput[0]).toMatch(new RegExp(`${info}`));
    });
  });

  describe('Imports:', () => {
    it('should add the PoSyncModule and PoStorageModule to the project module', async () => {
      const poSyncModuleName = 'PoSyncModule';
      const poStorageModuleName = 'PoStorageModule';

      const tree = await runner.runSchematicAsync('ng-add', componentOptions, appTree).toPromise();
      const fileContent = getFileContent(tree, `projects/${componentOptions.name}/src/app/app.module.ts`);

      expect(fileContent).toContain(poSyncModuleName);
      expect(fileContent).toContain(poStorageModuleName);
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
