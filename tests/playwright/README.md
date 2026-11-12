# Testes de regressão visual (Playwright) — POC `po-button` e `po-button-group`

Tira screenshots de componentes isolados e compara com as imagens base (`__snapshots__/`).

## Como funciona

- **Harness**: projeto Angular mínimo `visual-harness` (`angular.json`, código em `harness/`).
  Importa os módulos direto do código-fonte e renderiza um componente configurado por query string.
  Escolhido por não exigir nenhuma dependência nova (o repo não tem Storybook).
  - `?c=button` (padrão) e `?c=button-group`: um componente só (usados pelas matrizes completas, hoje desligadas).
  - `?c=grid&rows=[[célula]]`: várias células numa página só (**é o modo ativo**). Célula de `po-button`:
    `{kind,danger,size,icon,label,aria,disabled,loading}`; de `po-button-group`:
    `{component:'button-group',size,toggle,items}`. Comuns: `caption`, `width`, `force`, `forceItem`.
- **Tema**: `?theme=light|dark|deprecated-light|deprecated-dark`. O harness carrega o CSS base do
  `@po-ui/style` correspondente (`po-theme-default` ou `po-theme-default-deprecated`) e aplica o tema via
  `PoThemeService` (`setDefaultTheme` ou `setTheme(poThemeDefaultDeprecated, ...)`). O nome do snapshot começa
  com o tema (`deprecated-dark--primary--medium--label--default.png`). O tema depreciado sai na v24: basta
  apagar o `deprecated-*` do `THEMES` (`specs/helpers.ts`) e o laço no fim de `po-button.spec.ts`, e os snapshots.
- **Grid e legendas**: cada célula do grid mostra uma legenda de 2 linhas, que **faz parte do snapshot**
  (para saber qual estado é cada item ao abrir o PNG): `tema · variação` / `tamanho · conteúdo · estado` no
  `po-button`, e `tema · tamanho · toggle` / `conteúdo · estado` no `po-button-group`. Mudar o texto de uma legenda
  muda o snapshot. hover/focus/active são forçados via CDP (`CSS.forcePseudoState`, `forcePseudoStates` em
  `helpers.ts`); no grupo, `data-force-item` escolhe o item (2º nos estados comuns, 1º nos `selected-*`).
- **Specs** (`specs/`): `helpers.ts` é compartilhado (abrir página, estados de ponteiro, congelar animação,
  forçar pseudo-estados, `gridUrl`). A matriz de cada componente fica em `*.matrix.ts` e é usada pelos dois specs
  do componente (completo e grid), então nunca divergem.

| Spec | Roda por padrão? | Testes = snapshots | Matriz |
|---|---|---:|---|
| `po-button-grid.spec.ts` | **sim** | 24 | 4 temas × 6 variações; 72 células por snapshot (3 tamanhos × 4 conteúdos × 6 estados) |
| `po-button-group-grid.spec.ts` | **sim** | 24 | 4 temas × 2 tamanhos × 3 `p-toggle`; 4 conteúdos × 6 a 9 estados por snapshot |
| `po-button.spec.ts` | não (`PW_FULL=1`) | 1368 | 1 teste por combinação |
| `po-button-group.spec.ts` | não (`PW_FULL=1`) | 768 | 1 teste por combinação |

## Reativar as matrizes completas (1 teste por combinação)

O código continua nos specs; só não é registrado sem a variável. Os 2136 snapshots antigos continuam em
`__snapshots__/po-button.spec.ts/` e `__snapshots__/po-button-group.spec.ts/`. O Playwright não reclama de snapshot
sem teste (verificado), então o CI não quebra com eles parados.

```bash
PW_FULL=1 npx playwright test                    # tudo (grids + completas, ~5 a 11 min)
PW_FULL=1 npx playwright test po-button.spec     # só a completa do po-button
```

Útil para investigar um diff do grid (rodar a combinação isolada, com hover/Tab reais) e como rede de segurança
ocasional (ex.: noturno). Se os grids forem alterados (legenda, estados), as completas não mudam.

