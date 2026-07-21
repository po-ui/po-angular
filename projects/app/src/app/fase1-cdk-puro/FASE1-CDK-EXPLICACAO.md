# Fase 1 — CDK Drag & Drop: Explicação das Funcionalidades

> Análise do componente `Fase1CdkPuroComponent` com base nas diretivas, utilitários e classes CSS do `@angular/cdk/drag-drop`.

---

## Diretivas

### `cdkDropList` — aplicada na `div.drop-list`

Define um container que aceita itens arrastáveis. O CDK monitora quais itens pertencem a essa lista e gerencia a lógica de reordenação.

- **`[cdkDropListData]`** — passa o array de dados associado à lista. Usado pelo CDK para construir o evento `CdkDragDrop` com os dados corretos (`previousContainer.data`, `container.data`).
- **`(cdkDropListDropped)`** — evento disparado quando o usuário solta um item. Recebe um `CdkDragDrop<CardItem[]>` com `previousIndex` e `currentIndex`.

---

### `cdkDrag` — aplicada em cada `div.card`

Torna o elemento arrastável dentro do `cdkDropList` pai. Na **Lista A**, o card inteiro é a área de drag — qualquer clique e arraste no card o move.

---

### `cdkDragHandle` — aplicada no `span.grip` (Lista B apenas)

Restringe a área de início do drag a esse elemento específico. Com isso, o restante do card (título, botão de ação) fica clicável normalmente sem acionar o drag. É a abordagem adotada na versão publicada no vercel.app.

---

### `*cdkDragPlaceholder` — aplicada na `div.card-placeholder`

Define o elemento que ocupa o espaço do card enquanto ele está sendo arrastado. Sem essa diretiva, o CDK cria um placeholder padrão. Neste componente, o placeholder customizado existe mas está com `display: none` no CSS — o espaço desaparece durante o drag, removendo o "buraco" visual na lista. Escolha intencional de UX.

---

### `moveItemInArray` — utilitário usado no método `reorder()`

Função helper do CDK que recebe o array, `previousIndex` e `currentIndex` e move o item in-place. O componente faz uma cópia do array antes (`[...cardsSignal()]`) para preservar imutabilidade com signals, aplica o `moveItemInArray` na cópia e depois chama `.set()`.

```typescript
private reorder(cardsSignal: typeof this.cardsWholeDrag, event: CdkDragDrop<CardItem[]>): void {
  const updated = [...cardsSignal()];
  moveItemInArray(updated, event.previousIndex, event.currentIndex);
  cardsSignal.set(updated);
}
```

---

## Classes CSS automáticas do CDK

O CDK injeta classes automaticamente nos elementos durante o drag — não é necessário adicioná-las manualmente, apenas estilizá-las.

| Classe | Quando existe | Uso no componente |
|---|---|---|
| `.cdk-drag-preview` | No clone visual que segue o cursor durante o drag | `box-shadow: 0 5px 15px pink` — sombra rosa para tornar visível o item sendo arrastado |
| `.cdk-drag-placeholder` | No espaço reservado que fica na lista enquanto o item está sendo arrastado | `opacity: 0` — torna o placeholder invisível (em combinação com `card-placeholder: display: none`) |
| `.cdk-drop-list-dragging` | No `cdkDropList` enquanto qualquer drag está ativo dentro dele | Usado no seletor `.cdk-drop-list-dragging .card:not(.cdk-drag-placeholder)` para aplicar `transition: transform 200ms ease` nos cards que se movem para abrir espaço |
| `.cdk-drag-animating` | No item após ser solto, durante a animação de retorno à posição final | Não estilizada explicitamente aqui, mas usada internamente pelo CDK para a animação de snap |

---

## Fluxo completo de um drag

1. Usuário clica e arrasta → CDK cria o **preview** (clone com `.cdk-drag-preview`) que segue o cursor
2. O item original vira o **placeholder** (`.cdk-drag-placeholder`) no lugar original
3. Conforme o cursor move, os outros cards recebem `transform` via `.cdk-drop-list-dragging` para abrir/fechar espaço visualmente
4. Usuário solta → `(cdkDropListDropped)` dispara com os índices → `moveItemInArray` reordena o signal → Angular re-renderiza a lista na nova ordem

---

## Diferença entre as duas listas

| | Lista A — Card inteiro arrastável | Lista B — Somente handle arrastável |
|---|---|---|
| Área de drag | Card inteiro (`cdkDrag` no card) | Apenas o ícone `⠿` (`cdkDragHandle` no span) |
| Botões/links clicáveis | Podem ser engolidos pelo drag | Funcionam normalmente |
| Caso de uso | Listas simples sem interação interna | Cards com ações, links ou inputs internos |
| Adotado no vercel.app | Não | **Sim** |
