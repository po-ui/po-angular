# Decisões — regressão visual com Playwright

## 1. O padrão é a GRADE (um snapshot com muitos estados), não um teste por combinação

**Decisão**: cada componente tem poucos testes grandes. Cada teste fotografa uma grade de células (cada uma com
legenda) com estados forçados via CDP. Os testes de "1 teste por combinação" foram removidos.

**Por quê** (medido neste repositório, servidor `ng serve`, mesma matriz):

| | 1 teste por combinação | Grade |
|---|---:|---:|
| `po-button`, 2 workers | 318 s (1368 testes) | 28 s (24 testes) |
| `po-button`, 4 workers | 222 s | 27 s |
| `po-button` + `po-button-group` + grid (suíte inteira, 4 workers, estático) | 294 s para 2160 testes | 41 s para 48 testes |
| Combinações de `po-button` + `po-button-group` cobertas | 2136 | 2136 (em 48 testes) |

- O custo de um teste isolado é quase todo fixo (contexto do navegador + carregar a página + fontes + screenshot ≈ 245 ms);
  numa grade esse custo é pago uma vez para dezenas de combinações. Ganho medido: ≈ 11× (2 workers) e ≈ 7× (suíte inteira).
- Projeção para ~90 componentes com ~1000 combinações cada: ≈ 4 a 5,6 h no formato antigo contra ≈ 20 a 40 min na grade.
- Um diff vira uma imagem só, com legenda em cada item, em vez de dezenas de arquivos soltos.
- Detecta regressão: mutações de cor no hover e de padding no disabled fizeram os grids falharem e voltarem a passar
  ao reverter (detalhes no README).

**Custos aceitos**:

- Estado forçado por CDP (`CSS.forcePseudoState`) não é interação real (Tab, clique). Se o comportamento de
  teclado importar, escreva um teste de interação **pequeno e separado** (2 ou 3 casos), não uma matriz.
- Um PNG grande (até ~2000 × 1600) cobre muita coisa; um diff diz "o grid mudou" e é preciso abrir a imagem de
  diff para achar a célula. A legenda existe para isso.
- Um grid com animação infinita (ex.: `glow`) é mais lento e já exigiu timeouts maiores (90 s por teste, 30 s por screenshot).

## 2. `threshold: 0`

O padrão do Playwright (`threshold` 0.2) deixava passar `opacity: .9` no hover. Com `threshold: 0` até `.97` reprova.
Efeito colateral: apareceu a variação do `glow`; resolvido congelando as animações em t=0 (`freezeAnimations`).

## 3. Sem corte de conteúdo, garantido pelo helper

O grid original cortava o lado direito (células de largura fixa menores que o conteúdo). Hoje as colunas são
`max-content` e `expectGridScreenshot` chama `assertGridNotClipped`, que falha se algo passar da célula ou do `#stage`.
Largura fixa só quando se quer testar quebra de linha; aí o próprio helper avisa se o conteúdo não coube.

## 4. Servidor estático, só Chromium, baselines em Linux

- `PW_STATIC=1` serve o `ng build` pronto: ≈ 20 % mais rápido que o `ng serve` e usa menos memória.
- Só Chromium: Firefox/WebKit dobram tempo e imagens e renderizam fonte diferente.
- Baselines são geradas em Linux (CI `ubuntu-24.04` / Docker); no macOS/Windows use Docker.

## 5. Onde recuperar os testes completos (1 por combinação)

Commit `3729922` (último com `po-button.spec.ts`, `po-button-group.spec.ts` e os 2136 PNGs):

```bash
git checkout 3729922 -- tests/playwright/specs tests/playwright/harness tests/playwright/__snapshots__
```

O harness daquele commit tem o modo "um componente por página" que eles precisam. Os dados das combinações
(`*.matrix.ts`) continuam no código atual e são os mesmos.
