import { expectSettersMethod } from './../../util-test/util-expect.spec';

import * as UtilsFunction from '../../utils/util';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoDisclaimer } from '../po-disclaimer/po-disclaimer.interface';
import { PoDisclaimerGroupBaseComponent } from './po-disclaimer-group-base.component';
import { tick, fakeAsync } from '@angular/core/testing';

describe('PoDisclaimerGroupBaseComponent:', () => {
  const differ = {
    find: () => ({ create: () => {} })
  };

  const languageService = new PoLanguageService();

  const component = new PoDisclaimerGroupBaseComponent(<any>differ, languageService);

  it('should be created', () => {
    expect(component instanceof PoDisclaimerGroupBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-hide-remove-all: should set property `p-hide-remove-all`.', () => {
      expectSettersMethod(component, 'hideRemoveAll', '', '_hideRemoveAll', true);
      expectSettersMethod(component, 'hideRemoveAll', 'true', '_hideRemoveAll', true);
      expectSettersMethod(component, 'hideRemoveAll', true, '_hideRemoveAll', true);
      expectSettersMethod(component, 'hideRemoveAll', 'false', '_hideRemoveAll', false);
      expectSettersMethod(component, 'hideRemoveAll', false, '_hideRemoveAll', false);
      expectSettersMethod(component, 'hideRemoveAll', null, '_hideRemoveAll', false);
      expectSettersMethod(component, 'hideRemoveAll', 'null', '_hideRemoveAll', false);
      expectSettersMethod(component, 'hideRemoveAll', NaN, '_hideRemoveAll', false);
      expectSettersMethod(component, 'hideRemoveAll', 'undefined', '_hideRemoveAll', false);
      expectSettersMethod(component, 'hideRemoveAll', undefined, '_hideRemoveAll', false);
    });

    it('should return [] when property disclaimers is seted to undefined.', () => {
      component.disclaimers = undefined;
      expect(component.disclaimers).toEqual([]);
    });

    it('should return [] when property disclaimers is seted to undefined.', () => {
      component.disclaimers = null;
      expect(component.disclaimers).toEqual([]);
    });
  });

  describe('Methods:', () => {
    let disclaimers: Array<PoDisclaimer>;

    let invalidDisclaimers: Array<PoDisclaimer>;

    let validDisclaimers: Array<PoDisclaimer>;

    beforeEach(() => {
      disclaimers = [
        { value: 'hotel', label: 'Hotel', property: 'hotel', hideClose: false },
        { value: '500', label: 'Price', property: 'Preço', hideClose: false },
        { value: 'north', label: 'Region', property: 'region', hideClose: false }
      ];

      invalidDisclaimers = [
        { value: '', label: 'InvalidString', property: 'invalidString' },
        { value: undefined, label: 'InvalidValue', property: 'invalidValue' },
        { value: null, label: 'Null', property: 'invalidNull' }
      ];

      validDisclaimers = [
        { value: 'hotel', label: 'Hotel', property: 'hotel' },
        { value: 0, label: 'Zero', property: 'number' },
        { value: 10, label: 'Dez', property: 'number10' },
        { value: true, label: 'True', property: 'bTrue' },
        { value: false, label: 'False', property: 'bFalse' }
      ];

      component.disclaimers = disclaimers;
    });

    it('ngDoCheck: should call `checkChanges`.', () => {
      spyOn(component, <any>'checkChanges');

      component.ngDoCheck();

      expect(component['checkChanges']).toHaveBeenCalled();
    });

    it('checkChanges: shouldn`t call `emitChangeDisclaimers` if `diff` return `false`.', () => {
      const fakeThis = {
        differ: {
          diff: () => false
        },
        disclaimers: [{ value: 'house', label: 'House', property: 'house' }],
        previousDisclaimers: [{}],
        disclaimersAreChanged: () => true,
        emitChangeDisclaimers: () => {}
      };

      spyOn(fakeThis, 'emitChangeDisclaimers');

      component['checkChanges'].call(fakeThis);

      expect(fakeThis.emitChangeDisclaimers).not.toHaveBeenCalled();
    });

    it('checkChanges: shouldn`t call `emitChangeDisclaimers` if `disclaimersAreChanged` return `false`.', () => {
      const fakeThis = {
        differ: {
          diff: () => true
        },
        disclaimers: [{ value: 'house', label: 'House', property: 'house' }],
        previousDisclaimers: [{}],
        disclaimersAreChanged: () => false,
        emitChangeDisclaimers: () => {}
      };

      spyOn(fakeThis, 'emitChangeDisclaimers');

      component['checkChanges'].call(fakeThis);

      expect(fakeThis.emitChangeDisclaimers).not.toHaveBeenCalled();
    });

    it('checkChanges: should call `emitChangeDisclaimers`.', () => {
      const fakeThis = {
        differ: {
          diff: () => true
        },
        disclaimers: [{ value: 'house', label: 'House', property: 'house' }],
        previousDisclaimers: [{}],
        disclaimersAreChanged: () => true,
        emitChangeDisclaimers: () => {}
      };

      spyOn(fakeThis, 'emitChangeDisclaimers');

      component['checkChanges'].call(fakeThis);

      expect(fakeThis.emitChangeDisclaimers).toHaveBeenCalled();
    });

    it('checkChanges: shouldn`t call `emitChangeDisclaimers` if property `differ` is undefined.', () => {
      spyOn(component, <any>'emitChangeDisclaimers');

      component['checkChanges']();

      expect(component['emitChangeDisclaimers']).not.toHaveBeenCalled();
    });

    it('isRemoveAll: should return default false in `isRemoveAll` method.', () => {
      component.disclaimers = [];
      expect(component.isRemoveAll()).toBe(false);
    });

    it('isRemoveAll: should return false in `isRemoveAll` method.', () => {
      component.hideRemoveAll = true;
      expect(component.isRemoveAll()).toBe(false);
    });

    it('isRemoveAll: should return false in `isRemoveAll` method if items length is less than 2.', () => {
      component.disclaimers = [disclaimers[0]];
      expect(component.isRemoveAll()).toBe(false);
    });

    it('removeDisclaimer: should close/remove a disclaimer.', () => {
      component['removeDisclaimer'](disclaimers[0]);

      expect(component.disclaimers.find(f => f.value === 'hotel')).toBeFalsy();
      expect(component.disclaimers.length).toEqual(2);
    });

    it('removeAllItems: should not remove a disclaimer if its `hideClose` is true.', () => {
      component.disclaimers[0].hideClose = true;
      component.removeAllItems();
      expect(component.disclaimers.length).toBe(1);
    });

    it('removeAllItems: should remove all disclaimers', () => {
      component.disclaimers[0].hideClose = false;
      component.removeAllItems();
      expect(component.disclaimers).toEqual([]);
    });

    it('removeAllItems: should call `emitChangeDisclaimers` only once.', () => {
      component.disclaimers = validDisclaimers;

      spyOn(component, <any>'emitChangeDisclaimers');
      component.removeAllItems();

      expect(component['emitChangeDisclaimers']).toHaveBeenCalledTimes(1);
    });

    it('removeAllItems: should emit removeAll with removed disclaimers', () => {
      component.disclaimers = [...validDisclaimers];

      spyOn(component.removeAll, <any>'emit');
      component.removeAllItems();

      expect(component.removeAll.emit).toHaveBeenCalledWith(validDisclaimers);
    });

    it('onCloseAction: should remove disclaimer and emit current disclaimers', fakeAsync(() => {
      spyOn(component.change, <any>'emit');

      const disclaimerToRemove = { value: 'north', label: 'Region', property: 'region', hideClose: false };
      const currentDisclaimers = [component.disclaimers[0], component.disclaimers[1]];

      component.onCloseAction(disclaimerToRemove);

      tick();

      expect(component.disclaimers).toEqual(currentDisclaimers);
      expect(component.change.emit).toHaveBeenCalledWith(component.disclaimers);
    }));

    it('onCloseAction: should emit removedDisclaimer and currentDisclaimers in remove action', () => {
      spyOn(component.remove, <any>'emit');

      const removedDisclaimer = { value: 'north', label: 'Region', property: 'region', hideClose: false };
      const currentDisclaimers = [component.disclaimers[0], component.disclaimers[1]];

      component.onCloseAction(removedDisclaimer);

      expect(component.disclaimers).toEqual(currentDisclaimers);
      expect(component.remove.emit).toHaveBeenCalledWith({ currentDisclaimers, removedDisclaimer });
    });

    it('checkDisclaimers: should return only valid disclaimers.', () => {
      const checkedDisclaimers = component['checkDisclaimers']([...validDisclaimers]);

      expect(checkedDisclaimers.length).toBe(validDisclaimers.length);
    });

    it('checkDisclaimers: should return `[]` if `disclaimers` isn`t array.', () => {
      const checkedDisclaimers = component['checkDisclaimers'](undefined);

      expect(checkedDisclaimers).toEqual([]);
    });

    it('checkDisclaimers: should return only valid `disclaimers` when has invalid values too.', () => {
      let checkedDisclaimers = component['checkDisclaimers']([
        ...invalidDisclaimers,
        ...validDisclaimers,
        ...invalidDisclaimers
      ]);

      expect(checkedDisclaimers.length).toBe(validDisclaimers.length);

      // 2º cenário com os valores inválidos no início da lista
      checkedDisclaimers = component['checkDisclaimers']([
        ...invalidDisclaimers,
        ...invalidDisclaimers,
        ...validDisclaimers
      ]);

      expect(checkedDisclaimers.length).toBe(validDisclaimers.length);
    });

    it('emitChangeDisclaimers: should call `change.emit` and set `previousDisclaimers` with `disclaimers`', done => {
      component.disclaimers = disclaimers;

      spyOn(component.change, 'emit');

      component['emitChangeDisclaimers']();

      setTimeout(() => {
        expect(component.change.emit).toHaveBeenCalled();
        expect(component['previousDisclaimers']).toEqual(component.disclaimers);
        done();
      });
    });

    describe('disclaimersAreChanged:', () => {
      const disclaimerItems = [
        { value: 'progress', property: 'Progress' },
        { value: 'protheus', property: 'Protheus' }
      ];
      const expectedReturnFalse = false;
      const expectedReturnTrue = true;

      it('should return true if `disclaimers.currentValue` is greater than `disclaimers.previousValue`.', () => {
        component['previousDisclaimers'] = [];

        const changes: Array<PoDisclaimer> = disclaimerItems;
        const disclaimersAreChangedReturn = component['disclaimersAreChanged'](changes);

        expect(disclaimersAreChangedReturn).toBe(expectedReturnTrue);
      });

      it('should return true if `disclaimers.currentValue` is less than `disclaimers.previousValue`.', () => {
        component['previousDisclaimers'] = disclaimerItems;

        const changes: Array<PoDisclaimer> = [];
        const disclaimersAreChangedReturn = component['disclaimersAreChanged'](changes);

        expect(disclaimersAreChangedReturn).toBe(expectedReturnTrue);
      });

      it(`should return true if order 'disclaimers.currentValue' is different than 'disclaimers.previousValue'.`, () => {
        component['previousDisclaimers'] = disclaimerItems;

        const changes: Array<PoDisclaimer> = [{ value: 'protheus' }, { value: 'progress' }];
        const disclaimersAreChangedReturn = component['disclaimersAreChanged'](changes);

        expect(disclaimersAreChangedReturn).toBe(expectedReturnTrue);
      });

      it('should return false if `disclaimers.currentValue` is equal than `disclaimers.previousValue`.', () => {
        component['previousDisclaimers'] = disclaimerItems;

        const changes: Array<PoDisclaimer> = disclaimerItems;
        const disclaimersAreChangedReturn = component['disclaimersAreChanged'](changes);

        expect(disclaimersAreChangedReturn).toBe(expectedReturnFalse);
      });

      it(`should return true if 'disclaimers.currentValue.property' is different than 'disclaimers.previousValue.property'.`, () => {
        component['previousDisclaimers'] = disclaimerItems;

        const changes: Array<PoDisclaimer> = [
          { value: 'progress', property: 'Protheus' },
          { value: 'protheus', property: 'Progress' }
        ];
        const disclaimersAreChangedReturn = component['disclaimersAreChanged'](changes);

        expect(disclaimersAreChangedReturn).toBe(expectedReturnTrue);
      });

      it(`should return false if 'disclaimers.currentValue.property' is equal than 'disclaimers.previousValue.property'.`, () => {
        component['previousDisclaimers'] = disclaimerItems;

        const changes: Array<PoDisclaimer> = disclaimerItems;
        const disclaimersAreChangedReturn = component['disclaimersAreChanged'](changes);

        expect(disclaimersAreChangedReturn).toBe(expectedReturnFalse);
      });
    });

    it(`onKeyPress: should call 'removeAllItems' if enter is typed.`, () => {
      const eventEnterKey = { keyCode: 13 };

      spyOn(component, 'removeAllItems');
      component.onKeyPress(eventEnterKey);

      expect(component['removeAllItems']).toHaveBeenCalled();
    });

    it(`onKeyPress: should call 'isKeyCodeEnter' if typed key is enter.`, () => {
      const eventEnterKey = { keyCode: 13 };

      spyOn(UtilsFunction, <any>'isKeyCodeEnter');
      component.onKeyPress(eventEnterKey);

      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });

    it(`onKeyPress: shouldn't call 'removeAllItems' if the typed key is not enter.`, () => {
      const eventDeleteKey = { keyCode: 46 };

      spyOn(UtilsFunction, <any>'isKeyCodeEnter');
      spyOn(component, 'removeAllItems');
      component.onKeyPress(eventDeleteKey);

      expect(component.removeAllItems).not.toHaveBeenCalled();
      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });
  });
});
