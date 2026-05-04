---
inclusion: manual
---

# Common Commands

## Desenvolvimento

```bash
npm start                        # Inicia o dev server do portal
```

## Testes

```bash
npm run test:ui                  # Testes da biblioteca UI
npm run test:ui:browse           # Testes interativos no browser
npm run test:storage             # Testes da biblioteca Storage
npm run test:sync                # Testes da biblioteca Sync
npm run test:templates           # Testes da biblioteca Templates
npm run test:code-editor         # Testes da biblioteca Code Editor
npm run test:schematics          # Todos os testes de schematics
cd projects/mcp && npm test      # Testes Jest do pacote MCP
```

## Lint e formatação

```bash
npm run lint:ui                  # Lint da biblioteca UI
npm run lint                     # Lint geral
npm run format:check             # Verifica formatação Prettier
npm run format:all               # Formata todos os arquivos
```

## Build

```bash
npm run build:ui:lite            # Build rápido da UI, sem schematics/pack
npm run build:ui                 # Build completo da UI + schematics + npm pack
npm run build                    # Build de todas as bibliotecas
npm run build:portal:docs        # Build da documentação do portal; requer build:ui antes
npm run build:portal:llms        # Build dos arquivos de documentação para LLM
npm run build:mcp                # Build do servidor MCP
```

## Publicação local com Verdaccio

```bash
npm run publish:ui:local
npm run publish:local            # Publica todos os pacotes localmente
```

## Portal

```bash
npm run build:portal:docs        # Constrói documentação, guias e menus
npm run build:portal:prod        # Build de produção do portal
npm run build:portal             # Build completo do portal
```

## CSS local com po-style

```bash
cd ../po-style
npm run watch:css
cd ../po-angular
npx ng serve app --port 4200 --host 0.0.0.0 --open=false
```

## CI equivalente da `.github/workflows/ci.yml`

```bash
npm i
npm run format:check
npm run lint:storage
npm run lint:sync
npm run lint:ui
npm run lint:templates
npm run lint:code-editor
npm run build
npm run build:portal:docs
npm run build:portal:llms
npm run build:portal:prod
npm run test:ui
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
