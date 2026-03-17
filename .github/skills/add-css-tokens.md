# Skill: Adicionar Tokens CSS Customizáveis

## Descrição
Adiciona ou atualiza tokens CSS customizáveis em um componente PO UI.

## Passos
1. Abrir o arquivo `-base.component.ts` do componente
2. Adicionar/atualizar a tabela de tokens no JSDoc acima da classe
3. Agrupar tokens logicamente: Padrão → Hover → Focused → Pressed → Disabled → Danger/variantes
4. Referenciar o guia de customização de tema no cabeçalho
5. Testar com níveis de acessibilidade AA e AAA

## Convenções de Nomenclatura
- Baseado em estados: `--{property}-{state}` (ex: `--color-hover`, `--background-pressed`)
- Baseado em variantes: `--{property}-{variant}` (ex: `--color-button-danger`)
- Referenciar tokens globais usando `var(--global-token-name)`

## Categorias Comuns
1. Tipografia: `--font-family`, `--font-size`, `--font-weight`, `--line-height`
2. Cores: `--color-*`, `--text-color-*`, `--background-*`, `--border-color-*`
3. Espaçamento: `--padding`, `--margin`
4. Forma: `--border-radius`, `--border-width`
5. Efeitos: `--shadow`, `--outline-color-focused`

## Fontes de Tokens Globais
- Tema base: `@po-ui/style/css/po-theme-default.min.css`
- Constantes: `projects/ui/src/lib/services/po-theme/helpers/`
