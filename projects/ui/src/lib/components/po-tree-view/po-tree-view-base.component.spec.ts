import { PoTreeViewBaseComponent } from './po-tree-view-base.component';

describe('PoTreeViewBaseComponent:', () => {

  const component = new PoTreeViewBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoTreeViewBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {

    it('p-items: shouldn`t call getItemsByMaxLevel if items isn`t array and return empty array', () => {
      const spyGetItemsByMaxLevel = spyOn(component, <any>'getItemsByMaxLevel');

      component.items = undefined;

      expect(spyGetItemsByMaxLevel).not.toHaveBeenCalled();
      expect(component.items).toEqual([]);
    });

    it('p-items: should call getItemsByMaxLevel if items is array and return items', () => {
      const expectedValue = [{ label: 'Nível 01', value: 1 }];

      const spyGetItemsByMaxLevel = spyOn(component, <any>'getItemsByMaxLevel').and.callThrough();

      component.items = expectedValue;

      expect(spyGetItemsByMaxLevel).toHaveBeenCalled();
      expect(component.items).toEqual(expectedValue);
    });
  });

  describe('Methods: ', () => {

    it('emitEvent: should call collapsed.emit with tree view item if treeViewItem.expanded is false', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, expanded: false };

      const spyCollapsedEmit = spyOn(component['collapsed'], 'emit');

      component['emitEvent'](treeViewItem);

      expect(spyCollapsedEmit).toHaveBeenCalledWith(treeViewItem);
    });

    it('emitEvent: should call expanded.emit with tree view item if treeViewItem.expanded is true', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, expanded: true };

      const spyExpandedEmit = spyOn(component['expanded'], 'emit');

      component['emitEvent'](treeViewItem);

      expect(spyExpandedEmit).toHaveBeenCalledWith(treeViewItem);
    });

    it('getItemsByMaxLevel: should return and not call addItem if level is 4', () => {
      const items = [];

      const spyAddItem = spyOn(component, <any> 'addItem');

      const itemsByMaxLavel = component['getItemsByMaxLevel'](items, 4);

      expect(itemsByMaxLavel).toEqual(items);
      expect(spyAddItem).not.toHaveBeenCalled();
    });

    it('getItemsByMaxLevel: should return `newItems` if `newItems` has value and `items` is equal `[]`', () => {
      const newItems = [{ item: 'first item' }];

      const itemsByMaxLavel = component['getItemsByMaxLevel']([], undefined, undefined, newItems);

      expect(itemsByMaxLavel).toEqual(newItems);
    });

    it('getItemsByMaxLevel: should return `[]` if has no parameters', () => {
      const itemsByMaxLavel = component['getItemsByMaxLevel']();

      expect(itemsByMaxLavel).toEqual([]);
    });

    it('getItemsByMaxLevel: should return items up to 4 levels', () => {
      const unlimitedItems = [
        { label: 'Nivel 01', value: 1, subItems: [
          { label: 'Nivel 02', value: 2, subItems: [
            { label: 'Nivel 03', value: 3, subItems: [
              { label: 'Nivel 04', value: 4, subItems: [
                { label: 'Nivel 05', value: 5, subItems: [
                  { label: 'Nivel 06', value: 6 }
                ] }
              ] }
            ] }
          ] }
        ] }
      ];

      const expectedValue = [
        { label: 'Nivel 01', value: 1, subItems: [
          { label: 'Nivel 02', value: 2, subItems: [
            { label: 'Nivel 03', value: 3, subItems: [
              { label: 'Nivel 04', value: 4 }
            ] }
          ] }
        ] }
      ];

      const spyAddItem = spyOn(component, <any> 'addItem').and.callThrough();
      const spyGetItemsByMaxLevel = spyOn(component, <any> 'getItemsByMaxLevel').and.callThrough();

      const itemsByMaxLavel = component['getItemsByMaxLevel'](unlimitedItems);

      expect(itemsByMaxLavel).toEqual(expectedValue);
      expect(spyAddItem).toHaveBeenCalled();
      expect(spyGetItemsByMaxLevel).toHaveBeenCalledTimes(5);
    });

    it('addItem: should add childItem in items and not call expandParentItem and addChildItemInParent if parentIf is falsy', () => {
      const childItem = { label: 'Nível 01', value: 1 };
      const items = [];

      const expectedValue = [childItem];

      const spyExpandParentItem = spyOn(component, <any> 'expandParentItem');
      const spyAddChildItemInParent = spyOn(component, <any> 'addChildItemInParent');

      component['addItem'](items, childItem);

      expect(items.length).toBe(1);
      expect(items).toEqual(expectedValue);
      expect(spyAddChildItemInParent).not.toHaveBeenCalled();
      expect(spyExpandParentItem).not.toHaveBeenCalled();
    });

    it('addItem: should add parentItem in items and call expandParentItem and addChildItemInParent', () => {
      const childItem = { label: 'Nível 02', value: 2 };
      const parentItem = { label: 'Nível 01', value: 1 };
      const items = [];

      const expectedValue = [parentItem];

      const spyExpandParentItem = spyOn(component, <any> 'expandParentItem');
      const spyAddChildItemInParent = spyOn(component, <any> 'addChildItemInParent');

      component['addItem'](items, childItem, parentItem);

      expect(items.length).toBe(1);
      expect(items).toEqual(expectedValue);
      expect(spyAddChildItemInParent).toHaveBeenCalledWith(childItem, parentItem);
      expect(spyExpandParentItem).toHaveBeenCalledWith(childItem, parentItem);
    });

    it('addChildItemInParent: should create an empty array in parentItem.subItems if it is falsy and add childItem', () => {
      const childItem = { label: 'Nivel 02', value: 2 };
      const parentItem = { label: 'Nivel 01', value: 1, subItems: undefined };

      component['addChildItemInParent'](childItem, parentItem);

      expect(parentItem.subItems.length).toBe(1);
      expect(parentItem.subItems[0]).toEqual(childItem);
    });

    it('addChildItemInParent: should add childItem in parentItem.subItems', () => {
      const childItem = { label: 'Nivel 02', value: 2 };
      const parentItem = { label: 'Nivel 01', value: 1, subItems: [{ label: 'Nivel 011', value: 111}] };

      component['addChildItemInParent'](childItem, parentItem);

      expect(parentItem.subItems.length).toBe(2);
      expect(parentItem.subItems[1]).toEqual(childItem);
    });

    it('expandParentItem: parentItem.expanded should be true if childItem.expanded is true', () => {
      const childItem = { label: 'Nivel 2', value: 12, expanded: true };
      const parentItem = { label: 'Nivel 1', value: 1, expanded: undefined };

      component['expandParentItem'](childItem, parentItem);

      expect(parentItem.expanded).toBe(true);
    });

    it('expandParentItem: parentItem.expanded should be true if childItem.expanded is false and parentItem.expanded is true', () => {
      const childItem = { label: 'Nivel 2', value: 12, expanded: false };
      const parentItem = { label: 'Nivel 1', value: 1, expanded: true };

      component['expandParentItem'](childItem, parentItem);

      expect(parentItem.expanded).toBe(true);
    });

    it('expandParentItem: parentItem.expanded should be false if childItem.expanded is false', () => {
      const childItem = { label: 'Nivel 2', value: 12, expanded: false };
      const parentItem = { label: 'Nivel 1', value: 1, expanded: false };

      component['expandParentItem'](childItem, parentItem);

      expect(parentItem.expanded).toBe(false);
    });

  });

});
