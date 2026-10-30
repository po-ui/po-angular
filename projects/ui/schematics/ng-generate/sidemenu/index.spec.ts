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
    it('should create the app files with the `.component` suffix while preserving the bootstrapped class', async () => {
      const options = { ...sidemenuOptions, fileNameStyleGuide: '2016' };
      const tree = await runner.runSchematic('sidemenu', options, appTree);

      const appDir = `/projects/${sidemenuOptions.project}/src/app`;

      expect(tree.files).toContain(`${appDir}/app.component.ts`);
      expect(tree.files).toContain(`${appDir}/app.component.html`);
      expect(tree.files).toContain(`${appDir}/app.component.${sidemenuOptions.style}`);
      // The option only controls the file-name suffix. The class name still follows the
      // component bootstrapped by the base app (the CLI's standalone `App`) so the
      // overwritten component keeps matching the existing import.
      expect(getFileContent(tree, `${appDir}/app.component.ts`)).toContain('export class App {');
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

  describe('auto-detected style on an NgModule project with a chained bootstrapModule call:', () => {
    beforeEach(() => {
      // Mirrors the CLI v22 NgModule main.ts, where the bootstrap call is chained off
      // `platformBrowser()` (a property-access callee) rather than a bare identifier.
      appTree.overwrite(
        '/projects/po/src/main.ts',
        `import { platformBrowser } from '@angular/platform-browser';\n` +
          `import { AppModule } from './app/app.module';\n` +
          `platformBrowser().bootstrapModule(AppModule).catch(err => console.error(err));\n`
      );
      appTree.create(
        '/projects/po/src/app/app.component.ts',
        `import { Component } from '@angular/core';\n@Component({ selector: 'app-root', template: '' })\nexport class App {}\n`
      );
      appTree.create(
        '/projects/po/src/app/app.module.ts',
        `import { NgModule } from '@angular/core';\n` +
          `import { BrowserModule } from '@angular/platform-browser';\n` +
          `import { App } from './app.component';\n` +
          `@NgModule({\n` +
          `  declarations: [App],\n` +
          `  imports: [BrowserModule],\n` +
          `  bootstrap: [App]\n` +
          `})\n` +
          `export class AppModule {}\n`
      );
    });

    it('should overwrite the existing `.component` file with the PO layout', async () => {
      const appDir = `/projects/${sidemenuOptions.project}/src/app`;
      const originalComponent = getFileContent(appTree, `${appDir}/app.component.ts`);

      const tree = await runner.runSchematic('sidemenu', sidemenuOptions, appTree);

      const generatedComponent = getFileContent(tree, `${appDir}/app.component.ts`);

      // The chained `bootstrapModule(AppModule)` import resolves to `./app/app.module`
      // (a `.module` suffix), so the classic 2016 style must be detected and the PO layout
      // written to the existing `app.component.ts` (suffix `.component`), not to a new
      // suffix-less `app.ts`.
      expect(generatedComponent).not.toEqual(originalComponent);
      expect(generatedComponent).toContain('PoMenuItem');
      expect(generatedComponent).toContain(`templateUrl: './app.component.html'`);
      // The class name is read from the module's `bootstrap: [App]`, not from the
      // bootstrapped module symbol (`AppModule`), so it stays `App` and keeps matching
      // the module's `declarations`/`bootstrap` references.
      expect(generatedComponent).toContain('export class App {');
      expect(generatedComponent).not.toContain('export class AppModule');
    });
  });

  describe('auto-detected class name on an NgModule project bootstrapping `AppComponent`:', () => {
    beforeEach(() => {
      appTree.overwrite(
        '/projects/po/src/main.ts',
        `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n` +
          `import { AppModule } from './app/app.module';\n` +
          `platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));\n`
      );
      appTree.create(
        '/projects/po/src/app/app.component.ts',
        `import { Component } from '@angular/core';\n@Component({ selector: 'app-root', template: '' })\nexport class AppComponent {}\n`
      );
      appTree.create(
        '/projects/po/src/app/app.module.ts',
        `import { NgModule } from '@angular/core';\n` +
          `import { BrowserModule } from '@angular/platform-browser';\n` +
          `import { AppComponent } from './app.component';\n` +
          `@NgModule({\n` +
          `  declarations: [AppComponent],\n` +
          `  imports: [BrowserModule],\n` +
          `  bootstrap: [AppComponent]\n` +
          `})\n` +
          `export class AppModule {}\n`
      );
    });

    it('should preserve the `AppComponent` class name read from the module bootstrap array', async () => {
      const tree = await runner.runSchematic('sidemenu', sidemenuOptions, appTree);

      const content = getFileContent(tree, `/projects/${sidemenuOptions.project}/src/app/app.component.ts`);

      expect(content).toContain('export class AppComponent {');
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
