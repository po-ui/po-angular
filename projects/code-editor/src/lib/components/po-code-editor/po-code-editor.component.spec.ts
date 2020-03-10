import { ComponentFixture, fakeAsync, TestBed, tick, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PoCodeEditorComponent } from './po-code-editor.component';
import { PoCodeEditorRegister } from './po-code-editor-register.service';

describe('PoCodeEditorComponent', () => {
  let component: PoCodeEditorComponent;
  let fixture: ComponentFixture<PoCodeEditorComponent>;
  let testBedConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoCodeEditorComponent],
      providers: [PoCodeEditorRegister],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCodeEditorComponent);
    component = fixture.componentInstance;

    testBedConfig = TestBed.inject(PoCodeEditorRegister);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should define Code editor register', inject([PoCodeEditorRegister], (injectConfig: PoCodeEditorRegister) => {
    expect(injectConfig).toBe(testBedConfig);
  }));

  it('should set theme', () => {
    expect(component.setTheme).toBeDefined();
  });

  it('should set language with showDiff', () => {
    const fakeThis = {
      showDiff: true,
      editor: {
        getModel: () => {
          return { original: '', modified: '' };
        }
      },
      setMonacoLanguage: () => {}
    };

    spyOn(fakeThis, 'setMonacoLanguage');
    component.setLanguage.call(fakeThis, 'javascript');
    expect(fakeThis.setMonacoLanguage).toHaveBeenCalledTimes(2);
  });

  it('should set language without showDiff', () => {
    const fakeThis = {
      showDiff: false,
      editor: {
        getModel: () => {
          return { original: '', modified: '' };
        }
      },
      setMonacoLanguage: () => {}
    };

    spyOn(fakeThis, 'setMonacoLanguage');
    component.setLanguage.call(fakeThis, 'javascript');
    expect(fakeThis.setMonacoLanguage).toHaveBeenCalledTimes(1);
  });

  it('should call monaco register sintax', () => {
    const fakeThis = {
      codeEditorRegister: {
        language: 'terraform'
      }
    };

    (<any>window).monaco = {
      languages: {
        register: () => {},
        setMonarchTokensProvider: () => {}
      }
    };

    spyOn((<any>window).monaco.languages, <any>'register');
    spyOn((<any>window).monaco.languages, <any>'setMonarchTokensProvider');

    component['registerCustomLanguage'].call(fakeThis);
    expect((<any>window).monaco.languages.register).toHaveBeenCalled();
    expect((<any>window).monaco.languages.setMonarchTokensProvider).toHaveBeenCalled();
  });

  it('should init monaco in ngDoCheck', () => {
    const fakeThis = {
      canLoad: true,
      el: {
        nativeElement: {
          offsetWidth: 10
        }
      },
      initMonaco: () => {},
      registerCustomLanguage: () => {},
      getOptions: () => {}
    };

    spyOn(fakeThis, 'initMonaco');

    component.ngDoCheck.call(fakeThis);
    expect(fakeThis.initMonaco).toHaveBeenCalled();
  });

  it('shouldn`t init monaco in ngDoCheck', () => {
    const fakeThis = {
      canLoad: true,
      el: {
        nativeElement: {
          offsetWidth: null
        }
      },
      initMonaco: () => {},
      getOptions: () => {}
    };

    spyOn(fakeThis, 'initMonaco');

    component.ngDoCheck.call(fakeThis);
    expect(fakeThis.initMonaco).not.toHaveBeenCalled();
  });

  it('should call setValue in setValueInEditor', fakeAsync(() => {
    const fakeThis: any = {
      showDiff: false,
      editor: {
        setValue: ({}) => true
      }
    };

    spyOn(fakeThis.editor, 'setValue').and.returnValue('');
    component.setValueInEditor.call(fakeThis);
    tick(100);

    expect(fakeThis.editor.setValue).toHaveBeenCalled();
  }));

  it('should call setModel in setValueInEditor', fakeAsync(() => {
    const fakeThis: any = {
      showDiff: true,
      editor: {
        setModel: ({}) => true
      },
      monacoCreateModel: () => {}
    };

    spyOn(fakeThis, 'monacoCreateModel').and.returnValue('');
    component.setValueInEditor.call(fakeThis);
    tick(100);

    expect(fakeThis.monacoCreateModel).toHaveBeenCalled();
  }));

  it('should call setValueInEditor in writeValue', fakeAsync(() => {
    component.value = '';
    component.modifiedValue = '';

    spyOn(component, 'setValueInEditor');
    component.writeValue('teste');
    tick(100);

    expect(component.setValueInEditor).toHaveBeenCalled();
  }));

  it('should set value to the editor in writeValue', fakeAsync(() => {
    component.value = 'a';
    component.modifiedValue = 'b';

    component.writeValue(['a', 'b']);
    tick(100);

    expect(component.value).toBe('a');
    expect(component.modifiedValue).toBe('b');
  }));

  it('should call updateOptions in setReadOnly with true', () => {
    const fakeThis: any = {
      editor: {
        updateOptions: {}
      }
    };
    spyOn(fakeThis.editor, 'updateOptions');
    component.setReadOnly.call(fakeThis, true);
    expect(fakeThis.editor.updateOptions).toHaveBeenCalledWith({ readOnly: true });
  });
});
