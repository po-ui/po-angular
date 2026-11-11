# Testes de regressão visual (Playwright) — POC `po-button` e `po-button-group`

Tira screenshots de componentes isolados e compara com as imagens base (`__snapshots__/`).

## Como funciona

- **Harness**: projeto Angular mínimo `visual-harness` (`angular.json`, código em `harness/`).
  Importa os módulos direto do código-fonte e renderiza um componente configurado por query string.
  Escolhido por não exigir nenhuma dependência nova (o repo não tem Storybook).
  - `?c=button` (padrão): `kind`, `danger`, `size`, `icon`, `label`, `aria`, `disabled`, `loading`.
  - `?c=button-group`: `size`, `toggle=none|single|multiple`, `items=[{label,icon,selected,disabled}]` (JSON).
  - `?c=grid&rows=[[{...célula de po-button, force}]]`: várias células numa página só (ver "Escala").
- **Tema**: `?theme=light|dark|deprecated-light|deprecated-dark`. O harness carrega o CSS base do
  `@po-ui/style` correspondente (`po-theme-default` ou `po-theme-default-deprecated`) e aplica o tema via
  `PoThemeService` (`setDefaultTheme` ou `setTheme(poThemeDefaultDeprecated, ...)`). O nome do snapshot começa
  com o tema (`deprecated-dark--primary--medium--label--default.png`). O tema depreciado sai na v24: basta
  apagar o `deprecated-*` do `THEMES` (`specs/helpers.ts`) e o laço no fim de `po-button.spec.ts`, e os snapshots.
- **Specs** (`specs/`): `helpers.ts` (abrir página, estados de ponteiro, congelar animação, forçar pseudo-estados)
  é compartilhado; cada componente tem o seu `*.spec.ts` com a matriz.

| Spec | Testes = snapshots | Matriz |
|---|---:|---|
| `po-button.spec.ts` | 1368 | claro e depreciado-claro/escuro: 6 variações × 3 tamanhos × 4 conteúdos × 6 estados (432 cada); escuro: recorte de 72 |
| `po-button-group.spec.ts` | 768 | 4 temas × 2 tamanhos × 3 `p-toggle` × 4 conteúdos × 6 a 9 estados (192 por tema) |
| `po-button-grid.spec.ts` | 24 | experimento de escala: mesma matriz do `po-button` (432 por tema) em 1 snapshot por tema × variação |

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

## Escala: medidas (host: 12 núcleos, memória livre ≥ 10 GB; sem sobrecarga de memória, então 4 e 2 workers)

Obs.: o host é compartilhado (outro processo rodava builds); os tempos têm ruído de alguns %. O CI do GitHub
(2 vCPU) não foi medido e deve ser mais lento que este host.

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
  Mais workers quase não ajudam (4 → 8: −10 %), então o gargalo não é só CPU.

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
