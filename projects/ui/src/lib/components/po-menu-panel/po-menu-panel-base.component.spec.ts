import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoMenuPanelBaseComponent } from './po-menu-panel-base.component';

describe('PoMenuPanelBaseComponent: ', () => {
  const component = new PoMenuPanelBaseComponent();
  const poDefaultLogo = 'https://po-ui.io/assets/po-logos/po_black.svg';

  beforeEach(() => {
    component.menus = [
      { label: 'Item 1', link: '/item1', icon: 'clock' },
      { label: 'Item 2', link: '/item2', icon: 'star' }
    ];
  });

  it('should be created', () => {
    expect(component instanceof PoMenuPanelBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('menus: should set `menus` with valid values', () => {
      const validValue = [{ label: 'Item 1', link: '/item1', icon: 'clock' }];
      expectPropertiesValues(component, 'menus', [validValue], [validValue]);
    });

    it('menus: should set `menus` with a array empty when invalid values', () => {
      const invalidValues = [undefined, 'menu', 123, true, null, {}, false, NaN];

      spyOn(component, <any>'setMenuExtraProperties');
      spyOn(component, <any>'validateMenus');

      expectPropertiesValues(component, 'menus', invalidValues, []);

      expect(component['setMenuExtraProperties']).toHaveBeenCalled();
      expect(component['validateMenus']).toHaveBeenCalled();
    });

    it('logo: should set `logo` with the developer image url', () => {
      const src = 'https://po-ui.io/assets/po-logos/po_color_bg.svg';
      component.logo = src;
      expect(component.logo).not.toEqual(poDefaultLogo);
      expect(component.logo).toEqual(src);
    });

    it('logo: should set `logo` with default value if the url passed by the developer is undefined', () => {
      const src = undefined;
      component.logo = src;
      expect(component.logo).toEqual(poDefaultLogo);
      expect(component.logo).not.toEqual(src);
    });
  });

  describe('Methods: ', () => {
    it('validateMenus: should throw error message when label and icon are falsy', () => {
      const validationItemErrorLabel = () => {
        component['validateMenus']([{ label: '', link: '/test', icon: 'home' }]);
      };

      const validationItemErrorIcon = () => {
        component['validateMenus']([{ label: 'Label', link: '/test', icon: '' }]);
      };

      expect(validationItemErrorIcon).toThrowError();
      expect(validationItemErrorLabel).toThrowError();
    });

    it('validateMenus: shouldn`t throw error message when label and icon are true.', () => {
      const fnNoThrowError = () => {
        component['validateMenus']([{ label: 'Teste', icon: 'user' }]);
      };

      expect(fnNoThrowError).not.toThrowError();
    });

    it('setMenuType: should set correct menu type', () => {
      let menuItem: any = { label: 'Utilidades', link: 'utilities' };
      expect(component['setMenuType'](menuItem)).toBe('internalLink');

      menuItem = { label: 'Utilidades', link: 'http://www.fakeUrlPo.com' };
      expect(component['setMenuType'](menuItem)).toBe('externalLink');

      menuItem = { label: 'Utilidades' };
      expect(component['setMenuType'](menuItem)).toBe('noLink');
    });

    it('setMenuItemProperties: should not set new id of menu item if it is not null', () => {
      const idMenuItem = '3423435454948';
      const menuItem: any = { label: 'Utilidades', link: 'utilities', id: idMenuItem };

      component['setMenuItemProperties'](menuItem);

      expect(menuItem.id).toBe(idMenuItem);
      expect(menuItem.type).toBe('internalLink');
    });

    it('setMenuItemProperties: should set menu item properties', () => {
      const menuItem: any = { label: 'Utilidades', link: 'utilities' };

      component['setMenuItemProperties'](menuItem);

      expect(menuItem.id).toBeTruthy();
      expect(menuItem.type).toBe('internalLink');
    });
  });
});
