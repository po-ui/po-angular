import { AbstractControl } from '@angular/forms';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoFieldModule } from './../po-field.module';
import { PoInputGeneric } from './po-input-generic';
import { of, Subscription } from 'rxjs';

@Component({
  template: `
    <input type="text" #inp />
    <span #clean></span>
  `,
  standalone: false
})
class ContentProjectionComponent extends PoInputGeneric {
  constructor(el: ElementRef) {
    super(el);
  }

  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }
}

describe('PoInputGeneric:', () => {
  let component: ContentProjectionComponent;
  let fixture: ComponentFixture<ContentProjectionComponent>;

  const fakeEvent = {
    target: {
      value: '',
      keyCode: 1,
      validity: {
        valid: true
      }
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoFieldModule],
      declarations: [ContentProjectionComponent],
      providers: [ChangeDetectorRef]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('validateClassesForMask: should called if mask exists', (): void => {
    const fakeThis = {
      mask: '99999-999',
      validateClassesForMask: () => {}
    };
    spyOn(fakeThis, 'validateClassesForMask');

    component.validateInitMask.call(fakeThis);

    expect(fakeThis.validateClassesForMask).toHaveBeenCalled();
  });

  it('should call afterViewInit', () => {
    spyOn(component, 'afterViewInit');
    component.ngAfterViewInit();
    expect(component.afterViewInit).toHaveBeenCalled();
  });

  it('should call keydown from mask with keyCode different 229', () => {
    const fakeThis = {
      mask: '(999)',
      passedWriteValue: true,
      objMask: {
        keydown: (value: any) => {}
      },
      eventOnBlur: e => {},
      validateClassesForMask: (value: boolean) => {}
    };
    spyOn(fakeThis.objMask, 'keydown');
    component.onKeydown.call(fakeThis, fakeEvent);
    expect(fakeThis.objMask.keydown).toHaveBeenCalled();
  });

  it('should not call keydown from mask with keyCode different 229', () => {
    const fakeThis = {
      mask: '',
      passedWriteValue: true,
      objMask: {
        keydown: (value: any) => {}
      },
      eventOnBlur: e => {}
    };
    spyOn(fakeThis.objMask, 'keydown');
    spyOn(fakeThis, 'eventOnBlur');
    component.onKeydown.call(fakeThis, fakeEvent);
    expect(fakeThis.objMask.keydown).not.toHaveBeenCalled();
    expect(fakeThis.eventOnBlur).not.toHaveBeenCalled();
  });

  it('should not call keydown when the mask is empty and keyCode is different of 229', () => {
    const fakeThis = {
      mask: '999',
      passedWriteValue: true,
      objMask: {
        keydown: (value: any) => {}
      },
      eventOnBlur: e => {}
    };
    const fakeEventLocal = {
      target: {
        value: '',
        keyCode: 229
      }
    };
    spyOn(fakeThis.objMask, 'keydown');
    spyOn(fakeThis, 'eventOnBlur');
    component.onKeydown.call(fakeThis, fakeEventLocal);
    expect(fakeThis.objMask.keydown).not.toHaveBeenCalled();
    expect(fakeThis.eventOnBlur).not.toHaveBeenCalled();
  });

  it('should call keyup from mask with keyCode different 229', () => {
    const fakeThis = {
      mask: '(999)',
      objMask: {
        keyup: (value: any) => {},
        valueToModel: ''
      },
      callOnChange: () => {},
      errorAsyncProperties: {
        errorAsync: value => of(true),
        triggerMode: 'changeModel'
      },
      verifyErrorAsync: () => {}
    };
    const fakeEventLocal = {
      target: {
        value: '',
        keyCode: 13
      }
    };

    spyOn(fakeThis, 'callOnChange');
    spyOn(fakeThis.objMask, 'keyup');
    component.onKeyup.call(fakeThis, fakeEventLocal);
    expect(fakeThis.callOnChange).toHaveBeenCalled();
    expect(fakeThis.objMask.keyup).toHaveBeenCalled();
  });

  it('shouldn`t call keyup from mask with keyCode equal to 229', () => {
    const fakeThis = {
      mask: '(999)',
      objMask: {
        keyup: (value: any) => {},
        valueToModel: ''
      },
      callOnChange: () => {},
      eventOnBlur: e => {}
    };

    const fakeEventLocal = {
      target: {
        value: '',
        keyCode: 229
      }
    };

    spyOn(fakeThis.objMask, 'keyup');
    spyOn(fakeThis, 'eventOnBlur');

    component.onKeyup.call(fakeThis, fakeEventLocal);

    expect(fakeThis.objMask.keyup).not.toHaveBeenCalled();
    expect(fakeThis.eventOnBlur).not.toHaveBeenCalled();
  });

  it('should not call keyup when the mask is empty and keyCode is different of 229', () => {
    const fakeThis = {
      mask: '',
      objMask: {
        keyup: (value: any) => {},
        valueToModel: ''
      },
      callOnChange: () => {}
    };

    spyOn(fakeThis, 'callOnChange');
    spyOn(fakeThis.objMask, 'keyup');
    component.onKeyup.call(fakeThis, event);
    expect(fakeThis.callOnChange).not.toHaveBeenCalled();
    expect(fakeThis.objMask.keyup).not.toHaveBeenCalled();
  });

  it('should call "callOnChange" on eventInput without mask', () => {
    const fakeThis = {
      mask: false,
      callOnChange: (v: any) => {},
      validMaxLength: component.validMaxLength,
      maxlength: 5,
      inputEl: component.inputEl,
      errorAsyncProperties: {
        errorAsync: value => of(true),
        triggerMode: 'changeModel'
      },
      verifyErrorAsync: () => {}
    };
    fakeEvent.target.value = '1234567890';

    spyOn(fakeThis, 'callOnChange');
    component.eventOnInput.call(fakeThis, fakeEvent);
    expect(fakeThis.callOnChange).toHaveBeenCalledWith('12345');
    expect(fakeThis.inputEl.nativeElement.value).toBe('12345');
  });

  it('should call "callOnChange" on eventInput without uppercase', () => {
    const fakeThis = {
      upperCase: false,
      callOnChange: (v: any) => {},
      validMaxLength: component.validMaxLength,
      inputEl: component.inputEl
    };
    fakeEvent.target.value = 'teste';

    spyOn(fakeThis, 'callOnChange');
    component.eventOnInput.call(fakeThis, fakeEvent);
    expect(fakeThis.callOnChange).toHaveBeenCalledWith('teste');
    expect(fakeThis.inputEl.nativeElement.value).toBe('teste');
  });

  it('should call "callOnChange" on eventInput with uppercase', () => {
    const fakeThis = {
      upperCase: true,
      callOnChange: (v: any) => {},
      validMaxLength: component.validMaxLength,
      inputEl: component.inputEl
    };
    fakeEvent.target.value = 'teste';

    spyOn(fakeThis, 'callOnChange');
    component.eventOnInput.call(fakeThis, fakeEvent);
    expect(fakeThis.callOnChange).toHaveBeenCalledWith('TESTE');
    expect(fakeThis.inputEl.nativeElement.value).toBe('TESTE');
  });

  it('should call mask.blur on eventInput with mask', () => {
    const fakeThis = {
      mask: true,
      callOnChange: (v: any) => {},
      inputEl: component.inputEl,
      objMask: {
        blur: (v: any) => {},
        valueToInput: '',
        valueToModel: ''
      }
    };

    fakeEvent.target.value = '1234567890';

    spyOn(fakeThis.objMask, 'blur');
    spyOn(fakeThis, 'callOnChange');
    component.eventOnInput.call(fakeThis, fakeEvent);
    expect(fakeThis.callOnChange).toHaveBeenCalled();
    expect(fakeThis.objMask.blur).toHaveBeenCalled();
  });

  it('should valid maxlength when its defined', () => {
    let value = component.validMaxLength(0, '0123456789123456789');
    expect(value).toBe('');

    value = component.validMaxLength(10, '0123456789123456789');
    expect(value).toBe('0123456789');

    value = component.validMaxLength(20, '0123456789123456789');
    expect(value).toBe('0123456789123456789');

    value = component.validMaxLength(30, '0123456789123456789');
    expect(value).toBe('0123456789123456789');
  });

  it('should valid maxlength when its not defined', () => {
    let value = component.validMaxLength(undefined, '0123456789123456789');
    expect(value).toBe('0123456789123456789');

    value = component.validMaxLength(null, '0123456789123456789');
    expect(value).toBe('0123456789123456789');
  });

  it('should emit enter in eventOnFocus', () => {
    spyOn(component.enter, 'emit');
    component.eventOnFocus(fakeEvent);
    expect(component.enter.emit).toHaveBeenCalled();
  });

  it('should emit change', fakeAsync((): void => {
    component.inputEl.nativeElement.value = '';
    const fakeThis = {
      inputEl: component.inputEl,
      valueBeforeChange: '1',
      getScreenValue: component.getScreenValue,
      change: component.change,
      verifyErrorAsync: () => {}
    };

    spyOn(fakeThis.change, 'emit');
    component.controlChangeEmitter.call(fakeThis);
    tick(250);
    expect(fakeThis.change.emit).toHaveBeenCalled();
  }));

  it('should call click of the objMask when exists mask', () => {
    const fakeThis = {
      mask: true,
      objMask: {
        click: (value: any) => {}
      }
    };

    spyOn(fakeThis.objMask, 'click');
    component.eventOnClick.call(fakeThis, fakeEvent);
    expect(fakeThis.objMask.click).toHaveBeenCalledWith(fakeEvent);
  });

  it('should not call click of the objMask when not exists mask', () => {
    const fakeThis = {
      mask: false,
      objMask: {
        click: (value: any) => {}
      }
    };

    spyOn(fakeThis.objMask, 'click');
    component.eventOnClick.call(fakeThis, fakeEvent);
    expect(fakeThis.objMask.click).not.toHaveBeenCalledWith(fakeEvent);
  });

  it('should return true in hasInvalidClass', () => {
    component.el.nativeElement.classList.add('ng-invalid');
    component.el.nativeElement.classList.add('ng-dirty');
    component.inputEl.nativeElement.value = '1';
    expect(component.hasInvalidClass()).toBeTruthy();
  });

  it('should return true in hasInvalidClass if showErrorMessageRequired and required is true', () => {
    component.el.nativeElement.classList.add('ng-invalid');
    component.el.nativeElement.classList.add('ng-dirty');
    component.inputEl.nativeElement.value = '';
    component.showErrorMessageRequired = true;
    component.required = true;
    expect(component.hasInvalidClass()).toBeTruthy();
  });

  it('should return true in hasInvalidClass if showErrorMessageRequired and hasValidatorRequired is true', () => {
    component.el.nativeElement.classList.add('ng-invalid');
    component.el.nativeElement.classList.add('ng-dirty');
    component.inputEl.nativeElement.value = '';
    component.showErrorMessageRequired = true;
    component.hasValidatorRequired = true;
    expect(component.hasInvalidClass()).toBeTruthy();
  });

  it('should return false in hasInvalidClass', () => {
    component.el.nativeElement.classList.add('ng-invalid');
    component.el.nativeElement.classList.remove('ng-dirty');
    component.inputEl.nativeElement.value = '1';
    expect(component.hasInvalidClass()).toBeFalsy();

    component.el.nativeElement.classList.remove('ng-invalid');
    component.el.nativeElement.classList.add('ng-dirty');
    component.inputEl.nativeElement.value = '1';
    expect(component.hasInvalidClass()).toBeFalsy();

    component.el.nativeElement.classList.add('ng-invalid');
    component.el.nativeElement.classList.add('ng-dirty');
    component.inputEl.nativeElement.value = '';
    expect(component.hasInvalidClass()).toBeFalsy();
  });

  it('should be a valid pattern', () => {
    expect(component.verifyPattern('abc', 'abc')).toBeTruthy();
    expect(component.verifyPattern('\\d', 1)).toBeTruthy();
    expect(component.verifyPattern('\\d', 'a')).toBeFalsy();
  });

  it('should call callOnChange and controlChangeEmitter when input is cleaned', () => {
    component.clean = true;
    component.errorAsyncProperties = {
      errorAsync: value => of(true),
      triggerMode: 'changeModel'
    };

    spyOn(component, 'callOnChange');
    spyOn(component, 'controlChangeEmitter');
    component.clear('');
    expect(component.callOnChange).toHaveBeenCalled();
    expect(component.controlChangeEmitter).toHaveBeenCalled();
  });

  it('should clean input when "value" to be null', () => {
    const fakeThis = {
      inputEl: component.inputEl,
      mask: '',
      objMask: {
        controlFormatting: value => {},
        _formatModel: false
      },
      change: component.change,
      passedWriteValue: false
    };
    component.writeValueModel.call(fakeThis, '');
    expect(component.inputEl.nativeElement.value).toBe('');
    expect(fakeThis.passedWriteValue).toBeTruthy();
  });

  it('should get input value', () => {
    component.inputEl.nativeElement.value = 'valor';
    expect(component.getScreenValue()).toBe('valor');
  });

  it('should get empty value', () => {
    component.inputEl = null;
    expect(component.getScreenValue()).toBe(undefined);
  });

  it('should get error pattern with no error pattern', () => {
    const fakeThis = {
      errorPattern: '',
      hasInvalidClass: () => {}
    };

    expect(component.getErrorPattern.call(fakeThis)).toBe('');
  });

  it('should get error pattern with error pattern', () => {
    const fakeThis = {
      errorPattern: 'erro',
      hasInvalidClass: () => true
    };

    expect(component.getErrorPattern.call(fakeThis)).toBe('erro');
  });

  describe('Properties:', () => {
    it('autocomplete: should return `off` if `noAutocomplete` is true', () => {
      component.noAutocomplete = true;

      expect(component.autocomplete).toBe('off');
    });

    it('autocomplete: should return `on` if `noAutocomplete` is false', () => {
      component.noAutocomplete = false;

      expect(component.autocomplete).toBe('on');
    });
  });

  describe('Methods:', () => {
    function createFakeThis(hasMask: boolean) {
      return {
        mask: hasMask,
        objMask: { blur: (value: any) => {} },
        blur: component.blur,
        controlChangeEmitter: () => {},
        onTouched: () => {},
        getAdditionalHelpTooltip: () => false
      };
    }

    it('focus: should call `focus` of input', () => {
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of input if `disabled`', () => {
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
    });

    it('getScreenValue: should get input numeric value when call `getScreenValue` method.', () => {
      component.type = 'number';
      component.inputEl.nativeElement.value = '123.1';
      expect(component.getScreenValue()).toBe(123.1);
    });

    it('getScreenValue: should return undefined when call `getScreenValue` method with invalid value to `parseFloat`.', () => {
      component.type = 'number';
      component.inputEl.nativeElement.value = 'A';
      expect(component.getScreenValue()).toBe(null);
    });

    it('onKeydown: should not call keydown from mask with keyCode and readonly. ', () => {
      const fakeThis = {
        mask: '(999)',
        readonly: true,
        objMask: {
          keydown: (value: any) => {}
        },
        eventOnBlur: e => {}
      };
      spyOn(fakeThis.objMask, 'keydown');
      component.onKeydown.call(fakeThis, fakeEvent);
      expect(fakeThis.objMask.keydown).not.toHaveBeenCalled();
    });

    it('onKeydown: should emit event when field is focused', () => {
      const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.keydown, 'emit');
      spyOnProperty(document, 'activeElement', 'get').and.returnValue(component.inputEl.nativeElement);

      component.onKeyDown(fakeEvent);

      expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
    });

    it('onKeydown: should not emit event when field is not focused', () => {
      const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.keydown, 'emit');
      spyOnProperty(document, 'activeElement', 'get').and.returnValue(document.createElement('div'));
      component.onKeyDown(fakeEvent);

      expect(component.keydown.emit).not.toHaveBeenCalled();
    });

    it('onKeyup: should not call keyup from mask with keyCode and readonly.', () => {
      const fakeThis = {
        mask: '(999)',
        readonly: true,
        objMask: {
          keyup: (value: any) => {},
          valueToModel: ''
        },
        callOnChange: () => {},
        eventOnBlur: e => {}
      };

      spyOn(fakeThis.objMask, 'keyup');
      component.onKeyup.call(fakeThis, fakeEvent);
      expect(fakeThis.objMask.keyup).not.toHaveBeenCalled();
    });

    it('verifyAutoFocus: should call `focus` if autofocus is true', () => {
      const fakeThis = {
        autoFocus: true,
        focus: () => {}
      };

      spyOn(fakeThis, 'focus');

      component.verifyAutoFocus.call(fakeThis);

      expect(fakeThis.focus).toHaveBeenCalled();
    });

    it('verifyAutoFocus: shouldn`t call `focus` if autofocus is false', () => {
      const fakeThis = {
        autofocus: false,
        focus: () => {},
        getAdditionalHelpTooltip: () => false
      };

      spyOn(fakeThis, 'focus');

      component.verifyAutoFocus.call(fakeThis);

      expect(fakeThis.focus).not.toHaveBeenCalled();
    });

    describe('eventOnBlur:', () => {
      let setupTest;

      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          spyOn(component, 'showAdditionalHelp');
        };
      });

      it('should call showAdditionalHelp when the tooltip is displayed', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: false });
        component.eventOnBlur(fakeEvent);
        expect(component.showAdditionalHelp).toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });
        component.eventOnBlur(fakeEvent);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });
        component.eventOnBlur(fakeEvent);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should call `objMask.blur` when exists a `mask`.', () => {
        const fakeThis = createFakeThis(true);

        spyOn(fakeThis.objMask, 'blur');
        spyOn(fakeThis, <any>'onTouched');

        component.eventOnBlur.call(fakeThis, fakeEvent);

        expect(fakeThis['onTouched']).toHaveBeenCalled();
        expect(fakeThis.objMask.blur).toHaveBeenCalled();
      });

      it('shouldn´t call `objMask.blur` when not exists a `mask`.', () => {
        const fakeThis = createFakeThis(false);

        spyOn(fakeThis.objMask, 'blur');
        spyOn(fakeThis, <any>'onTouched');

        component.eventOnBlur.call(fakeThis, fakeEvent);

        expect(fakeThis['onTouched']).toHaveBeenCalled();
        expect(fakeThis.objMask.blur).not.toHaveBeenCalled();
      });

      it('should call `blur.emit` and `controlChangeEmitter` when `event.type` is blur.', () => {
        const fakeThis = createFakeThis(false);

        spyOn(fakeThis.blur, 'emit');
        spyOn(fakeThis, 'controlChangeEmitter');
        spyOn(fakeThis, <any>'onTouched');

        component.eventOnBlur.call(fakeThis, { type: 'blur' });

        expect(fakeThis['onTouched']).toHaveBeenCalled();
        expect(fakeThis.blur.emit).toHaveBeenCalled();
        expect(fakeThis.controlChangeEmitter).toHaveBeenCalled();
      });

      it('shouldn`t call `blur.emit` and `controlChangeEmitter` when `event.type` is undefined.', () => {
        const fakeThis = createFakeThis(false);

        spyOn(fakeThis.blur, 'emit');
        spyOn(fakeThis, 'controlChangeEmitter');
        spyOn(fakeThis, <any>'onTouched');

        component.eventOnBlur.call(fakeThis, fakeEvent);

        expect(fakeThis['onTouched']).toHaveBeenCalled();
        expect(fakeThis.blur.emit).not.toHaveBeenCalled();
        expect(fakeThis.controlChangeEmitter).not.toHaveBeenCalled();
      });

      it('shouldn´t throw error if onTouched is falsy', () => {
        component['onTouched'] = null;

        const fnError = () => component.eventOnBlur(fakeEvent);

        expect(fnError).not.toThrow();
      });
    });

    it('validateClassesForPattern: should add invalid classes if pattern validation failed.', () => {
      component.pattern = '[a-z]';
      component.inputEl.nativeElement.value = '2';

      component.validateClassesForPattern();

      expect(component.el.nativeElement.classList).toContain('ng-invalid');
      expect(component.el.nativeElement.classList).toContain('ng-dirty');
    });

    it('validateClassesForPattern: should not have invalid class if pattern validation passed.', () => {
      component.pattern = '[a-z]';
      component.inputEl.nativeElement.value = 'a';

      component.validateClassesForPattern();

      expect(component.el.nativeElement.classList).not.toContain('ng-invalid');
    });

    it('validateClassesForMask: should add invalid classes if maskValid validation failed.', (): void => {
      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: undefined
          }
        },
        el: {
          nativeElement: {
            classList: {
              add: value => {},
              get: 'ng-invalid-mask'
            }
          }
        },
        mask: '99999-999'
      };

      component.validateClassesForMask.call(fakeThis);

      expect(fakeThis.el.nativeElement.classList.get).toContain('ng-invalid-mask');
      expect(fakeThis.el.nativeElement.classList.get).toContain('ng-invalid-mask');
    });

    it('validateClassesForMask: should remove invalid classes if maskValid validation sucess.', (): void => {
      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: '12345-678'
          }
        },
        el: {
          nativeElement: {
            classList: {
              add: value => {},
              get: 'ng-invalid-mask',
              remove: value => {}
            }
          }
        },
        mask: '99999-999'
      };
      spyOn(fakeThis.el.nativeElement.classList, 'remove');

      component.validateClassesForMask.call(fakeThis);

      expect(fakeThis.el.nativeElement.classList.remove).toHaveBeenCalledWith('ng-invalid-mask');
    });

    it('controlChangeEmitter: should emit change with input value if input value changes', fakeAsync((): void => {
      const inputValue = 'value';

      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: inputValue
          }
        },
        valueBeforeChange: '1',
        change: component.change,
        verifyErrorAsync: () => {}
      };

      spyOn(fakeThis.change, 'emit');
      component.controlChangeEmitter.call(fakeThis);
      tick(250);
      expect(fakeThis.change.emit).toHaveBeenCalledWith(inputValue);
    }));

    it('controlChangeEmitter: should not emit change if input value doesn`t change', fakeAsync((): void => {
      const inputValue = 'value';

      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: inputValue
          }
        },
        valueBeforeChange: inputValue,
        change: {
          emit: () => {}
        }
      };

      spyOn(fakeThis.change, 'emit');
      component.controlChangeEmitter.call(fakeThis);
      tick(250);
      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    }));

    it('writeValueModel: should emit changeModel', () => {
      const value = 'valor';
      const fakeThis = {
        inputEl: '',
        mask: '',
        changeModel: component.changeModel,
        passedWriteValue: false,
        validateClassesForMask: () => {},
        validateInitMask: () => {},
        verifyErrorAsync: () => {}
      };
      spyOn(component.changeModel, 'emit');
      component.writeValueModel.call(fakeThis, value);
      expect(component.changeModel.emit).toHaveBeenCalledWith(value);
      expect(fakeThis.passedWriteValue).toBeTruthy();
    });

    it('writeValueModel: should not emit changeModel if value doesn`t exist', () => {
      const fakeThis = {
        inputEl: '',
        mask: '',
        changeModel: component.changeModel,
        passedWriteValue: false,
        validateClassesForMask: () => {}
      };
      spyOn(component.changeModel, 'emit');
      component.writeValueModel.call(fakeThis, '');
      expect(component.changeModel.emit).not.toHaveBeenCalled();
      expect(fakeThis.passedWriteValue).toBeTruthy();
    });

    it('writeValueModel: should set value in input', () => {
      const fakeThis = {
        inputEl: component.inputEl,
        mask: '',
        changeModel: component.changeModel,
        passedWriteValue: false,
        validateClassesForMask: () => {},
        validateInitMask: () => {},
        verifyErrorAsync: () => {}
      };
      component.writeValueModel.call(fakeThis, 'valor');
      expect(component.inputEl.nativeElement.value).toBe('valor');
      expect(fakeThis.passedWriteValue).toBeTruthy();
    });

    it('writeValueModel: should set value in input, formatted with mask', () => {
      const fakeThis = {
        inputEl: component.inputEl,
        mask: '(999)',
        objMask: {
          controlFormatting: value => value + ' formatted',
          _formatModel: false
        },
        changeModel: component.changeModel,
        passedWriteValue: false,
        validateClassesForMask: () => {},
        validateInitMask: () => {},
        verifyErrorAsync: () => {}
      };
      component.writeValueModel.call(fakeThis, 'valor');
      expect(component.inputEl.nativeElement.value).toBe('valor formatted');
      expect(fakeThis.passedWriteValue).toBeTruthy();
    });

    it('writeValueModel: should set value in input, formatted with mask and model formatted', () => {
      const fakeThis = {
        inputEl: component.inputEl,
        mask: '(999)',
        objMask: {
          controlFormatting: value => value + ' formatted',
          formatModel: true
        },
        changeModel: component.changeModel,
        callUpdateModelWithTimeout: component.callUpdateModelWithTimeout,
        passedWriteValue: false,
        validateClassesForMask: () => {},
        validateInitMask: () => {},
        verifyErrorAsync: () => {}
      };
      const callUpdateModelWithTimeout = spyOn(fakeThis, <any>'callUpdateModelWithTimeout');
      component.writeValueModel.call(fakeThis, 'valor');
      expect(component.inputEl.nativeElement.value).toBe('valor formatted');
      expect(callUpdateModelWithTimeout).toHaveBeenCalled();
      expect(fakeThis.passedWriteValue).toBeTruthy();
    });
  });

  describe('verifyErrorAsync', () => {
    beforeEach(() => {
      component['cd'] = { detectChanges: () => {} } as any;
      component['inputEl'] = { nativeElement: { value: 'test' } } as ElementRef;
      component['el'] = { nativeElement: document.createElement('div') } as ElementRef;

      component.errorPattern = 'Erro de exemplo';
      component.errorAsyncProperties = {
        errorAsync: jasmine.createSpy('errorAsync').and.returnValue(of(true))
      };

      component['subscriptionValidator'] = new Subscription();
    });

    afterEach(() => {
      component['subscriptionValidator'].unsubscribe();
    });

    it('should add ng-invalid and ng-dirty classes when error is true', () => {
      spyOn(component['cd'], 'detectChanges');
      component.verifyErrorAsync();

      expect(component.errorAsyncProperties.errorAsync).toHaveBeenCalledWith('test');
      expect(component['el'].nativeElement.classList.contains('ng-invalid')).toBeTrue();
      expect(component['el'].nativeElement.classList.contains('ng-dirty')).toBeTrue();
      expect(component['cd'].detectChanges).toHaveBeenCalled();
    });

    it('should remove ng-invalid class when error is false and isInvalid is false', () => {
      spyOn(component['cd'], 'detectChanges');
      component.errorAsyncProperties.errorAsync = jasmine.createSpy('errorAsync').and.returnValue(of(false));
      component['el'].nativeElement.classList.add('ng-invalid');
      component['el'].nativeElement.classList.add('ng-dirty');
      component.isInvalid = false;

      component.verifyErrorAsync();

      expect(component.errorAsyncProperties.errorAsync).toHaveBeenCalledWith('test');
      expect(component['el'].nativeElement.classList.contains('ng-invalid')).toBeFalse();
      expect(component['cd'].detectChanges).toHaveBeenCalled();
    });

    it('must cancel the previous subscription from subscriptionValidator', () => {
      const unsubscribeSpy = spyOn(component['subscriptionValidator'], 'unsubscribe');

      component.verifyErrorAsync();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
