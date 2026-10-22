# Reidratação do tema no boot do portal pelo AppComponent

O portal precisa reaplicar, ao iniciar, a preferência de tema salva no `localStorage` (chave `totvs-theme`), e cair no `poThemeDefault` (light/AAA) quando não há preferência. Decidimos fazer essa reidratação no **construtor do `AppComponent`** do portal, espelhando o papel que o `AppContainerComponent` tem no `smart-ui-service-thf-web`, em vez de criar um serviço `root` equivalente ao `ThfThemeService`.

Motivo: o po-angular não possui (nem deve ganhar, no escopo desta POC) uma camada wrapper sobre o `PoThemeService`. O `PoThemeService.getThemeActive()` já re-resolve a constante embutida pelo `name` (via `resolveBuiltInTheme`), cobrindo o equivalente ao `getThemeConfig` do THF — então o boot só precisa ler o tema ativo, extrair `type`/`a11y` e chamar `setTheme`, sem reintroduzir aquela lógica no portal.

## Consequências

- A fonte única da verdade do tema passa a ser `getThemeActive()`/`setTheme()` (chave `totvs-theme`). O `AppComponent` deixa de usar as chaves legadas `po-ui-theme`/`po-ui-a11y` e o `poThemeConstant` montado à mão.
- O popover de Aparência é a única via de troca de tema no portal.
- Samples que disparam `po-sample-change-theme`/`po-sample-change-a11y` permanecem independentes (têm seus próprios listeners), não dependem de reação do `AppComponent`.
