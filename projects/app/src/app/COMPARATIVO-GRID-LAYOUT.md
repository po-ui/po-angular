# Comparativo: `fase2-cdk-widget` vs `cdk-widget-grid`

> Análise detalhada das diferenças de arquitetura, modelo de dados, layout e comportamento de drag & drop entre os dois componentes.

---

## 1. Modelo de Dados

### `fase2-cdk-widget`

```typescript
export interface GridCell {
  colClass: string;      // Classe CSS do PO UI (ex: 'po-xl-6 po-lg-6')
  widget: WidgetContent; // Sempre preenchido — sem slots vazios
}

cells = signal<GridCell[]>([...]) // Lista plana de células
```

- Estrutura **plana** — uma única lista de células sem conceito de linha
- O tamanho é uma **string de classes CSS** (`po-xl-6 po-lg-6`) aplicada via `[ngClass]`
- Não existe slot vazio — toda célula tem widget
- Não há relação explícita entre células vizinhas

### `cdk-widget-grid`

```typescript
export interface GridCell {
  id: string;                    // ID único da célula
  colSpan: number;               // Número inteiro de colunas (ex: 4, 6, 8)
  widget: WidgetContent | null;  // Pode ser null (slot vazio)
}

export interface GridRow {
  id: string;
  cells: GridCell[];
}

rows = signal<GridRow[]>([...]) // Lista de linhas, cada linha com suas células
```

- Estrutura **hierárquica** — linhas contendo células
- O tamanho é um **número inteiro** (`colSpan`) usado via `[style.flex]`
- Slots vazios (`widget: null`) são possíveis — usados na stack de bigNumbers
- Células têm consciência das vizinhas via `GridRow`

---

## 2. Arquitetura de Layout

### `fase2-cdk-widget` — `flex-wrap`

```css
.widgets-grid {
  display: flex;
  flex-wrap: wrap;   /* células quebram para próxima linha automaticamente */
}
```

```html
<div class="widgets-grid">
  @for (cell of cells(); ...) {
    <div [ngClass]="cell.colClass" cdkDropList>  <!-- ex: po-xl-6 po-lg-6 -->
      <po-widget cdkDrag>...</po-widget>
    </div>
  }
</div>
```

**Como funciona:** as células são jogadas num flex container com `flex-wrap`. O PO UI grid system (`po-xl-N`) define a largura percentual de cada célula via float/flex. Quando a soma das larguras ultrapassa 100%, a célula quebra para a próxima linha automaticamente.

**Limitação:** sem controle explícito de linhas, não é possível saber quais células estão na mesma linha em tempo de execução — o layout é definido puramente por CSS.

---

### `cdk-widget-grid` — linhas explícitas com `flex`

```css
.widget-grid {
  display: flex;
  flex-direction: column;  /* linhas empilhadas verticalmente */
  gap: 8px;
}

.grid-row {
  display: flex;
  flex-direction: row;     /* células lado a lado dentro de cada linha */
  gap: 8px;
  align-items: stretch;    /* altura igual para todas as células da linha */
}
```

```html
<div class="widget-grid">
  @for (row of rows(); ...) {
    <div class="grid-row">
      @for (cell of row.cells; ...) {
        <div [style.flex]="cell.colSpan" cdkDropList>  <!-- flex: 8 ou flex: 4 etc -->
          <po-widget cdkDrag>...</po-widget>
        </div>
      }
    </div>
  }
</div>
```

**Como funciona:** cada linha é um flex container independente. O `[style.flex]="cell.colSpan"` define o peso relativo de cada célula — `flex: 8` ocupa o dobro do espaço de `flex: 4`. O `align-items: stretch` força todas as células da mesma linha a terem a mesma altura.

**Vantagem:** o componente sabe exatamente quais células estão na mesma linha, o que permite lógica condicional de renderização.

---

## 3. Comportamento do Swap (Drag & Drop)

### `fase2-cdk-widget` — swap de célula inteira

```typescript
// Opção 1 implementada: célula inteira (conteúdo + tamanho) é trocada
onDrop(event, targetIndex) {
  const updated = this.cells().map(cell => ({ ...cell }));
  const temp = updated[sourceIndex];
  updated[sourceIndex] = updated[targetIndex]; // troca a célula completa
  updated[targetIndex] = temp;
  this.cells.set(updated);
}
```

- Quando A (`po-xl-8`) troca com B (`po-xl-3`), A ocupa a posição de B com seu tamanho original (`po-xl-8`)
- O layout da grade **muda** após cada swap
- `onDrop` recebe `targetIndex` como parâmetro direto (passado pelo `@for`)

