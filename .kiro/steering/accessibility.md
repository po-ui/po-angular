---
inclusion: fileMatch
fileMatchPattern: ["projects/ui/src/lib/**/*.ts", "projects/ui/src/lib/**/*.html", "projects/ui/src/lib/**/*.scss"]
name: accessibility
description: Use ao revisar ou implementar requisitos de acessibilidade WCAG, ARIA, navegação por teclado e contraste em componentes PO UI.
---

# Accessibility Rules

## Regras gerais

- Seguir padrões WCAG.
- O nível padrão do PO-UI é AAA, com maior contraste e áreas clicáveis maiores.
- AA é a variante balanceada.
- Todo componente interativo deve ter `aria-label` ou `aria-labelledby` quando o texto visível não for suficiente.
- Usar `role` semântico quando o elemento HTML nativo não for suficiente.
- Navegação por teclado é obrigatória: Tab, Enter, Escape e setas conforme o padrão do componente.
- Estados de foco devem ser visíveis; não remover `outline` sem substituto equivalente.
- Contraste mínimo WCAG AA: 4.5:1 para texto normal.
- Indicadores de foco devem ter espessura mínima de 2px.
- Space/Enter devem ativar botões conforme WAI-ARIA.
- Usar `getDefaultSizeFn()` para conformidade de tamanho AA/AAA quando aplicável.
- Testar com `PoDensityMode` para modos de densidade e espaçamento.

## Documentação

Quando houver impacto de acessibilidade, documentar recursos e comportamento acessível na seção `@description` do JSDoc do componente.

## Checklist detalhado importado da `.github`

### Atributos ARIA obrigatórios

- Usar `role` apropriado quando o elemento HTML semântico não for suficiente, como `dialog`, `listbox` ou `tabpanel`.
- Usar `aria-label` ou `aria-labelledby` para elementos sem texto visível.
- Usar `aria-describedby` quando houver texto auxiliar, mensagem de erro ou helper text.
- Usar `aria-expanded` para controles que abrem ou fecham painéis, dropdowns e accordions.
- Usar `aria-live="polite"` para regiões com conteúdo dinâmico, como toasters, contadores e validações.
- Usar `aria-disabled="true"` junto com `[disabled]` quando relevante.
- Usar `aria-checked` para checkboxes e toggles, incluindo estado `mixed`.
- Usar `aria-selected` para itens selecionáveis em listas e tabs.
- Usar `aria-hidden="true"` para elementos decorativos que não devem ser anunciados.

### Focus trap para overlays

- Capturar foco ao abrir overlay; o primeiro elemento focável deve receber foco.
- Impedir que `Tab` e `Shift+Tab` saiam do overlay enquanto ele estiver aberto.
- Retornar o foco ao elemento que abriu o overlay ao fechar.
- Permitir fechamento por `Esc` quando o padrão do componente exigir.

### Navegação por teclado

| Tecla | Comportamento esperado |
|---|---|
| `Tab` / `Shift+Tab` | Navegar entre elementos focáveis |
| `Enter` / `Space` | Ativar botões, links e controles |
| `Esc` | Fechar overlays, modais, dropdowns e popovers |
| `Arrow Up/Down` | Navegar itens em listas, menus e selects |
| `Arrow Left/Right` | Navegar tabs, segmented controls e radio groups |
| `Home` / `End` | Ir para o primeiro ou último item em listas |

### Contraste mínimo

- Texto normal: 4.5:1 para AA e 7:1 para AAA.
- Texto grande: 3:1 para AA e 4.5:1 para AAA.
- Elementos gráficos e componentes de interface: 3:1.

### Constantes de tema relevantes

- `po-theme-default-aa.constant.ts` para variante AA.
- `po-theme-default-aaa.constant.ts` para variante AAA.
- `po-theme-light-defaults.constant.ts` para modo claro.
- `po-theme-dark-defaults.constant.ts` para modo escuro.
