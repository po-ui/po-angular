const fs = require('fs');
const os = require('os');
const path = require('path');

const builder = require('./search-index-builder');
const { plainText, truncate } = require('./search-text');
const { assignGroupAnchors } = require('../helpers/anchors');

const makeGroup = () => ({
  name: 'po-button',
  componentName: 'PoButton',
  package: 'components',
  description: 'Botão com **vários** estilos.\n```html\n<po-button></po-button>\n```',
  directives: [
    {
      name: 'PoButtonComponent',
      description: 'Componente de botão',
      properties: [
        {
          name: 'label',
          isDirectiveInput: true,
          directiveInputAlias: 'p-label',
          description: 'Texto do botão &#123;x&#125;',
          content: 'x'
        },
        {
          name: 'click',
          isDirectiveOutput: true,
          directiveOutputAlias: 'p-click',
          description: 'Evento de clique',
          content: 'x'
        },
        { name: 'semDoc', description: '', content: '' }
      ],
      methods: [{ name: 'focus', description: 'Foca o botão' }]
    }
  ],
  services: [],
  additionalClasses: [],
  models: [],
  interfaces: [{ name: 'PoButtonKind', docType: 'interface', description: 'Tipos', properties: [{ name: 'primary', description: 'Primário', content: 'x' }], methods: [] }],
  enums: []
});

const guideMarkdown = `[comment]: # (@label Primeiros passos)
[comment]: # (@link guides/getting-started)

# Primeiros passos

Introdução com \`ng add\`.

## Pré-requisitos

Node 20.

## Pré-requisitos

Repetido.
`;

describe('search-text', () => {
  it('plainText remove markdown, código em bloco e entidades', () => {
    expect(plainText('Veja **isto** [aqui](http://x)\n```ts\nconst a = 1;\n```\n&#123;ok&#125;')).toBe('Veja isto aqui {ok}');
    expect(plainText('a\n```\nng add\n```', { keepCode: true })).toContain('ng add');
  });

  it('truncate corta em palavra', () => {
    expect(truncate('um dois tres quatro', 10)).toBe('um dois…');
    expect(truncate('curto', 12)).toBe('curto');
  });
});

describe('search-index-builder: samples', () => {
  const groups = [{ name: 'po-list-view', componentName: 'PoListView', package: 'components' }];
  const example = (name, title, file = 'ui/src/lib/components/po-list-view/po-list-view.component.ts') => ({
    id: `sample-${name}`,
    name,
    title,
    doc: { fileInfo: { relativePath: file } }
  });

  it('gera uma entrada por sample apontando para a aba Exemplos e o id do sample', () => {
    const docs = builder.buildSampleDocs(groups, [example('po-list-view-labs', 'PO List View Labs')]);

    expect(docs).toEqual([
      jasmine.objectContaining({
        id: 'po-list-view#sample-po-list-view-labs',
        type: 'sample',
        title: 'PO List View Labs',
        fragment: 'sample-po-list-view-labs',
        section: 'Exemplos'
      })
    ]);
    expect(docs[0].page).toEqual({
      name: 'PoListView',
      url: '/documentation/po-list-view?view=web',
      component: 'po-list-view',
      package: 'components'
    });
  });

  it('usa o name quando falta title e ignora sample de componente sem página', () => {
    const docs = builder.buildSampleDocs(groups, [
      { ...example('po-list-view-basic'), title: undefined },
      example('po-nada-basic', 'Sem página', 'ui/src/lib/components/po-nada/po-nada.component.ts')
    ]);

    expect(docs.map(d => d.title)).toEqual(['po-list-view-basic']);
  });

  it('vai para um chunk lazy próprio (fora do core)', () => {
    const chunks = builder.buildChunks(builder.buildSampleDocs(groups, [example('po-list-view-labs', 'Labs')]));

    expect(Object.keys(chunks)).toEqual(['samples']);
  });
});

