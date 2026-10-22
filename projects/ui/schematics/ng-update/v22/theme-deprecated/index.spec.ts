import * as fs from 'fs';
import * as path from 'path';

import { logging } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

const MIGRATION = 'migration-v22-theme-deprecated';
const collectionPath = path.join(__dirname, '../../../migrations.json');

const lines = (...content: Array<string>) => content.join('\n');

const OLD_CSS = 'node_modules/@po-ui/style/css/po-theme-default.min.css';
const DEPRECATED_CSS = 'node_modules/@po-ui/style/css/po-theme-default-deprecated.min.css';

function angularJson(projects: Record<string, unknown>): string {
  return JSON.stringify({ version: 1, projects }, null, 2);
}

function application(sourceRoot = 'src', main = 'src/main.ts') {
  return {
    projectType: 'application',
    root: '',
    sourceRoot,
    architect: {
      build: { builder: '@angular/build:application', options: { browser: main, styles: [OLD_CSS] } },
      test: { builder: '@angular/build:karma', options: { styles: [`./${OLD_CSS}`] } }
    }
  };
}

const STANDALONE_MAIN = lines(
  `import { bootstrapApplication } from '@angular/platform-browser';`,
  `import { appConfig } from './app/app.config';`,
  `import { App } from './app/app';`,
  ``,
  `bootstrapApplication(App, appConfig).catch(err => console.error(err));`,
  ``
);

const STANDALONE_APP = lines(
  `import { Component } from '@angular/core';`,
  `import { PoMenuItem, PoMenuModule } from '@po-ui/ng-components';`,
  ``,
  `@Component({ selector: 'app-root', imports: [PoMenuModule], templateUrl: './app.html' })`,
  `export class App {`,
  `  readonly menus: Array<PoMenuItem> = [];`,
  `}`,
  ``
);

const THEME_FILE = lines(
  `import { PoTheme, poThemeDefaultActions, poThemeDefaultLightValues } from '@po-ui/ng-components';`,
  ``,
  `export const myTheme: Partial<PoTheme> = {`,
  `  name: 'my-theme',`,
  `  type: { light: { color: { action: { ...poThemeDefaultActions } }, onRoot: poThemeDefaultLightValues.onRoot } }`,
  `};`,
  ``
);

function standaloneTree(): Tree {
  const tree = Tree.empty();
  tree.create('/angular.json', angularJson({ app: application() }));
  tree.create('/src/main.ts', STANDALONE_MAIN);
  tree.create('/src/app/app.ts', STANDALONE_APP);
  tree.create('/src/app/app.config.ts', `export const appConfig = { providers: [] };\n`);
  tree.create('/src/app/theme.ts', THEME_FILE);
  tree.create('/src/styles.scss', `@import '~@po-ui/style/css/po-theme-default-variables.css';\n`);
  return tree;
}

async function run(tree: Tree): Promise<{ tree: Tree; logs: Array<string> }> {
  const runner = new SchematicTestRunner('migrations', collectionPath);
  const logs: Array<string> = [];
  runner.logger.subscribe((entry: logging.LogEntry) => logs.push(`${entry.level}: ${entry.message}`));

  const result = await runner.runSchematic(MIGRATION, {}, tree);
  return { tree: result, logs };
}

const read = (tree: Tree, file: string) => tree.read(file)!.toString('utf-8');

