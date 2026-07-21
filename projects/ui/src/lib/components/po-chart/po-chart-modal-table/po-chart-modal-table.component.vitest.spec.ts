/**
 * NOTA: O PoChartModalTableComponent é standalone e importa PoModalModule + PoTableModule.
 * O PoTableModule possui uma árvore de dependências muito pesada que trava a compilação JIT
 * do Angular no ambiente Vitest/jsdom. Por isso, mockamos esses módulos aqui para permitir
 * importar e testar o componente isoladamente (instanciação e binding de propriedades).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dos módulos pesados para evitar o deadlock na compilação JIT
vi.mock('../../po-modal', () => ({
  PoModalModule: class PoModalModule {},
  PoModalComponent: class PoModalComponent {}
}));

vi.mock('../../po-table', () => ({
  PoTableModule: class PoTableModule {}
}));

import { PoChartModalTableComponent } from './po-chart-modal-table.component';

describe('PoChartModalTableComponent', () => {
  let component: PoChartModalTableComponent;

  beforeEach(() => {
    component = new PoChartModalTableComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind inputs correctly', () => {
    const title = 'Meu título';
    const items = [{ name: 'Item 1' }, { name: 'Item 2' }];
    const columns = [{ property: 'name', label: 'Nome' }];
    const action = { label: 'Fechar', action: vi.fn() };

    component.title = title;
    component.itemsTable = items;
    component.columnsTable = columns;
    component.actionModal = action;

    expect(component.title).toBe(title);
    expect(component.itemsTable).toEqual(items);
    expect(component.columnsTable).toEqual(columns);
    expect(component.actionModal).toEqual(action);
  });
});
