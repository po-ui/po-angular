import { Component } from '@angular/core';

interface TestScenario {
  label: string;
  route: string;
  description: string;
}

@Component({
  selector: 'dthfui-11105-index',
  templateUrl: './index.component.html',
  standalone: false
})
export class IndexTestComponent {
  scenarios: Array<TestScenario> = [
    { label: 'PoTable (5000 registros)', route: '/PoTable', description: 'Tabela com virtual scroll, 5000 itens, frozen column e cellTemplate.' },
    { label: 'PoTableLabs', route: '/PoTableLabs', description: 'Laboratório completo com todas as propriedades configuráveis.' },
    { label: 'Column Alignment', route: '/ColumnAlignment', description: 'Valida alinhamento entre thead e tbody com diferentes configurações de width.' },
    { label: 'Frozen Columns', route: '/FrozenColumns', description: 'Testa position: sticky com scroll horizontal e vertical simultâneo.' },
    { label: 'Selection', route: '/Selection', description: 'Seleção com virtual scroll, selectAll, e estado de seleção após scroll.' },
    { label: 'Sort', route: '/Sort', description: 'Ordenação com virtual scroll, diferentes tipos de coluna.' },
    { label: 'Drag and Drop', route: '/DragDrop', description: 'Reordenação de colunas via drag-and-drop com virtual scroll.' },
    { label: 'Infinite Scroll', route: '/InfiniteScroll', description: 'Carregamento paginado com virtual scroll e p-show-more.' },
    { label: 'Striped Rows', route: '/Striped', description: 'Alternância de cores com virtual scroll e seleção de linhas.' },
    { label: 'Height & Spacing', route: '/HeightSpacing', description: 'Altura e spacing dinâmicos com virtual scroll.' },
    { label: 'Column Manager', route: '/ColumnManager', description: 'Ocultar/exibir colunas com frozen columns ativas.' },
    { label: 'Loading & Empty', route: '/LoadingEmpty', description: 'Loading overlay e transição vazio/populado/vazio.' },
    { label: 'Resize', route: '/Resize', description: 'Redimensionamento do container com frozen columns.' },
    { label: 'Performance', route: '/Performance', description: 'FPS counter, posição do thead e auto-scroll para teste de flickering.' },
    { label: 'PoDynamic', route: '/PoDynamic', description: 'Teste com po-page-dynamic-table.' },
    { label: 'PoLookup', route: '/PoLookup', description: 'Teste com po-lookup.' },
    { label: 'PoSample', route: '/PoSample', description: 'Teste com po-table-component sample.' }
  ];
}
