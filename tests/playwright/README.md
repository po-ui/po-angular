# Testes de regressão visual (Playwright)

Tira screenshots de componentes do PO UI **em grade** (muitos estados numa imagem só) e compara com as
imagens base em `__snapshots__/`. Componentes cobertos: `po-button`, `po-button-group`, `po-checkbox`.
Por que grade, e não um teste por combinação: [docs/decisions.md](docs/decisions.md).

## Como funciona

- **Harness** (`harness/`, projeto Angular `visual-harness` em `angular.json`): importa os módulos direto do código-fonte
  e desenha uma grade de células na página `/?theme=...&rows=[[célula,...],...]` (JSON). Cada célula tem uma
  **legenda** (2 linhas, parte do snapshot) dizendo tema, tamanho, valor, conteúdo e estado. Sem dependência nova
  (o repo não tem Storybook). O contrato das células está no comentário do topo de `harness/main.ts`.
- **Temas**: `light`, `dark`, `deprecated-light`, `deprecated-dark` (`THEMES` em `specs/helpers.ts`). O harness
  carrega o CSS base do `@po-ui/style` do tema e aplica o tema via `PoThemeService`
  (`setDefaultTheme` ou `setTheme(poThemeDefaultDeprecated, ...)`). O tema depreciado sai na v24: basta tirar
  `deprecated-*` de `THEMES` e apagar os snapshots `deprecated-*`.
- **Estados forçados**: hover / focus / active são forçados via CDP (`CSS.forcePseudoState`, `forcePseudoStates` em
  `helpers.ts`), na célula inteira de uma vez. Cada célula diz **onde** forçar com `forceSelector` (padrão `button`).
- **Sem cortes**: colunas do grid são `max-content` (nunca cortam). `expectGridScreenshot` roda
  `assertGridNotClipped` antes do snapshot e **falha** se algo passar da célula ou do `#stage`.
- **Estabilidade**: viewport fixo, `reducedMotion`, animações congeladas em t=0 (`freezeAnimations`, inclui o `glow`),
  fontes locais do `@po-ui/style`, `threshold: 0` e `maxDiffPixels: 0`. Só Chromium.

| Spec | Testes = snapshots | Cada snapshot | Combinações cobertas |
|---|---:|---|---:|
| `po-button-grid.spec.ts` | 24 | tema × variação; 72 células = 3 tamanhos × 4 conteúdos × 6 estados | 1728 |
| `po-button-group-grid.spec.ts` | 24 | tema × tamanho × `p-toggle`; 4 conteúdos × 6 a 9 estados | 768 |
| `po-checkbox-grid.spec.ts` | 12 | tema × tamanho; 90 células = 3 valores × 6 conteúdos × 5 estados | 1080 |

## Rodar localmente

```bash
npm install --legacy-peer-deps
npx playwright install chromium
npm run visual:test      # sobe o harness sozinho (porta 4300)
npm run visual:report    # abre o relatório HTML

# mais rápido (sem dev-server): build uma vez e serve estático
npx ng build visual-harness && PW_STATIC=1 npm run visual:test
```

As imagens base são geradas em **Linux**. No macOS/Windows a renderização de fonte difere; use Docker:

```bash
docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.65.0-noble \
  bash -c "npm install --ignore-scripts --legacy-peer-deps && npm run visual:test"
```

## Atualizar snapshots

Quando a mudança visual for intencional:

```bash
npm run visual:update
git add tests/playwright/__snapshots__   # abra e revise as imagens antes de commitar
```

## Como escrever o grid de um componente novo

Passo a passo curto. Use `po-checkbox-grid.spec.ts` e `po-checkbox.matrix.ts` como modelo.

1. **Harness**: em `harness/main.ts` importe o módulo do componente, adicione um `@case` no `@switch` e documente os
   campos da célula no comentário do topo. Se o componente usa `ngModel`, lembre que o NgModel zera `p-disabled`:
   passe também `[disabled]`.
2. **Matriz** (`specs/po-<componente>.matrix.ts`): tamanhos, valores, conteúdos e estados reais do componente
   (leia o `*-base.component.ts` e o html). Inclua: vazio / sem label, label longa (largura fixa + quebra),
   ajuda/erro, obrigatório, desabilitado, e os valores especiais (ex.: indeterminado). Anote o que **não** existe
   no componente, para não parecer esquecimento.
3. **Legenda por célula** (`caption`, 2 linhas): `tema · tamanho · valor` / `conteúdo · estado`. Quem abrir o PNG
   precisa saber o que cada item é.
4. **Estados forçados**: `force: 'hover' | 'focus' | 'active'` e `forceSelector` com o(s) elemento(s) que o CSS do
   `@po-ui/style` usa para aquele estado (procure `:hover`, `:focus`, `:active` do componente em
   `node_modules/@po-ui/style/css/po-theme-default.min.css`). Aceita lista separada por vírgula.
5. **Temas**: um `test` por tema (`THEMES`: padrão e depreciado, claro e escuro) × tamanho (ou o eixo que separar
   bem os snapshots; evite imagens maiores que ~2000 × 2000 px).
