---
inclusion: fileMatch
fileMatchPattern: ["**/*.ts", "**/*.html", "**/*.scss", "**/*.md"]
name: po-ui-conventions
description: Use ao escrever ou revisar código TypeScript, HTML, SCSS ou documentação seguindo as convenções de codificação do PO UI.
---

# PO-UI Coding Conventions

## Inputs e API pública

- Todos os aliases de `@Input` devem usar prefixo `p-`, por exemplo `@Input('p-label')`.
- Inputs booleanos devem usar `@Input({ alias: 'p-prop', transform: convertToBoolean })` ou decorator `@InputBoolean()`.
- Arrays devem ser tipados como `Array<T>`, não como `T[]`.
- Não criar nova API pública sem justificar trade-offs.
- Ao alterar Input, Output ou símbolo público, revisar naming, tipagem, valor default e compatibilidade retroativa.

## Ordem de propriedades

```typescript
// 1. Private backing fields para getters/setters, com prefixo underscore
private _prop: string = 'default';

// 2. Propriedades públicas readonly
public readonly items: Array<Item> = [];

// 3. Variáveis privadas de classe, sem underscore
private internalState: boolean;

// 4. Decorators: ViewChild → Input → Output
@ViewChild('template') template: TemplateRef<any>;
@Input('p-label') label: string;
@Output('p-click') click = new EventEmitter();

// 5. Getters/Setters, com setter antes do getter
@Input('p-disabled') set disabled(value: boolean) {
  this._disabled = convertToBoolean(value);
}
get disabled(): boolean {
  return this._disabled;
}
```

## Ordem de métodos

Constructor → Angular lifecycle hooks → `@HostListener` → métodos públicos → métodos privados.

## Documentação JSDoc

- Documentação é gerada por Dgeni a partir de comentários JSDoc em arquivos `-base.component.ts`.
- Usar blocos `/** */`; comentários `//` são ignorados pelo Dgeni.
- Escrever em português formal e impessoal.
- Evitar formulações como “você deve” ou “você pode”.
- Usar crases para nomes de propriedades e valores.
- Usar blocos com três crases para exemplos de código.
- A tag `@optional` deve vir antes de `@description`.

Exemplo:

```typescript
/**
 * @optional
 *
 * @description
 *
 * Define o tamanho do elemento. Valores aceitos: `sm`, `md`, `lg`.
 *
 * @default `md`
 */
@Input('p-size') size: string = 'md';
```

## Tokens CSS

Documentar tokens customizáveis em uma tabela markdown acima da classe no arquivo `-base.component.ts`.

```typescript
/**
 * #### Tokens customizáveis
 *
 * | Propriedade         | Descrição              | Valor Padrão                  |
 * |---------------------|------------------------|-------------------------------|
 * | `--color`           | Cor principal          | `var(--color-action-default)` |
 * | `--color-hover`     | Cor no hover           | `var(--color-action-hover)`   |
 */
```

Agrupar tokens logicamente: Default → Hover → Focused → Pressed → Disabled → Danger/variants.

## Branches, commits e PRs

- Branch no formato `<componente>/<issue>`, por exemplo `po-button/DTHFUI-222`.
- Se não houver issue, usar `<componente>/<dev>`.
- Commits seguem o formato Angular:

```text
<type>(<scope>): <short description>
```

Tipos aceitos: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`.

O escopo deve ser o nome do componente, não o nome do projeto, por exemplo `po-button`.

Antes de abrir PR, consolidar commits com squash.
