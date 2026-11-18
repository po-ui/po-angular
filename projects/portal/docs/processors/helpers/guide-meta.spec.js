const { readGuide, buildGuidesMenu } = require('./guide-meta');
const vocab = require('../../guides-categories');

const md = (name, front, label = name) =>
  `${front === undefined ? '' : `---\n${front}\n---\n`}[comment]: # (@label ${label})\n[comment]: # (@link guides/${name})\n\n## Título\n\nTexto.\n`;
const guide = (name, front, label) => readGuide(name, md(name, front, label));
const codes = list => list.map(e => e.code);

describe('guide-meta: readGuide', () => {
  it('lê o frontmatter e tira o bloco do markdown', () => {
    const g = guide(
      'getting-started',
      'title: Primeiros passos\ncategory: getting-started\norder: 1',
      'Primeiros passos'
    );

    expect(g).toEqual(
      jasmine.objectContaining({
        label: 'Primeiros passos',
        link: 'guides/getting-started',
        category: 'getting-started',
        order: 1,
        errors: [],
        warnings: []
      })
    );
    expect(g.body.startsWith('[comment]')).toBe(true);
    expect(g.body).not.toContain('---');
  });

  it('aceita BOM, CRLF e linhas em branco antes do bloco', () => {
    const g = readGuide('x', '\uFEFF\r\n---\r\ncategory: sync\r\n---\r\n[comment]: # (@label X)\r\n# X\r\n');

    expect(g.errors).toEqual([]);
    expect(g.category).toBe('sync');
    expect(g.body).toBe('[comment]: # (@label X)\r\n# X\r\n');
  });

  it('sem frontmatter: body igual ao arquivo e sem categoria', () => {
    const g = guide('api');

    expect(g.body).toBe(md('api'));
    expect(g.category).toBeUndefined();
    expect(g.errors).toEqual([]);
  });

  it('o @label vale; title só se faltar o @label', () => {
    expect(readGuide('x', '---\ntitle: Do frontmatter\n---\n# X\n').label).toBe('Do frontmatter');

    const g = guide('x', 'title: Outro', 'Do comentário');

    expect(g.label).toBe('Do comentário');
    expect(codes(g.warnings)).toEqual(['title-differs']);
  });

  it('erros: YAML inválido, bloco sem fechar, campo desconhecido, sem título', () => {
    expect(codes(guide('a', 'category: [sync').errors)).toEqual(['invalid-frontmatter']);
    expect(codes(readGuide('b', '---\ncategory: sync\n# B\n').errors)).toContain('invalid-frontmatter');
    expect(codes(guide('c', 'categoria: sync').errors)).toEqual(['unknown-field']);
    expect(codes(guide('d', '- sync').errors)).toEqual(['invalid-frontmatter']);
    expect(codes(readGuide('e', '# E\n').errors)).toEqual(['missing-title']);
  });
});

describe('guide-meta: buildGuidesMenu', () => {
  it('categorias na ordem da lista, order na frente e depois alfabética', () => {
    const { menu, errors, warnings } = buildGuidesMenu(
      [
        guide('schematics', 'category: getting-started', 'Schematics'),
        guide('browser-support', 'category: getting-started', 'Compatibilidade'),
        guide('getting-started', 'category: getting-started\norder: 1', 'Primeiros passos'),
        guide('sync', 'category: sync', 'Sync')
      ],
      vocab
    );

    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(menu.map(c => [c.label, c.items.map(i => i.label)])).toEqual([
      ['Começando', ['Primeiros passos', 'Compatibilidade', 'Schematics']],
      ['Dados offline (PO Sync)', ['Sync']]
    ]);
  });

  it('atalho entra na outra categoria com a categoria de origem', () => {
    const { menu, errors, counts } = buildGuidesMenu(
      [
        guide('deprecations', 'category: migration\nshortcut: [releases]', 'Depreciações'),
        guide('releases', 'category: releases', 'Releases')
      ],
      vocab
    );

    expect(errors).toEqual([]);
    expect(counts.shortcuts).toBe(1);
    expect(menu.find(c => c.key === 'releases').items).toEqual([
      {
        name: 'deprecations',
        label: 'Depreciações',
        link: 'guides/deprecations',
        shortcut: true,
        origin: 'Migração e depreciações'
      },
      { name: 'releases', label: 'Releases', link: 'guides/releases' }
    ]);
  });

  it('subguia fica dentro do pai, com order e ordem alfabética', () => {
    const { menu, errors, warnings, counts } = buildGuidesMenu(
      [
        guide('sync-fundamentals', 'category: sync', 'Fundamentos'),
        guide('sync-b', 'parent: sync-fundamentals', 'B'),
        guide('sync-a', 'parent: sync-fundamentals', 'A'),
        guide('sync-z', 'parent: sync-fundamentals\norder: 1', 'Z')
      ],
      vocab
    );

    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(counts.subguides).toBe(3);
    expect(menu).toEqual([
      {
        key: 'sync',
        label: 'Dados offline (PO Sync)',
        items: [
          {
            name: 'sync-fundamentals',
            label: 'Fundamentos',
            link: 'guides/sync-fundamentals',
            children: [
              { name: 'sync-z', label: 'Z', link: 'guides/sync-z' },
              { name: 'sync-a', label: 'A', link: 'guides/sync-a' },
              { name: 'sync-b', label: 'B', link: 'guides/sync-b' }
            ]
          }
        ]
      }
    ]);
  });

  it('sem categoria: aviso e vai para Outros', () => {
    const { menu, warnings } = buildGuidesMenu([guide('press-kit')], vocab);

    expect(codes(warnings)).toEqual(['missing-category']);
    expect(menu.map(c => c.label)).toEqual(['Outros']);
  });

  it('valores inválidos são erro, com o nome do campo do frontmatter', () => {
    const { errors } = buildGuidesMenu(
      [
        guide('a', 'category: nada'),
        guide('b', 'category: sync\nshortcut: [sync]'),
        guide('c', 'category: sync\nshortcut: [nada]'),
        guide('d', 'parent: nao-existe'),
        guide('e', 'category: sync\norder: 0'),
        guide('f', 'category: sync\norder: 1.5'),
        guide('g', 'category: sync\nparent: e'),
        guide('h', 'parent: i'),
        guide('i', 'parent: e')
      ],
      vocab
    );

    expect(codes(errors).sort()).toEqual(
      [
        'unknown-category',
        'shortcut-same-category',
        'unknown-shortcut',
        'parent-not-found',
        'invalid-order',
        'invalid-order',
        'category-and-parent',
        'parent-is-sub'
      ].sort()
    );
    expect(errors.find(e => e.code === 'category-and-parent').message).toContain('use category');
    expect(errors.some(e => /@docs/.test(e.message))).toBe(false);
  });
});