### `cdk-widget-grid` — swap somente de conteúdo

```typescript
// Células têm posição fixa — só o widget é trocado
onDrop(event) {
  // Localiza células por ID
  sourceCell.widget = targetCell.widget; // troca só o widget
  targetCell.widget = temp;
  this.rows.set(updatedRows);
}
```

- O `colSpan` de cada célula nunca muda — o layout da grade é **estável**
- `onDrop` não recebe índice — descobre a célula de origem/destino pelo `id` do container
- O `id` da célula é estável e permanente (`cell-0-0`, `cell-1-2`, etc.)

---

## 4. Renderização Condicional por Tipo de Linha

### `fase2-cdk-widget`

Um único template para todos os widgets, com `@switch` no tipo:

```html
@switch (cell.widget.type) {
  @case ('bigNumber') { ... }
  @case ('chart') { ... }
  @case ('routine') { ... }
}
```

Sem diferenciação de comportamento baseada em vizinhos — cada widget é renderizado independentemente.

### `cdk-widget-grid`

Dois templates distintos baseados no contexto da linha:

```html
@if (isMixedRow(row)) {
  <!-- Linha mista: charts separados + bigNumbers em stack -->
  <div class="mixed-row">
    @for (cell of getChartsInRow(row); ...) { ... }   <!-- charts primeiro -->
    <div class="big-number-stack">                     <!-- stack de bigNumbers -->
      @for (cell of getBigNumbersInRow(row); ...) { ... }
    </div>
  </div>
} @else {
  <!-- Linha homogênea: renderização padrão -->
  <div class="grid-row">
    @for (cell of row.cells; ...) { ... }
  </div>
}
```

`isMixedRow()` detecta se a linha tem `chart` e `bigNumber` juntos. Se sim, os bigNumbers são empilhados verticalmente numa coluna lateral ao chart.

---

## 5. Altura dos Charts

### `fase2-cdk-widget`

```html
<po-chart [p-height]="180"></po-chart>
```

Altura **fixa em 180px** para todos os charts, independente do tamanho da célula.

### `cdk-widget-grid`

```typescript
getChartHeight(row: GridRow, cell: GridCell): number {
  const isMixed = hasChart && hasBigNumber;
  if (isMixed) return 240; // altura fixa quando há bigNumbers ao lado

  // Escala linear: po-xl-3 = 160px, po-xl-12 = 320px
  return Math.round(160 + ((cell.colSpan - 3) / 9) * 160);
}
```

```html
<po-chart [p-height]="getChartHeight(row, cell)"></po-chart>
```

Altura **calculada dinamicamente**:
- Em linha mista: 240px fixo (para alinhar com a stack de bigNumbers)
- Em linha homogênea: proporcional ao `colSpan` da célula

---

## 6. Stack de BigNumbers (exclusivo do `cdk-widget-grid`)

Funcionalidade que não existe no `fase2-cdk-widget`:

```typescript
getBigNumbersInRow(row: GridRow): (GridCell | null)[] {
  const cells = row.cells.filter(c => c.widget?.type === 'bigNumber');
  // Garante mínimo de 2 slots para dividir a altura do chart ao lado
  if (cells.length === 1) return [cells[0], null]; // adiciona slot vazio
  return cells;
}
```

```html
<div class="big-number-stack" [style.flex]="getBigNumbersInRow(row)[0]?.colSpan ?? 4">
  @for (cell of getBigNumbersInRow(row); track $index) {
    @if (cell) {
      <div class="big-number-cell" cdkDropList>...</div>  <!-- bigNumber real -->
    } @else {
      <div class="empty-slot">Arraste um widget aqui</div> <!-- slot vazio -->
    }
  }
</div>
```

```css
.big-number-stack {
  display: flex;
  flex-direction: column; /* empilha verticalmente */
  gap: 8px;
}
.big-number-cell {
  flex: 1; /* divide a altura igualmente */
}
```

Quando há apenas 1 bigNumber ao lado de um chart, um slot vazio é adicionado automaticamente para que o bigNumber ocupe metade da altura do chart.

---

## 7. IDs das Células e Conexão dos Drop Lists

### `fase2-cdk-widget`

```typescript
allListIds = computed(() => this.cells().map((_, i) => `cell-${i}`));
getListId(index: number) { return `cell-${index}`; }
```

