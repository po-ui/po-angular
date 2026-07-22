# Handoff - Home / Apps Section (Figma Dev Mode + implementacao atual)

## Objetivo

Este documento resume a estrutura da pagina **Home**, com foco principal na **secao Apps**, para agilizar o handoff entre design e desenvolvimento. Ele combina:

- medidas observadas no **Figma Dev Mode**
- regras implementadas em `src/app/App.tsx`
- pontos de atencao da **grid**, **responsividade** e **drag and drop**

> Observacao importante: o Figma representa o estado estatico da tela. A implementacao atual adiciona comportamento responsivo e reordenacao via drag and drop, que nao estao descritos visualmente no layout original.

---

## Referencias do Figma

- Pagina: `0:1` - `📄 Home atualizada`
- Frame principal: `27675:2332` - `Ani Home`
- Header total: `27708:1143` - `Header`
- Main container: `27675:2363` - `Main Container`
- Secao Apps: `27675:2956` - `Apps Section`
- Navbar Apps: `27675:2364` - `Navigation Bar`
- Conteudo Apps: `27675:2373` - `Content`
- Secao Tarefas: `27675:2957` - `Tarefas Section`

---

## Estrutura macro da pagina no Figma

### Header fixo superior

O bloco superior do Figma soma **236 px**:

- `Ani Global Header`: **60 px**
- `Ani Tabs`: **56 px**
- `Ani Context Bar`: **60 px**
- `Ani Anchors`: **60 px**

Isso bate com a implementacao atual, que usa um topo fixo e empurra o conteudo com:

- `pt-[232px]` no container rolavel

> Diferenca de 4 px entre o empilhamento visual do Figma e o offset atual do codigo: isso faz parte do ajuste pratico da interface e do padding aplicado no body da pagina.

### Main container

- largura total do frame: **1366 px**
- margem lateral interna: **16 px** de cada lado
- largura util das secoes: **1334 px**

No codigo, a pagina usa um container fluido (`w-full`) com `p-[12px] md:p-[16px]`.

---

## Secao Apps no Figma

### Medidas gerais

- frame da secao: **1334 x 692**
- navbar da secao: **1334 x 60**
- espacamento entre navbar e grid: **16 px**
- area de conteudo da secao: **1334 x 616**

### Composicao visual da secao

No Figma, a secao Apps aparece assim:

```text
Navbar Apps (60)
gap 16

Row 1 -> 4 cards compactos
Row 2 -> 3 cards graficos/grandes
```

Representacao:

```text
|----3 cols----|----3 cols----|----3 cols----|----3 cols----|
|    card 1    |    card 2    |    card 3    |    card 4    |

|------4 cols------|------4 cols------|------4 cols------|
|      chart 1     |      chart 2     |      chart 3     |
|      chart 1     |      chart 2     |      chart 3     |
```

---

## Grid da secao Apps - leitura de Dev Mode

Pelos tamanhos dos widgets no Figma:

- card compacto: **321.5 x 200**
- card grafico: **434 x 400**
- gap horizontal entre cards: **16 px**
- gap vertical entre linhas: **16 px**

Isso indica uma grid base de **12 colunas**.

### Calculo da coluna

Largura util da area:

- `1334 px`

Gutters:

- `11 gaps x 16 px = 176 px`

Espaco restante para colunas:

- `1334 - 176 = 1158 px`

Largura de cada coluna:

- `1158 / 12 = 96.5 px`

### Validacao com os cards do Figma

#### Card compacto = 3 colunas

```text
3 * 96.5 + 2 * 16 = 321.5 px
```

#### Card grafico = 4 colunas

```text
4 * 96.5 + 3 * 16 = 434 px
```

#### Altura

- 1 row = **200 px**
- 2 rows = **400 px**
- gap entre rows = **16 px**

Conclusao:

- a secao Apps do Figma foi desenhada sobre uma **grid 12 colunas**
- com **row base de 200 px**
- e **gutter de 16 px** nas duas direcoes

---

## Implementacao atual da secao Apps

Arquivo principal:

- `src/app/App.tsx`

