---
inclusion: fileMatch
fileMatchPattern: ["projects/ui/src/lib/**/*.ts", "projects/ui/src/lib/**/*.scss", "**/*.css", "**/*.scss"]
name: css-tokens
classification: skill
source: .github/skills/add-css-tokens.md + .kiro/steering/css-theme-workflow.md
description: Use ao adicionar, alterar ou documentar tokens CSS customizáveis em componentes PO UI.
---

# Tokens CSS Customizáveis

## Procedimento

1. Abrir o arquivo `po-<nome>-base.component.ts` do componente.
2. Adicionar ou atualizar a tabela de tokens no JSDoc acima da classe.
3. Agrupar tokens por comportamento visual.
4. Referenciar o guia de customização de tema no texto de documentação quando necessário.
5. Validar visualmente os níveis AA e AAA quando a mudança afetar contraste, foco, área clicável ou estado visual.

## Ordem de agrupamento

- Padrão.
- Hover.
- Focused.
- Pressed ou Active.
- Disabled.
- Loading.
- Danger e variantes.

## Convenções de nomenclatura

- Estados: `--{property}-{state}`, por exemplo `--color-hover` ou `--background-pressed`.
- Variantes: `--{property}-{variant}`, por exemplo `--color-button-danger`.
- Referências globais devem usar `var(--global-token-name)`.

## Categorias comuns

- Tipografia: `--font-family`, `--font-size`, `--font-weight`, `--line-height`.
- Cores: `--color-*`, `--text-color-*`, `--background-*`, `--border-color-*`.
- Espaçamento: `--padding`, `--margin`.
- Forma: `--border-radius`, `--border-width`.
- Efeitos: `--shadow`, `--outline-color-focused`.

## Fontes úteis

- Tema base: `@po-ui/style/css/po-theme-default.min.css`.
- Helpers e constantes: `projects/ui/src/lib/services/po-theme/helpers/`.

## Integração com po-style

Quando a mudança precisar ser validada com `po-style` local:

```bash
cd ../po-style
npm run watch:css
cd ../po-angular
npx ng serve app --port 4200 --host 0.0.0.0 --open=false
```

Se o token afetar `po-theme-default.css`, avaliar a necessidade de espelhamento em `po-theme-custom.css` no repositório `po-theme-totvs`.
