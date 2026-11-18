const fs = require('fs');
const path = require('path');

const configuration = require('../../configuration');
const util = require('../../util');
const vocab = require('../../guides-categories');
const { readGuide, buildGuidesMenu } = require('./guide-meta');

// mesma pasta que o `gulp build:guides` lê (o po-style só entra se estiver ao lado do po-angular)
const PORTAL_DIR = path.resolve(__dirname, '../../..');

const guideFiles = () =>
  util.projectsNames().flatMap(project => {
    const dir = path.resolve(PORTAL_DIR, configuration.sourceFolder, project, 'docs/guides');

    return fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter(f => f.endsWith('.md'))
          .map(f => ({ project, name: path.basename(f, '.md'), file: path.join(dir, f) }))
      : [];
  });

// guia -> categoria, como decidido no estudo (docs-study/guides-categories-study.md)
const TABLE = {
  'getting-started': 'getting-started',
  'schematics': 'getting-started',
  'browser-support': 'getting-started',
  'theme-service': 'themes',
  'theme-customization': 'themes',
  'create-theme-customization': 'themes',
  'grid-system': 'layout',
  'spacing': 'layout',
  'typography': 'layout',
  'guide-charts': 'components',
  'api': 'components',
  'sync-get-started': 'sync',
  'sync-fundamentals': 'sync',
  'migration-poui-v2': 'migration',
  'migration-poui': 'migration',
  'migration-thf-to-po-ui': 'migration',
  'deprecations': 'migration',
  'releases': 'releases',
  'release-schedule': 'releases',
  'development-flow': 'community',
  'press-kit': 'community'
};

describe('menu de Guias: frontmatter dos guias reais', () => {
  const files = guideFiles();
  const guides = files.map(({ name, file }) => readGuide(name, fs.readFileSync(file, 'utf-8'), file));
  const { menu, errors, warnings, counts } = buildGuidesMenu(guides, vocab);

  it('sem erro nem aviso, nada em "Outros"', () => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(menu.some(c => c.key === 'others')).toBe(false);
  });

  it('cada guia na categoria da tabela (contagem por categoria)', () => {
    const count = list => list.reduce((total, key) => Object.assign(total, { [key]: (total[key] || 0) + 1 }), {});
    const expected = count(files.filter(f => TABLE[f.name]).map(f => TABLE[f.name]));
    const actual = count(menu.flatMap(c => c.items.filter(i => !i.shortcut).map(() => c.key)));

    expect(files.filter(f => f.project === 'po-angular').length).toBe(16);
    expect(guides.every(g => TABLE[g.name] === g.category)).toBe(true);
    expect(actual).toEqual(expected);
  });

  it('Primeiros passos abre "Começando" e os 3 atalhos estão nas categorias certas', () => {
    expect(menu[0].label).toBe('Começando');
    expect(menu[0].items[0].label).toBe('Primeiros passos');
    expect(counts.shortcuts).toBe(3);
    expect(menu.flatMap(c => c.items.filter(i => i.shortcut).map(i => `${c.key}:${i.name}`)).sort()).toEqual([
      'migration:schematics',
      'releases:browser-support',
      'releases:deprecations'
    ]);
  });

  it('o corpo dos guias não começa mais com o bloco ---', () => {
    guides.forEach(g => expect(g.body.trimStart().startsWith('---')).toBe(false));
  });
});
