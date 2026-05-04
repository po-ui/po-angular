---
inclusion: fileMatch
fileMatchPattern: ["projects/ui/src/lib/**/*.ts", "projects/**/*.md"]
name: component-documentation
classification: skill
source: .github/skills/document-component.md + .kiro/steering/po-ui-conventions.md
description: Use ao escrever ou revisar documentação JSDoc/Dgeni de componentes PO UI.
---

# Documentação de Componentes PO UI

## Regras gerais

- Usar blocos `/** */`; comentários `//` são ignorados pelo Dgeni.
- Escrever em português formal e impessoal.
- Evitar formulações como “você deve” ou “você pode”.
- Usar crases para nomes de propriedades, valores e símbolos de código.
- Usar blocos com três crases para exemplos de código.
- Tipar arrays como `Array<T>`.

## Ordem recomendada das tags

1. `@docExtends`, `@usedBy`, `@docsPrivate`.
2. `@optional`.
3. `@deprecated`.
4. `@description`.
5. `@default`, com valor entre crases.
6. `@example`.

## Exemplo de propriedade

```typescript
/**
 * @optional
 *
 * @description
 *
 * Define o tamanho do elemento. Valores aceitos: `sm`, `md` e `lg`.
 *
 * @default `md`
 */
size = input<string>('md', { alias: 'p-size' });
```

## Tokens CSS

Documentar tokens customizáveis no arquivo `-base.component.ts`, acima da classe, em tabela markdown.

```typescript
/**
 * #### Tokens customizáveis
 *
 * | Propriedade | Descrição | Valor Padrão |
 * |-------------|-----------|--------------|
 * | `--color` | Cor principal | `var(--color-action-default)` |
 */
```
