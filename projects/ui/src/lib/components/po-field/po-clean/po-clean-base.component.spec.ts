import { Directive } from '@angular/core';

import { PoCleanBaseComponent } from './po-clean-base.component';

@Directive()
class PoClean extends PoCleanBaseComponent {
  setInputValue(value: string): void {}

  getInputValue(): string {
    return '';
  }
}

describe('PoCleanBaseComponent', () => {
  const component = new PoClean();

  component['parentComponent'] = {
    onChangePropagate: function () {}
  };

  it('should be created', () => {
    expect(component instanceof PoCleanBaseComponent).toBeTruthy();
  });

  it('should call setInputValue and changeEvent emit in clear()', () => {
    component.defaultValue = '123';

    spyOn(component, 'setInputValue');
    spyOn(component.changeEvent, 'emit');
    component.clear();
    expect(component.setInputValue).toHaveBeenCalledWith('123');
    expect(component.changeEvent.emit).toHaveBeenCalledWith('123');
  });

  it('should show icon', () => {
    const fakeThis = {
      defaultValue: '',
      getInputValue: () => 'valor'
    };
    expect(component.showIcon.call(fakeThis)).toBeTruthy();
  });

  it('shouldn`t show icon when value is equals', () => {
    const fakeThis = {
      defaultValue: '',
      getInputValue: () => ''
    };
    expect(component.showIcon.call(fakeThis)).toBeFalsy();
  });
});