Pontos mais importantes:

- `NavigationBar()` -> barra da secao Apps
- `CardDef` -> contrato dos cards
- `computeInitialAppsLayout()` -> layout inicial da secao
- `computeLayout()` -> recalculo apos drag and drop
- `DraggableCard()` -> comportamento visual e tecnico do arraste
- `ContentGrid()` -> grid responsiva e estado da secao

### Estrutura da grid no codigo

Em `ContentGrid()`:

- desktop: `grid-cols-12`
- tablet: `grid-cols-2`
- mobile: `grid-cols-1`

Tambem foi definido:

- `gridAutoRows: "200px"`
- `gridAutoFlow: "row dense"`
- gap: `12px` no menor viewport, `16px` a partir de `md`

### Breakpoints implementados

O modo da grid e decidido em JS:

- `mobile`: `< 768`
- `tablet`: `>= 768` e `< 1280`
- `desktop`: `>= 1280`

Comportamento esperado:

- telas grandes: cards distribuidos pela grid de 12 colunas
- tablet: cards caem para **2 colunas**
- mobile: cards caem para **1 coluna**

Ou seja: a responsividade atual vai alem do Figma estatico.

---

## Regras de tamanho dos cards

Existem dois tipos principais:

- `compact`
- `chart`

No codigo, a altura e travada por tipo:

```ts
rowSpan: card.kind === "chart" ? 2 : 1
```

### Regra funcional

- cards de grafico (`chart`) **sempre ocupam 2 rows**
- cards compactos (`big number` e `default`) **sempre ocupam 1 row**

Isso foi reforcado em mais de um ponto para evitar regressao visual durante reordenacao.

### Regra de largura

A largura nao e fixa por pixel no codigo; ela e derivada da grid:

- no desktop, via `colSpan`
- no tablet/mobile, via adaptacao por `layoutMode`

Logo:

- **altura = travada por tipo**
- **largura = adaptavel pela grid**

Esse foi um dos requisitos centrais da implementacao.

---

## Layout inicial vs layout apos reordenacao

### Estado inicial carregado

O estado inicial da secao Apps **nao segue exatamente o mesmo arranjo do Figma**.

Hoje, o codigo monta um estado inicial proposital com:

1. **row 1**: 4 cards compactos
2. **row 2**: 2 cards de grafico
3. **row 3**: 3 cards compactos
4. **row 4**: 1 grafico full width

Isso vem de `computeInitialAppsLayout()`.

Resumo da distribuicao:

```text
Row 1 -> 4 x span 3
Row 2 -> 2 x span 6
Row 3 -> 3 x span 4
Row 4 -> 1 x span 12
```

### Depois do drag and drop

Depois que o usuario reordena, o layout passa a ser recalculado por `computeLayout()`.

Esse algoritmo:

- mantem altura travada por tipo
- recalcula `gridCol` e `gridRow`
- redistribui os spans para preencher 100% da largura da row
- tenta combinar cards compactos com charts sem quebrar a responsividade

---

## Logica da grid apos drag and drop

O `computeLayout()` trabalha com a ideia de **bandas** e **slots**.

### Conceitos

- **L-slot**: um card grande ocupando 2 rows
- **P-slot**: dois cards pequenos empilhados na mesma coluna
- **S-slot**: um card pequeno sozinho numa row plana

### Regras principais

1. Se houver card `chart`, ele ocupa 2 rows.
2. Dois cards pequenos podem ser empilhados ao lado de um `chart`.
3. A largura final dos slots e recalculada para preencher as 12 colunas.
4. Os spans permitidos sao:
   - chart: `4`, `6`, `12`
   - compact: `3`, `4`, `6`, `12`

### Objetivo da heuristica

Manter a row sempre cheia, preservando:

- charts altos
- compactos baixos
- composicoes laterais coerentes

---

## Drag and drop - pontos importantes do handoff

### Interacao

O drag na secao Apps:

- acontece apenas nos cards de Apps
- e iniciado pelo **handle central superior**
- nao afeta a secao Tarefas

### Tecnica usada

