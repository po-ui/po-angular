---
inclusion: fileMatch
fileMatchPattern: ["projects/ui/src/lib/**/*.ts"]
name: angular-signals
description: Use ao migrar @Input para input() com Angular Signals, preservando aliases e transforms no PO UI.
---

# Migração de Inputs para Angular Signals

Ao migrar `@Input` para `input()` no PO Angular, preservar aliases e transforms.

## Padrão

Antes:

```typescript
@Input({ alias: 'p-compact-label', transform: convertToBoolean }) compactLabel: boolean = false;
```

Depois:

```typescript
compactLabel = input<boolean, unknown>(false, { alias: 'p-compact-label', transform: convertToBoolean });
```

## Regras

- Usar o segundo parâmetro genérico `unknown` quando houver transform, pois o valor recebido pode ser desconhecido antes da conversão.
- Não remover a função `transform` durante a migração.
- Aplicar a mesma regra a qualquer transform, não apenas `convertToBoolean`.
- Revisar testes unitários e documentação quando a migração alterar comportamento observável.
