import { PoCleanBaseComponent } from './po-clean-base.component';

class PoClean extends PoCleanBaseComponent {
  setInputValue(value: string): void {}

  getInputValue(): string {
    return '';
  }
}

describe('PoCleanBaseComponent', () => {
  const component = new PoClean();

  component['parentComponent'] = {
    onChangePropagate: function() {}
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

  it('should return a boolean value if parentComponent has clean attr', () => {
    component['parentComponent']['clean'] = true;

    expect(component['hasCleanAttr']()).toBeTruthy();
  });

  it('should return disabled attr of parentComponent', () => {
    component['parentComponent']['disabled'] = true;

    expect(component['isDisabled']()).toBeTruthy();
  });

  it('should return readonly attr of parentComponent', () => {
    component['parentComponent']['readonly'] = true;

    expect(component['isReadonly']()).toBeTruthy();
  });

  it('should show icon', () => {
    const fakeThis = {
      defaultValue: '',
      getInputValue: () => 'valor',
      hasCleanAttr: () => true,
      isDisabled: () => false,
      isReadonly: () => false
    };
    expect(component.showIcon.call(fakeThis)).toBeTruthy();
  });

  it('shouldn`t show icon when value is equals', () => {
    const fakeThis = {
      defaultValue: '',
      getInputValue: () => '',
      hasCleanAttr: () => true,
      isDisabled: () => false,
      isReadonly: () => false
    };
    expect(component.showIcon.call(fakeThis)).toBeFalsy();
  });

  it('shouldn`t show icon when is disabled', () => {
    const fakeThis = {
      defaultValue: '',
      getInputValue: () => 'valor',
      hasCleanAttr: () => true,
      isDisabled: () => true,
      isReadonly: () => false
    };
    expect(component.showIcon.call(fakeThis)).toBeFalsy();
  });

  it('shouldn`t show icon when is readonly', () => {
    const fakeThis = {
      defaultValue: '',
      getInputValue: () => 'valor',
      hasCleanAttr: () => true,
      isDisabled: () => false,
      isReadonly: () => true
    };
    expect(component.showIcon.call(fakeThis)).toBeFalsy();
  });

  it('shouldn`t show icon when hasn`t clean attr', () => {
    const fakeThis = {
      defaultValue: '',
      getInputValue: () => 'valor',
      hasCleanAttr: () => false,
      isDisabled: () => false
    };
    expect(component.showIcon.call(fakeThis)).toBeFalsy();
  });
});
