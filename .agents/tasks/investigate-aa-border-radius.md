# Investigação: border-radius não aplica no nível AA (po-angular theme service)

> Investigação **read-only**. Nenhum arquivo foi alterado. Evidências geradas por simulação
> da lógica real do serviço e por inspeção do CSS compilado em `dist/portal/browser`.

## Resposta resumida (TL;DR)

A **Opção A não resolve o sintoma**, porque o problema real **não está** na ausência do
`poThemeSharedBase` no bloco AA. A causa-raiz é de **fluxo de execução**, não de seletor:

No caminho do appearance-popover para **AA (Compacto)**, o `#baseStyle` termina **sem nenhuma
regra de `border-radius`**, porque:

1. O popover, para AA, chama `setDensityMode(PoDensityMode.Small)` e depois `setTheme(..., AA)`.
2. `setTheme` começa com `resetBaseTheme()` (tema é built-in `poThemeDefault`), que **zera**
   `#baseStyle.textContent`.
3. `setTheme` termina chamando `this.setDensityMode(localStorage['po-density-mode'])`, que no
   caminho AA vale `'small'`.
4. No ramo `mode === Small`, `setDensityMode` **NÃO chama** `setDefaultBaseStyle()`. Ele apenas
   injeta um bloco `:root { ... }` usando `poThemeDefaultAA.perComponent`, que é **`{}` (vazio)**
   — ou seja, zero regras de `border-radius`.

Resultado: as regras `perComponent` de `border-radius` (que só existem no runtime, dentro de
`setDefaultBaseStyle`) **nunca são reinjetadas** no fluxo AA. No fluxo **AAA (Espaçoso)**, o popover
usa `setDensityMode(Medium)`; o ramo `else` (Medium) **chama** `setDefaultBaseStyleForCurrentTheme()`,
que repopula todos os 6 blocos com as regras de `border-radius`. Por isso AAA arredonda e AA não.

A Opção A (espalhar `poThemeSharedBase` também no bloco `:root[class$="-AA"]`) é correta e desejável,
mas **inócua para este sintoma**, pois o método que a contém (`setDefaultBaseStyle`) não é executado
no caminho AA do popover.

---

## Evidências

### E1 — A edição da Opção A está presente e não commitada

`git -C .../po-angular diff` em `projects/ui/src/lib/services/po-theme/po-theme.service.ts` mostra
que as 6 chamadas de `setPerComponentAndOnRoot` em `setDefaultBaseStyle()` agora espalham
`poThemeSharedBase.perComponent` e `poThemeSharedBase.onRoot` como primeiro termo (antes, o
`perComponent` do base já estava na chamada AAA; o `onRoot` do base só estava em AAA). Confere com o
contexto do brief.

### E2 — As regras de border-radius NÃO existem no CSS estático; são 100% runtime

No bundle compilado `dist/portal/browser/styles-GBWYPV7P.css`:

- `po-button` tem como **default estático**: `po-button { ... --border-radius: var(--border-radius-md); ... }`
  e `po-button { ... border-radius: var(--border-radius, var(--border-radius-md)); ... }`.
- **Não existe** nenhuma regra estática `:root ... po-button { --border-radius: var(--border-radius-pill) }`,
  nem qualquer seletor com `-AA` redefinindo border-radius. Busca por `:root[...]po-button{...}` e por
  `class$="-AA"`/`class*="-AA"` com border-radius não retornou nada.
- As únicas aparições estáticas de `var(--border-radius-pill)` são em `po-disclaimer`, `po-tag`,
  `.po-progress-bar`, `.po-upload-thumbnail-icon` — **não** nos componentes citados pelo usuário
  (button, input, container, etc.).

Conclusão: o arredondamento "pill/xl" de button/input/container **depende inteiramente** do bloco
injetado em tempo de execução em `<style id="baseStyle">` por `setDefaultBaseStyle()`. Se esse bloco
não for injetado, os componentes caem no default estático (`--border-radius-md`) ou ficam sem o
override esperado.

### E3 — Simulação do fluxo do popover (controle de execução) — `#baseStyle` final

Reimplementando o control-flow real (`applyTheme` do popover → `setDensityMode` → `setTheme` →
`setDensityMode` final) e registrando o conteúdo de `#baseStyle`:

**AA (Compacto):**
```
#baseStyle = :root { [perComponent VAZIO] --outline-width...; --default-spacing-*...; }
             // nenhum bloco com border-radius
```

**AAA (Espaçoso):**
```
#baseStyle =
  :root { [regras border-radius de po-button/.po-input/containers/...] }
  :root[class$="-AA"] { [regras border-radius ...] --outline-width... }
  :root[class*="-light"]     { [regras border-radius ...] }
  :root[class*="-light-AA"]  { [regras border-radius ...] }
  :root[class*="-dark"]      { [regras border-radius ...] }
  :root[class*="-dark-AA"]   { [regras border-radius ...] }
```

Ou seja, o AA perde todas as regras de `border-radius`; o AAA as tem. Isso casa exatamente com o
sintoma relatado.

