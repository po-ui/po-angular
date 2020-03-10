import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoCodeEditorBaseComponent } from './po-code-editor-base.component';

class PoCodeEditorTestComponent extends PoCodeEditorBaseComponent {
  writeValue(value: any) {}
  setLanguage(value: any) {}
  setReadOnly(value: any) {}
  setTheme(value: any) {}
}

describe('PoCodeEditorBaseComponent', () => {
  const component = new PoCodeEditorTestComponent();

  it('should be created', () => {
    expect(component instanceof PoCodeEditorBaseComponent).toBeTruthy();
  });

  it('should set language', () => {
    const validValues = ['java', 'javascript', 'typescript'];
    const invalidValues = [undefined, null, '', false, true];

    expectPropertiesValues(component, 'language', invalidValues, 'plainText');

    component.editor = {};

    spyOn(component, 'setLanguage');
    expectPropertiesValues(component, 'language', validValues, validValues);
    expect(component.setLanguage).toHaveBeenCalled();
  });

  it('should set show-diff', () => {
    const booleanValidTrueValues = [true, 'true', 1, ''];
    const booleanValidFalseValues = [false, 'false', 0];

    expectPropertiesValues(component, 'showDiff', booleanValidFalseValues, false);
    expectPropertiesValues(component, 'showDiff', booleanValidTrueValues, true);
  });

  it('should set theme', () => {
    const validThemes = ['vs-dark', 'vs', 'hc-black'];
    const invalidThemes = ['test', 'black', '', null, undefined];
    spyOn(component, 'setTheme');

    component.editor = null;

    expectPropertiesValues(component, 'theme', invalidThemes, 'vs');
    expect(component.setTheme).not.toHaveBeenCalled();

    component.editor = {};

    expectPropertiesValues(component, 'theme', validThemes, validThemes);
    expect(component.setTheme).toHaveBeenCalled();
  });

  it('should set readonly', () => {
    const booleanValidTrueValues = [true, 'true', 1, ''];
    const booleanValidFalseValues = [false, 'false', 0];

    expectPropertiesValues(component, 'readonly', booleanValidFalseValues, false);
    expectPropertiesValues(component, 'readonly', booleanValidTrueValues, true);
  });

  it('should set height', () => {
    const invalidHeights = ['', '0', '100', null, undefined, false, true];

    expectPropertiesValues(component, 'height', invalidHeights, '150px');
    expectPropertiesValues(component, 'height', 200, '200px');
    expectPropertiesValues(component, 'height', '250px', '250px');
    expectPropertiesValues(component, 'height', '300', '300px');
  });

  it('should get options', () => {
    const fakeThis = {
      language: 'javascript',
      theme: 'vs'
    };

    const options = component.getOptions.call(fakeThis);

    expect(options.language).toBe('javascript');
    expect(options.theme).toBe('vs');
  });

  it('should register function OnChangePropagate', () => {
    component.onChangePropagate = undefined;
    const func = () => true;

    component.registerOnChange(func);
    expect(component.onChangePropagate).toBe(func);
  });

  it('should register function registerOnTouched', () => {
    component.onTouched = undefined;
    const func = () => true;

    component.registerOnTouched(func);
    expect(component.onTouched).toBe(func);
  });
});
