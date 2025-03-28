import { PoButtonGroupBaseComponent } from './po-button-group-base.component';
import { PoButtonGroupItem } from './po-button-group-item.interface';

import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';

describe('PoButtonGroupBaseComponent', () => {
  let component: PoButtonGroupBaseComponent;
  let fakeButtons: Array<PoButtonGroupItem>;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);
    component = new PoButtonGroupBaseComponent(poThemeServiceMock);

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

    describe('p-size', () => {
      it('should set property with valid values for accessibility level is AA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        component.size = 'small';
        expect(component.size).toBe('small');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        component.size = 'small';
        expect(component.size).toBe('medium');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('small');

        component['_size'] = undefined;
        expect(component.size).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('medium');

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);
        component['_size'] = undefined;
        expect(component.size).toBe('medium');
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
  });
});