IDs gerados por **índice posicional** (`cell-0`, `cell-1`, ...). Se a lista é reordenada, os IDs se deslocam com as posições — o CDK precisa de `cellsAsList` como computed para manter os dados sincronizados.

### `cdk-widget-grid`

```typescript
// IDs definidos estaticamente nos dados
{ id: 'cell-0-0', colSpan: 8, widget: {...} }
{ id: 'cell-0-1', colSpan: 4, widget: {...} }

allCellIds = computed(() =>
  this.rows().flatMap(row => row.cells.map(cell => cell.id))
);
```

IDs **estáveis e semânticos** (`cell-linha-coluna`). Nunca mudam — a célula tem identidade própria independente do conteúdo. O `onDrop` localiza a célula pelo ID, não pelo índice.

---

## 8. Resumo Comparativo

| Aspecto | `fase2-cdk-widget` | `cdk-widget-grid` |
|---|---|---|
| **Estrutura de dados** | Lista plana de `GridCell[]` | Hierarquia `GridRow[]` com `GridCell[]` |
| **Tamanho da célula** | String CSS (`po-xl-6 po-lg-6`) | Número inteiro (`colSpan: 6`) |
| **Layout CSS** | `flex-wrap` com classes PO UI | Linhas explícitas com `flex` proporcional |
| **Consciência de vizinhos** | Não — cada célula é independente | Sim — célula conhece sua linha |
| **Swap no drop** | Célula inteira (conteúdo + tamanho) | Só conteúdo (tamanho fixo) |
| **Altura do chart** | Fixa (180px) | Dinâmica por `colSpan` e contexto da linha |
| **Linha mista** | Não detectada — renderização uniforme | Detectada via `isMixedRow()` |
| **Stack de bigNumbers** | Não existe | Empilha automaticamente ao lado de chart |
| **Slots vazios** | Não existem | Existem para completar a stack |
| **IDs das células** | Por índice posicional (`cell-0`) | Estáveis e semânticos (`cell-0-1`) |
| **Complexidade** | Simples — template único | Maior — dois templates condicionais |
| **Responsividade** | Via classes PO UI (`po-lg-N`) | Apenas `xl` — sem breakpoints implementados |

---

# Fase 2.2 — `fase2-2-grid-layout-sui`

> Grid automático baseado em CSS Grid nativo com `grid-auto-flow: row dense`. Spans lógicos por `displaySize`. Substitui o modelo de linhas explícitas da Fase 2.1.

---

## 9. Modelo de Dados

```typescript
export type DisplaySize = 'extrasmall' | 'small' | 'medium' | 'large' | 'extralarge';

export const DISPLAY_SIZE_SPANS: Record<DisplaySize, CardSpan> = {
  extrasmall: { col: 1, row: 1 },
  small:      { col: 1, row: 2 },
  medium:     { col: 2, row: 2 },
  large:      { col: 3, row: 2 },
  extralarge: { col: 4, row: 2 }
};

export interface WidgetCard {
  id: string;
  title: string;
  type: WidgetType;
  displaySize?: DisplaySize; // opcional — fallback por tipo se ausente
  ...
}

cards = signal<WidgetCard[]>([...]) // lista plana, sem linhas
```

- Estrutura **plana** — sem conceito de linha ou coluna fixa
- O tamanho é um **enum lógico** (`displaySize`) mapeado para spans `col × row`
- Fallback automático por tipo: `chart` → `medium`, `actionlist` → `small`, demais → `extrasmall`
- Spans viajam **junto com o card** no swap (diferença crítica em relação à Fase 2.1)

---

## 10. Arquitetura de Layout

### `fase2-2-grid-layout-sui` — CSS Grid automático com `dense`

```css
.auto-grid {
  display: grid;
  gap: var(--spacing-sm, 8px);
  grid-auto-rows: 10.8rem;          /* altura de linha fixa conforme spec */
  grid-auto-flow: row dense;        /* preenche buracos automaticamente */
  grid-template-columns: repeat(3, 1fr); /* varia por breakpoint */
}
```

```typescript
// Estilo inline calculado por card
getCardGridStyle(card: WidgetCard): Record<string, string> {
  const span = this.getSpan(card); // { col: 2, row: 2 }
  return {
    'grid-column': `span ${span.col}`,
    'grid-row':    `span ${span.row}`
  };
}
```

```html
<div class="auto-grid" [class.dense]="isDense()">
  @for (card of cards(); track card.id) {
    <div class="grid-item"
         [ngStyle]="getCardGridStyle(card)"
         cdkDropList ...>
      <po-widget cdkDrag>...</po-widget>
    </div>
  }
</div>
```

