import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoTooltipBaseDirective } from './po-tooltip-base.directive';

class PoTooltipDirective extends PoTooltipBaseDirective {
  addTooltipAction() {}
  removeTooltipAction() {}
}

describe('PoTooltipBaseDirective', () => {
  let component: PoTooltipDirective;

  beforeEach(() => {
    component = new PoTooltipDirective();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set tooltip', () => {
    let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quisua.';
    text += text;

    expectPropertiesValues(component, 'tooltip', '', '');
    expectPropertiesValues(component, 'tooltip', '1234567890', '1234567890');
    expectPropertiesValues(component, 'tooltip', null, null);
    expectPropertiesValues(component, 'tooltip', text, text);
    expectPropertiesValues(component, 'tooltip', text + 'abcd', text);
  });

  it('should set valid positions', () => {
    const validValues = [
      'right',
      'right-top',
      'right-bottom',
      'top',
      'top-left',
      'top-right',
      'left',
      'left-top',
      'left-bottom',
      'bottom',
      'bottom-left',
      'bottom-right'
    ];

    expectPropertiesValues(component, 'tooltipPosition', validValues, validValues);
  });

  it('should set invalid positions', () => {
    const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

    expectPropertiesValues(component, 'tooltipPosition', invalidValues, 'bottom');
  });

  it('should set p-append-in-body', () => {
    expect(component.appendInBody).toBeFalse();
  });

  describe('Properties', () => {
    it('p-display-tooltip: should call `addTooltipAction` if true', () => {
      const spyAddTooltipAction = spyOn(component, <any>'addTooltipAction');

      component.displayTooltip = true;

      expect(spyAddTooltipAction).toHaveBeenCalled();
    });

    it('p-display-tooltip: should call `removeTooltipAction` if false', () => {
      const spyRemoveTooltipAction = spyOn(component, <any>'removeTooltipAction');

      component.displayTooltip = false;

      expect(spyRemoveTooltipAction).toHaveBeenCalled();
    });
  });
});
