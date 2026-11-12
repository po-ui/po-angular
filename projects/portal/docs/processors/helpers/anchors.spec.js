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

    expect(dir.anchorId).toBe('class-po-button-component');
    expect(dir.properties.map(p => p.anchorId)).toEqual(['prop-p-label', 'prop-p-label-2']);
    expect(dir.methods[0].anchorId).toBe('method-focus');
    expect(dir.properties.every(p => p.anchorId.startsWith('prop-'))).toBe(true);
    expect(group.interfaces[0].properties[0].anchorId).toBe('interface-po-button-kind-primary');
    expect(group.enums[0].enums[0].anchorId).toBe('enum-po-type-submit');

    // ordem trocada nas propriedades de interface não muda o id
    const again = makeGroup();
    again.interfaces[0].properties.unshift({ name: 'secondary' });
    assignGroupAnchors(again);
    expect(again.interfaces[0].properties[1].anchorId).toBe('interface-po-button-kind-primary');
  });

  it('evento recebe event- e não colide com propriedade de mesmo nome', () => {
    const group = {
      directives: [
        {
          name: 'X',
          properties: [
            { name: 'a', isDirectiveInput: true, directiveInputAlias: 'p-change' },
            { name: 'b', isDirectiveOutput: true, directiveOutputAlias: 'p-change' }
          ],
          methods: []
        }
      ],
      services: [],
      additionalClasses: [],
      interfaces: [{ name: 'Foo', properties: [], methods: [{ name: 'run' }] }],
      models: [],
      enums: [{ name: 'Foo', docType: 'enum', enums: [{ name: 'A' }] }]
    };

    assignGroupAnchors(group);

    expect(group.directives[0].properties.map(p => p.anchorId)).toEqual(['prop-p-change', 'event-p-change']);
    expect(group.interfaces[0].anchorId).toBe('interface-foo');
    expect(group.interfaces[0].methods[0].anchorId).toBe('interface-foo-method-run');
    expect(group.enums[0].anchorId).toBe('enum-foo');
  });
});
