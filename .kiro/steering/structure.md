---
inclusion: always
---

# Project Structure

## Arquitetura de componentes

Componentes são divididos em dois arquivos principais:

- `po-<name>-base.component.ts`: declara Inputs, Outputs, getters/setters, validações, documentação JSDoc e documentação de tokens CSS. Esta é a classe consumida pelo template.
- `po-<name>.component.ts`: estende a classe base e concentra interação com a view, lifecycle hooks e renderização do template.

Cada componente possui seu próprio `.module.ts`. Os módulos são agregados por `PoModule` → `PoComponentsModule`.

## Schematics

Cada biblioteca pode possuir `projects/<lib>/schematics/` com:

- `ng-add/`: schematic de instalação;
- `ng-generate/`: geradores de componentes ou features;
- `ng-update/`: scripts de migração.

Build de schematics:

```bash
gulp build:schematics --lib <ui|storage|sync|templates|code-editor>
```

Saída esperada: `dist/<package>/schematics/`.

## Regra para código novo versus legado

A estrutura histórica do PO UI contém módulos Angular e componentes agregados em `PoModule` e `PoComponentsModule`. Para componentes já existentes, preservar o padrão local salvo solicitação explícita de modernização.

Para componentes novos, seguir a instrução consolidada em `component-creation.md`: usar `standalone: true`, não criar `.module.ts` novo e importar dependências standalone diretamente.