**Como funciona:** cada card recebe `grid-column: span N` e `grid-row: span N` calculados a partir do `displaySize`. O `grid-auto-flow: row dense` faz o navegador tentar preencher lacunas com cards menores que aparecem depois na ordem do DOM, minimizando espaços vazios.

**Breakpoints responsivos:**

| Breakpoint | Largura | Colunas |
|---|---|---|
| `xs` | até 850px | 1 |
| `sm` | 850px+ | 2 |
| `md` | 1366px+ | 3 |
| `lg` | 1650px+ | 4 |
| `xl` | 2110px+ | 5 |

---

## 11. Comportamento do Swap (Drag & Drop)

```typescript
onDrop(event: CdkDragDrop<WidgetCard[]>, targetCard: WidgetCard): void {
  if (event.previousContainer.id === event.container.id) return;

  const sourceId = event.previousContainer.id; // id do card arrastado
  const targetId = targetCard.id;              // id do card de destino

  const updated = this.cards().map(c => ({ ...c }));
  const sourceIdx = updated.findIndex(c => c.id === sourceId);
  const targetIdx = updated.findIndex(c => c.id === targetId);

  // Swap completo: conteúdo E displaySize viajam juntos
  [updated[sourceIdx], updated[targetIdx]] = [updated[targetIdx], updated[sourceIdx]];

  this.cards.set(updated);
}
```

- Swap de **card inteiro** — `displaySize` muda de posição junto com o conteúdo
- O layout se reorganiza após cada swap (o grid recalcula o posicionamento automático)
- `onDrop` recebe o `targetCard` diretamente via parâmetro do `@for`
- IDs dos cards são estáveis — o drop list usa `card.id` como `[id]`

---

## 12. Altura dos Charts

```typescript
getChartHeight(card: WidgetCard): number {
  const span = this.getSpan(card);
  // 10.8rem ≈ 173px por linha; desconta ~80px do header/footer do po-widget
  return span.row * 173 - 80;
}
```

Altura **proporcional ao `row span`** do card:
- `extrasmall`/`small` (1 linha): ~93px
- `medium`/`large`/`extralarge` (2 linhas): ~266px

---

## 13. Dense Mode

```html
<div class="auto-grid" [class.dense]="isDense()">
```

```css
.auto-grid.dense {
  grid-auto-flow: row dense;
}
```

Toggle via botões na toolbar. Quando `dense` está ativo, o CSS Grid tenta preencher lacunas com cards que cabem no espaço vago — o que pode alterar a ordem visual em relação à ordem do DOM.

---

## 14. Comparativo Geral — Todas as Fases

| Aspecto | `fase2-cdk-widget` (Fase 2) | `cdk-widget-grid` (Fase 2.1) | `fase2-2-grid-layout-sui` (Fase 2.2) |
|---|---|---|---|
| **Estrutura de dados** | Lista plana `GridCell[]` | Hierarquia `GridRow[] > GridCell[]` | Lista plana `WidgetCard[]` |
| **Definição de tamanho** | String CSS (`po-xl-6`) | Número inteiro (`colSpan: 6`) | Enum lógico (`displaySize: 'medium'`) |
| **Motor de layout** | `flex-wrap` + classes PO UI | Flex por linha explícita | CSS Grid nativo |
| **Controle de linhas** | Nenhum (CSS puro) | Explícito no código | Automático (grid algorithm) |
| **Preenchimento de buracos** | Não | Não | Sim (`dense`) |
| **Consciência de vizinhos** | Não | Sim (via `GridRow`) | Não necessário |
| **Swap no drop** | Célula inteira (col + widget) | Só widget (col fixo) | Card inteiro (size + widget) |
| **Breakpoints responsivos** | Via classes PO UI | Apenas `xl` | 5 breakpoints customizados |
| **Linha mista** | Não detectada | Detectada via `isMixedRow()` | Não necessária — grid resolve |
| **Stack de bigNumbers** | Não existe | Empilhamento automático | Não existe (dense resolve) |
| **Slots vazios** | Não existem | Existem para completar stack | Não existem |
| **Altura do chart** | Fixa (180px) | Dinâmica por `colSpan` e linha | Proporcional ao `row span` |
| **Complexidade do template** | Simples — 1 template | Alta — 2 templates condicionais | Simples — 1 template |
| **Complexidade do CSS** | Baixa | Média | Baixa (grid faz o trabalho) |