describe('v22 migration-v22-theme-deprecated (integration):', () => {
  it('should migrate constants, CSS and inject the theme in a standalone app without the service', async () => {
    const { tree, logs } = await run(standaloneTree());

    const workspace = JSON.parse(read(tree, '/angular.json'));
    expect(workspace.projects.app.architect.build.options.styles).toEqual([DEPRECATED_CSS]);
    expect(workspace.projects.app.architect.test.options.styles).toEqual([`./${DEPRECATED_CSS}`]);

    expect(read(tree, '/src/styles.scss')).toBe(
      `@import '~@po-ui/style/css/po-theme-default-deprecated-variables.css';\n`
    );

    const theme = read(tree, '/src/app/theme.ts');
    expect(theme).toContain(
      `import { PoTheme, poThemeDefaultActionsDeprecated, poThemeDefaultLightValuesDeprecated } from '@po-ui/ng-components';`
    );
    expect(theme).toContain(`...poThemeDefaultActionsDeprecated`);
    expect(theme).toContain(`onRoot: poThemeDefaultLightValuesDeprecated.onRoot`);

    const app = read(tree, '/src/app/app.ts');
    expect(app).toContain(`import { Component, inject } from '@angular/core';`);
    expect(app).toContain(
      `import { PoMenuItem, PoMenuModule, PoThemeService, poThemeDefaultDeprecated } from '@po-ui/ng-components';`
    );
    expect(app).toContain(`private readonly poThemeService = inject(PoThemeService);`);
    expect(app).toContain(`this.poThemeService.setTheme(poThemeDefaultDeprecated);`);

    expect(read(tree, '/src/main.ts')).toBe(STANDALONE_MAIN);
    expect(logs.some(log => log.includes('tema anterior aplicado em "/src/app/app.ts"'))).toBe(true);
  });

  it('should inject the theme in the bootstrap component of an NgModule app', async () => {
    const tree = Tree.empty();
    tree.create('/angular.json', angularJson({ app: application() }));
    tree.create(
      '/src/main.ts',
      lines(
        `import { platformBrowser } from '@angular/platform-browser';`,
        `import { AppModule } from './app/app.module';`,
        `platformBrowser().bootstrapModule(AppModule);`
      )
    );
    tree.create(
      '/src/app/app.module.ts',
      lines(
        `import { NgModule } from '@angular/core';`,
        `import { PoModule } from '@po-ui/ng-components';`,
        `import { AppComponent } from './app.component';`,
        `@NgModule({ declarations: [AppComponent], imports: [PoModule], bootstrap: [AppComponent] })`,
        `export class AppModule {}`
      )
    );
    tree.create(
      '/src/app/app.component.ts',
      lines(
        `import { Component } from '@angular/core';`,
        `@Component({ selector: 'app-root', templateUrl: './app.component.html', standalone: false })`,
        `export class AppComponent {}`
      )
    );

    const { tree: result } = await run(tree);

    const component = read(result, '/src/app/app.component.ts');
    expect(component).toContain(`import { PoThemeService, poThemeDefaultDeprecated } from '@po-ui/ng-components';`);
    expect(component).toContain(`this.poThemeService.setTheme(poThemeDefaultDeprecated);`);
    expect(read(result, '/src/app/app.module.ts')).not.toContain('poThemeService');
  });

  it('should only rewrite references when the app already uses PoThemeService', async () => {
    const tree = standaloneTree();
    const appWithService = lines(
      `import { Component, inject } from '@angular/core';`,
      `import { poThemeDefault, PoThemeService, PoThemeTypeEnum } from '@po-ui/ng-components';`,
      ``,
      `@Component({ selector: 'app-root', template: '' })`,
      `export class App {`,
      `  private readonly theme = inject(PoThemeService);`,
      ``,
      `  constructor() {`,
      `    this.theme.setTheme(poThemeDefault, PoThemeTypeEnum.light);`,
      `  }`,
      `}`,
      ``
    );
    tree.overwrite('/src/app/app.ts', appWithService);

    const { tree: result, logs } = await run(tree);

    expect(read(result, '/src/app/app.ts')).toBe(
      appWithService.replace(/poThemeDefault\b/g, 'poThemeDefaultDeprecated')
    );
    expect(read(result, '/src/app/app.ts')).not.toContain('poThemeService');
    expect(logs.some(log => log.includes('já usa o PoThemeService'))).toBe(true);
  });

  it('should not inject the theme in libraries', async () => {
    const tree = Tree.empty();
    tree.create(
      '/angular.json',
      angularJson({
        lib: { projectType: 'library', root: 'projects/lib', sourceRoot: 'projects/lib/src' }
      })
    );
    tree.create(
      '/projects/lib/src/lib/lib.component.ts',
      lines(
        `import { Component } from '@angular/core';`,
        `import { poThemeDefaultDark } from '@po-ui/ng-components';`,
        `@Component({ selector: 'lib-a', template: '' })`,
        `export class LibComponent { theme = poThemeDefaultDark; }`
      )
    );

    const { tree: result } = await run(tree);

    const component = read(result, '/projects/lib/src/lib/lib.component.ts');
    expect(component).toContain(`import { poThemeDefaultDarkDeprecated } from '@po-ui/ng-components';`);
    expect(component).toContain(`theme = poThemeDefaultDarkDeprecated;`);
    expect(component).not.toContain('PoThemeService');
  });

  it('should warn and continue when the bootstrap component is not found', async () => {
    const tree = standaloneTree();
    tree.overwrite('/src/main.ts', `console.log('sem bootstrap');\n`);

    const { tree: result, logs } = await run(tree);

    expect(read(result, '/src/app/app.ts')).toBe(STANDALONE_APP);
    expect(read(result, '/src/app/theme.ts')).toContain('poThemeDefaultActionsDeprecated');
    expect(logs.some(log => log.startsWith('warn') && log.includes('bootstrapApplication'))).toBe(true);
  });

  it('should not change anything when executed a second time', async () => {
    const { tree: first } = await run(standaloneTree());
    const snapshot = new Map<string, string>();
    first.visit(file => {
      snapshot.set(file, read(first, file));
    });

    const { tree: second, logs } = await run(first);

    second.visit(file => {
      expect(`${file}:\n${read(second, file)}`).toBe(`${file}:\n${snapshot.get(file)}`);
    });
    expect(logs.some(log => log.includes('0 arquivo(s) alterado(s)'))).toBe(true);
  });

  it('should log an error and change nothing without a workspace file', async () => {
    const tree = Tree.empty();
    tree.create('/src/app/theme.ts', THEME_FILE);

    const { tree: result, logs } = await run(tree);

    expect(read(result, '/src/app/theme.ts')).toBe(THEME_FILE);
    expect(logs.some(log => log.startsWith('error'))).toBe(true);
  });
});

describe('v22 migrations.json — migration-v22-theme-deprecated:', () => {
  const migrations = JSON.parse(fs.readFileSync(collectionPath, 'utf-8')).schematics;
  const entry = migrations[MIGRATION];

  it('should be an optional, not recommended v22 migration', () => {
    expect(entry).toBeDefined();
    expect(entry.version).toBe('22');
    expect(entry.optional).toBe(true);
    expect(entry.recommended).toBe(false);
    expect(entry.factory).toBe('./ng-update/v22/theme-deprecated/index');
  });

  it('should present the expected title and recommend the new theme in the description', () => {
    // O Angular CLI usa a primeira frase (até ". ") como título.
    const [title, ...rest] = entry.description.split('. ');

    expect(title).toBe('Retornar ao tema padrão anterior do PO UI (depreciado)');
    expect(rest.join('. ')).toContain('recomendamos utilizá-la');
    expect(rest.join('. ')).toContain('v24');
  });

  it('should not advertise the --name command anywhere in the mandatory migration', () => {
    const mandatory = fs.readFileSync(path.join(__dirname, '../index.js'), 'utf-8');

    expect(mandatory).not.toContain(MIGRATION);
  });
});