describe('search-index-builder', () => {
  it('gera documentos de API com ids únicos, estáveis e sem HTML/entidades', () => {
    const run = () => {
      const group = makeGroup();
      assignGroupAnchors(group);
      return builder.buildApiDocs([group]);
    };
    const docs = run();
    const ids = docs.map(d => d.id);

    expect(ids).toEqual(run().map(d => d.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      jasmine.arrayContaining(['po-button', 'po-button#prop-p-label', 'po-button#event-p-click', 'po-button#method-focus', 'po-button#interface-po-button-kind-primary'])
    );
    expect(ids).not.toContain('po-button#sem-doc');
    expect(docs.find(d => d.id === 'po-button#event-p-click').type).toBe('evento');
    expect(docs.find(d => d.id === 'po-button#method-focus').type).toBe('metodo');
    expect(docs.find(d => d.id === 'po-button').text).toBe('Botão com vários estilos.');
    docs.forEach(d => expect(d.text).not.toMatch(/&#\d+;|<[a-z]/i));
  });

  it('gera seções de guia com os mesmos ids do renderer (slug, repetido -2)', () => {
    const docs = builder.buildGuideDocs('getting-started', guideMarkdown);

    expect(docs.map(d => d.id)).toEqual([
      'guia:getting-started#primeiros-passos',
      'guia:getting-started#pre-requisitos',
      'guia:getting-started#pre-requisitos-2'
    ]);
    expect(docs[0].fragment).toBeUndefined();
    expect(docs[0].page.name).toBe('Primeiros passos');
    expect(docs[0].text).toContain('ng add');
    expect(docs[1].text).toBe('Node 20.');
  });

  it('ignora o frontmatter do guia (sem título falso nem texto) e mantém os ids', () => {
    const docs = builder.buildGuideDocs('getting-started', `---\ntitle: Outro\ncategory: getting-started\norder: 1\n---\n${guideMarkdown}`);

    expect(docs.map(d => d.id)).toEqual(builder.buildGuideDocs('getting-started', guideMarkdown).map(d => d.id));
    docs.forEach(d => expect(d.title + d.text).not.toMatch(/category|order: 1|---/));
  });

  it('indexa ícones sem repetir a variante fill e não tem changelog', () => {
    const docs = builder.buildIconDocs({
      icons: [{ properties: { name: 'arrow-left' } }, { properties: { name: 'arrow-left-fill' } }, { properties: { name: 'x', ligatures: 'x' } }]
    });
    const all = [...docs, ...builder.buildPageDocs()];

    expect(docs.map(d => d.id)).toEqual(['icone:arrow-left', 'icone:x']);
    expect(all.some(d => /changelog/i.test(d.id + d.title + d.page.url))).toBe(false);
  });

  it('separa em chunks com tabela de páginas e grava arquivos com hash + manifest', () => {
    const group = makeGroup();
    assignGroupAnchors(group);
    const docs = [
      ...builder.buildApiDocs([group]),
      ...builder.buildGuideDocs('getting-started', guideMarkdown),
      ...builder.buildIconDocs({ icons: [{ properties: { name: 'a' } }] }),
      ...builder.buildPageDocs()
    ];
    const chunks = builder.buildChunks(docs);

    expect(Object.keys(chunks).sort()).toEqual(['api', 'core', 'icons']);
    expect(chunks.api.docs.every(d => ['propriedade', 'evento', 'metodo'].includes(d.type))).toBe(true);
    expect(chunks.api.pages.length).toBe(1);
    expect(chunks.api.docs.every(d => chunks.api.pages[d.page])).toBe(true);

    const dir = fs.mkdtempSync(path.join(process.env.KIROCREW_SCRATCH || os.tmpdir(), 'search-'));
    const first = builder.writeIndex(dir, chunks);

    expect(first.chunks.core.file).toMatch(/^search-core\.[0-9a-f]{8}\.json$/);
    expect(first.chunks.core.count).toBe(chunks.core.docs.length);
    expect(fs.existsSync(path.join(dir, first.chunks.core.file))).toBe(true);

    // conteúdo diferente = nome diferente; o arquivo antigo é removido
    chunks.core.docs.push({ id: 'pagina:novo', type: 'pagina', title: 'Novo', page: 0, text: '' });
    const second = builder.writeIndex(dir, chunks);

    expect(second.chunks.core.file).not.toBe(first.chunks.core.file);
    expect(fs.existsSync(path.join(dir, first.chunks.core.file))).toBe(false);
    expect(JSON.parse(fs.readFileSync(path.join(dir, 'search-manifest.json'), 'utf-8'))).toEqual(second);

    fs.rmSync(dir, { recursive: true, force: true });
  });
});
