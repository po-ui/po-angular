import { PoThemeA11yEnum } from '../../services';
import { expectSettersMethod } from './../../util-test/util-expect.spec';

import { PoBreadcrumbBaseComponent } from './po-breadcrumb-base.component';
import { PoBreadcrumbItem } from './po-breadcrumb-item.interface';

describe('PoDisclaimerBaseComponent:', () => {
  const component = new PoBreadcrumbBaseComponent();

  const items: Array<PoBreadcrumbItem> = [
    { label: 'Teste nível 1', link: '/test/nivel/1' },
    { label: 'Teste nível 2', link: '/test/nivel/2', action: () => {} },
    { label: 'Teste nível 3', action: () => {} },
    { label: 'Teste nível 4', link: '/test/nivel/4' }
  ];

  it('should be created', () => {
    expect(component instanceof PoBreadcrumbBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-items: should set equal `itemsView`.', () => {
      expectSettersMethod(component, 'items', items, '_items', items);
      expect(component.itemsView).toEqual(items);
    });

    it('p-items: should set equal `itemsView` when items empty.', () => {
      const itemsEmpty = [undefined];

      expectSettersMethod(component, 'items', itemsEmpty, '_items', itemsEmpty);
      expect(component.itemsView).toEqual(itemsEmpty);
    });

    describe('p-size', () => {
      beforeEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      it('should set property with valid values for accessibility level is AA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

        component.size = 'small';
        expect(component.size).toBe('small');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

        component.size = 'small';
        expect(component.size).toBe('medium');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'small');

        component['_size'] = undefined;
        expect(component.size).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'medium');

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);
        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });
    });
  });

  describe('Methods:', () => {
    it('transformToArrayPopup: should remove first, penultimate and last item .', () => {
      component['transformToArrayPopup'](items);
      expect(component.itemsViewPopup.length).toEqual(1);
    });

    it('transformArrayToActionPopUp: should edit property to `link` to `url` and remove action if exists `link`', () => {
      const newItem = component['transformArrayToActionPopUp'](items);
      const expectedOutputItems = [
        { label: 'Teste nível 1', url: '/test/nivel/1' },
        { label: 'Teste nível 2', url: '/test/nivel/2' },
        { label: 'Teste nível 3', action: jasmine.any(Function) },
        { label: 'Teste nível 4', url: '/test/nivel/4' }
      ];
      expect(newItem).toEqual(expectedOutputItems);
    });
  });
});
