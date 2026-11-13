const { resolveDocsMenu, compareForMenu } = require('./docs-menu');
const vocab = require('../../docs-categories');

const item = (name, tags = {}) => ({ name, title: `Po ${name.replace(/^po-/, '')}`, file: `${name}.component.ts`, ...tags });
const codes = list => list.map(e => e.code);

describe('docs-menu: resolveDocsMenu', () => {
  it('deriva a seção da categoria e liga o sub ao pai', () => {
    const { entries, errors, warnings } = resolveDocsMenu(
      [item('po-table', { docsCategory: 'tables-lists' }), item('po-table-cell-template', { docsParent: 'po-table' })],
      vocab
    );
    const table = entries.find(e => e.name === 'po-table');

    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(table).toEqual(
      jasmine.objectContaining({
        section: 'components',
        sectionLabel: 'Componentes',
        category: 'tables-lists',
        categoryLabel: 'Tabelas e listas',
        children: ['po-table-cell-template']
      })
    );
    expect(entries.find(e => e.name === 'po-table-cell-template').parent).toBe('po-table');
  });

  it('aceita o valor com espaços e quebras de linha que o Dgeni deixa', () => {
    const { entries, errors } = resolveDocsMenu([item('po-input', { docsCategory: ' form\n\n' })], vocab);

    expect(errors).toEqual([]);
    expect(entries[0].category).toBe('form');
  });

  it('resolve atalhos (vários) e ignora repetidos', () => {
    const { entries, errors } = resolveDocsMenu(
      [item('po-drag', { docsCategory: 'directives', docsShortcut: ['tables-lists', 'tables-lists'] })],
      vocab
    );

    expect(errors).toEqual([]);
    expect(entries[0].shortcuts.map(s => [s.section, s.category])).toEqual([['components', 'tables-lists']]);
  });

  it('erros: categoria/atalho desconhecido, pai inexistente, cadeia, categoria e pai juntos, atalho igual à categoria', () => {
    const { errors } = resolveDocsMenu(
      [
        item('po-a', { docsCategory: 'from' }),
        item('po-b', { docsCategory: 'form', docsShortcut: 'nada' }),
        item('po-c', { docsParent: 'po-nao-existe' }),
        item('po-d', { docsCategory: 'form' }),
        item('po-e', { docsParent: 'po-d' }),
        item('po-f', { docsParent: 'po-e' }),
        item('po-g', { docsCategory: 'form', docsParent: 'po-d' }),
        item('po-h', { docsCategory: 'form', docsShortcut: 'form' })
      ],
      vocab
    );

    expect(codes(errors).sort()).toEqual(
      [
        'unknown-category',
        'unknown-shortcut',
        'parent-not-found',
        'parent-is-sub',
        'category-and-parent',
        'shortcut-same-category'
      ].sort()
    );
    expect(errors.find(e => e.code === 'unknown-category').message).toContain('po-a.component.ts');
  });

  it('sem tag: só aviso e vai para "Outros"', () => {
    const { entries, errors, warnings } = resolveDocsMenu([item('po-novo')], vocab);

    expect(errors).toEqual([]);
    expect(codes(warnings)).toEqual(['missing-category']);
    expect(entries[0]).toEqual(jasmine.objectContaining({ section: 'components', category: 'others', categoryLabel: 'Outros' }));
  });

  it('@docsOrder: inteiro >= 1; em sub é ignorado com aviso; repetido avisa', () => {
    ['0', '1.5', 'alto', '-1'].forEach(value => {
      expect(codes(resolveDocsMenu([item('po-a', { docsCategory: 'form', docsOrder: value })], vocab).errors)).toEqual([
        'invalid-order'
      ]);
    });

    const { entries, warnings } = resolveDocsMenu(
      [
        item('po-a', { docsCategory: 'form', docsOrder: '2' }),
        item('po-b', { docsCategory: 'form', docsOrder: '2' }),
        item('po-c', { docsParent: 'po-a', docsOrder: '1' })
      ],
      vocab
    );

    expect(entries[0].order).toBe(2);
    expect(entries[2].order).toBeUndefined();
    expect(codes(warnings).sort()).toEqual(['duplicate-order', 'order-on-sub']);
  });
});

describe('docs-menu: compareForMenu', () => {
  it('@docsOrder primeiro (menor primeiro), depois alfabética pelo título sem acento nem caixa', () => {
    const list = [
      { title: 'Po Url' },
      { title: 'Po email' },
      { title: 'Po Ávila', order: undefined },
      { title: 'Po Zeta', order: 2 },
      { title: 'Po Novo', order: 1 },
      { title: 'Po Beta' }
    ];

    expect(list.sort(compareForMenu).map(i => i.title)).toEqual([
      'Po Novo',
      'Po Zeta',
      'Po Ávila',
      'Po Beta',
      'Po email',
      'Po Url'
    ]);
  });
});
