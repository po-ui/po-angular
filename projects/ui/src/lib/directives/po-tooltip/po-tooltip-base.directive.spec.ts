import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoTooltipBaseDirective } from './po-tooltip-base.directive';

describe('PoTooltipBaseDirective', () => {
  const component = new PoTooltipBaseDirective();

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
});