- **Estabilidade**: viewport fixo, `reducedMotion`, animações desligadas, fontes locais do `@po-ui/style`
  (esperamos `document.fonts.ready`), `threshold: 0` e `maxDiffPixels: 0`. Só Chromium.
  Animações infinitas (pontos do `glow`) são congeladas em t=0 e as finitas vão ao fim (`freezeAnimations`).

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
git add tests/playwright/__snapshots__   # revise as imagens antes de commitar
```

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

## Aprendizados

1. **`threshold` padrão (0.2) é frouxo.** Com ele, `.po-button:hover{opacity:.9}` passava. Com `threshold: 0`
   até `opacity:.97` reprova. Efeito colateral: apareceu a variação do `glow` (4 a 40 pixels por execução),
   porque a animação infinita dos pontos não parava. Corrigido com `freezeAnimations` (snapshots do glow regerados).
2. Resíduo medido depois da correção: ~1 falha em ~2000 execuções do glow (timeout "two consecutive stable
   screenshots"). Por isso o CI usa 1 retry (flaky continua visível no relatório).
3. **Grid com pseudo-estados forçados via CDP** (`CSS.forcePseudoState`) cobre hover/focus/active sem mouse real.
   Não substitui 1 ou 2 testes de interação real por componente (Tab de verdade, clique).
4. Servidor estático (`PW_STATIC=1`) é mais leve que o `ng serve`.
5. **Grids de `glow` são pesados** (72 botões animados): com 4 workers, 4 grids de glow ao mesmo tempo estouravam
   o timeout de 30 s do teste (4 de 48 testes falharam em 1 de 2 execuções). Corrigido com `timeout: 90_000`
   no teste e `timeout: 30_000` no `toHaveScreenshot`; depois disso 4 execuções seguidas sem falha.

## Validação do grid: mutações (o grid detecta regressão?)

Feitas editando o CSS servido (`dist/visual-harness/browser/po-theme-default.css`, que não é versionado) e
revertidas com a cópia original (mesmo md5); nada foi commitado. As mutações só afetam o tema padrão
(claro e escuro): os grids `deprecated-*` continuam passando, como esperado.

| Mutação | Grids que falharam | Depois de reverter |
|---|---|---|
| `.po-button:hover:not(:disabled){opacity:.95}` (cor no hover) | 24 de 48: todos os 12 do `po-button` e todos os 12 do `po-button-group` dos temas claro/escuro (177 mil a 413 mil pixels de diferença) | 48/48 |
| `.po-button-group-disabled button{padding-left:23px !important}` (padding no disabled do grupo) | 12 de 48: só os do `po-button-group` claro/escuro (≈ 9,3 mil pixels cada); os do `po-button` não mudam | 48/48 |

## Escala: medidas (host: 12 núcleos, memória livre ≥ 10 GB; sem sobrecarga de memória, então 4 e 2 workers)

Obs.: o host é compartilhado (outro processo rodava builds; load médio ≈ 6 durante as medidas), então há ruído.
O CI do GitHub (2 vCPU) não foi medido e deve ser mais lento que este host. Todas as medidas abaixo usam o
servidor estático (`PW_STATIC=1`).

### Antes (matrizes completas + grid) × depois (só grids)

| Medida | Antes | Depois |
|---|---:|---:|
| Testes rodados | 2160 | 48 (24 `po-button` + 24 `po-button-group`) |
| Snapshots ativos | 2160 | 48 |
| PNGs ativos (bytes) | 14,75 MB (button 5,66 + group 3,25 + grid antigo 5,84) | 10,79 MB (button 7,64 + group 3,15) |
| PNGs parados no repo (reativáveis) | 0 | 8,91 MB (2136 arquivos) |
| Tempo da suíte, 4 workers | 294 s (2 execuções: 294 s e 294 s) | 41 s e 41 s (outras 2 execuções: 42 s e 43 s) |
| Tempo da suíte, 2 workers | 676 s | 39 s a 60 s (6 execuções: 59, 52, 60, 39, 43 e 47 s) |
| Tempo médio de parede por teste (4 workers) | 0,14 s | 0,86 s |
| Combinações cobertas | 2136 | 2136 (as mesmas) |
| Tempo por combinação (4 workers) | 0,14 s | 0,019 s |
| Estabilidade | 2 execuções 2160/2160, 0 flaky | 4 execuções com 4 workers 48/48 e 4 com 2 workers 48/48, 0 flaky |

- **Ganho**: ≈ 7× mais rápido com 4 workers (294 s → 41 s) e ≈ 13× com 2 workers (676 s → ≈ 50 s).
- Com 2 workers o tempo quase não difere do de 4: são só 48 testes e os maiores (glow, 72 botões) dominam.
- Sem mudar a cobertura, o PNG ativo cai 27 % (os grids de `glow` são grandes, ≈ 0,5 MB cada), mas o repo não encolhe enquanto os antigos ficarem versionados.
- Startup separado (não entra nos tempos): `ng build visual-harness` ≈ 3 a 5 s; servidor estático 0,1 s.

### Medidas anteriores (matrizes completas, `ng serve`)

| Medida | po-button | po-button-group | Os dois | Grid (button) |
|---|---:|---:|---:|---:|
| Testes = snapshots | 1368 | 768 | 2136 | 24 (cobrem 1368 combinações) |
| PNGs no repo (bytes reais) | 5,66 MB | 3,25 MB | 8,91 MB | 5,84 MB |
| Tamanho médio por PNG | 4,1 KB | 4,2 KB | 4,2 KB | 243 KB |
| Tempo, 4 workers (dev-server) | 222 s | 130 s | ≈ 352 s (soma; suíte inteira com o grid: 361 s e 359 s) | 27 s |
| Tempo, 2 workers (dev-server) | 318 s | 165 s | ≈ 483 s (soma) | 28 s |
| Tempo médio por teste, 4 workers (soma das durações ÷ n) | 0,61 s | 0,63 s | 0,63 s | 3,2 s |
| Tempo de parede por teste, 4 / 2 workers | 0,16 / 0,23 s | 0,17 / 0,21 s | 0,16 / 0,23 s | 1,1 s |

- **Aumento ao adicionar o group**: de 222 s para ≈ 352 s com 4 workers (+59 %) e de 318 s para ≈ 483 s com 2 workers (+52 %).
  Custa quase linear em nº de testes (~0,17 s/teste com 4 workers, ~0,23 s com 2).
- **Estabilidade**: 2 execuções completas de 2160 testes (button + group + grid), com `threshold: 0`: 2160/2160 nas duas, 0 flaky.
- **Startup separado** (não entra na tabela de testes): `ng build visual-harness` 3,1 s; `ng serve` frio até responder 3,8 s;
  servidor estático 0,1 s. `npm install` no repo ≈ 2 min; build do po-style ≈ 11 s.
- **Custo fixo por teste isolado** (sem concorrência): contexto 32 ms + `goto` e fontes prontas 141 ms + screenshot 72 ms ≈ 245 ms.
- **Servidor estático** em vez do `ng serve` (group, 4 workers): 130 s → 101 s (−22 %). Com 8 workers: 124 s → 91 s.
  Suíte inteira (2160 testes, 4 workers): 360 s com `ng serve` → 294 s estático (−18 %), 2 execuções seguidas 2160/2160, 0 flaky.
  Mais workers quase não ajudam (4 → 8: −10 %), então o gargalo não é só CPU.


Com a medição real dos grids (≈ 41 s para 2 componentes com 4 workers, ≈ 20 s por componente de ~1000 combinações),
90 componentes ficam em ≈ 30 min com 4 workers e ≈ 40 min com 2 workers (extrapolação linear, não medida), contra
≈ 4 h a 5,6 h no formato de 1 teste por combinação. A tabela abaixo é a projeção feita antes dessa medição.

### Projeção (hipótese explícita: ~90 componentes públicos, cada um com ~1000 testes no mesmo rigor)

Contagem do repo: 51 pastas `po-*` em `ui/components` + ~28 campos em `po-field` + 10 em `templates` + 1 `code-editor` ≈ 90 públicos
(160 `selector: 'po-…'` contando os internos).

| Cenário | Testes | Tempo, 2 workers | Tempo, 4 workers | PNGs no repo |
|---|---:|---:|---:|---:|
| Produto cartesiano, 1 teste por combinação | 90 000 | ≈ 5,6 h | ≈ 4,2 h | ≈ 370 MB |
| Mesmo, se cada componente tivesse 500 ou 1500 testes | 45 000 / 135 000 | 2,8 h / 8,4 h | 2,1 h / 6,3 h | 185 / 555 MB |
| Grid + estados forçados (mesmas combinações) | 90 000 combinações | ≈ 31 min | n/m | ≈ 385 MB |
| Grid + pares + deprecated em subconjunto (÷ ~8, estimativa) | ≈ 11 000 | ≈ 4 min | n/m | ≈ 50 MB |

Cálculo: 0,225 s/teste (2 workers) e 0,167 s/teste (4 workers) medidos; grid = 28 s ÷ 1368 combinações = 0,02 s/combinação.
O tamanho do repo não cai com o grid (mesmos pixels); só cai reduzindo combinações.

### Estratégias e ganho esperado

| Estratégia | Ganho | Base |
|---|---|---|
| Grid por componente (várias combinações num snapshot) + pseudo-estados via CDP | **≈ 11× mais rápido** (318 s → 28 s, 2 workers) | **medido** em `po-button` |
| Servidor estático no lugar do `ng serve` | −22 % no tempo | **medido** (group) |
| `threshold: 0` | não é ganho de tempo; pega regressões que o padrão deixava passar | **medido** (mutação de hover) |
| Tema depreciado só em subconjunto (ex.: default/hover/disabled, tamanho médio) | −50 a −63 % dos testes (hoje 864 de 1368 no button; 384 de 768 no group) | contagem exata |
| Combinações por pares (tamanho × variação × conteúdo × estado) | ≈ 8 a 10× menos casos (432 → ~40-60 por tema); risco de perder interação rara | estimativa |
| Só componentes afetados pelo diff da PR (mapear `projects/ui/src/lib/components/<x>/` → spec; style/tema/utils → roda tudo) | PR típica com 1 a 3 componentes: −95 % ou mais | estimativa |
| Reuso de página/contexto (mudar props sem recarregar) | no máximo ≈ 70 % do custo fixo isolado (170 de 245 ms); no suite real o ganho é menor | estimativa; o grid já embute isso |
| Sharding no GitHub Actions (`matrix.shard`, `--shard=i/N`) | tempo de parede ≈ total ÷ N + setup por job (~2 a 4 min de install/build); minutos de CI não diminuem | estimativa |
| Git LFS / repo de baselines separado | não reduz tempo; evita inchar o clone. Só compensa passando de ~500 MB ou com muita troca de baseline | estimativa |

**Recomendação**: (1) grid com pseudo-estados forçados para a matriz de estados + 1 a 2 testes de interação real por componente;
(2) servidor estático; (3) deprecated só em subconjunto até a v24; (4) pares para tamanho × variação; (5) rodar só os componentes afetados na PR e
a suíte completa à noite; (6) sharding só se a PR ainda passar de ~10 min. Manter PNG no git até ~300 MB; depois, repo de baselines.
