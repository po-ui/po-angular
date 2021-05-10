import { Directive } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoMenuBaseComponent } from './po-menu-base.component';
import { PoMenuFilter } from './po-menu-filter/po-menu-filter.interface';

@Directive()
export class PoMenuComponent extends PoMenuBaseComponent {
  protected validateCollapseClass() {}
  protected checkActiveMenuByUrl() {}
  protected checkingRouterChildrenFragments() {}
}

describe('PoMenuBaseComponent:', () => {
  let component: PoMenuBaseComponent;

  const menuGlobalService: any = {
    sendMenus: menus => {}
  };
  const languageService: any = {
    getShortLanguage: () => {
      return 'pt';
    },
    getLanguageDefault: () => {
      return 'pt';
    }
  };
  const menuService: any = {
    configProperties: () => {},
    getFilteredData: () => {}
  };
  beforeEach(() => {
    component = new PoMenuComponent(menuGlobalService, menuService, languageService);
    component.menus = [
      {
        label: 'Level 1.1',
        link: '/level-1-1',
        icon: 'clock',
        subItems: [
          // level 1
          { label: 'Level 2.1', link: '/level-2-1' }, // level 2
          {
            label: 'Level 2.2',
            link: '/level-2-2',
            subItems: [
              // level 2
              {
                label: 'Level 3.1',
                link: '/level-3-1',
                subItems: [
                  // level 3
                  { label: 'Level 4.1', link: '/level-4-1' }, // level 4
                  {
                    label: 'Level 4.2',
                    link: '/level-4-2',
                    subItems: [
                      // level 4
                      { label: 'Level 5.1', link: '/level-5-1' }, // level 5 (não permitido)
                      { label: 'Level 5.2', link: '/level-5-2' } // level 5 (não permitido)
                    ]
                  },
                  { label: 'Level 4.3', link: '/level-4-3' } // level 4
                ]
              },
              { label: 'Level 3.2', link: '/level-3-2' } // level 3
            ]
          },
          { label: 'Level 2.3', link: '/level-2-3' } // level 2
        ]
      },
      { label: 'Level 1.2', link: '/level-1-2', icon: 'star' } // level 1
    ];
  });

  it('should be created', () => {
    expect(component instanceof PoMenuBaseComponent).toBeTruthy();
  });

  it('should create level 1 in menu item', () => {
    component['setMenuExtraProperties']();

    expect(component.menus[0]['level']).toBe(1);
    expect(component.menus[1]['level']).toBe(1);
  });

  it('should create level property until level 4 in menu items', () => {
    component['setMenuExtraProperties']();

    expect(component.menus[0]['level']).toBe(1);
    expect(component.menus[1]['level']).toBe(1);

    expect(component.menus[0].subItems[0]['level']).toBe(2);
    expect(component.menus[0].subItems[1]['level']).toBe(2);
    expect(component.menus[0].subItems[2]['level']).toBe(2);

    expect(component.menus[0].subItems[1].subItems[0]['level']).toBe(3);
    expect(component.menus[0].subItems[1].subItems[0]['level']).toBe(3);

    expect(component.menus[0].subItems[1].subItems[0].subItems[0]['level']).toBe(4);
    expect(component.menus[0].subItems[1].subItems[0].subItems[1]['level']).toBe(4);
    expect(component.menus[0].subItems[1].subItems[0].subItems[2]['level']).toBe(4);

    expect(component.menus[0].subItems[1].subItems[0].subItems[1].subItems[0]['level']).toBeUndefined();
    expect(component.menus[0].subItems[1].subItems[0].subItems[1].subItems[1]['level']).toBeUndefined();
  });

  it('should set menus with values received when valid values', () => {
    const valueValid = [{ label: 'Level 1.1', link: '/level-1-1', icon: 'clock' }];
    expectPropertiesValues(component, 'menus', [valueValid], [valueValid]);
  });

  it('should set menus with a array empty when invalid values', () => {
    const valuesInvalid = [undefined, 'menu', 123, true];
    expectPropertiesValues(component, 'menus', valuesInvalid, []);
  });

  it('should set filter', () => {
    const trueValues = ['', true, 1];
    const falseValues = [undefined, null, false, 0];

    expectPropertiesValues(component, 'filter', trueValues, true);
    expectPropertiesValues(component, 'filter', falseValues, false);
  });

  it('should set menu item properties', () => {
    const menuItem: any = { label: 'Utilidades', link: 'utilities' };

    component['_level'] = 1;
    component['setMenuItemProperties'](menuItem);

    expect(menuItem.level).toBe(1);
    expect(menuItem.id).toBeTruthy();
    expect(menuItem.type).toBe('internalLink');
  });

  it('should not set new id of menu item if it is not null', () => {
    const idMenuItem = '3423435454948';
    const menuItem: any = { label: 'Utilidades', link: 'utilities', id: idMenuItem };

    component['setMenuItemProperties'](menuItem);

    expect(menuItem.id).toBe(idMenuItem);
  });

  it('should set correct menu type', () => {
    component['_level'] = 1;

    let menuItem: any = { label: 'Utilidades', link: 'utilities' };
    expect(component['setMenuType'](menuItem)).toBe('internalLink');

    menuItem = { label: 'Utilidades', link: 'http://www.fakeUrlPo.com' };
    expect(component['setMenuType'](menuItem)).toBe('externalLink');

    menuItem = { label: 'Utilidades' };
    expect(component['setMenuType'](menuItem)).toBe('noLink');

    menuItem = { label: 'Utilidades', subItems: [] };
    expect(component['setMenuType'](menuItem)).toBe('noLink');

    menuItem = { label: 'Utilidades', subItems: [{ label: 'Jardim' }] };
    expect(component['setMenuType'](menuItem)).toBe('subItems');
  });

  it('should log error message "O atributo PoMenuItem.label não pode ser vazio."', () => {
    const validationItemError = () => {
      component['validateMenus']([{ label: '', link: '/test' }]);
    };

    expect(validationItemError).toThrowError();

    const validationSubItemError = () => {
      component['validateMenus']([{ label: 'Teste', subItems: [{ label: '' }] }]);
    };

    expect(validationSubItemError).toThrowError();

    const validationItemNoError = () => {
      component['validateMenus']([{ label: 'Teste' }]);
    };

    expect(validationItemNoError).not.toThrowError();
  });

  it('should set allowIcons to true if all first level items have icons', () => {
    component['setMenuExtraProperties']();
    expect(component.allowIcons).toBeTruthy();
  });

  it('should allowIcons to false if one first level item doesn`t have icon', () => {
    component.menus = [
      { label: 'Com ícone', icon: 'star' },
      { label: 'Sem ícone' },
      { label: 'Com ícone', icon: 'clock' }
    ];
    component['setMenuExtraProperties']();

    expect(component.allowIcons).toBeFalsy();
  });

  describe('Methods: ', () => {
    it('configService: should call `menuService.configProperties` and set `filterService` if service parameter is valid string', () => {
      const service = 'http://po.com.br';

      const spyConfigPropeties = spyOn(component.menuService, <any>'configProperties');

      component['configService'](service);

      expect(component.filterService).toEqual(component.menuService);
      expect(spyConfigPropeties).toHaveBeenCalled();
    });

    it(`configService: shouldn't call 'menuService.configProperties' and should set 'filterService' if service parameter
      is a custom service`, () => {
      const service: PoMenuFilter = {
        getFilteredData: (search, params) => {
          return of([{ label: 'Menu', link: '/' }]);
        }
      };

      const spyConfigPropeties = spyOn(component.menuService, <any>'configProperties');

      component['configService'](<any>service);

      expect(component.filterService).toEqual(<any>service);
      expect(spyConfigPropeties).not.toHaveBeenCalled();
    });

    it(`configService: shouldn't call 'menuService.configProperties' and should set 'filterService' with undefined if
      service parameter is a custom service`, () => {
      const service: any = {};

      const spyConfigPropeties = spyOn(component.menuService, <any>'configProperties');

      component['configService'](service);

      expect(component.filterService).toEqual(undefined);
      expect(spyConfigPropeties).not.toHaveBeenCalled();
    });

    it('setMenuExtraProperties: should set allowCollapseMenu to true if all first level items have icons and shortlabels', () => {
      component.menus = [
        { label: 'Menu Item', icon: 'star', shortLabel: 'Menu Item' },
        { label: 'Menu Item', icon: 'calendar', shortLabel: 'Menu Item' },
        { label: 'Menu Item', icon: 'clock', shortLabel: 'Menu Item' }
      ];

      component['setMenuExtraProperties']();

      expect(component.allowCollapseMenu).toBe(true);
    });

    it('setMenuExtraProperties: should set allowCollapseMenu to false if one first level item doesn`t contain icon', () => {
      component.menus = [
        { label: 'Menu Item', icon: 'star', shortLabel: 'Menu Item' },
        { label: 'Menu Item', shortLabel: 'Menu Item' },
        { label: 'Menu Item', icon: 'clock', shortLabel: 'Menu Item' }
      ];

      component['setMenuExtraProperties']();

      expect(component.allowCollapseMenu).toBe(false);
    });

    it('setMenuExtraProperties: should set allowCollapseMenu to false if one first level item doesn`t contain short label', () => {
      component.menus = [
        { label: 'Menu Item', icon: 'star', shortLabel: 'Menu Item' },
        { label: 'Menu Item', icon: 'calendar' },
        { label: 'Menu Item', icon: 'clock', shortLabel: 'Menu Item' }
      ];

      component['setMenuExtraProperties']();

      expect(component.allowCollapseMenu).toBe(false);
    });

    it('setMenuExtraProperties: should call `removeBadgeAlert` three times', () => {
      component.menus = [
        { label: 'Menu Item', icon: 'star', shortLabel: 'Menu Item' },
        { label: 'Menu Item', icon: 'calendar' },
        { label: 'Menu Item', icon: 'clock', shortLabel: 'Menu Item' }
      ];

      spyOn(component, <any>'removeBadgeAlert');

      component['setMenuExtraProperties']();

      expect(component['removeBadgeAlert']).toHaveBeenCalledTimes(3);
    });

    it('processSubItems: should call `setMenuBadgeAlert` one time with `menu` and `menuItem2`', () => {
      const menuItem2 = { label: 'Menu Item 2', subItems: undefined };
      const menus = { label: 'Menu Item 1', badgeAlert: false, subItems: [menuItem2] };

      spyOn(component, <any>'setMenuItemProperties');
      spyOn(component, <any>'setMenuBadgeAlert').and.returnValue(menus);

      component['processSubItems'](menus);

      expect(component['setMenuBadgeAlert']).toHaveBeenCalledWith(menus, menuItem2);
      expect(component['setMenuBadgeAlert']).toHaveBeenCalledTimes(1);
    });

    it('processSubItems: should return a new reference of menu subItem', () => {
      const menuItem2 = { label: 'Menu Item 2' };
      const menu = { label: 'Menu Item 1', subItems: [menuItem2] };
      const menuAssigned = { label: 'Menu Item 1', subItems: [menuItem2] };

      spyOn(Object, 'assign').and.returnValue(menuAssigned);

      component['processSubItems'](menu);

      expect(<any>menu.subItems).toEqual(menuAssigned);
    });

    it('removeBadgeAlert: should remove `badgeAlert` property of menu item', () => {
      const menu = {
        label: '1',
        badgeAlert: true,
        subItems: [
          { label: '2', badgeAlert: true, subItems: [{ label: '3' }] },
          { label: '4', badgeAlert: true, subItems: [{ label: '5', badgeAlert: true, subItems: [{ label: '6' }] }] },
          { label: '4', badgeAlert: true }
        ]
      };

      const expetedMenu = {
        label: '1',
        subItems: [
          { label: '2', subItems: [{ label: '3' }] },
          { label: '4', subItems: [{ label: '5', subItems: [{ label: '6' }] }] },
          { label: '4' }
        ]
      };

      component['removeBadgeAlert'](menu);

      expect(<any>menu).toEqual(expetedMenu);
    });

    it('setMenuBadgeAlert: should return parent with `badgeAlert` true if `child.badgeAlert` is true', () => {
      const child = { label: 'child', badgeAlert: true, subItems: [] };
      const parent = { label: 'item', subItems: [child] };
      const parentExpected = { label: 'item', badgeAlert: true, subItems: [child] };

      const result = component['setMenuBadgeAlert'](parent, child);

      expect(result).toEqual(parentExpected);
    });

    it(`setMenuBadgeAlert: should return parent with 'badgeAlert' true if 'child' contain badge with value 0 and
      'child' not contain subItems`, () => {
      const child = { label: 'child', badge: { value: 0 }, subItems: [] };
      const parent = { label: 'item', subItems: [child] };
      const parentExpected = { label: 'item', badgeAlert: true, subItems: [child] };

      const result = component['setMenuBadgeAlert'](parent, child);

      expect(result).toEqual(parentExpected);
    });

    it(`setMenuBadgeAlert: should return parent with 'badgeAlert' false if 'child' contain badge with
      value less that 0`, () => {
      const child = { label: 'child', badge: { value: -1 }, subItems: [] };
      const parent = { label: 'item', subItems: [child] };
      const parentExpected = { label: 'item', badgeAlert: false, subItems: [child] };

      const result = component['setMenuBadgeAlert'](parent, child);

      expect(result).toEqual(parentExpected);
    });

    it(`setMenuBadgeAlert: should return parent with 'badgeAlert' false if 'child' contain badge with
      value is undefined`, () => {
      const child = { label: 'child', badge: { value: undefined }, subItems: [] };
      const parent = { label: 'item', subItems: [child] };
      const parentExpected = { label: 'item', badgeAlert: false, subItems: [child] };

      const result = component['setMenuBadgeAlert'](parent, child);

      expect(result).toEqual(parentExpected);
    });

    it(`setMenuBadgeAlert: should return parent with 'badgeAlert' false if 'child' contain badge with
      value is empty string`, () => {
      const child = { label: 'child', badge: { value: <any>' ' }, subItems: [] };
      const parent = { label: 'item', subItems: [child] };
      const parentExpected = { label: 'item', badgeAlert: false, subItems: [child] };

      const result = component['setMenuBadgeAlert'](parent, child);

      expect(result).toEqual(parentExpected);
    });

    it(`setMenuBadgeAlert: should return parent with 'badgeAlert' false if 'child.badge' is valid
      but 'child' contain subItems`, () => {
      const child = { label: 'child', badge: { value: 1 }, subItems: [{ label: '2' }] };
      const parent = { label: 'item', subItems: [child] };
      const parentExpected = { label: 'item', badgeAlert: false, subItems: [child] };

      const result = component['setMenuBadgeAlert'](parent, child);

      expect(result).toEqual(parentExpected);
    });
  });

  describe('Properties:', () => {
    it('service: should set property with `undefined` if invalid values', () => {
      const invalidValues = ['', 0, null, undefined, false];
      const expectedValue = undefined;

      const spyCofingService = spyOn(component, <any>'configService');

      expectPropertiesValues(component, 'service', invalidValues, expectedValue);

      expect(spyCofingService).toHaveBeenCalledWith(component.service);
    });

    it('service: should set property with valid values', () => {
      const validValues = ['http://po.com', { getFilteredData: () => {} }];

      const spyCofingService = spyOn(component, <any>'configService');

      expectPropertiesValues(component, 'service', validValues, validValues);

      expect(spyCofingService).toHaveBeenCalledWith(component.service);
    });

    it('params: should set property with `undefined` if invalid values', () => {
      const invalidValues = ['', null, undefined, 0, false, true];
      const expectedValue = undefined;

      expectPropertiesValues(component, 'params', invalidValues, expectedValue);
    });

    it('params: should set property with valid values', () => {
      const validValues = [{}, { id: '1' }];

      expectPropertiesValues(component, 'params', validValues, validValues);
    });

    it('logo: should set property with `undefined` if invalid values', () => {
      const invalidValues = ['', ' ', null, undefined, 0, false, true];
      const expectedValue = undefined;

      expectPropertiesValues(component, 'logo', invalidValues, expectedValue);
    });

    it('logo: should set property with valid values', () => {
      const validValues = ['https://po-ui.io/logo', 'https://other.com/images/logo'];

      expectPropertiesValues(component, 'logo', validValues, validValues);
    });

    it('shortLogo: should set property with `undefined` if invalid values', () => {
      const invalidValues = ['', ' ', null, undefined, 0, false, true];
      const expectedValue = undefined;

      expectPropertiesValues(component, 'shortLogo', invalidValues, expectedValue);
    });

    it('shortLogo: should set property with valid values', () => {
      const validValues = ['https://po-ui.io/logo', 'https://other.com/images/logo'];

      expectPropertiesValues(component, 'shortLogo', validValues, validValues);
    });

    it('collapsed: should update property with valid values.', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'collapsed', validValues, expectedValues);
    });

    it('collapsed: should call `validateCollapseClass`', () => {
      spyOn(component, <any>'validateCollapseClass');

      component.collapsed = true;

      expect(component['validateCollapseClass']).toHaveBeenCalled();
    });

    it('collapsed: should update property with `false` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null'];

      expectPropertiesValues(component, 'collapsed', invalidValues, false);
    });

    it('menus: should update property with valid values.', fakeAsync(() => {
      const validValues = [[{ label: 'Level 1.1', link: '/level-1-1', icon: 'clock' }]];

      const spyCheckingRouterChildrenFragments = spyOn(component, <any>'checkingRouterChildrenFragments');
      const spyCheckActiveMenuByUrl = spyOn(component, <any>'checkActiveMenuByUrl');

      const spySendMenus = spyOn(component.menuGlobalService, <any>'sendMenus');

      expectPropertiesValues(component, 'menus', validValues, validValues);

      tick();

      expect(spyCheckingRouterChildrenFragments).toHaveBeenCalled();
      expect(spyCheckActiveMenuByUrl).toHaveBeenCalled();
      expect(spySendMenus).toHaveBeenCalled();
    }));

    it('menus: should update property with `[]` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null', {}, false, true];

      expectPropertiesValues(component, 'menus', invalidValues, []);
    });
  });

  describe('Integration:', () => {
    it('setMenuExtraProperties: should create menu with `badgeAlert` and structure it correctly', () => {
      component.menus = [
        { label: 'Menu Item 1', subItems: [{ label: 'Menu Item 2', badge: { value: 1 } }, { label: 'Menu Item 3' }] },
        { label: 'Menu Item 4', subItems: [{ label: 'Menu Item 5' }, { label: 'Menu Item 6' }] },
        {
          label: 'Menu Item 7',
          subItems: [{ label: 'Menu Item 8', subItems: [{ label: 'Menu Item 9', badge: { value: 70 } }] }]
        },
        { label: 'Menu Item 10' }
      ];

      const expetedMenus = [
        {
          label: 'Menu Item 1',
          badgeAlert: true,
          subItems: [{ label: 'Menu Item 2', badge: { value: 1 } }, { label: 'Menu Item 3' }]
        },
        { label: 'Menu Item 4', badgeAlert: undefined, subItems: [{ label: 'Menu Item 5' }, { label: 'Menu Item 6' }] },
        {
          label: 'Menu Item 7',
          badgeAlert: true,
          subItems: [
            { label: 'Menu Item 8', badgeAlert: true, subItems: [{ label: 'Menu Item 9', badge: { value: 70 } }] }
          ]
        },
        { label: 'Menu Item 10' }
      ];

      spyOn(component, <any>'setMenuItemProperties');

      component['setMenuExtraProperties']();

      expect(<any>component.menus).toEqual(expetedMenus);
    });
  });
});
