# Skill: Documentar Componente

## Descrição
Documenta um componente PO UI seguindo os padrões de JSDoc/Dgeni do projeto.

## Regras
- Usar `/** */` para documentação (linhas `//` são ignoradas pelo Dgeni)
- Escrever em português formal e impessoal
- Evitar "você deve/você pode"
- Usar backticks para valores/nomes de propriedades
- Usar triple backticks para blocos de código
- Arrays tipados como `Array<T>`

## Tags (ordem de precedência)
1. `@docExtends`, `@usedBy`, `@docsPrivate`
2. `@optional` (antes de `@description`)
3. `@deprecated` (antes de `@optional`)
4. `@description`
5. `@default` (com crase simples: `` @default `md` ``)
6. `@example`

## Tokens CSS
Documentar no `-base.component.ts` usando tabela markdown:
```typescript
/**
 * #### Tokens customizáveis
 *
 * | Propriedade | Descrição | Valor Padrão |
 * |-------------|-----------|--------------|
 * | `--color`   | Cor principal | `var(--color-action-default)` |
 */
```