Foi implementado com **HTML5 Drag and Drop** + estado React.

Pontos principais:

- `handleDragStart`
- `handleDragOver`
- `applyDrop`
- `handleDragEnd`
- `resetDragState`

### Ghost de arraste

Ao iniciar o drag, o codigo cria um **drag ghost customizado**:

- clone visual do card
- `opacity: 0.8`
- borda `2px solid #00445B`
- `border-radius: 12px`
- sombra elevada

Objetivo:

- deixar claro qual card esta sendo arrastado
- manter a leitura do conteudo durante o gesto

### Placeholder de origem

Enquanto o card esta em voo:

- a origem vira um placeholder tracejado
- o card real nao desaparece sem referencia espacial

### Durante o hover sobre o alvo

Durante `dragOver`:

- o layout **nao e refluido em tempo real**
- apenas o alvo recebe highlight

Isso foi mantido porque tentativas anteriores de preview mais agressivo causaram regressoes visuais indesejadas.

### No drop

Ao soltar:

1. o card e removido da posicao original
2. inserido antes/depois do card alvo
3. a lista e recalculada por `computeLayout()`
4. o estado de drag e limpo

### Regra de seguranca

Se o drop ocorrer no mesmo card, ou em caso invalido:

- o estado de drag e resetado
- nenhuma mudanca e persistida

---

## Diferencas entre Figma e implementacao atual

### O que bate com o Figma

- topologia geral da pagina
- header superior em 4 camadas
- largura util de conteudo com margem lateral de 16 px
- navbar Apps com altura de 60 px
- cards compactos equivalentes a **3 colunas x 1 row**
- cards graficos equivalentes a **4 colunas x 2 rows**
- gutters principais de 16 px

### O que foi expandido no codigo

- responsividade tablet/mobile
- secao Apps reordenavel
- lock de altura por tipo
- algoritmo de recomposicao da grid
- estado inicial customizado, diferente do mock estatico

### O que merece alinhamento de handoff

Se esse material for para outro dev ou squad, vale deixar explicito que:

1. **Figma = referencia estrutural e visual**
2. **codigo = comportamento real e responsivo**
3. a secao Apps atual tem regras de produto/UX que vao alem do frame original

---

## Tokens e anotacoes uteis do Figma

Variaveis observadas no node da secao Apps:

- `Ani Tabs/--background`: `#ecf1f8`
- `color/action/default`: `#00445b`
- `Ani Label/--text-color`: `#091a22`
- `spacing/xs`: `8`
- `spacing/sm`: `16`
- `Target/Target Size`: `44`
- `font-size/default`: `16`
- `typography/font-size/emphasized`: `20`

Esses valores ajudam a justificar:

- altura/ritmo da navbar
- espacamentos internos
- tamanho dos alvos interativos
- contraste e cor dos icones/botoes

---

## Mapa rapido de codigo

Arquivo:

- `src/app/App.tsx`

Trechos relevantes:

- ancora superior e navegacao entre secoes: regiao de `AniAnchors`
- navbar Apps: `NavigationBar()`
- tipos e regras da grid: `CardDef`, `enforceAppsCardHeightRules()`
- layout inicial: `computeInitialAppsLayout()`
- layout apos drag: `computeLayout()`
- comportamento do card: `DraggableCard()`
- montagem da grid: `ContentGrid()`

---

## Recomendacao para handoff

Se voce quiser colar isso em uma entrega formal, eu recomendo resumir a secao Apps assim:

> A secao Apps usa uma grid base de 12 colunas com gutter de 16 px e row base de 200 px. Cards compactos ocupam 3 colunas x 1 row, enquanto cards de grafico ocupam 4 colunas x 2 rows no baseline do Figma. Na implementacao, a largura dos cards e responsiva e a altura e travada por tipo. A secao suporta drag and drop com recomputo automatico de `gridCol`, `gridRow` e `colSpan` apos o drop, preservando o preenchimento da row e evitando distorcao de altura nos charts.

---

## Arquivo de origem

- Figma: `📄 Home atualizada`
- Codigo: `src/app/App.tsx`
