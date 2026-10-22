# 1. Shared base do po-theme

## Status

Aceito

## Contexto

O serviço de tema do THF expõe uma constante `poThemeTotvsBase` que concentra
estilos compartilhados (`perComponent` e `onRoot`) aplicados como base, antes dos
overrides de cada nível de acessibilidade. No po-angular, os estilos equivalentes
viviam embutidos em `poThemeDefaultAAA`, misturando a "base compartilhada" com os
overrides específicos do nível AAA.

A direção de dependência entre os projetos é **THF → po-angular**: o THF consome o
po-angular, e não o contrário. Importar a base a partir do `@totvs/themes` (THF)
dentro do po-angular inverteria essa seta e criaria um ciclo de dependência.

## Decisão

Extrair o conjunto de estilos compartilhados para uma nova constante
`poThemeSharedBase`, definida **dentro do próprio po-angular**
(`projects/ui/src/lib/services/po-theme/helpers/shared/base.constant.ts`),
espelhando o papel e a estrutura (`{ perComponent, onRoot }`) do `poThemeTotvsBase`
do THF.

A base é consumida no `PoThemeService` por spread, combinando base + AAA, com o AAA
sobrescrevendo a base:

```ts
this.setPerComponentAndOnRoot(
  undefined,
  { ...poThemeSharedBase.perComponent, ...poThemeDefaultAAA.perComponent },
  poThemeSharedBase.onRoot
);
```

Os valores migrados são **exatamente** os que o po-angular já utilizava, sem
reconciliação com o THF (ex.: `po-button` mantém `--border-radius-pill`, mesmo que o
THF use `--border-radius-lg`). Qualquer reconciliação fica para uma task futura.

## Consequências

- `poThemeDefaultAAA` passa a ser `{ perComponent: {}, onRoot: {} }`, reservado apenas
  para overrides específicos do nível AAA quando existirem.
- A base compartilhada fica em um único ponto, reduzindo duplicação e divergência.
- O comportamento visual atual é preservado: nenhum valor de tema foi alterado.
- `poThemeSharedBase` é exportado no barrel do serviço de tema, ficando disponível para
  consumo/teste.

## Alternativas consideradas

- **Importar a base do `@totvs/themes`/THF**: rejeitada por inverter a direção de
  dependência (THF → po-angular) e criar ciclo.
- **Manter os valores duplicados dentro do `poThemeDefaultAAA`**: rejeitada por manter a
  duplicação e o risco de divergência entre base e níveis de acessibilidade.
