const fs = require('fs');
const path = require('path');

const { CATEGORIES, PARENTS, SHORTCUTS, withTags } = require('./apply-docs-tags');

const API_LIST = path.resolve(__dirname, '../../src/assets/json/api-list.json');

describe('apply-docs-tags: withTags', () => {
  const report = () => ({ conflicts: [] });
  const comment = ['/**', ' * @docsExtends PoButtonBaseComponent', ' *', ' * @example', ' * <example name="x"></example>', ' */'].join('\n');

  it('insere no fim do bloco, separado por uma linha em branco', () => {
    expect(withTags(comment, [['docsCategory', 'actions']], 'po-button', report())).toBe(
      ['/**', ' * @docsExtends PoButtonBaseComponent', ' *', ' * @example', ' * <example name="x"></example>', ' *', ' * @docsCategory actions', ' */'].join('\n')
    );
  });

  it('é idempotente e não troca valor diferente (avisa)', () => {
    const once = withTags(comment, [['docsCategory', 'actions']], 'po-button', report());
    const r = report();

    expect(withTags(once, [['docsCategory', 'actions']], 'po-button', r)).toBe(once);
    expect(withTags(once, [['docsCategory', 'form']], 'po-button', r)).toBe(once);
    expect(r.conflicts.length).toBe(1);
  });

  it('não duplica a linha em branco quando o bloco já termina com " *"', () => {
    const endsBlank = ['/**', ' * @description', ' *', ' * Texto.', ' *', ' */'].join('\n');

    expect(withTags(endsBlank, [['docsParent', 'po-table']], 'po-x', report())).toBe(
      ['/**', ' * @description', ' *', ' * Texto.', ' *', ' * @docsParent po-table', ' */'].join('\n')
    );
  });
});

describe('apply-docs-tags: tabela aplicada (api-list.json gerado)', () => {
  const generated = fs.existsSync(API_LIST) ? JSON.parse(fs.readFileSync(API_LIST, 'utf-8')) : null;
  const byName = new Map((generated || []).map(i => [i.name, i]));

  beforeEach(() => {
    if (!generated) pending('api-list.json não gerado: rode `cd projects/portal && npx gulp build:api` antes');
  });

  it('101 no menu, 17 subcomponentes, 5 atalhos e nenhum em "Outros"', () => {
    const inMenu = generated.filter(i => !i.parent);

    expect(inMenu.length).toBe(101);
    expect(generated.length - inMenu.length).toBe(17);
    expect(generated.reduce((n, i) => n + (i.shortcuts || []).length, 0)).toBe(5);
    expect(generated.filter(i => i.category === 'others').map(i => i.name)).toEqual([]);
    expect(byName.has('po-gauge')).toBe(false);
  });

  it('cada item está na categoria, no pai e nos atalhos da tabela', () => {
    Object.entries(CATEGORIES).forEach(([category, routes]) =>
      routes.forEach(route => expect(`${route}: ${byName.get(route)?.category}`).toBe(`${route}: ${category}`))
    );
    Object.entries(PARENTS).forEach(([parent, subs]) => {
      subs.forEach(sub => expect(`${sub}: ${byName.get(sub)?.parent}`).toBe(`${sub}: ${parent}`));
      expect(byName.get(parent).children).toEqual([...subs].sort());
    });
    Object.entries(SHORTCUTS).forEach(([route, categories]) =>
      expect(byName.get(route).shortcuts.map(s => s.category)).toEqual(categories)
    );
    expect(generated.filter(i => i.order !== undefined).length).toBe(0);
  });
});
