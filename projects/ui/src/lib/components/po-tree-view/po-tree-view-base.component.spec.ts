import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoThemeA11yEnum } from '../../services';
import { PoTreeViewModule } from './po-tree-view.module';
import { PoTreeViewComponent } from './po-tree-view.component';

describe('PoTreeViewBaseComponent:', () => {
  let component: PoTreeViewComponent;
  let fixture: ComponentFixture<PoTreeViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoTreeViewModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTreeViewComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof PoTreeViewComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    describe('p-components-size', () => {
      beforeEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      it('should return medium when accessibility is AAA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);
        component['_componentsSize'] = undefined;
        expect(component['componentsSize']).toBe('medium');
      });

      it('should return small when accessibility is AA and default size is small', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'small');
        component['_componentsSize'] = undefined;
        expect(component['componentsSize']).toBe('small');
      });

      it('should return medium when accessibility is AA and default size is medium', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'medium');
        component['_componentsSize'] = undefined;
        expect(component['componentsSize']).toBe('medium');
      });

      it('onThemeChange: should call applySizeBasedOnA11y', () => {
        spyOn<any>(component, 'applySizeBasedOnA11y');
        component['onThemeChange']();
        expect((component as any).applySizeBasedOnA11y).toHaveBeenCalled();
      });
    });

    it('p-items: should return empty array if items is not array', () => {
      component['items'] = undefined;
      expect(component['items']).toEqual([]);
    });

    it('p-items: should call getItemsByMaxLevel if items is array', () => {
      const expectedValue = [{ label: 'Nível 01', value: 1 }];
      const spyGetItemsByMaxLevel = spyOn(component, <any>'getItemsByMaxLevel').and.callThrough();

      component['items'] = expectedValue;

      expect(spyGetItemsByMaxLevel).toHaveBeenCalled();
      expect(component['items']).toEqual(expectedValue);
    });

    it('p-selectable: should be false by default', () => {
      expect(component.selectable()).toBe(false);
    });

    it('p-selectable: should set to true', () => {
      fixture.componentRef.setInput('p-selectable', true);
      expect(component.selectable()).toBe(true);
    });

    it('p-max-level: should be 4 by default', () => {
      expect(component.maxLevel()).toBe(4);
    });

    it('p-max-level: should set to provided value', () => {
      fixture.componentRef.setInput('p-max-level', 2);
      expect(component.maxLevel()).toBe(2);
    });

    it('p-single-select: should be false by default', () => {
      expect(component.singleSelect()).toBe(false);
    });

    it('p-single-select: should set to true', () => {
      fixture.componentRef.setInput('p-single-select', true);
      expect(component.singleSelect()).toBe(true);
    });

    it('p-disabled: should be false by default', () => {
      expect(component.disabled()).toBe(false);
    });

    it('p-disabled: should set to true', () => {
      fixture.componentRef.setInput('p-disabled', true);
      expect(component.disabled()).toBe(true);
    });
  });

  describe('Methods: ', () => {
    it('emitExpanded: should call collapsed.emit if treeViewItem.expanded is false', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, expanded: false };
      const spyCollapsedEmit = spyOn(component['collapsed'], 'emit');

      component['emitExpanded'](treeViewItem);

      expect(spyCollapsedEmit).toHaveBeenCalledWith(treeViewItem);
    });

    it('emitExpanded: should call expanded.emit if treeViewItem.expanded is true', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, expanded: true };
      const spyExpandedEmit = spyOn(component['expanded'], 'emit');

      component['emitExpanded'](treeViewItem);

      expect(spyExpandedEmit).toHaveBeenCalledWith(treeViewItem);
    });

    it('emitSelected: should not emit if item is disabled', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, selected: true, disabled: true };
      const spySelectedEmit = spyOn(component['selected'], 'emit');

      component['emitSelected'](treeViewItem);

      expect(spySelectedEmit).not.toHaveBeenCalled();
    });

    it('emitSelected: should call selected.emit if treeViewItem.selected is true', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, selected: true };
      const spySelectedEmit = spyOn(component['selected'], 'emit');
      spyOn(component, <any>'updateItemsOnSelect');

      component['emitSelected'](treeViewItem);

      expect(spySelectedEmit).toHaveBeenCalledWith(treeViewItem);
    });

    it('emitSelected: should call unselected.emit if treeViewItem.selected is false', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, selected: false };
      const spyUnselectedEmit = spyOn(component['unselected'], 'emit');
      spyOn(component, <any>'updateItemsOnSelect');

      component['emitSelected'](treeViewItem);

      expect(spyUnselectedEmit).toHaveBeenCalledWith(treeViewItem);
    });

    it('emitSelected: should emit item with all properties (including subItems) when singleSelect', () => {
      fixture.componentRef.setInput('p-single-select', true);
      const treeViewItem = { label: 'Nível 01', value: 1, selected: true, subItems: [{ label: 'X', value: 2 }] };

      const spySelectedEmit = spyOn(component['selected'], 'emit');
      spyOn(component, <any>'updateItemsOnSelect');

      component['emitSelected'](treeViewItem);

      expect(spySelectedEmit).toHaveBeenCalledWith({ ...treeViewItem });
    });

    it('emitSelected: should not propagate selection to subItems internally when singleSelect', () => {
      fixture.componentRef.setInput('p-single-select', true);
      const treeViewItem = { label: 'Nível 01', value: 1, selected: true, subItems: [{ label: 'X', value: 2 }] };

      const spyUpdate = spyOn(component, <any>'updateItemsOnSelect');
      spyOn(component['selected'], 'emit');

      component['emitSelected'](treeViewItem);

      const updateArg = <any>spyUpdate.calls.mostRecent().args[0];
      expect(updateArg.subItems).toBeUndefined();
    });

    it('getItemsByMaxLevel: should return empty array if no params', () => {
      expect(component['getItemsByMaxLevel']()).toEqual([]);
    });

    it('getItemsByMaxLevel: should respect max level', () => {
      fixture.componentRef.setInput('p-max-level', 2);

      const items = [
        {
          label: 'L1',
          value: 1,
          subItems: [{ label: 'L2', value: 2, subItems: [{ label: 'L3', value: 3 }] }]
        }
      ];

      const result = component['getItemsByMaxLevel'](items);

      expect(result).toHaveSize(1);
      expect(result[0].subItems).toHaveSize(1);
      expect(result[0].subItems[0].subItems).toBeUndefined();
    });

    it('getItemsByMaxLevel: should set disabled=true when p-disabled is true', () => {
      fixture.componentRef.setInput('p-disabled', true);

      const items = [{ label: 'A', value: 1 }];
      const result = component['getItemsByMaxLevel'](items);

      expect(result[0].disabled).toBe(true);
    });

    it('getItemsByMaxLevel: should convert isSelectable=false to disabled=true', () => {
      const items = [{ label: 'A', value: 1, isSelectable: false }];
      const result = component['getItemsByMaxLevel'](items);

      expect(result[0].disabled).toBe(true);
    });

    it('addItem: should add childItem to items when no parentItem', () => {
      const childItem = { label: 'A', value: 1 };
      const items = [];

      component['addItem'](items, childItem);

      expect(items).toEqual([childItem]);
    });

    it('addItem: should add parentItem and call addChildItemInParent when parentItem exists', () => {
      const childItem = { label: 'B', value: 2 };
      const parentItem = { label: 'A', value: 1 };
      const items = [];

      const spyAddChild = spyOn(component, <any>'addChildItemInParent');

      component['addItem'](items, childItem, parentItem);

      expect(items).toEqual([parentItem]);
      expect(spyAddChild).toHaveBeenCalledWith(childItem, parentItem);
    });

    it('addItem: should call expandParentItem when isNewItem is true', () => {
      const childItem = { label: 'B', value: 2, expanded: true };
      const parentItem = { label: 'A', value: 1 };
      const items = [];

      const spyExpand = spyOn(component, <any>'expandParentItem');

      component['addItem'](items, childItem, parentItem, true);

      expect(spyExpand).toHaveBeenCalledWith(childItem, parentItem);
    });

    it('addChildItemInParent: should create subItems array and add child', () => {
      const childItem = { label: 'B', value: 2 };
      const parentItem = { label: 'A', value: 1, subItems: undefined };

      component['addChildItemInParent'](childItem, parentItem);

      expect(parentItem.subItems).toEqual([childItem]);
    });

    it('expandParentItem: should set parent expanded when child is expanded', () => {
      const childItem = { label: 'B', value: 2, expanded: true };
      const parentItem = { label: 'A', value: 1, expanded: false };

      component['expandParentItem'](childItem, parentItem);

      expect(parentItem.expanded).toBe(true);
    });

    it('expandParentItem: should not change parent if child is not expanded', () => {
      const childItem = { label: 'B', value: 2, expanded: false };
      const parentItem = { label: 'A', value: 1, expanded: false };

      component['expandParentItem'](childItem, parentItem);

      expect(parentItem.expanded).toBe(false);
    });

    it('selectAllItems: should select all items recursively', () => {
      const items = [{ label: 'A', value: 1, selected: false, subItems: [{ label: 'B', value: 2, selected: false }] }];

      component['selectAllItems'](items, true);

      expect(items[0].selected).toBe(true);
      expect(items[0].subItems[0].selected).toBe(true);
    });

    it('selectAllItems: should unselect all items recursively', () => {
      const items = [{ label: 'A', value: 1, selected: true, subItems: [{ label: 'B', value: 2, selected: true }] }];

      component['selectAllItems'](items, false);

      expect(items[0].selected).toBe(false);
      expect(items[0].subItems[0].selected).toBe(false);
    });

    it('selectAllItems: should keep selected false when isSelectable is false', () => {
      const items = [{ label: 'A', value: 1, selected: false, isSelectable: false }];

      component['selectAllItems'](items, true);

      expect(items[0].selected).toBe(false);
    });

    it('everyItemSelected: should return true if all items selected', () => {
      const items = [
        { label: 'A', selected: true },
        { label: 'B', selected: true }
      ];
      expect(component['everyItemSelected'](items as any)).toBe(true);
    });

    it('everyItemSelected: should return false if no items selected', () => {
      const items = [
        { label: 'A', selected: false },
        { label: 'B', selected: false }
      ];
      expect(component['everyItemSelected'](items as any)).toBe(false);
    });

    it('everyItemSelected: should return null if some items selected (indeterminate)', () => {
      const items = [
        { label: 'A', selected: true },
        { label: 'B', selected: false }
      ];
      expect(component['everyItemSelected'](items as any)).toBeNull();
    });

    it('everyItemSelected: should return null if any item is null', () => {
      const items = [
        { label: 'A', selected: null },
        { label: 'B', selected: false }
      ];
      expect(component['everyItemSelected'](items as any)).toBeNull();
    });

    it('everyItemSelected: should return false if items is undefined', () => {
      expect(component['everyItemSelected']()).toBe(false);
    });

    it('updateItemsOnSelect: should call selectAllItems when item has subItems', () => {
      const selectedItem = { label: 'A', value: 1, selected: true, subItems: [{ label: 'B', value: 2 }] };
      component['items'] = [selectedItem];

      const spySelectAll = spyOn(component, <any>'selectAllItems');
      spyOn(component, <any>'getItemsWithParentSelected').and.returnValue([selectedItem]);

      component['updateItemsOnSelect'](selectedItem);

      expect(spySelectAll).toHaveBeenCalledWith(selectedItem.subItems, true);
    });

    it('updateItemsOnSelect: should not call selectAllItems when singleSelect', () => {
      fixture.componentRef.setInput('p-single-select', true);
      const selectedItem = { label: 'A', value: 1, selected: true, subItems: [{ label: 'B', value: 2 }] };
      component['items'] = [selectedItem];

      const spySelectAll = spyOn(component, <any>'selectAllItems');
      spyOn(component, <any>'getItemsWithParentSelected').and.returnValue([selectedItem]);

      component['updateItemsOnSelect'](selectedItem);

      expect(spySelectAll).not.toHaveBeenCalled();
    });

    it('getItemsWithParentSelected: should return empty array for undefined', () => {
      expect(component['getItemsWithParentSelected'](undefined)).toEqual([]);
    });

    it('getItemsWithParentSelected: should reconstruct items with parent selection', () => {
      const items = [{ label: 'A', value: '1', subItems: [{ label: 'B', value: '2', selected: true }] }];

      const result = component['getItemsWithParentSelected'](items);

      expect(result).toHaveSize(1);
      expect(result[0].selected).toBe(true);
    });

    it('applySizeBasedOnA11y: should set _componentsSize', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
      component['applySizeBasedOnA11y']('small');
      expect(component['_componentsSize']).toBe('small');
    });

    it('constructor effect: should call applySizeBasedOnA11y when componentsSizeInput changes', () => {
      spyOn<any>(component, 'applySizeBasedOnA11y');
      fixture.componentRef.setInput('p-components-size', 'small');
      fixture.detectChanges();
      expect((component as any).applySizeBasedOnA11y).toHaveBeenCalled();
    });
  });

  describe('p-no-border: ', () => {
    it('should be false by default', () => {
      expect(component.noBorder()).toBe(false);
    });

    it('should apply p-no-border binding when set to true', () => {
      fixture.componentRef.setInput('p-no-border', true);
      fixture.detectChanges();
      expect(component.noBorder()).toBe(true);
    });
  });

  describe('emitActivated: ', () => {
    it('should call selectSingleFinalItem and emit activated when not selectable', () => {
      const treeViewItem = { label: 'A', value: 1 };
      const spySelectSingle = spyOn(component, <any>'selectSingleFinalItem');
      const spyActivatedEmit = spyOn(component['activated'], 'emit');

      component['emitActivated'](treeViewItem);

      expect(spySelectSingle).toHaveBeenCalledWith(treeViewItem);
      expect(spyActivatedEmit).toHaveBeenCalledWith({ ...treeViewItem });
    });

    it('should only emit activated (not select) when selectable', () => {
      fixture.componentRef.setInput('p-selectable', true);
      const treeViewItem = { label: 'A', value: 1 };
      const spySelectSingle = spyOn(component, <any>'selectSingleFinalItem');
      const spyActivatedEmit = spyOn(component['activated'], 'emit');

      component['emitActivated'](treeViewItem);

      expect(spySelectSingle).not.toHaveBeenCalled();
      expect(spyActivatedEmit).toHaveBeenCalledWith({ ...treeViewItem });
    });
  });

  describe('selectSingleFinalItem: ', () => {
    it('should mark the final item, set selectedValue and rebuild _items', () => {
      component['items'] = [
        { label: 'A', value: 1 },
        { label: 'B', value: 2 }
      ];

      component['selectSingleFinalItem']({ label: 'B', value: 2 });

      expect(component.selectedValue).toBe(2);
      const itemA = component['items'].find(item => item.value === 1);
      const itemB = component['items'].find(item => item.value === 2);
      expect(itemA['selected']).toBe(false);
      expect(itemB['selected']).toBe(true);
    });
  });

  describe('setSingleFinalSelection: ', () => {
    it('should mark selected only on the final item whose value matches (recursive)', () => {
      const items = [
        {
          label: 'A',
          value: 1,
          subItems: [
            { label: 'B', value: 2 },
            { label: 'C', value: 3 }
          ]
        }
      ];

      component['setSingleFinalSelection'](items, 3);

      expect(items[0].subItems[0]['selected']).toBe(false);
      expect(items[0].subItems[1]['selected']).toBe(true);
    });

    it('should return without error for empty items', () => {
      expect(() => component['setSingleFinalSelection']([], 1)).not.toThrow();
    });
  });

  describe('getExpandedState: ', () => {
    it('should return a map only with grouping items (with subItems)', () => {
      const items = [
        { label: 'A', value: 1, expanded: true, subItems: [{ label: 'B', value: 2 }] },
        { label: 'C', value: 3 }
      ];

      const state = component['getExpandedState'](items);

      expect(state.get(1)).toBe(true);
      expect(state.has(3)).toBe(false);
    });

    it('should store false for grouping items that are not expanded', () => {
      const items = [{ label: 'A', value: 1, subItems: [{ label: 'B', value: 2 }] }];

      const state = component['getExpandedState'](items);

      expect(state.get(1)).toBe(false);
    });

    it('should return empty map for empty items', () => {
      expect(component['getExpandedState']().size).toBe(0);
    });
  });

  describe('applyExpandedState: ', () => {
    it('should return early when state is empty', () => {
      const items = [{ label: 'A', value: 1, expanded: false, subItems: [{ label: 'B', value: 2 }] }];

      component['applyExpandedState'](items, new Map());

      expect(items[0].expanded).toBe(false);
    });

    it('should reapply expanded by value (recursive) when state has entries', () => {
      const items = [
        {
          label: 'A',
          value: 1,
          expanded: false,
          subItems: [{ label: 'B', value: 2, expanded: false, subItems: [{ label: 'C', value: 3 }] }]
        }
      ];

      const state = new Map<string | number, boolean>([
        [1, true],
        [2, true]
      ]);

      component['applyExpandedState'](items, state);

      expect(items[0].expanded).toBe(true);
      expect(items[0].subItems[0].expanded).toBe(true);
    });
  });

  describe('getSelectedState: ', () => {
    it('should return selected ?? false for all items (recursive)', () => {
      const items = [
        { label: 'A', value: 1, selected: true },
        { label: 'B', value: 2, selected: false },
        { label: 'C', value: 3, selected: null },
        { label: 'D', value: 4, subItems: [{ label: 'E', value: 5 }] }
      ];

      const state = component['getSelectedState'](items);

      expect(state.get(1)).toBe(true);
      expect(state.get(2)).toBe(false);
      // selected null -> ?? false
      expect(state.get(3)).toBe(false);
      // item sem selected (undefined) -> ?? false
      expect(state.get(4)).toBe(false);
      // subItem incluído recursivamente
      expect(state.get(5)).toBe(false);
    });

    it('should return empty map for empty items', () => {
      expect(component['getSelectedState']().size).toBe(0);
    });
  });

  describe('applySelectedState: ', () => {
    it('should return early when state is empty', () => {
      const items = [{ label: 'A', value: 1, selected: false }];

      component['applySelectedState'](items, new Map());

      expect(items[0].selected).toBe(false);
    });

    it('should reapply selected by value (recursive) when state has entries', () => {
      const items = [
        {
          label: 'A',
          value: 1,
          selected: false,
          subItems: [{ label: 'B', value: 2, selected: false }]
        }
      ];

      const state = new Map<string | number, boolean | null>([
        [1, true],
        [2, true]
      ]);

      component['applySelectedState'](items, state);

      expect(items[0].selected).toBe(true);
      expect(items[0].subItems[0].selected).toBe(true);
    });
  });

  describe('getLastSelectedFinalItemValue: ', () => {
    it('should return the value of the last selected final item (recursive)', () => {
      const items = [
        { label: 'A', value: 1, subItems: [{ label: 'B', value: 2, selected: true }] },
        { label: 'C', value: 3, selected: true }
      ];

      expect(component['getLastSelectedFinalItemValue'](items as any)).toBe(3);
    });

    it('should return a nested final value when only a child is selected', () => {
      const items = [{ label: 'A', value: 1, subItems: [{ label: 'B', value: 2, selected: true }] }];

      expect(component['getLastSelectedFinalItemValue'](items as any)).toBe(2);
    });

    it('should return undefined when no final item is selected', () => {
      const items = [{ label: 'A', value: 1, subItems: [{ label: 'B', value: 2, selected: false }] }];

      expect(component['getLastSelectedFinalItemValue'](items as any)).toBeUndefined();
    });

    it('should return undefined and use default empty array when items is undefined', () => {
      expect(component['getLastSelectedFinalItemValue']()).toBeUndefined();
    });
  });

  describe('items setter branches: ', () => {
    it('should keep single final selection when not selectable and there is a selected final item', () => {
      component['items'] = [
        { label: 'A', value: 1 },
        { label: 'B', value: 2, selected: true }
      ];

      expect(component.selectedValue).toBe(2);
      expect(component['items'].find(item => item.value === 2).selected).toBe(true);
      expect(component['items'].find(item => item.value === 1).selected).toBe(false);
    });

    it('should not force single selection when not selectable and no final item is selected', () => {
      const spySetSingle = spyOn(component, <any>'setSingleFinalSelection').and.callThrough();

      component['items'] = [{ label: 'A', value: 1 }];

      expect(spySetSingle).not.toHaveBeenCalled();
    });

    it('should not reapply selected state when selectable and singleSelect', () => {
      fixture.componentRef.setInput('p-selectable', true);
      fixture.componentRef.setInput('p-single-select', true);

      const spyApplySelected = spyOn(component, <any>'applySelectedState');

      component['items'] = [{ label: 'A', value: 1, selected: true }];

      expect(spyApplySelected).not.toHaveBeenCalled();
    });

    it('should reapply selected state via applySelectedState when selectable and not singleSelect', () => {
      fixture.componentRef.setInput('p-selectable', true);

      component['items'] = [{ label: 'A', value: 1, selected: true }];

      const spyApplySelected = spyOn(component, <any>'applySelectedState').and.callThrough();

      component['items'] = [{ label: 'A', value: 1, selected: false }];

      expect(spyApplySelected).toHaveBeenCalled();
      expect(component['items'][0].selected).toBe(true);
    });

    it('should preserve expanded state when items is reassigned a second time', () => {
      fixture.componentRef.setInput('p-selectable', true);

      component['items'] = [{ label: 'A', value: 1, expanded: true, subItems: [{ label: 'B', value: 2 }] }];
      expect(component['items'][0].expanded).toBe(true);

      component['items'] = [{ label: 'A', value: 1, expanded: false, subItems: [{ label: 'B', value: 2 }] }];
      expect(component['items'][0].expanded).toBe(true);
    });
  });
});
