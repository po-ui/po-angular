---
inclusion: always
---

# Technology Stack

## Stack principal

- Angular, na versão atual do projeto.
- TypeScript estrito.
- Jasmine + Karma para testes unitários dos pacotes Angular.
- Jest para testes do pacote MCP em `projects/mcp`.
- Dgeni para geração de documentação a partir de JSDoc.
- ng-packagr para build de bibliotecas.
- Gulp para schematics e transformação de documentação.
- Husky + commitlint com `@commitlint/config-angular`.

## Pacotes do monorepo

| Caminho | Pacote | Descrição |
|---|---|---|
| `projects/ui/` | `@po-ui/ng-components` | Biblioteca principal de componentes |
| `projects/templates/` | `@po-ui/ng-templates` | Templates de páginas |
| `projects/storage/` | `@po-ui/ng-storage` | Utilitários de storage |
| `projects/sync/` | `@po-ui/ng-sync` | Utilitários de sincronização de dados |
| `projects/code-editor/` | `@po-ui/ng-code-editor` | Editor baseado em Monaco |
| `projects/mcp/` | `@po-ui/mcp` | Servidor MCP para integração com LLM |
| `projects/portal/` | — | Portal de documentação |
| `projects/app/` | — | Aplicação de demonstração/testes |

## Resolução de bibliotecas

Aliases de biblioteca em `tsconfig.json` apontam para `dist/`. Portanto, uma biblioteca deve ser buildada antes de ser usada no portal ou na aplicação de demonstração.
