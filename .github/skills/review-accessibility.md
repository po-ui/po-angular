# Skill: Verificar Acessibilidade de Componente

## Descrição
Verifica a conformidade de um componente PO UI com padrões WCAG e Animalia DS.

## Checklist Geral
- [ ] Indicadores de foco com espessura mínima de 2px (WCAG 2.4.12)
- [ ] Navegação por teclado: Espaço/Enter ativam botões (WAI-ARIA 3.5)
- [ ] Tamanhos padrão verificados com `getDefaultSizeFn()` para AA/AAA
- [ ] Modos de densidade configurados via `PoDensityMode`
- [ ] Recursos de acessibilidade documentados na seção `@description`
- [ ] Conformidade com especificação do Animalia DS (https://doc.animaliads.io/)

## Checklist de Atributos ARIA (OBRIGATÓRIO)
- [ ] `role` apropriado quando o elemento HTML semântico não for suficiente (ex: `role="dialog"`, `role="listbox"`, `role="tabpanel"`)
- [ ] `aria-label` ou `aria-labelledby` para elementos sem texto visível
- [ ] `aria-describedby` quando houver texto auxiliar (mensagem de erro, helper text)
- [ ] `aria-expanded` para elementos que controlam painéis expansíveis (dropdowns, accordions)
- [ ] `aria-live="polite"` para regiões com conteúdo dinâmico (toasters, contadores, validação)
- [ ] `aria-disabled="true"` em conjunto com `[disabled]` quando relevante
- [ ] `aria-checked` para checkboxes e toggles (incluindo estado `mixed` para indeterminado)
- [ ] `aria-selected` para itens selecionáveis em listas e tabs
- [ ] `aria-hidden="true"` para elementos decorativos que não devem ser anunciados

## Checklist de Focus Trap (OBRIGATÓRIO para overlays)
- [ ] Foco capturado ao abrir (primeiro elemento focável recebe foco)
- [ ] Tab/Shift+Tab NÃO saem do overlay enquanto estiver aberto
- [ ] Foco retorna ao elemento que abriu o overlay ao fechar
- [ ] Tecla Esc fecha o overlay

## Checklist de Navegação por Teclado
- [ ] `Tab` / `Shift+Tab` — Navega entre elementos focáveis
- [ ] `Enter` / `Space` — Ativa botões, links e controles
- [ ] `Esc` — Fecha overlays (modais, dropdowns, popovers)
- [ ] `Arrow Up/Down` — Navega itens em listas, menus, selects
- [ ] `Arrow Left/Right` — Navega tabs, segmented controls, radio groups
- [ ] `Home` / `End` — Vai para primeiro/último item em listas

## Contraste Mínimo
- Texto normal: ratio mínimo de **4.5:1** (AA) ou **7:1** (AAA)
- Texto grande (≥18px bold ou ≥24px): ratio mínimo de **3:1** (AA) ou **4.5:1** (AAA)
- Elementos gráficos e componentes de interface: ratio mínimo de **3:1**

## Níveis de Acessibilidade
- **AAA** (padrão): Maior contraste, áreas clicáveis maiores
- **AA**: Proporções balanceadas

## Constantes de Tema
- `po-theme-default-aa.constant.ts` — Variante AA
- `po-theme-default-aaa.constant.ts` — Variante AAA
- `po-theme-light-defaults.constant.ts` — Modo claro
- `po-theme-dark-defaults.constant.ts` — Modo escuro