Trechos de código que comprovam o fluxo (`po-theme.service.ts`):

- `setTheme()` (início): `if (this.builtInThemes.includes(themeConfig)) { this.resetBaseTheme(); }`
  — `poThemeDefault` é built-in, então `#baseStyle` é zerado.
- `setTheme()` (fim): `const densityMode = localStorage.getItem('po-density-mode'); this.setDensityMode(densityMode);`
- `setDensityMode()`:
  - ramo `mode === PoDensityMode.Small`: injeta `setPerComponentAndOnRoot(undefined, poThemeDefaultAA.perComponent, onRootTokens)` — **sem** `setDefaultBaseStyle()`.
  - ramo `else` (Medium): limpa tokens de densidade e chama `this.setDefaultBaseStyleForCurrentTheme()` — **com** repopulação completa.
- `poThemeDefaultAA.perComponent === {}` (arquivo `helpers/accessibilities/po-theme-default-aa.constant.ts`).

### E4 — Pergunta 1 (causa-raiz "clássica" por seletor): parcialmente aplicável, mas secundária

O brief levanta a hipótese de que o bloco AAA (`:root`) não cobriria os componentes no nível AA. Na
geração atual, as regras `perComponent` são emitidas como **CSS aninhado**:
`:root { po-button { --border-radius: ...; } }` → equivale a `:root po-button { ... }`
(descendente, especificidade `(0,1,1)`), que vence o default estático `po-button { ... }` `(0,0,1)`
e casa o `<html>` **independentemente** da classe `-AA`/`-AAA`. Portanto, **se o bloco `:root` base
estivesse presente**, ele arredondaria em AA também — não é herança do `:root`, é o seletor
descendente `:root po-button`. Logo, a explicação por especificidade/seletor **não** é a causa: o
bloco `:root` base simplesmente **não está presente** no `#baseStyle` no caminho AA (ver E3). Esse é
o ponto que derruba a hipótese de seletor como causa-raiz.

### E5 — Pergunta 2 (Opção A resolve?): NÃO

O CSS gerado para o bloco AA, com a Opção A, de fato passa a conter as regras
(`:root[class$="-AA"] { po-button { --border-radius: var(--border-radius-pill); } ... }` —
confirmado por simulação da geração). **Porém**, esse bloco só é escrito por `setDefaultBaseStyle()`,
que **não roda** no caminho AA do popover (E3). Então a Opção A não muda o `#baseStyle` resultante em
AA. **Não resolve.**

### E6 — Pergunta 3 (dedup e seletor `[class$="-AA"]`)

- **Formato da classe aplicada** (`changeThemeType`): `${name}-${PoThemeTypeEnum[type]}-${PoThemeA11yEnum[a11y]}`
  → para o tema padrão: `default-light-AA` ou `default-dark-AA`. Ambos **terminam em `-AA`**, então
  `:root[class$="-AA"]` casa para todas as combinações AA (light-AA e dark-AA). Não há caso AA que
  não termine em `-AA` neste serviço (a11y é sempre o último segmento). **Seletor OK.**
  - Observação: `PoThemeA11yEnum` é string-enum (`AA='AA'`), então `PoThemeA11yEnum['AA'] === 'AA'`
    e o seletor sai `-AA` corretamente; `PoThemeTypeEnum` é numérico (`light=0`/`dark=1`) com reverse
    mapping, então `PoThemeTypeEnum[0]='light'`. Confirmado.
- **Dedup** (`!styleElement.textContent.includes(styleCss.trim())`): não é a causa do sintoma AA
  (o bloco base nem chega a ser gerado em AA). É, porém, **frágil** como mecanismo geral: compara
  strings inteiras; o mesmo seletor com `onRoot` diferente gera string diferente e é reanexado,
  podendo acumular blocos duplicados/parciais ao alternar temas várias vezes. Não bloqueia a correção,
  mas vale registrar.
- **Ordem/`#theme`**: `applyThemeStyles` insere `#theme` logo após `#baseStyle`. O `#theme` usa
  seletor `:root.default-light-AA` (classe no próprio `:root`, especificidade alta) e carrega
  `perComponent` do tema ativo — que para o tema padrão é `{}`. Não sobrepõe border-radius. Não é a causa.

### E7 — Pergunta 4 (como reproduzir e necessidade de rebuild)

**Reprodução no portal (appearance-popover):**
1. Abrir o popover de aparência.
2. Em "Densidade", clicar em **Compacto (AA)** → dispara `onA11yChange('AA')` → `applyTheme()` →
   `setA11yDefaultSizeSmall(true)` + `setDensityMode(Small)` + `setTheme(tema, modo, AA)`.
3. Observar que button/input/container ficam sem o arredondamento pill/xl.
4. Clicar em **Espaçoso (AAA)** → arredondamento volta.

