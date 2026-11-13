# Entrega para a crew remota: regressão visual com Playwright

Leia este arquivo inteiro antes de começar. Você não tem o histórico da conversa que originou o trabalho.

## Objetivo

Ter regressão visual com Playwright para **todos os componentes** do `po-angular`, rodando a cada PR. O formato
escolhido é a **grade** (muitos estados numa imagem só): ver [decisions.md](decisions.md) e o
[README](../README.md). Não volte para "um teste por combinação": foi removido de propósito (318 s contra 28 s só no
`po-button`).

## Estado atual (já feito)

- Branch: `tests/playwright-poc`, saída de `22.x.x`, repo `git@github.com:po-ui/po-angular.git`.
- Componentes cobertos: `po-button`, `po-button-group`, `po-checkbox` (60 testes = 60 snapshots, 14,7 MB).
- Quatro temas por componente: `light`, `dark`, `deprecated-light`, `deprecated-dark`.
- Harness: projeto Angular `visual-harness` (`angular.json`), código em `tests/playwright/harness/`.
- CI: `.github/workflows/visual-regression.yml` (faz build do po-style na mesma branch do PR, instala o pacote e roda
  o Playwright). **Nunca rodou no GitHub Actions**, só local.
- As imagens base foram geradas em **Linux**, neste host: `Linux`, Chromium do Playwright 1.65.0 (`@playwright/test@1.65.0`).

## Regras

- **Não faça PR e não faça push em `22.x.x` ou outra branch protegida.** Push só na branch `tests/playwright-poc`,
  e só se o usuário pedir.
- Não altere o código-fonte dos componentes (`projects/ui/src/lib/components/**`). Só testes, harness, config e CI.
- Commits pequenos, mensagens em conventional commits (`test(...)`, `docs(...)`, `ci(...)`).
- Versões de dependências fixas, sem ranges.
- Se algo travar duas vezes com a mesma abordagem, mude de abordagem e explique.
- Não gere snapshots novos em máquina que renderiza diferente da base. Se a base do repo não bater na sua máquina,
  **pare e reporte** (veja o passo 2 abaixo).

## Passo 1: preparar

```bash
git clone git@github.com:po-ui/po-angular.git && cd po-angular
git fetch origin tests/playwright-poc && git checkout tests/playwright-poc
node -v                         # o host original usa Node 26.13.0; Node 20+ deve servir
npm install --legacy-peer-deps  # o repo não tem lockfile; npm ci não funciona
npx playwright install chromium
```

Pré-requisitos: acesso SSH ao GitHub (para clonar também o `po-ui/po-style` quando o script de CI precisar) e
espaço em disco para `node_modules` e `dist/`.

## Passo 2: verificar que a base bate na sua máquina

```bash
npx ng build visual-harness
PW_STATIC=1 npm run visual:test
```

Resultado esperado: **60/60 passam**, 0 flaky, em 1 a 2 minutos. Rode **duas vezes seguidas**.

- Se passar: o ambiente do Linux remoto renderiza igual à base. Siga para o passo 3.
- Se falhar com diferenças de pixel (fonte, antialias): **não regenere**. Reporte quais testes falharam, o
  `uname -a`, `cat /etc/os-release`, `fc-list | wc -l` e abra um diff de 1 PNG. A saída esperada é decidir se as
  bases passam a ser geradas no Docker (`mcr.microsoft.com/playwright:v1.65.0-noble`, comando no README).

## Passo 3: primeira entrega

Se o passo 2 passou, reporte e pare. Conte ao usuário:

1. versão do SO, Node e Chromium;
2. tempo da suíte com 2 e 4 workers (`--workers=2`, `--workers=4`);
3. se houve teste instável;
4. qualquer coisa que o README tenha errado ou deixado de dizer.

**Não comece novos componentes sem o usuário escolher qual.** Quando ele escolher, siga o passo a passo do README
("Como escrever o grid de um componente novo") e valide com pelo menos 2 mutações (README, "Validar o grid com
mutações").

## Próximos passos já conhecidos (para o usuário decidir a ordem)

- Rodar o workflow no GitHub Actions pela primeira vez e medir o tempo em runner de 2 vCPU.
- Mais componentes em grade (cerca de 90 no total; a ordem não foi decidida).
- Rodar só os componentes afetados pelo diff do PR.
- Disparo a partir do repo `po-style`.
- Cache do build do po-style e do download do Chromium.

## Onde está cada coisa

| O quê | Onde |
|---|---|
| Specs em grade | `tests/playwright/specs/*-grid.spec.ts` |
| Matrizes de estados | `tests/playwright/specs/*.matrix.ts` |
| Helpers (CDP, sem cortes, temas) | `tests/playwright/specs/helpers.ts` |
| Harness | `tests/playwright/harness/` |
| Imagens base | `tests/playwright/__snapshots__/` |
| Script do po-style | `tests/playwright/scripts/install-po-style.sh` |
| Decisões e medidas | `tests/playwright/docs/decisions.md` |
