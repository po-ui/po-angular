const { slugify, headingText, uniqueId, propertyAlias, assignGroupAnchors } = require('./anchors');

describe('anchors', () => {
  it('slugify remove acento e usa kebab-case', () => {
    expect(slugify('Pré-requisitos')).toBe('pre-requisitos');
    expect(slugify('PoButton')).toBe('po-button');
    expect(slugify('  Passo 1: Crie o projeto! ')).toBe('passo-1-crie-o-projeto');
  });

  it('headingText tira markdown e HTML do título', () => {
    expect(headingText('Usando `p-label` e [link](http://x) <b>x</b>')).toBe('Usando p-label e link x');
  });

  it('uniqueId acrescenta -2, -3 para repetidos, de forma determinística', () => {
    const seen = new Set();
    expect([uniqueId('a', seen), uniqueId('a', seen), uniqueId('a', seen)]).toEqual(['a', 'a-2', 'a-3']);
  });

  it('propertyAlias usa alias de input/output ou p-<nome>', () => {
    expect(propertyAlias({ name: 'label', isDirectiveInput: true, directiveInputAlias: "'p-label'" })).toBe('p-label');
    expect(propertyAlias({ name: 'click', isDirectiveOutput: true, directiveOutputAlias: 'p-click' })).toBe('p-click');
    expect(propertyAlias({ name: 'maxLength' })).toBe('p-max-length');
    expect(propertyAlias({ name: 'name' })).toBe('name');
  });

  it('assignGroupAnchors gera ids únicos, independentes da ordem, e não repete em objetos compartilhados', () => {
    const makeGroup = () => ({
      directives: [
        {
          name: 'PoButtonComponent',
          properties: [
            { name: 'label', isDirectiveInput: true, directiveInputAlias: 'p-label' },
            { name: 'label2', isDirectiveInput: true, directiveInputAlias: 'p-label' }
          ],
          methods: [{ name: 'focus' }]
        }
      ],
      services: [],
      additionalClasses: [],
      interfaces: [{ name: 'PoButtonKind', properties: [{ name: 'primary' }], methods: [] }],
      models: [],
      enums: [{ name: 'PoType', docType: 'enum', properties: [{ name: 'x' }], enums: [{ name: 'Submit' }] }]
    });
    const group = makeGroup();

    assignGroupAnchors(group);
    const dir = group.directives[0];

    expect(dir.anchorId).toBe('po-button-component');
    expect(dir.properties.map(p => p.anchorId)).toEqual(['p-label', 'p-label-2']);
    expect(dir.methods[0].anchorId).toBe('method-focus');
    expect(group.interfaces[0].properties[0].anchorId).toBe('po-button-kind-primary');
    expect(group.enums[0].enums[0].anchorId).toBe('po-type-submit');

    // ordem trocada nas propriedades de interface não muda o id
    const again = makeGroup();
    again.interfaces[0].properties.unshift({ name: 'secondary' });
    assignGroupAnchors(again);
    expect(again.interfaces[0].properties[1].anchorId).toBe('po-button-kind-primary');
  });
});
