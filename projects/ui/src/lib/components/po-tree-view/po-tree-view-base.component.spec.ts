import { expectPropertiesValues } from '../../util-test/util-expect.spec';

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

    it('p-selectable: should update property with `true` if valid values', () => {
      const validValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'selectable', validValues, true);
    });

    it('p-selectable: should update property with `false` if invalid values', () => {
      const invalidValues = [10, 0.5, 'test', undefined];

      expectPropertiesValues(component, 'selectable', invalidValues, false);
    });
  });

  describe('Methods: ', () => {
    it('emitExpanded: should call collapsed.emit with tree view item if treeViewItem.expanded is false', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, expanded: false };

      const spyCollapsedEmit = spyOn(component['collapsed'], 'emit');

      component['emitExpanded'](treeViewItem);

      expect(spyCollapsedEmit).toHaveBeenCalledWith(treeViewItem);
    });

    it('emitExpanded: should call expanded.emit with tree view item if treeViewItem.expanded is true', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, expanded: true };

      const spyExpandedEmit = spyOn(component['expanded'], 'emit');

      component['emitExpanded'](treeViewItem);

      expect(spyExpandedEmit).toHaveBeenCalledWith(treeViewItem);
    });

    it('emitSelected: should call unselected.emit with tree view item if treeViewItem.selected is false', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, selected: false };

      const spyUpdateItemsOnSelect = spyOn(component, <any>'updateItemsOnSelect');
      const spyUnselectedEmit = spyOn(component['unselected'], 'emit');

      component['emitSelected'](treeViewItem);

      expect(spyUnselectedEmit).toHaveBeenCalledWith(treeViewItem);
      expect(spyUpdateItemsOnSelect).toHaveBeenCalledWith(treeViewItem);
    });

    it('emitSelected: should call selected.emit with tree view item if treeViewItem.selected is true', () => {
      const treeViewItem = { label: 'Nível 01', value: 1, selected: true };

      const spyUpdateItemsOnSelect = spyOn(component, <any>'updateItemsOnSelect');
      const spySelectedEmit = spyOn(component['selected'], 'emit');

      component['emitSelected'](treeViewItem);

      expect(spySelectedEmit).toHaveBeenCalledWith(treeViewItem);
      expect(spyUpdateItemsOnSelect).toHaveBeenCalledWith(treeViewItem);
    });

    it('getItemsByMaxLevel: should return and not call addItem if level is 4', () => {
      const items = [];

      const spyAddItem = spyOn(component, <any>'addItem');

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
        {
          label: 'Nivel 01',
          value: 1,
          subItems: [
            {
              label: 'Nivel 02',
              value: 2,
              subItems: [
                {
                  label: 'Nivel 03',
                  value: 3,
                  subItems: [
                    {
                      label: 'Nivel 04',
                      value: 4,
                      subItems: [{ label: 'Nivel 05', value: 5, subItems: [{ label: 'Nivel 06', value: 6 }] }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];

      const expectedValue = [
        {
          label: 'Nivel 01',
          value: 1,
          selected: false,
          subItems: [
            {
              label: 'Nivel 02',
              value: 2,
              selected: false,
              subItems: [{ label: 'Nivel 03', value: 3, selected: false, subItems: [{ label: 'Nivel 04', value: 4 }] }]
            }
          ]
        }
      ];

      const spyAddItem = spyOn(component, <any>'addItem').and.callThrough();
      const spyGetItemsByMaxLevel = spyOn(component, <any>'getItemsByMaxLevel').and.callThrough();

      const itemsByMaxLavel = component['getItemsByMaxLevel'](unlimitedItems);

      expect(itemsByMaxLavel).toEqual(expectedValue);
      expect(spyAddItem).toHaveBeenCalled();
      expect(spyGetItemsByMaxLevel).toHaveBeenCalledTimes(5);
    });

    it('addItem: should add childItem in items and not call expandParentItem and addChildItemInParent if parentIf is falsy', () => {
      const childItem = { label: 'Nível 01', value: 1 };
      const items = [];

      const expectedValue = [childItem];

      const spyExpandParentItem = spyOn(component, <any>'expandParentItem');
      const spyAddChildItemInParent = spyOn(component, <any>'addChildItemInParent');

      component['addItem'](items, childItem);

      expect(items.length).toBe(1);
      expect(items).toEqual(expectedValue);
      expect(spyAddChildItemInParent).not.toHaveBeenCalled();
      expect(spyExpandParentItem).not.toHaveBeenCalled();
    });

    it('addItem: should add parentItem in items and call expandParentItem, addChildItemInParent and selectItemBySubItems', () => {
      const childItem = { label: 'Nível 02', value: 2 };
      const parentItem = { label: 'Nível 01', value: 1 };
      const items = [];

      const expectedValue = [parentItem];

      const spyExpandParentItem = spyOn(component, <any>'expandParentItem');
      const spyAddChildItemInParent = spyOn(component, <any>'addChildItemInParent');
      const spySelectItemBySubItems = spyOn(component, <any>'selectItemBySubItems');

      component['addItem'](items, childItem, parentItem);

      expect(items.length).toBe(1);
      expect(items).toEqual(expectedValue);
      expect(spySelectItemBySubItems).toHaveBeenCalledWith(parentItem);
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
      const parentItem = { label: 'Nivel 01', value: 1, subItems: [{ label: 'Nivel 011', value: 111 }] };

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

    it('updateItemsOnSelect: shouldn`t call selectAllItems if selectedItem hasn`t subItems', () => {
      const selectedItem = { label: 'Label 01', value: '01' };
      const items = [selectedItem];
      component.items = items;

      const spyGetItemsWithParentSelected = spyOn(component, <any>'getItemsWithParentSelected').and.returnValue(items);
      const spySelect = spyOn(component, <any>'selectAllItems');

      component['updateItemsOnSelect'](selectedItem);

      expect(spySelect).not.toHaveBeenCalled();
      expect(spyGetItemsWithParentSelected).toHaveBeenCalledWith(component.items);
    });

    it('updateItemsOnSelect: should call selectAllItems if selectedItem has subItems and call getItemsWithParentSelected', () => {
      const selectedItem = {
        label: 'Label 01',
        value: '01',
        selected: true,
        subItems: [{ label: 'Label 01.1', value: '01.1' }]
      };
      const items = [selectedItem];
      component.items = items;

      const spyGetItemsWithParentSelected = spyOn(component, <any>'getItemsWithParentSelected').and.returnValue(items);
      const spySelect = spyOn(component, <any>'selectAllItems');

      component['updateItemsOnSelect'](selectedItem);

      expect(spySelect).toHaveBeenCalledWith(selectedItem.subItems, selectedItem.selected);
      expect(spyGetItemsWithParentSelected).toHaveBeenCalledWith(component.items);
    });

    it('selectAllItems: should select all items if isSelected is true', () => {
      const items = [
        {
          label: 'Nivel 01',
          value: 1,
          selected: false,
          subItems: [
            {
              label: 'Nivel 02',
              value: 2,
              selected: true,
              subItems: [
                {
                  label: 'Nivel 03',
                  value: 3,
                  selected: false,
                  subItems: [{ label: 'Nivel 04', value: 4, selected: false }]
                }
              ]
            }
          ]
        }
      ];

      const expectedItems = [
        {
          label: 'Nivel 01',
          value: 1,
          selected: true,
          subItems: [
            {
              label: 'Nivel 02',
              value: 2,
              selected: true,
              subItems: [
                {
                  label: 'Nivel 03',
                  value: 3,
                  selected: true,
                  subItems: [{ label: 'Nivel 04', value: 4, selected: true }]
                }
              ]
            }
          ]
        }
      ];

      const isSelected = true;

      component['selectAllItems'](items, isSelected);

      expect(items).toEqual(expectedItems);
    });

    it('selectAllItems: should unselect all items if isSelected is false', () => {
      const items = [
        {
          label: 'Nivel 01',
          value: 1,
          selected: true,
          subItems: [
            {
              label: 'Nivel 02',
              value: 2,
              selected: true,
              subItems: [
                {
                  label: 'Nivel 03',
                  value: 3,
                  selected: true,
                  subItems: [{ label: 'Nivel 04', value: 4, selected: true }]
                }
              ]
            }
          ]
        }
      ];

      const expectedItems = [
        {
          label: 'Nivel 01',
          value: 1,
          selected: false,
          subItems: [
            {
              label: 'Nivel 02',
              value: 2,
              selected: false,
              subItems: [
                {
                  label: 'Nivel 03',
                  value: 3,
                  selected: false,
                  subItems: [{ label: 'Nivel 04', value: 4, selected: false }]
                }
              ]
            }
          ]
        }
      ];

      const isSelected = false;

      component['selectAllItems'](items, isSelected);

      expect(items).toEqual(expectedItems);
    });

    it('selectItemBySubItems: should call everyItemSelected with subitems to set item.selected', () => {
      const subItems = [
        { label: 'SubItem 1', selected: true },
        { label: 'SubItem 2', selected: true },
        { label: 'SubItem 3', selected: true },
        { label: 'SubItem 4', selected: true },
        { label: 'SubItem 5', selected: true }
      ];

      const item = { label: 'Item 1', value: 1, subItems, selected: undefined };

      spyOn(component, <any>'everyItemSelected').and.returnValue(true);

      component['selectItemBySubItems'](<any>item);

      expect(component['everyItemSelected']).toHaveBeenCalledWith(<any>item.subItems);
      expect(item.selected).toBe(true);
    });

    it('everyItemSelected: should return false if items param is undefined', () => {
      expect(component['everyItemSelected']()).toBe(false);
    });

    it('everyItemSelected: should return true if all items are selected', () => {
      const items = [
        { label: 'Item 1', selected: true },
        { label: 'Item 2', selected: true },
        { label: 'Item 3', selected: true },
        { label: 'Item 4', selected: true },
        { label: 'Item 5', selected: true }
      ];

      expect(component['everyItemSelected'](<any>items)).toBe(true);
    });

    it('everyItemSelected: should return null if any item is null', () => {
      const items = [
        { label: 'Item 1', selected: true },
        { label: 'Item 2', selected: true },
        { label: 'Item 3', selected: true },
        { label: 'Item 4', selected: null },
        { label: 'Item 5', selected: true }
      ];

      expect(component['everyItemSelected'](<any>items)).toBe(null);
    });

    it('everyItemSelected: should return null if all items are null', () => {
      const items = [
        { label: 'Item 1', selected: null },
        { label: 'Item 2', selected: null },
        { label: 'Item 3', selected: null },
        { label: 'Item 4', selected: null },
        { label: 'Item 5', selected: null }
      ];

      expect(component['everyItemSelected'](<any>items)).toBe(null);
    });

    it('everyItemSelected: should return null if any items are selected', () => {
      const items = [
        { label: 'Item 1', selected: false },
        { label: 'Item 2', selected: false },
        { label: 'Item 3', selected: true },
        { label: 'Item 4', selected: false },
        { label: 'Item 5', selected: false }
      ];

      expect(component['everyItemSelected'](<any>items)).toBe(null);
    });

    it('everyItemSelected: should return false if no true or null items', () => {
      const items = [
        { label: 'Item 1', selected: false },
        { label: 'Item 2', selected: false },
        { label: 'Item 3', selected: undefined },
        { label: 'Item 4', selected: false },
        { label: 'Item 5', selected: false }
      ];

      expect(component['everyItemSelected'](<any>items)).toBe(false);
    });

    describe('getItemsWithParentSelected:', () => {
      it('should return [] and not call addItem if items is undefined', () => {
        const spyAddItem = spyOn(component, <any>'addItem');

        const items = component['getItemsWithParentSelected'](undefined, undefined, [1]);

        expect(items).toEqual([1]);
        expect(spyAddItem).not.toHaveBeenCalled();
      });

      it('should call only 1 time getItemsWithParentSelected if items hasn`t subItems', () => {
        const items = [{ label: 'Item 1', value: '1' }];

        const spyAddItem = spyOn(component, <any>'addItem').and.callThrough();
        const spyGetItemsWithParentSelected = spyOn(component, <any>'getItemsWithParentSelected').and.callThrough();

        const itemsWithParentSelected = component['getItemsWithParentSelected'](items);

        expect(itemsWithParentSelected).toEqual(items);
        expect(spyGetItemsWithParentSelected).toHaveBeenCalledTimes(1);
        expect(spyAddItem).toHaveBeenCalled();
      });

      it('should call only 2 time getItemsWithParentSelected if items has subItems ', () => {
        const items = [{ label: 'Item 1', value: '1', subItems: [{ label: 'Item 1.2', value: '1.2' }] }];
        const expectedValue = [
          { label: 'Item 1', value: '1', selected: false, subItems: [{ label: 'Item 1.2', value: '1.2' }] }
        ];

        const spyAddItem = spyOn(component, <any>'addItem').and.callThrough();
        const spyGetItemsWithParentSelected = spyOn(component, <any>'getItemsWithParentSelected').and.callThrough();

        const itemsWithParentSelected = component['getItemsWithParentSelected'](items);

        expect(itemsWithParentSelected).toEqual(expectedValue);
        expect(spyGetItemsWithParentSelected).toHaveBeenCalledTimes(2);
        expect(spyAddItem).toHaveBeenCalled();
      });

      it('should return items with parent selected if child is selected', () => {
        const items = [
          {
            label: 'Item 1',
            value: '1',
            subItems: [{ label: 'Item 1.2', value: '1.2', selected: true }]
          }
        ];

        const expectedValue = [
          {
            label: 'Item 1',
            value: '1',
            selected: true,
            subItems: [{ label: 'Item 1.2', value: '1.2', selected: true }]
          }
        ];

        const itemsWithParentSelected = component['getItemsWithParentSelected'](items);

        expect(itemsWithParentSelected).toEqual(expectedValue);
      });
    });
  });
});
