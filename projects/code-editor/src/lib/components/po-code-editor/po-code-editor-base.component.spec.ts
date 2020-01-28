import { Directive } from '@angular/core';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoCodeEditorBaseComponent } from './po-code-editor-base.component';
import { PoCodeEditorRegisterableSuggestion } from './interfaces/po-code-editor-registerable-suggestion.interface';

@Directive()
class PoCodeEditorTestComponent extends PoCodeEditorBaseComponent {
  writeValue(value: any) {}
  setLanguage(value: any) {}
  setReadOnly(value: any) {}
  setTheme(value: any) {}
  setSuggestions(value: any) {}
}

describe('PoCodeEditorBaseComponent', () => {
  let component: PoCodeEditorTestComponent;
  beforeEach(() => {
    component = new PoCodeEditorTestComponent();
  });

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

  it('shouldn`t call `setLanguage` when setting `language` with a configured editor', () => {
    const language = 'java';

    component.editor = undefined;

    spyOn(component, 'setLanguage');

    component.language = language;

    expect(component.setLanguage).not.toHaveBeenCalled();
  });

  it('should call `setSuggestions` when setting `suggestions` with a configured editor', () => {
    const suggestions: Array<PoCodeEditorRegisterableSuggestion> = [
      { label: 'po', insertText: 'Portinari UI' },
      { label: 'ng', insertText: 'Angular', documentation: 'Framework Javascript.' }
    ];

    component.editor = {};

    spyOn(component, 'setSuggestions');

    component.suggestions = suggestions;

    expect(component.setSuggestions).toHaveBeenCalled();
    expect(component.suggestions).toEqual(suggestions);
  });

  it('shouldn`t call `setSuggestions` when setting `suggestions` with a configured editor', () => {
    const suggestions: Array<PoCodeEditorRegisterableSuggestion> = [{ label: 'po', insertText: 'Portinari UI' }];

    component.editor = undefined;

    spyOn(component, 'setSuggestions');

    component.suggestions = suggestions;

    expect(component.setSuggestions).not.toHaveBeenCalled();
    expect(component.suggestions).toEqual(suggestions);
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
    const spy = spyOn(component, 'setReadOnly');
    component.editor = {};
    expectPropertiesValues(component, 'readonly', booleanValidFalseValues, false);
    expect(spy).toHaveBeenCalledWith(false);
    expectPropertiesValues(component, 'readonly', booleanValidTrueValues, true);
  });

  it('should not set readonly if there is no editor', () => {
    const booleanValidTrueValues = [true, 'true', 1, ''];
    const booleanValidFalseValues = [false, 'false', 0];
    const spy = spyOn(component, 'setReadOnly');
    component.editor = null;
    expectPropertiesValues(component, 'readonly', booleanValidFalseValues, false);
    expectPropertiesValues(component, 'readonly', booleanValidTrueValues, true);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call `setReadOnly` when setting `readonly` with a configured editor', () => {
    const readonly = true;

    component.editor = {};

    spyOn(component, 'setReadOnly');

    component.readonly = readonly;

    expect(component.setReadOnly).toHaveBeenCalled();
  });

  it('shouldn`t call `setReadOnly` when setting `readonly` with a configured editor', () => {
    const readonly = true;

    component.editor = undefined;

    spyOn(component, 'setReadOnly');

    component.readonly = readonly;

    expect(component.setReadOnly).not.toHaveBeenCalled();
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
