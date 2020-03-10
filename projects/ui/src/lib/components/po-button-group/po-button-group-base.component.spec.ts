import { PoButtonGroupItem } from './po-button-group-item.interface';
import { PoButtonGroupBaseComponent } from './po-button-group-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

describe('PoButtonGroupBaseComponent', () => {
  let component;
  let fakeButtons: Array<PoButtonGroupItem>;

  beforeEach(() => {
    component = new PoButtonGroupBaseComponent();
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
    const booleanInvalidValues = [undefined, null, 2, 'string'];
    const booleanValidTrueValues = [true, 'true', 1, ''];

    it('p-small: should update property `p-small` with valid values.', () => {
      expectPropertiesValues(component, 'small', booleanValidTrueValues, true);
    });

    it('p-small: should update property `p-small` with invalid values.', () => {
      expectPropertiesValues(component, 'small', booleanInvalidValues, false);
    });

    it('p-toggle: should update property `p-toggle` with valid values.', () => {
      const validValues = ['multiple', 'single', 'none'];

      expectPropertiesValues(component, 'toggle', validValues, validValues);
    });

    it('p-toggle: should update property `p-toggle` with invalid values.', () => {
      const invalidValues = [false, true, {}, 'invalid', []];

      expectPropertiesValues(component, 'toggle', invalidValues, 'none');
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
