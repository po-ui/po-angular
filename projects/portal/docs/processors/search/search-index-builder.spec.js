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
      jasmine.arrayContaining(['po-button', 'po-button#p-label', 'po-button#p-click', 'po-button#method-focus', 'po-button#po-button-kind-primary'])
    );
    expect(ids).not.toContain('po-button#sem-doc');
    expect(docs.find(d => d.id === 'po-button#p-click').type).toBe('evento');
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
