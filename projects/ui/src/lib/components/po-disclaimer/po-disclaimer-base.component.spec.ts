import { PoDisclaimerBaseComponent } from './po-disclaimer-base.component';
import { expectSettersMethod } from './../../util-test/util-expect.spec';

describe('PoDisclaimerBaseComponent', () => {
  const component = new PoDisclaimerBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoDisclaimerBaseComponent).toBeTruthy();
  });

  it('should get default value of p-hide-close as false', () => {
    expect(component.hideClose).toBe(false);
  });

  it('should set property p-hide-close', () => {
    expectSettersMethod(component, 'hideClose', '', '_hideClose', true);
    expectSettersMethod(component, 'hideClose', 'true', '_hideClose', true);
    expectSettersMethod(component, 'hideClose', true, '_hideClose', true);
    expectSettersMethod(component, 'hideClose', 'false', '_hideClose', false);
    expectSettersMethod(component, 'hideClose', false, '_hideClose', false);
    expectSettersMethod(component, 'hideClose', null, '_hideClose', false);
    expectSettersMethod(component, 'hideClose', 'null', '_hideClose', false);
    expectSettersMethod(component, 'hideClose', NaN, '_hideClose', false);
    expectSettersMethod(component, 'hideClose', 'undefined', '_hideClose', false);
    expectSettersMethod(component, 'hideClose', undefined, '_hideClose', false);
  });

  it('should get default value of p-type as default', () => {
    expect(component.type).toBe('default');
  });

  it('should be set property p-type', () => {
    expectSettersMethod(component, 'type', '', '_type', 'default');
    expectSettersMethod(component, 'type', 'default', '_type', 'default');
    expectSettersMethod(component, 'type', 'danger', '_type', 'danger');
    expectSettersMethod(component, 'type', false, '_type', 'default');
    expectSettersMethod(component, 'type', null, '_type', 'default');
    expectSettersMethod(component, 'type', NaN, '_type', 'default');
    expectSettersMethod(component, 'type', undefined, '_type', 'default');
  });

  it('should call closeAction emiter', () => {
    component.label = 'testeLabel';
    component.property = 'testeProperty';
    component.value = 'testeValue';

    spyOn(component.closeAction, 'emit');
    component.close();

    expect(component.closeAction.emit).toHaveBeenCalledWith({
      value: 'testeValue',
      label: 'testeLabel',
      property: 'testeProperty'
    });
  });

  it('should set showDisclaimer false after close', () => {
    component.showDisclaimer = true;
    component.close();
    expect(component.showDisclaimer).toBe(false);
  });

  it('should get label', () => {
    component.label = 'Label';
    component.value = 'Valor';

    expect(component.getLabel()).toBe('Label');
  });

  it('should get label as value', () => {
    component.value = 'Valor';

    component.label = '';
    expect(component.getLabel()).toBe('Valor');

    component.label = null;
    expect(component.getLabel()).toBe('Valor');

    component.label = undefined;
    expect(component.getLabel()).toBe('Valor');
  });
});
