import { PoButtonGroupBaseComponent } from './po-button-group-base.component';
import { PoButtonGroupItem } from './po-button-group-item.interface';

import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';

describe('PoButtonGroupBaseComponent', () => {
  let component: PoButtonGroupBaseComponent;
  let fakeButtons: Array<PoButtonGroupItem>;
  let poThemeService: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeService = jasmine.createSpyObj('PoThemeService', ['getA11yDefaultSize', 'getA11yLevel']);
    component = new PoButtonGroupBaseComponent(poThemeService);

    fakeButtons = [
      {
        label: 'acao',
        disabled: false,
        action: () => {},
        selected: true
      }
    ];
  });

  it('should be created', () => {
    expect(component instanceof PoButtonGroupBaseComponent).toBeTruthy();
    expect(component.buttons.length).toBe(0);
  });

  it('validate type of p-buttons (PoButtonGroupItem)', () => {
    component.buttons = fakeButtons;
    const buttonGroupItem = component.buttons[0];

    expect(typeof buttonGroupItem.label).toBe('string');
    expect(typeof buttonGroupItem.disabled).toBe('boolean');
    expect(typeof buttonGroupItem.action).toBe('function');
    expect(typeof buttonGroupItem.selected).toBe('boolean');
  });

  it('validate if action can be called', () => {
    component.buttons = fakeButtons;

    spyOn(component.buttons[0], 'action');
    component.buttons[0].action();

    expect(component.buttons[0].action).toHaveBeenCalled();
  });

  describe('Properties: ', () => {
    it('p-toggle: should update property `p-toggle` with valid values.', () => {
      const validValues = ['multiple', 'single', 'none'];

      expectPropertiesValues(component, 'toggle', validValues, validValues);
    });

    it('p-toggle: should update property `p-toggle` with invalid values.', () => {
      const invalidValues = [false, true, {}, 'invalid', []];

      expectPropertiesValues(component, 'toggle', invalidValues, 'none');
    });

    describe('p-size:', () => {
      it('should update size with valid values', () => {
        const validValues = ['medium'];

        expectPropertiesValues(component, 'size', validValues, validValues);
      });

      it('should update size to `medium` with invalid values', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        const invalidValues = ['extraSmall', 'extraLarge'];

        expectPropertiesValues(component, 'size', invalidValues, 'medium');
      });

      it('should use default size when size is not set', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        component.size = undefined;
        expect(component.size).toBe('small');
      });

      it('should return `p-size` if it is defined', () => {
        component['_size'] = 'large';
        expect(component.size).toBe('large');
      });

      it('should call `getDefaultSize` and return its value if `p-size` is null or undefined', () => {
        spyOn(component as any, 'getDefaultSize').and.returnValue('medium');

        component['_size'] = null;
        expect(component.size).toBe('medium');
        expect(component['getDefaultSize']).toHaveBeenCalled();

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
        expect(component['getDefaultSize']).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Methods: ', () => {
    let buttons: Array<PoButtonGroupItem>;

    beforeEach(() => {
      buttons = [
        {
          action: () => {},
          label: 'button0',
          selected: false
        },
        {
          action: () => {},
          label: 'button1',
          selected: true
        },
        {
          action: () => {},
          label: 'button2',
          selected: false
        },
        {
          action: () => {},
          label: 'button3',
          selected: true
        }
      ];

      component.buttons = buttons;
    });

    it('onButtonClick: should desselect all buttons and select clicked button when toogle is single.', () => {
      component.toggle = 'single';

      component.onButtonClick(component.buttons[0], 0);

      expect(component.buttons[0].selected).toBeTruthy();
      expect(component.buttons[1].selected).toBeFalsy();
      expect(component.buttons[2].selected).toBeFalsy();
      expect(component.buttons[3].selected).toBeFalsy();
    });

    it('onButtonClick: should not desselect all buttons and select clicked button when toogle is multiple.', () => {
      component.toggle = 'multiple';

      component.onButtonClick(component.buttons[0], 0);

      expect(component.buttons[0].selected).toBeTruthy();
      expect(component.buttons[1].selected).toBeTruthy();
      expect(component.buttons[2].selected).toBeFalsy();
      expect(component.buttons[3].selected).toBeTruthy();
    });

    it('onButtonClick: should desselect all buttons when tooggle is none.', () => {
      component.toggle = 'none';

      component.onButtonClick(component.buttons[0], 0);

      expect(component.buttons[0].selected).toBeFalsy();
      expect(component.buttons[1].selected).toBeFalsy();
      expect(component.buttons[2].selected).toBeFalsy();
      expect(component.buttons[3].selected).toBeFalsy();
    });

    it('checkSelecteds: should call deselectAllButtons when toggle is none', () => {
      spyOn(component, <any>'deselectAllButtons');

      component['checkSelecteds']('none');

      expect(component['deselectAllButtons']).toHaveBeenCalled();
    });

    it('checkSelecteds: should call deselectAllButtons when toggle is single', () => {
      spyOn(component, <any>'deselectAllButtons');

      component['checkSelecteds']('single');

      expect(component['deselectAllButtons']).toHaveBeenCalled();
    });

    it('checkSelecteds: should not call deselectAllButtons when toggle is single', () => {
      spyOn(component, <any>'deselectAllButtons');

      component['checkSelecteds']('multiple');

      expect(component['deselectAllButtons']).not.toHaveBeenCalled();
    });

    it('deselectAllButtons: should sselect all buttons', () => {
      component['deselectAllButtons']();

      expect(component.buttons[0].selected).toBeFalsy();
      expect(component.buttons[1].selected).toBeFalsy();
      expect(component.buttons[2].selected).toBeFalsy();
      expect(component.buttons[3].selected).toBeFalsy();
    });

    describe('validateSize:', () => {
      it('should return the same size if valid and accessibility level allows it', () => {
        poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        expect(component['validateSize']('small')).toBe('small');
        expect(component['validateSize']('medium')).toBe('medium');
      });

      it('should return `medium` if p-size is `small` and accessibility level is not `AA`', () => {
        poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        expect(component['validateSize']('small')).toBe('medium');
      });

      it('should return default size from getA11yDefaultSize if value is invalid', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        expect(component['validateSize']('invalid')).toBe('small');
      });

      it('should return `medium` if default size is `medium`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        expect(component['validateSize']('invalid')).toBe('medium');
      });
    });

    describe('getDefaultSize:', () => {
      it('should return `small` if getA11yDefaultSize returns `small`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        expect(component['getDefaultSize']()).toBe('small');
      });

      it('should return `medium` if getA11yDefaultSize returns `medium`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        expect(component['getDefaultSize']()).toBe('medium');
      });
    });
  });
});
