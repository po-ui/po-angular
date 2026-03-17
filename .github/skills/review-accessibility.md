# Skill: Verificar Acessibilidade de Componente

## Descrição
Verifica a conformidade de um componente PO UI com padrões WCAG e Animalia DS.

## Checklist
- [ ] Indicadores de foco com espessura mínima de 2px (WCAG 2.4.12)
- [ ] Navegação por teclado: Espaço/Enter ativam botões (WAI-ARIA 3.5)
- [ ] Tamanhos padrão verificados com `getDefaultSizeFn()` para AA/AAA
- [ ] Modos de densidade configurados via `PoDensityMode`
- [ ] Recursos de acessibilidade documentados na seção `@description`
- [ ] Conformidade com especificação do Animalia DS (https://doc.animaliads.io/)

## Níveis de Acessibilidade
- **AAA** (padrão): Maior contraste, áreas clicáveis maiores
- **AA**: Proporções balanceadas

## Constantes de Tema
- `po-theme-default-aa.constant.ts` — Variante AA
- `po-theme-default-aaa.constant.ts` — Variante AAA
- `po-theme-light-defaults.constant.ts` — Modo claro
- `po-theme-dark-defaults.constant.ts` — Modo escuro