**Rebuild/consumo do código:** O componente do popover importa o serviço **direto do source**:
`appearance-popover.component.ts` →
`import { poThemeDefault, poThemeDefaultDeprecated, PoThemeService } from '../../../../../ui/src/lib';`
(caminho relativo ao source de `projects/ui`), não de `@po-ui/ng-components` (que, pelo
`tsconfig.json` raiz, aponta para `./dist/ng-components`). Portanto, para a **lógica** do serviço
(incluindo a edição não commitada), **não é necessário rebuildar a lib** — basta o dev server do
portal recompilar o source (`npm start`). O que vem do `dist` é o **CSS estático** dos componentes
(os defaults como `--border-radius-md`), que não precisa mudar para esta correção.

### E8 — Pergunta 5 (recomendação)

**A Opção A, sozinha, é insuficiente.** Há um defeito adicional que é a verdadeira causa-raiz:
`setDensityMode(Small)` não repopula o base (`setDefaultBaseStyle`). Correções possíveis (sugestões —
nada foi implementado):

- **Opção 1 (mais direta):** no ramo `mode === PoDensityMode.Small` de `setDensityMode`, chamar
  `this.setDefaultBaseStyleForCurrentTheme()` antes (ou depois) de injetar os tokens de densidade,
  garantindo que as regras base de `border-radius` estejam sempre presentes nos dois modos.
- **Opção 2:** mover a responsabilidade de injetar o base para fora de `setDensityMode` — fazer
  `setTheme` sempre chamar `setDefaultBaseStyleForCurrentTheme()` após o `resetBaseTheme()`, e deixar
  `setDensityMode` apenas adicionar/remover os tokens de densidade.
- Em ambos os casos, **manter a Opção A** (base também no bloco AA) é coerente e recomendável, pois
  dá cobertura explícita por nível, mas por si só não corrige o fluxo.

**Pendências para o usuário ver a correção:**
- Aplicar a correção de fluxo acima (além da Opção A já editada).
- **Commitar** as mudanças na branch.
- Reiniciar/recompilar o **portal** (`npm start`) — não precisa rebuildar `dist/ng-components` para a
  lógica, pois o popover consome o source.
- Validar manualmente alternando AA/AAA no popover e inspecionando `<style id="baseStyle">` no DOM
  para confirmar que o bloco com `border-radius` existe em AA.

---

## Conclusões

1. **Causa-raiz:** no caminho AA do popover, `#baseStyle` fica sem regras de `border-radius` porque
   `setDensityMode(Small)` (chamado por `setTheme` ao final, lendo `po-density-mode='small'`) não
   executa `setDefaultBaseStyle()`; já o caminho AAA passa por `setDensityMode(Medium)`, cujo ramo
   `else` chama `setDefaultBaseStyleForCurrentTheme()` e repopula tudo.
2. **Opção A não resolve** este sintoma; ela corrige a cobertura do bloco AA *quando*
   `setDefaultBaseStyle` roda, mas esse método não roda no fluxo AA. É melhoria correta porém
   ortogonal.
3. **Seletor `[class$="-AA"]` está correto** para todas as combinações AA (classes terminam em `-AA`).
4. **Não é necessário rebuildar a lib** para a lógica (popover consome o source de `projects/ui`);
   basta commitar + recompilar o portal. O `dist` só fornece o CSS estático dos componentes.
5. **Correção recomendada:** garantir a injeção do base também no modo `small`
   (chamar `setDefaultBaseStyleForCurrentTheme()` no ramo `Small` de `setDensityMode`, ou centralizar
   a injeção do base em `setTheme`), mantendo a Opção A.

## Arquivos/símbolos citados
- `projects/ui/src/lib/services/po-theme/po-theme.service.ts`: `setTheme`, `resetBaseTheme`,
  `setDensityMode`, `setDefaultBaseStyle`, `setDefaultBaseStyleForCurrentTheme`,
  `setPerComponentAndOnRoot`, `generatePerComponentStyles`, `changeThemeType`.
- `helpers/shared/base.constant.ts`: `poThemeSharedBase` (border-radius em `perComponent`, `onRoot:{}`).
- `helpers/accessibilities/po-theme-default-aa.constant.ts`: `poThemeDefaultAA` (`perComponent:{}`,
  `onRoot:{--outline-width...}`).
- `helpers/accessibilities/po-theme-default-aaa.constant.ts`: `poThemeDefaultAAA` (`{}`,`{}`).
- `helpers/types/po-theme-light-defaults-AA.constant.ts` / `...dark-defaults-AA...`:
  `perComponent` reaproveita o base light/dark (`{}`), sem override de border-radius.
- `helpers/accessibilities/po-theme-density.constant.ts`: `poThemeDensity.small`.
- `projects/portal/src/app/shared/appearance-popover/appearance-popover.component.ts`: `applyTheme`,
  import do serviço via source relativo.
- `tsconfig.json` (raiz): `@po-ui/ng-components` → `./dist/ng-components`.
- `dist/portal/browser/styles-GBWYPV7P.css`: defaults estáticos de `po-button`; ausência de regras
  `:root po-button` pill e de resets AA.
