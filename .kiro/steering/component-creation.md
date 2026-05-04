---
inclusion: auto
name: component-creation
classification: skill
source: .github/skills/create-component.md + .kiro/steering/structure.md + .kiro/steering/po-ui-conventions.md
description: Use ao criar novos componentes PO UI ou ao refatorar componentes para APIs modernas do Angular.
---

# Criação de Componentes PO UI

## Escopo

Use este fluxo para criar novos componentes em `projects/ui/src/lib/components/po-<nome>/` ou para refatorações explicitamente orientadas a modernização Angular.

## Arquitetura esperada

- Criar `po-<nome>-base.component.ts` para API pública, validações, documentação JSDoc e tokens CSS.
- Criar `po-<nome>.component.ts` para renderização, interação com a view, lifecycle hooks e extensão da classe base.
- Criar `po-<nome>.component.html` usando Control Flow Syntax.
- Criar `po-<nome>.component.spec.ts` com cobertura mínima de 99%.
- Exportar o componente no `src/public-api.ts`.
- Criar samples mínimos e labs quando o componente for público.

## Padrões para novos componentes

- Usar `standalone: true`.
- Não criar arquivos `.module.ts` para componentes novos.
- Não importar `CommonModule`; importar diretivas e componentes standalone explicitamente.
- Usar `@if`, `@for` e `@switch`; não usar `*ngIf`, `*ngFor` ou `*ngSwitch` em componentes novos.
- Usar `input()` e `output()` function-based em vez de `@Input()` e `@Output()` em componentes novos.
- Inputs e Outputs públicos devem usar alias com prefixo `p-`.
- Inputs booleanos devem usar `convertToBoolean` quando aplicável.
- Usar `signal()`, `computed()` e `effect()` para estado reativo quando houver necessidade real.
- Não usar `any`; declarar interfaces e tipos explícitos.
- Tipar arrays como `Array<T>`, não como `T[]`.
- Componentes de campo devem implementar `ControlValueAccessor`.

## Exemplo de Input com transform

```typescript
disabled = input<boolean, unknown>(false, { alias: 'p-disabled', transform: convertToBoolean });
```

## Documentação

- Escrever JSDoc em português formal e impessoal.
- Usar `@docExtends` no componente concreto quando a documentação estiver na classe base.
- Referenciar samples por `@example` quando aplicável.
- Documentar tokens CSS customizáveis no `-base.component.ts`.

## Testes

- Descrições de `describe()` e `it()` em inglês.
- Cobertura mínima de 99% em statements, branches, functions e lines.
- Usar `expectPropertiesValues` para validação de propriedades booleanas quando aplicável.

## Observação sobre código legado

Componentes existentes podem usar `@Input()`, `@Output()`, NgModules e sintaxe estrutural antiga. As regras modernas acima se aplicam a novos componentes e refatorações explicitamente solicitadas. Ao modificar código legado, preservar o padrão local salvo orientação contrária.
