import * as UtilsFunctions from '../../utils/util';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';

import { PoListViewBaseComponent, poListViewLiteralsDefault } from './po-list-view-base.component';

describe('PoListViewBaseComponent:', () => {
  const languageService: PoLanguageService = new PoLanguageService();
  let component: PoListViewBaseComponent;

  beforeEach(() => {
    component = new PoListViewBaseComponent(languageService);
  });

  describe('Properties:', () => {
    it('p-items: should update property with `[]` if it`s not an array', () => {
      const invalidValues = [undefined, null, 0, '', NaN];
      const expectedValue = [];

      expectPropertiesValues(component, 'items', invalidValues, expectedValue);
    });

    it('p-items: should update property with valid values if is an array', () => {
      const validValues = [[{ id: 1, name: 'register' }], []];

      expectPropertiesValues(component, 'items', validValues, validValues);
    });

    it('p-actions: should update property with `[]` if it`s not an array', () => {
      const invalidValues = [undefined, null, 0, '', NaN];
      const expectedValue = [];

      expectPropertiesValues(component, 'actions', invalidValues, expectedValue);
    });

    it('p-actions: should update property with valid values if is an array', () => {
      const validValues = [[{ label: 'action', action: () => true }], []];

      expectPropertiesValues(component, 'actions', validValues, validValues);
    });

    it('p-height: should update property with valid values', () => {
      const validValues = [0, 5, 200, 1000];

      expectPropertiesValues(component, 'height', validValues, validValues);
    });

    it('p-hide-select-all: should update property with valid values and call `showMainHeader`', () => {
      const validValuesTrue = [true, 'true', 1, ''];
      const validValuesFalse = [false, 'false', 0];

      spyOn(component, <any>'showMainHeader');

      expectPropertiesValues(component, 'hideSelectAll', validValuesTrue, true);
      expectPropertiesValues(component, 'hideSelectAll', validValuesFalse, false);
      expect(component['showMainHeader']).toHaveBeenCalled();
    });

    it('p-hide-select-all: should update property with false if invalid values and call `showMainHeader`', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      spyOn(component, <any>'showMainHeader');

      expectPropertiesValues(component, 'hideSelectAll', invalidValues, false);
      expect(component['showMainHeader']).toHaveBeenCalled();
    });

    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(poListViewLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poListViewLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poListViewLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(poListViewLiteralsDefault.es);
    });

    it('p-literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component.literals = {};

      expect(component.literals).toEqual(poListViewLiteralsDefault.ru);
    });

    it('p-literals: should accept custom literals', () => {
      component['language'] = poLocaleDefault;

      const customLiterals = Object.assign({}, poListViewLiteralsDefault[poLocaleDefault]);

      // Custom some literals
      customLiterals.loadMoreData = 'Load more';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = poLocaleDefault;

      expectPropertiesValues(component, 'literals', invalidValues, poListViewLiteralsDefault[poLocaleDefault]);
    });

    it('p-select: should update property with valid values and call `showMainHeader`', () => {
      const validValuesTrue = [true, 'true', 1, ''];
      const validValuesFalse = [false, 'false', 0];

      spyOn(component, <any>'showMainHeader');

      expectPropertiesValues(component, 'select', validValuesTrue, true);
      expectPropertiesValues(component, 'select', validValuesFalse, false);
      expect(component['showMainHeader']).toHaveBeenCalled();
    });

    it('p-select: should update property with false if invalid values and call `showMainHeader`', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      spyOn(component, <any>'showMainHeader');

      expectPropertiesValues(component, 'select', invalidValues, false);
      expect(component['showMainHeader']).toHaveBeenCalled();
    });

    it('p-show-more-disabled: should update property `p-show-more-disabled` with valid values', () => {
      const validValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'showMoreDisabled', validValues, true);
    });

    it('p-show-more-disabled: should update property `p-show-more-disabled` with `false` if invalid values', () => {
      const invalidValues = [undefined, null, 2, 'string', 0, NaN];

      expectPropertiesValues(component, 'showMoreDisabled', invalidValues, false);
    });
  });

  describe('Methods:', () => {
    const item = { id: 1, name: 'Register 1' };

    it('onClickAction: should call `listViewAction.action` with item parameter', () => {
      const listViewAction = { label: 'Action 1', action: arg => {} };

      spyOn(component, <any>'deleteInternalAttrs').and.returnValue(item);
      spyOn(listViewAction, 'action');

      component.onClickAction(listViewAction, item);

      expect(listViewAction.action).toHaveBeenCalledWith(item);
      expect(component['deleteInternalAttrs']).toHaveBeenCalled();
    });

    it('onClickAction: should not call `listViewAction.action`', () => {
      const listViewAction = { label: 'Action 1' };

      spyOn(component, <any>'deleteInternalAttrs').and.returnValue(item);

      component.onClickAction(listViewAction, item);

      expect(component['deleteInternalAttrs']).toHaveBeenCalled();
    });

    it('onShowMore: should call `showMore.emit`', () => {
      spyOn(component.showMore, <any>'emit');

      component.onShowMore();

      expect(component.showMore.emit).toHaveBeenCalled();
    });

    it('selectAllListItems: should select all list items', () => {
      component.items = [
        { name: 'Name 1', email: 'email 1' },
        { name: 'Name 2', email: 'email 2' }
      ];
      component.items.forEach(listItem => (listItem.$selected = false));

      component.select = true;
      component.hideSelectAll = false;

      component.selectAllListItems();

      component.items.forEach(listItem => expect(listItem.$selected).toBe(true));
    });

    it('selectAllListItems: should not select all list items if hide select all is active', () => {
      component.items = [
        { name: 'Name 1', email: 'email 1' },
        { name: 'Name 2', email: 'email 2' }
      ];
      component.items.forEach(listItem => (listItem.$selected = false));
      component.select = true;
      component.hideSelectAll = true;

      component.selectAllListItems();

      component.items.forEach(listItem => expect(listItem.$selected).toBe(false));
    });

    it('selectListItem: should set all select to true', () => {
      component.items = [
        { name: 'Name 1', email: 'email 1' },
        { name: 'Name 2', email: 'email 2' }
      ];
      component.items.forEach(listItem => (listItem.$selected = false));

      component.select = true;
      component.hideSelectAll = false;
      component.items.forEach(listItem => component.selectListItem(listItem));

      component.items.forEach(listItem => expect(listItem.$selected).toBe(true));
    });

    it('selectListItem: should set all select to false', () => {
      component.items = [
        { name: 'Name 1', email: 'email 1' },
        { name: 'Name 2', email: 'email 2' }
      ];
      component.items.forEach(listItem => (listItem.$selected = true));

      component.select = true;
      component.hideSelectAll = false;
      component.items.forEach(listItem => component.selectListItem(listItem));

      component.items.forEach(listItem => expect(listItem.$selected).toBe(false));
    });

    it('deleteInternalAttrs: should return `object` without property that starts with `$`', () => {
      const dirtyItem = { label: 'item label', $showDetail: 'test', $selected: true };
      const expectedItem = { label: 'item label' };

      expect(component['deleteInternalAttrs'](dirtyItem)).toEqual(expectedItem);
      expect(dirtyItem).toEqual({ label: 'item label', $showDetail: 'test', $selected: true });
    });

    it('deleteInternalAttrs: should return same `object` if property not starts with `$`', () => {
      expect(component['deleteInternalAttrs'](item)).toEqual(item);
    });

    it('deleteInternalAttrs: should return same parameter if it`s not defined', () => {
      expect(component['deleteInternalAttrs'](undefined)).toEqual(undefined);
    });

    describe('checkIfItemsAreSelected:', () => {
      let items;

      beforeEach(() => {
        items = [
          { name: 'Name 1', email: 'email 1', $selected: true },
          { name: 'Name 2', email: 'email 2', $selected: true }
        ];
      });

      it('should return `true` if every items is selected', () => {
        expect(component['checkIfItemsAreSelected'](items)).toBeTruthy();
      });

      it('should return `null` if some items selected is false', () => {
        items[1].$selected = false;

        const isIndeterminate = component['checkIfItemsAreSelected'](items) === null;

        expect(isIndeterminate).toBeTruthy();
      });

      it('should return `false` if every items isn`t selected', () => {
        items[0].$selected = false;
        items[1].$selected = false;

        expect(component['checkIfItemsAreSelected'](items)).toBeFalsy();
      });
    });

    it('showMainHeader: should set showHeader to `true` if `select` is `true`, `hideSelectAll` is `false` and have items', () => {
      component.showHeader = false;
      component.items = [{ name: 'Name 1', email: 'email 1', $selected: true }];
      component.select = true;
      component.hideSelectAll = false;

      component['showMainHeader']();

      expect(component.showHeader).toBe(true);
    });

    it('showMainHeader: should set showHeader to `false` if `select` is false', () => {
      component.select = false;

      component['showMainHeader']();

      expect(component.showHeader).toBe(false);
    });

    it('showMainHeader: should set showHeader to `false` if `hideSelectAll` is `true`', () => {
      component.select = true;
      component.hideSelectAll = true;

      component['showMainHeader']();

      expect(component.showHeader).toBe(false);
    });

    it('showMainHeader: should set showHeader to `false` if no have items', () => {
      component.items = [];
      component.select = true;
      component.hideSelectAll = true;

      component['showMainHeader']();

      expect(component.showHeader).toBe(false);
    });

    it('runTitleAction: should call `titleAction.emit` and `deleteInternalAttrs`', () => {
      const listItem = { label: 'item label', $showDetail: 'test' };
      const expectedItem = { label: 'item label' };

      spyOn(component.titleAction, <any>'emit');
      spyOn(component, <any>'deleteInternalAttrs').and.returnValue(expectedItem);

      component.runTitleAction(listItem);

      expect(component.titleAction.emit).toHaveBeenCalledWith(expectedItem);
      expect(component['deleteInternalAttrs']).toHaveBeenCalledWith(listItem);
    });
  });
});