6. **Sem cortes**: use `open(...)` + `expectGridScreenshot(...)`; não ponha `width` fixa a menos que queira testar
   quebra de linha. O helper falha sozinho se algo for cortado.
7. **Gere e olhe os PNGs**: `npx playwright test <spec> --update-snapshots`; abra cada tema e confira legendas, cortes e
   estados (um `disabled` igual ao `default` quase sempre é bug de harness).
8. **Valide com mutações** (abaixo) e rode a suíte 2 vezes seguidas: 0 flaky.

## Validar o grid com mutações (o grid detecta regressão?)

Edite o CSS **servido** (fica em `dist/visual-harness/browser/`, que não é versionado), rode, e reverta:

```bash
npx ng build visual-harness
CSS=dist/visual-harness/browser/po-theme-default.css; cp $CSS $CSS.orig
printf '\n.po-checkbox:hover{border-color:red !important}\n' >> $CSS               # mutação
PW_STATIC=1 npx playwright test                                                   # deve FALHAR nos grids afetados
cp $CSS.orig $CSS && PW_STATIC=1 npx playwright test                      # volta a passar
```

Faça pelo menos 2 mutações por componente (uma de cor/estado, uma de tamanho/espaçamento). Resultados já medidos:

| Componente | Mutação | Grids que falharam |
|---|---|---|
| po-button / po-button-group | `.po-button:hover:not(:disabled){opacity:.95}` | 24 de 48 (button e group, claro e escuro) |
| po-button-group | `.po-button-group-disabled button{padding-left:23px !important}` | 12 de 48 (só group, claro e escuro) |
| po-checkbox | `.po-checkbox:hover{border-color:red !important}` | 6 de 12 (claro e escuro; 5,2 a 7,6 mil pixels) |
| po-checkbox | `.po-checkbox-outline[data-inactive-component=true]{padding-left:6px !important}` | 6 de 12 (claro e escuro; 31 a 43 mil pixels) |

Os temas `deprecated-*` não falham porque a mutação só altera o CSS do tema padrão. Tentar `width/height` em
`.po-checkbox` **não** mudou nada (o tamanho da caixa vem de outra propriedade): uma mutação que não falha também
ensina; confira se ela realmente muda o pixel antes de concluir que o grid não vê.

## Recuperar os testes completos (1 teste por combinação)

Foram removidos de propósito (ver `docs/decisions.md`). Estão no git no commit `3729922`:

```bash
git checkout 3729922 -- tests/playwright/specs tests/playwright/harness tests/playwright/__snapshots__
```

(traz specs, harness e PNGs daquele commit; o harness de lá é o que funciona com eles.)

## CI (`.github/workflows/visual-regression.yml`)

A cada PR: instala deps → builda e instala o po-style → instala o Chromium → `ng build visual-harness` →
roda o Playwright (servidor estático, 1 retry: teste que só passa na 2ª vez aparece como **flaky** no relatório) →
sobe `playwright-report/` e `test-results/` (com os diffs) como artefato.

## po-style

`scripts/install-po-style.sh` já está ligado no CI: clona o `po-ui/po-style` na **mesma branch do PR**
(se existir; senão na branch base), roda `npm run build`, `npm pack` em `dist/style` e instala o `.tgz`
no lugar do `@po-ui/style`. Assim, mudança só no style não vira falso positivo.
Testado localmente (build ~11 s, pack e instalação OK); **não** rodou ainda no GitHub Actions.

TODO / evolução:

- PR vindo de fork: só a branch base do style é usada.
- Mudança intencional no style: abrir PR no po-style e no po-angular com o mesmo nome de branch
  e atualizar os snapshots no PR do po-angular.
- Disparar o mesmo teste a partir do próprio repo po-style (`repository_dispatch`).
- Cache do build do po-style e do download do Chromium.
- Rodar só os componentes afetados pela PR (mapear `projects/ui/src/lib/components/<x>/` → spec; style/tema → tudo).

## Medidas (host de 12 núcleos, servidor estático; o CI do GitHub não foi medido)

| Medida | Valor |
|---|---|
| Testes = snapshots (button + group + checkbox) | 60 |
| PNGs no repo | 14,69 MB (button 7,64 + group 3,59 + checkbox 3,45) |
| Suíte inteira, 4 workers | 53 s, 56 s, 53 s (3 execuções, 0 flaky) |
| Suíte inteira, 2 workers (o do CI) | 67 s, 64 s, 69 s (3 execuções, 0 flaky) |
| Soma das durações por spec, 4 workers | button 110 s (24 testes), group 36 s (24), checkbox 57 s (12) |
| Startup do harness (não entra acima) | build 3 a 5 s; servidor estático 0,1 s |

Projeção para ~90 componentes: ≈ 0,9 s de parede por teste de grid com 4 workers (≈ 1,1 s com 2) e ~12 testes
por componente dão perto de 20 min; o repo cresceria ~5 MB por componente (≈ 450 MB). Passando de ~300 MB,
considerar repositório separado de baselines.
