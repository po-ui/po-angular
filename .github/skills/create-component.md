# Skill: Criar Novo Componente PO UI

## Descrição
Cria um novo componente seguindo o padrão arquitetural do PO UI (base/child) com APIs modernas do Angular v21+.

## Passos

1. Criar pasta em `projects/ui/src/lib/components/po-<nome>/`
2. Criar `po-<nome>-base.component.ts` com:
   - Propriedades privadas com prefixo `_`
   - Inputs function-based com alias `p-` (ex: `label = input<string>('', { alias: 'p-label' })`)
   - Outputs function-based com alias `p-` (ex: `clicked = output<void>({ alias: 'p-click' })`)
   - Inputs booleanos com transform: `disabled = input<boolean, unknown>(false, { alias: 'p-disabled', transform: convertToBoolean })`
   - Estado reativo via `signal()`, `computed()` e `effect()`
   - Documentação JSDoc em português formal e impessoal
   - Tokens CSS customizáveis documentados em tabela markdown
3. Criar `po-<nome>.component.ts` com:
   - Decorator `@Component` com `standalone: true`
   - Array `imports` com dependências diretas (outros componentes standalone, diretivas)
   - `@docExtends` referenciando a classe base
   - Lógica de renderização e interação com a view
   - Exemplos (`@example`) referenciando samples
4. Criar `po-<nome>.component.html` com:
   - Control Flow Syntax: `@if`, `@for`, `@switch` (NUNCA usar `*ngIf`, `*ngFor`, `*ngSwitch`)
5. Criar `po-<nome>.component.spec.ts` com:
   - Coverage mínimo de 99%
   - Descrições em inglês
   - Uso de `expectPropertiesValues` para validação de booleanos
6. Exportar no `src/public-api.ts`
7. Criar samples em `samples/`:
   - `sample-po-<nome>-basic/` (mínimo necessário)
   - `sample-po-<nome>-labs/` (dinâmico, explorar propriedades)

## PROIBIDO em novos componentes
- **NÃO** crie arquivos `.module.ts` — todo componente DEVE ser `standalone: true`
- **NÃO** importe `CommonModule` — importe componentes/diretivas individualmente
- **NÃO** use `*ngIf`, `*ngFor`, `*ngSwitch` — use `@if`, `@for`, `@switch`
- **NÃO** use o tipo `any` — defina interfaces/types explícitos
- **NÃO** use `@Input()` / `@Output()` decorators em novos componentes — use `input()` / `output()` function-based

## Convenções
- Código fonte em inglês
- Documentação em português formal
- Testes em inglês
- Arrays tipados como `Array<T>`, não `T[]`
- Componentes de campo (input, select, textarea, datepicker) DEVEM implementar `ControlValueAccessor`
