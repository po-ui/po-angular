import { migrateAngularJsonStyles, migrateStylesheetContent } from './theme-style-migration';

const lines = (...content: Array<string>) => content.join('\n');

const ANGULAR_JSON = lines(
  `{`,
  `  // comentário preservado`,
  `  "projects": {`,
  `    "app": {`,
  `      "architect": {`,
  `        "build": {`,
  `          "options": {`,
  `            "styles": [`,
  `              "./node_modules/@po-ui/style/css/po-theme-default.min.css",`,
  `              "src/styles.css"`,
  `            ]`,
  `          },`,
  `          "configurations": {`,
  `            "production": {`,
  `              "styles": [{ "input": "node_modules/@po-ui/style/css/po-theme-default-variables.min.css", "inject": true }]`,
  `            }`,
  `          }`,
  `        },`,
  `        "test": {`,
  `          "options": { "styles": ["node_modules/@po-ui/style/css/po-theme-default-variables.css"] }`,
  `        }`,
  `      }`,
  `    }`,
  `  }`,
  `}`
);

describe('v22 theme-deprecated migrateAngularJsonStyles:', () => {
  it('should replace string and object entries in every target and configuration', () => {
    const result = migrateAngularJsonStyles(ANGULAR_JSON);

    expect(result.changed).toBe(true);
    expect(result.replacements).toBe(3);
    expect(result.content).toBe(
      ANGULAR_JSON.replace('po-theme-default.min.css', 'po-theme-default-deprecated.min.css')
        .replace('po-theme-default-variables.min.css', 'po-theme-default-deprecated-variables.min.css')
        .replace('po-theme-default-variables.css', 'po-theme-default-deprecated-variables.css')
    );
  });

  it('should keep po-theme-core and unrelated entries', () => {
    const json = `{ "styles": ["node_modules/@po-ui/style/css/po-theme-core.min.css", "src/po-theme-default.min.css"] }`;

    const result = migrateAngularJsonStyles(json);

    expect(result.changed).toBe(false);
    expect(result.content).toBe(json);
  });

  it('should leave an already migrated angular.json unchanged', () => {
    const migrated = migrateAngularJsonStyles(ANGULAR_JSON).content;

    const result = migrateAngularJsonStyles(migrated);

    expect(result.changed).toBe(false);
    expect(result.replacements).toBe(0);
    expect(result.content).toBe(migrated);
  });
});

describe('v22 theme-deprecated migrateStylesheetContent:', () => {
  it('should replace @import with and without ~ and url()', () => {
    const source = lines(
      `@import '~@po-ui/style/css/po-theme-default.min.css';`,
      `@import "@po-ui/style/css/po-theme-default-variables.css";`,
      `@import url('../node_modules/@po-ui/style/css/po-theme-default-variables.min.css');`,
      `body { margin: 0; }`
    );

    const result = migrateStylesheetContent(source);

    expect(result.replacements).toBe(3);
    expect(result.content).toBe(
      lines(
        `@import '~@po-ui/style/css/po-theme-default-deprecated.min.css';`,
        `@import "@po-ui/style/css/po-theme-default-deprecated-variables.css";`,
        `@import url('../node_modules/@po-ui/style/css/po-theme-default-deprecated-variables.min.css');`,
        `body { margin: 0; }`
      )
    );
  });

  it('should replace Sass @use and @forward, with and without extension', () => {
    const source = lines(
      `@use '@po-ui/style/css/po-theme-default.min';`,
      `@forward "~@po-ui/style/css/po-theme-default-variables.css" as theme-*;`
    );

    expect(migrateStylesheetContent(source).content).toBe(
      lines(
        `@use '@po-ui/style/css/po-theme-default-deprecated.min';`,
        `@forward "~@po-ui/style/css/po-theme-default-deprecated-variables.css" as theme-*;`
      )
    );
  });

  it('should ignore references outside @import/@use/@forward lines', () => {
    const source = `/* veja @po-ui/style/css/po-theme-default.min.css */`;

    expect(migrateStylesheetContent(source).content).toBe(source);
  });

  it('should leave a file without references unchanged', () => {
    const source = `@import 'other.css';\n.a { color: red; }`;

    const result = migrateStylesheetContent(source);

    expect(result.changed).toBe(false);
    expect(result.content).toBe(source);
  });

  it('should be idempotent', () => {
    const source = `@import '~@po-ui/style/css/po-theme-default.min.css';\r\n`;
    const first = migrateStylesheetContent(source);

    const second = migrateStylesheetContent(first.content);

    expect(first.changed).toBe(true);
    expect(first.content).toBe(`@import '~@po-ui/style/css/po-theme-default-deprecated.min.css';\r\n`);
    expect(second.changed).toBe(false);
  });
});
