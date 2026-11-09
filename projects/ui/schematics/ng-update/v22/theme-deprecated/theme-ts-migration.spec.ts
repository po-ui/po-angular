import { importsPoThemeService, migrateThemeTsContent } from './theme-ts-migration';

const lines = (...content: Array<string>) => content.join('\n');

describe('v22 theme-deprecated migrateThemeTsContent:', () => {
  it('should rename an import without alias and all its references', () => {
    const source = lines(
      `import { Component } from '@angular/core';`,
      `import { poThemeDefault, PoThemeTypeEnum } from '@po-ui/ng-components';`,
      ``,
      `const theme: typeof poThemeDefault = poThemeDefault;`,
      `export class AppComponent {`,
      `  apply(service: any) {`,
      `    service.setTheme(poThemeDefault, PoThemeTypeEnum.light);`,
      `  }`,
      `}`
    );

    const result = migrateThemeTsContent(source);

    expect(result.changed).toBe(true);
    expect(result.content).toBe(
      lines(
        `import { Component } from '@angular/core';`,
        `import { poThemeDefaultDeprecated, PoThemeTypeEnum } from '@po-ui/ng-components';`,
        ``,
        `const theme: typeof poThemeDefaultDeprecated = poThemeDefaultDeprecated;`,
        `export class AppComponent {`,
        `  apply(service: any) {`,
        `    service.setTheme(poThemeDefaultDeprecated, PoThemeTypeEnum.light);`,
        `  }`,
        `}`
      )
    );
    expect(result.warnings).toEqual([]);
  });

  it('should rename spread usages of color constants (sample-po-theme-labs pattern)', () => {
    const source = lines(
      `import { poThemeDefaultActions, poThemeDefaultLightValues } from '@po-ui/ng-components';`,
      `const theme = {`,
      `  action: { ...poThemeDefaultActions, disabled: 'red' },`,
      `  onRoot: { ...poThemeDefaultLightValues.onRoot }`,
      `};`
    );

    expect(migrateThemeTsContent(source).content).toBe(
      lines(
        `import { poThemeDefaultActionsDeprecated, poThemeDefaultLightValuesDeprecated } from '@po-ui/ng-components';`,
        `const theme = {`,
        `  action: { ...poThemeDefaultActionsDeprecated, disabled: 'red' },`,
        `  onRoot: { ...poThemeDefaultLightValuesDeprecated.onRoot }`,
        `};`
      )
    );
  });

  it('should rename all the 25 mapped constants', () => {
    const names = [
      'poThemeDefault',
      'poThemeDefaultLight',
      'poThemeDefaultDark',
      'poThemeDefaultBrands',
      'poThemeDefaultActions',
      'poThemeDefaultFeedback',
      'poThemeDefaultNeutrals',
      'poThemeDefaultLightValues',
      'poThemeDefaultCategoricals',
      'poThemeDefaultOverlayCategoricals',
      'poThemeDefaultCategoricalsAA',
      'poThemeDefaultOverlayCategoricalsAA',
      'poThemeDefaultLightValuesAA',
      'poThemeDefaultBrandsDark',
      'poThemeDefaultActionsDark',
      'poThemeDefaultFeedbackDark',
      'poThemeDefaultNeutralsDark',
      'poThemeDefaultDarkValues',
      'poThemeDefaultCategoricalsDark',
      'poThemeDefaultCategoricalsOverlayDark',
      'poThemeDefaultCategoricalsDarkAA',
      'poThemeDefaultCategoricalsOverlayDarkAA',
      'poThemeDefaultDarkValuesAA',
      'poThemeDefaultAA',
      'poThemeDefaultAAA'
    ];
    const source = lines(
      `import { ${names.join(', ')} } from '@po-ui/ng-components';`,
      `console.log(${names.join(', ')});`
    );

    const content = migrateThemeTsContent(source).content;
    const deprecated = names.map(name => `${name}Deprecated`);

    expect(content).toBe(
      lines(
        `import { ${deprecated.join(', ')} } from '@po-ui/ng-components';`,
        `console.log(${deprecated.join(', ')});`
      )
    );
  });

  it('should keep the alias and rename only the imported name', () => {
    const source = lines(`import { poThemeDefault as base } from '@po-ui/ng-components';`, `const theme = base;`);

    expect(migrateThemeTsContent(source).content).toBe(
      lines(`import { poThemeDefaultDeprecated as base } from '@po-ui/ng-components';`, `const theme = base;`)
    );
  });

  it('should expand shorthand properties', () => {
    const source = lines(
      `import { poThemeDefault } from '@po-ui/ng-components';`,
      `const themes = { poThemeDefault };`
    );

    expect(migrateThemeTsContent(source).content).toBe(
      lines(
        `import { poThemeDefaultDeprecated } from '@po-ui/ng-components';`,
        `const themes = { poThemeDefault: poThemeDefaultDeprecated };`
      )
    );
  });

  it('should ignore property names and local declarations with the same name', () => {
    const source = lines(
      `import { poThemeDefault } from '@po-ui/ng-components';`,
      `export class A {`,
      `  poThemeDefault = poThemeDefault;`,
      `  read() { return this.poThemeDefault; }`,
      `  local() { const poThemeDefault = 1; return poThemeDefault; }`,
      `}`,
      `const object = { poThemeDefault: 1 };`
    );

    expect(migrateThemeTsContent(source).content).toBe(
      lines(
        `import { poThemeDefaultDeprecated } from '@po-ui/ng-components';`,
        `export class A {`,
        `  poThemeDefault = poThemeDefaultDeprecated;`,
        `  read() { return this.poThemeDefault; }`,
        `  local() { const poThemeDefault = 1; return poThemeDefault; }`,
        `}`,
        `const object = { poThemeDefault: 1 };`
      )
    );
  });

  it('should rename namespace accesses', () => {
    const source = lines(
      `import * as po from '@po-ui/ng-components';`,
      `const theme: typeof po.poThemeDefault = po.poThemeDefault;`,
      `const other = po.PoThemeTypeEnum.light;`
    );

    expect(migrateThemeTsContent(source).content).toBe(
      lines(
        `import * as po from '@po-ui/ng-components';`,
        `const theme: typeof po.poThemeDefaultDeprecated = po.poThemeDefaultDeprecated;`,
        `const other = po.PoThemeTypeEnum.light;`
      )
    );
  });

  it('should not duplicate an already imported deprecated constant', () => {
    const source = lines(
      `import { poThemeDefault, poThemeDefaultDeprecated } from '@po-ui/ng-components';`,
      `const themes = [poThemeDefault, poThemeDefaultDeprecated];`
    );

    expect(migrateThemeTsContent(source).content).toBe(
      lines(
        `import { poThemeDefaultDeprecated } from '@po-ui/ng-components';`,
        `const themes = [poThemeDefaultDeprecated, poThemeDefaultDeprecated];`
      )
    );
  });

  it('should remove a whole import declaration when all its symbols are duplicated', () => {
    const source = lines(
      `import { poThemeDefaultDeprecated } from '@po-ui/ng-components';`,
      `import { poThemeDefault } from '@po-ui/ng-components';`,
      `const theme = poThemeDefault;`
    );

    expect(migrateThemeTsContent(source).content).toBe(
      lines(
        `import { poThemeDefaultDeprecated } from '@po-ui/ng-components';`,
        `const theme = poThemeDefaultDeprecated;`
      )
    );
  });

  it('should keep the public name of local and package re-exports', () => {
    const source = lines(
      `import { poThemeDefaultLight } from '@po-ui/ng-components';`,
      `export { poThemeDefaultLight };`,
      `export { poThemeDefaultDark, poThemeDefault as theme } from '@po-ui/ng-components';`
    );

    expect(migrateThemeTsContent(source).content).toBe(
      lines(
        `import { poThemeDefaultLightDeprecated } from '@po-ui/ng-components';`,
        `export { poThemeDefaultLightDeprecated as poThemeDefaultLight };`,
        `export { poThemeDefaultDarkDeprecated as poThemeDefaultDark, poThemeDefaultDeprecated as theme } from '@po-ui/ng-components';`
      )
    );
  });

  it('should not change symbols imported from other packages', () => {
    const source = lines(`import { poThemeDefault } from './my-theme';`, `const theme = poThemeDefault;`);

    const result = migrateThemeTsContent(source);

    expect(result.changed).toBe(false);
    expect(result.content).toBe(source);
  });

  describe('setDefaultTheme:', () => {
    it('should become setTheme with the deprecated theme and add the import', () => {
      const source = lines(
        `import { PoThemeService, PoThemeTypeEnum } from '@po-ui/ng-components';`,
        `export class A {`,
        `  constructor(private readonly theme: PoThemeService) {`,
        `    this.theme.setDefaultTheme(PoThemeTypeEnum.dark);`,
        `  }`,
        `}`
      );

      expect(migrateThemeTsContent(source).content).toBe(
        lines(
          `import { PoThemeService, PoThemeTypeEnum, poThemeDefaultDeprecated } from '@po-ui/ng-components';`,
          `export class A {`,
          `  constructor(private readonly theme: PoThemeService) {`,
          `    this.theme.setTheme(poThemeDefaultDeprecated, PoThemeTypeEnum.dark);`,
          `  }`,
          `}`
        )
      );
    });

    it('should reuse the renamed import of poThemeDefault', () => {
      const source = lines(
        `import { poThemeDefault, PoThemeService } from '@po-ui/ng-components';`,
        `function f(service: PoThemeService) {`,
        `  service.setTheme(poThemeDefault);`,
        `  service.setDefaultTheme(0);`,
        `}`
      );

      expect(migrateThemeTsContent(source).content).toBe(
        lines(
          `import { poThemeDefaultDeprecated, PoThemeService } from '@po-ui/ng-components';`,
          `function f(service: PoThemeService) {`,
          `  service.setTheme(poThemeDefaultDeprecated);`,
          `  service.setTheme(poThemeDefaultDeprecated, 0);`,
          `}`
        )
      );
    });

    it('should reuse an existing alias of poThemeDefaultDeprecated', () => {
      const source = lines(
        `import { PoThemeService, poThemeDefaultDeprecated as old } from '@po-ui/ng-components';`,
        `function f(service: PoThemeService) { service.setDefaultTheme(0); }`
      );

      expect(migrateThemeTsContent(source).content).toBe(
        lines(
          `import { PoThemeService, poThemeDefaultDeprecated as old } from '@po-ui/ng-components';`,
          `function f(service: PoThemeService) { service.setTheme(old, 0); }`
        )
      );
    });

    it('should use the namespace when the service comes from a namespace import', () => {
      const source = lines(
        `import * as po from '@po-ui/ng-components';`,
        `function f(service: po.PoThemeService) { service.setDefaultTheme(po.PoThemeTypeEnum.light); }`
      );

      expect(migrateThemeTsContent(source).content).toBe(
        lines(
          `import * as po from '@po-ui/ng-components';`,
          `function f(service: po.PoThemeService) { service.setTheme(po.poThemeDefaultDeprecated, po.PoThemeTypeEnum.light); }`
        )
      );
    });

    it('should warn and keep the call when the file does not import PoThemeService', () => {
      const source = lines(`export class A {`, `  run(service: any) {`, `    service.setDefaultTheme(0);`, `  }`, `}`);

      const result = migrateThemeTsContent(source);

      expect(result.changed).toBe(false);
      expect(result.content).toBe(source);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0].line).toBe(3);
      expect(result.warnings[0].reason).toContain('setDefaultTheme');
    });
  });

  it('should warn about poThemeSharedBase without changing it', () => {
    const source = lines(
      `import { PoButtonModule } from '@po-ui/ng-components';`,
      `import { poThemeSharedBase } from '@po-ui/ng-components';`,
      `const base = poThemeSharedBase;`
    );

    const result = migrateThemeTsContent(source);

    expect(result.content).toBe(source);
    expect(result.warnings.length).toBe(1);
    expect(result.warnings[0].line).toBe(2);
    expect(result.warnings[0].reason).toContain('poThemeSharedBase');
  });

  it('should leave files without PO UI unchanged', () => {
    const source = lines(`import { Component } from '@angular/core';`, `export class A {}`);

    const result = migrateThemeTsContent(source);

    expect(result.changed).toBe(false);
    expect(result.content).toBe(source);
    expect(result.warnings).toEqual([]);
  });

  it('should preserve formatting, comments and unrelated imports', () => {
    const source = lines(
      `// cabeçalho`,
      `import {`,
      `  PoButtonModule,`,
      `  poThemeDefault, // tema`,
      `  PoTableModule,`,
      `} from '@po-ui/ng-components';`,
      `import { Router } from '@angular/router';`,
      ``,
      `export const   value   =  poThemeDefault ;`
    );

    expect(migrateThemeTsContent(source).content).toBe(
      lines(
        `// cabeçalho`,
        `import {`,
        `  PoButtonModule,`,
        `  poThemeDefaultDeprecated, // tema`,
        `  PoTableModule,`,
        `} from '@po-ui/ng-components';`,
        `import { Router } from '@angular/router';`,
        ``,
        `export const   value   =  poThemeDefaultDeprecated ;`
      )
    );
  });

  it('should be idempotent', () => {
    const source = lines(
      `import { poThemeDefault, poThemeDefaultActions as actions, PoThemeService } from '@po-ui/ng-components';`,
      `function f(service: PoThemeService) {`,
      `  service.setDefaultTheme(0);`,
      `  return { poThemeDefault, actions };`,
      `}`
    );

    const first = migrateThemeTsContent(source);
    const second = migrateThemeTsContent(first.content);

    expect(first.changed).toBe(true);
    expect(second.changed).toBe(false);
    expect(second.content).toBe(first.content);
  });
});

describe('v22 theme-deprecated importsPoThemeService:', () => {
  it('should detect a named import of PoThemeService', () => {
    expect(importsPoThemeService(`import { PoThemeService } from '@po-ui/ng-components';`)).toBe(true);
    expect(importsPoThemeService(`import { PoThemeService as Theme } from '@po-ui/ng-components';`)).toBe(true);
  });

  it('should detect PoThemeService through a namespace import', () => {
    expect(
      importsPoThemeService(
        lines(`import * as po from '@po-ui/ng-components';`, `const service = inject(po.PoThemeService);`)
      )
    ).toBe(true);
  });

  it('should return false when the service is not imported from PO UI', () => {
    expect(importsPoThemeService(`import { PoButtonModule } from '@po-ui/ng-components';`)).toBe(false);
    expect(importsPoThemeService(`import { PoThemeService } from './local';`)).toBe(false);
  });
});
