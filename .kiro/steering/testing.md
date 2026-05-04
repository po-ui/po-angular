---
inclusion: fileMatch
fileMatchPattern: ["**/*.spec.ts", "projects/**/util-test/**/*.ts", "karma.conf.js", "projects/mcp/**/*.test.ts"]
name: testing
description: Use ao escrever, revisar ou executar testes unitários com Jasmine, Karma ou Jest no PO UI.
---

# Testing Standards

## Requisitos gerais

- Cobertura mínima por arquivo: 99% para statements, branches, functions e lines.
- Descrições de `describe()` e `it()` devem estar em inglês.
- Estrutura recomendada: `describe('PoXxxComponent') > describe('method') > it('should ...')`.
- Usar `beforeEach` para configurar o `TestBed` uma única vez por `describe`.
- Não deixar `fdescribe` ou `fit` em commits; usar apenas em sessões locais.
- Para mocks, preferir `spyOn` a substituições manuais.
- Sempre testar estado inicial do componente e valores default de Inputs.
- Testar casos de borda como `null`, `undefined` e strings vazias.

## Utilitários

- Importar `expectPropertiesValues` de `../../util-test/util-expect.spec` para validação de propriedades booleanas.
- O setup comum fica em `projects/ui/src/lib/util-test/util-setup.spec.ts`.

## MCP

Testes do pacote MCP usam Jest:

```bash
cd projects/mcp && npm test
```

## Estrutura recomendada importada da `.github`

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

## Comandos úteis

```bash
npm run test:ui
npm run test:ui:browse
npm run test:ui:schematics
npm run test:templates
npm run test:templates:schematics
npm run test:code-editor
npm run test:code-editor:schematics
npm run test:storage
npm run test:storage:schematics
npm run test:sync
npm run test:sync:schematics
npm run test:mcp
```
