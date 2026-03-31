# Skill: Escrever Testes Unitários

## Descrição
Escreve testes unitários para componentes PO UI seguindo os padrões do projeto.

## Requisitos
- Coverage mínimo: 99% em statements, branches, functions e lines
- Descrições de `describe()` e `it()` em inglês
- Importar `expectPropertiesValues` de `../../util-test/util-expect.spec`

## Estrutura
```typescript
describe('Po<Nome>Component', () => {
  it('should create component', () => { ... });

  describe('Properties:', () => {
    describe('p-<prop>', () => {
      it('should set <prop> with valid values', () => { ... });
      it('should set <prop> with default value when invalid', () => { ... });
    });
  });

  describe('Methods:', () => {
    describe('<method>', () => {
      it('should <expected behavior>', () => { ... });
    });
  });
});
```

## Comandos
- Executar: `npm run test:ui`
- Interativo: `npm run test:ui:browse`
