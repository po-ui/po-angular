import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoDecimalComponent } from './po-decimal.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';

describe('PoDecimalComponent:', () => {
  let component: PoDecimalComponent;
  let fixture: ComponentFixture<PoDecimalComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoDecimalComponent,
        PoFieldContainerComponent,
        PoCleanComponent,
        PoFieldContainerBottomComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDecimalComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.clean = true;
    component['regex'] = {
      thousand: new RegExp('\\' + '.', 'g'),
      decimal: new RegExp('\\' + ',', 'g')
    };

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should update property `p-decimal-length` with `2` if invalid values', () => {
    const invalidValues = [undefined, null, '', true, false, 'string', [], {}];

    expectPropertiesValues(component, 'decimalsLength', invalidValues, 2);
  });

  it('should update property `p-decimals-length` with valid values', () => {
    const validValues = [0, 4];

    expectPropertiesValues(component, 'decimalsLength', validValues, validValues);
  });

  it('should update property `p-thousand-maxlength` with `13` if invalid values', () => {
    const invalidValues = [undefined, null, '', true, false, 'string', [], {}, 15];

    expectPropertiesValues(component, 'thousandMaxlength', invalidValues, 13);
  });

  it('should update property `p-thousand-maxlength` with valid values', () => {
    const validValues = [5, 8];

    expectPropertiesValues(component, 'thousandMaxlength', validValues, validValues);
  });

  it('should create button clean', () => {
    expect(nativeElement.querySelector('po-clean')).not.toBeNull();
  });

  it('should not create button clean', () => {
    component.clean = false;
    expect(nativeElement.querySelector('po-clean').length).toBe(undefined);
  });

  it('should have a Label', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Label de teste');
  });

  it('should have a Help', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
  });

  it('should return a false value if isValidNumber method called with event that contains key `a`', () => {
    const fakeEvent = {
      which: '97',
      key: 'a'
    };

    const isNumberValid = component.isValidNumber(fakeEvent);
    expect(isNumberValid).toBeFalsy();
  });

  it('should return true in hasInvalidClass', () => {
    const fakeThis = {
      el: component.inputEl,
      getScreenValue: () => { }
    };

    fakeThis.el.nativeElement.classList.add('ng-invalid');
    fakeThis.el.nativeElement.classList.add('ng-dirty');
    expect(component.hasInvalidClass.call(fakeThis)).toBeTruthy();
  });

  it('blur event must be called', () => {
    const fakeEvent = {
      target: {
        value: '123.456'
      }
    };

    spyOn(component.blur, 'emit');
    spyOn(component, <any>'controlChangeEmitter');

    component.onBlur(fakeEvent);
    expect(component.blur.emit).toHaveBeenCalled();
    expect(component['controlChangeEmitter']).toHaveBeenCalled();
  });

  it('blur event must be called else path value undefined', () => {
    const fakeEvent = {
      target: {}
    };

    spyOn(component.blur, 'emit');
    spyOn(component, <any>'controlChangeEmitter');

    component.onBlur(fakeEvent);
    expect(component.blur.emit).toHaveBeenCalled();
    expect(component['controlChangeEmitter']).toHaveBeenCalled();
  });

  it('blur event must be called if hasletters', () => {
    const fakeEvent = {
      target: {
        value: 'ABC'
      }
    };

    spyOn(component, <any>'setViewValue');
    spyOn(component, <any>'callOnChange');

    component.onBlur(fakeEvent);
    expect(component['setViewValue']).toHaveBeenCalled();
    expect(component['callOnChange']).toHaveBeenCalled();
  });

  it('should have a call onInput method', () => {
    const fakeEvent = {
      target: {
        selectionStart: 2,
        selectionEnd: 5,
        value: '10425'
      }
    };

    spyOn(component, <any>'setViewValue');
    spyOn(component, <any>'setCursorInput');
    spyOn(component, <any>'callOnChange');

    component.onInput(fakeEvent);

    expect(component['setViewValue']).toHaveBeenCalled();
    expect(component['setCursorInput']).toHaveBeenCalled();
    expect(component['callOnChange']).toHaveBeenCalled();
  });

  it('should have a call onInput method with this.isKeyboardAndroid true', () => {
    component['isKeyboardAndroid'] = true;

    const fakeEvent = {
      target: {
        selectionStart: 2,
        selectionEnd: 5,
        value: '10425',
        setSelectionRange: (start, end) => { }
      }
    };

    spyOn(component, <any>'onInputKeyboardAndroid');

    component.onInput(fakeEvent);

    expect(component['onInputKeyboardAndroid']).toHaveBeenCalled();
  });

  it('should call the onInputKeyboardAndroid method with the false isValidKey method', () => {

    const fakeThis = {
      preventDefault: () => { },
      hasLetters: () => { },
      setPositionValue: () => { },
      isValidKey: () => false
    };

    const fakeEvent = {
      target: {
        selectionStart: 1,
        value: ',10.100,10,02',
      },
      key: ','
    };

    spyOn(fakeThis, 'isValidKey');

    component.onInputKeyboardAndroid.call(fakeThis, fakeEvent);

    expect(fakeThis.isValidKey).toHaveBeenCalled();
  });

  it('should have a call onInput method KeyboardAndroid', () => {
    const fakeEvent = {
      target: {
        selectionStart: 2,
        selectionEnd: 5,
        value: '10425'
      }
    };

    spyOn(component, <any>'setViewValue');
    spyOn(component, <any>'setCursorInput');
    spyOn(component, <any>'callOnChange');

    component.onInput(fakeEvent);
    expect(component['setViewValue']).toHaveBeenCalled();
    expect(component['setCursorInput']).toHaveBeenCalled();
    expect(component['callOnChange']).toHaveBeenCalled();
  });

  it('should call setPositiionValue if onInputKeyboardAndroid was called', () => {
    const fakeEvent = {
      target: {
        selectionStart: 2,
        selectionEnd: 5,
        value: '100.000,500,02',
        setSelectionRange: () => { }
      },
      key: ',',
      preventDefault: () => { }
    };

    spyOn(component, <any>'setPositionValue');

    component.onInputKeyboardAndroid(fakeEvent);

    expect(component['setPositionValue']).toHaveBeenCalled();
  });

  it('should call preventDefault() in onInputKeyboardandroid if target.value contains letters', () => {
    const fakeEvent = {
      target: {
        selectionStart: 2,
        selectionEnd: 5,
        value: 'ABCDEFGH',
        setSelectionRange: () => { }
      },
      preventDefault: () => { }
    };

    spyOn(fakeEvent, 'preventDefault');

    component.onInputKeyboardAndroid(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it('should return null in extraValidation()', () => {
    expect(component.extraValidation(null)).toBeNull();
  });

  it('should have a call getScreenValue method', () => {
    const fakeThis = {
      inputEl: undefined
    };

    expect(component.getScreenValue.apply(fakeThis)).toEqual('');
  });

  it('should set focus', () => {
    const fakeThis = {
      focus: true,
      inputEl: component.inputEl
    };

    spyOn(fakeThis.inputEl.nativeElement, 'focus');
    component['putFocus'].call(fakeThis);
    expect(fakeThis.inputEl.nativeElement.focus).toHaveBeenCalled();
  });

  it('should not set focus', () => {
    const fakeThis = {
      focus: false,
      inputEl: component.inputEl
    };

    spyOn(fakeThis.inputEl.nativeElement, 'focus');
    component['putFocus'].call(fakeThis);
    expect(fakeThis.inputEl.nativeElement.focus).not.toHaveBeenCalled();
  });

  it('should have a call replaceCommaToDot method', () => {
    const fakeThis = {
      regex: {
        decimal: ','
      }
    };

    const valueFormatted = component['replaceCommaToDot'].call(fakeThis, '123,10');
    expect(valueFormatted).toEqual('123.10');
  });

  it('should have a call replaceCommaToDot method with undefined param', () => {
    const fakeThis = {
      regex: {
        decimal: ','
      }
    };

    const valueFormatted = component['replaceCommaToDot'].call(fakeThis, undefined);
    expect(valueFormatted).toEqual('');
  });

  it('should have a call formatValueWithoutThousandSeparator method', () => {
    const fakeThis = {
      regex: {
        thousand: '.'
      }
    };

    const valueFormatted = component['formatValueWithoutThousandSeparator'].call(fakeThis, '12345.10');
    expect(valueFormatted).toEqual('1234510');
  });

  it('should have a call formatValueWithoutThousandSeparator method with undefined param', () => {
    const fakeThis = {
      regex: {
        thousand: '.'
      }
    };

    const valueFormatted = component['formatValueWithoutThousandSeparator'].call(fakeThis, undefined);
    expect(valueFormatted).toEqual('');
  });

  it('should return `true` value if call isKeyDecimalSeparator() with event.key `,`', () => {
    const event = {
      key: ','
    };

    const isKeyDecimalSeparator = component['isKeyDecimalSeparator'](event);
    expect(isKeyDecimalSeparator).toBeTruthy();
  });

  it('should return `true` value if call isKeyDecimalSeparator() with event.char `,`', () => {
    const event = {
      key: '',
      char: ','
    };

    const isKeyDecimalSeparator = component['isKeyDecimalSeparator'](event);
    expect(isKeyDecimalSeparator).toBeTruthy();
  });

  it('should have a call containsComma method', () => {
    const containsComma = component['containsComma']('123456789,10');
    expect(containsComma).toBeTruthy();
  });

  it('should have the get value after thousand separator', () => {
    const valueAfterSeparator = component['getValueAfterSeparator']('123456.10', '.');
    expect(valueAfterSeparator).toEqual('10');
  });

  it('should have the get value after thousand Separator with undefined param', () => {
    const valueAfterSeparator = component['getValueAfterSeparator'](undefined, '.');
    expect(valueAfterSeparator).toEqual('');
  });

  it('should have a call getValueBeforeSeparator method', () => {
    const valueBeforeSeparator = component['getValueBeforeSeparator']('123456.10', '.');
    expect(valueBeforeSeparator).toEqual('123456');
  });

  it('should have a call getValueBeforeSeparator method with undefined param', () => {
    const valueBeforeSeparator = component['getValueBeforeSeparator'](undefined, '.');
    expect(valueBeforeSeparator).toEqual('');
  });

  it('should have a call addZeroBefore method', () => {
    const addZeroBefore = component['addZeroBefore'](',');
    expect(addZeroBefore).toEqual('0,');
  });

  it('should have a call addZeroBefore method without comma', () => {
    const addZeroBefore = component['addZeroBefore']('10');
    expect(addZeroBefore).toEqual('10');
  });

  it('should have a call setPositionValue method', () => {
    const fakeThis = {
      target: {
        value: '12A45',
        selectionStart: 3
      },
      setPositionValue: () => { },
      key: '-'
    };

    component['setPositionValue'](fakeThis);
    expect(fakeThis.target.value).toEqual('1245');
  });

  it('should have a call setPositionValue method with position 0', () => {
    const fakeThis = {
      target: {
        value: '12345',
        selectionStart: 0
      }
    };

    component['setPositionValue'](fakeThis);
    expect(fakeThis.target.value).toEqual('12345');
  });

  it('should have a call setViewValue method', () => {
    const fakeThis = {
      inputEl: component.inputEl,
    };

    component['setViewValue'].call(fakeThis, '123456.10');
    expect(fakeThis.inputEl.nativeElement.value).toEqual('123456.10');
  });

  it('should have a call setCursorInput method', () => {
    const fakeEvent = {
      target: {
        value: '123456789',
        setSelectionRange: () => { }
      }
    };

    spyOn(fakeEvent.target, 'setSelectionRange');

    component['setCursorInput'](fakeEvent, 2, 5);

    expect(fakeEvent.target.setSelectionRange).toHaveBeenCalled();

  });

  it('should call event.setSelectionRange() from setCursorInput() with 3 and 3 values', () => {
    const fakeEvent = {
      target: {
        value: '0,',
        setSelectionRange: () => { }
      }
    };

    spyOn(fakeEvent.target, 'setSelectionRange');

    component['setCursorInput'](fakeEvent, 2, 2);

    expect(fakeEvent.target.setSelectionRange).toHaveBeenCalledWith(3, 3);

  });

  it('should call event.setSelectionRange() and hasLessDot() from setCursorInput() and subtract value params', () => {
    component['hasLessDot'] = () => true;

    const fakeEvent = {
      target: {
        value: '122',
        setSelectionRange: () => { }
      }
    };

    spyOn(fakeEvent.target, 'setSelectionRange');

    component['setCursorInput'](fakeEvent, 2, 2);

    expect(fakeEvent.target.setSelectionRange).toHaveBeenCalledWith(1, 1);
  });

  it('should call event.setSelectionRange() from setCursorInput() without add or subract value params', () => {
    const fakeEvent = {
      target: {
        value: '12345',
        setSelectionRange: () => { }
      }
    };

    spyOn(fakeEvent.target, 'setSelectionRange');

    component['setCursorInput'](fakeEvent, 2, 2);

    expect(fakeEvent.target.setSelectionRange).toHaveBeenCalledWith(2, 2);
  });

  it('should have a call hasLessDot method', () => {
    component['oldDotsLength'] = 2;

    const isLessDot = component['hasLessDot']('12.100');

    expect(isLessDot).toBeTruthy();
  });

  it('should have a call hasMoreDot method if path', () => {
    component['oldDotsLength'] = 1;

    const hasMoreDot = component['hasMoreDot']('1234.121.100');

    expect(hasMoreDot).toBeTruthy();
  });

  it('should have a call hasMoreDot method else path', () => {
    const fakeThis = {
      oldValue: '100.10',
      regex: {
        thousand: '.'
      }
    };

    const hasMoreDot = component['hasMoreDot'].call(fakeThis, '12.1');
    expect(hasMoreDot).toBeFalsy();

  });

  it('should have a call formatMask method', () => {
    const valueFormatted = component['formatMask']('12345');
    expect(valueFormatted).toEqual('12.345');
  });

  it('should have a call formatMask method else path', () => {
    const valueFormatted = component['formatMask']('10123,4');
    expect(valueFormatted).toEqual('10.123,4');
  });

  it('formatToModelValue: should call `replaceCommaToDot` and value return with dot', () => {
    const valueView = '12,345';
    const formatToModelValueExpected = 12.345;
    component.decimalsLength = 3;
    spyOn(component, <any>'replaceCommaToDot').and.returnValue(formatToModelValueExpected);

    const valueFormatted = component['formatToModelValue'](valueView);

    expect(valueFormatted).toEqual(formatToModelValueExpected);
    expect(component['replaceCommaToDot']).toHaveBeenCalledWith(valueView);
  });

  it(`formatToModelValue: should return undefined if input param is ''`, () => {
    const valueView = '';
    const formatToModelValueExpected = undefined;

    const valueFormatted = component['formatToModelValue'](valueView);

    expect(valueFormatted).toEqual(formatToModelValueExpected);
  });

  it('should have a call formatToModelValue method with undefined return', () => {
    const valueFormatted = component['formatToModelValue']('ABC');
    expect(valueFormatted).toBeUndefined();
  });

  it('should emit change valueBeforeChange else path', fakeAsync((): void => {
    const fakeThis = {
      inputEl: component.inputEl,
      valueBeforeChange: undefined,
      change: component.change,
      getScreenValue: () => { }
    };

    spyOn(fakeThis.change, 'emit');
    component['controlChangeEmitter'].call(fakeThis);
    tick(200);
    expect(fakeThis.change.emit).not.toHaveBeenCalled();
  }));

  it('should have a call formatToViewValue method', () => {
    component['_decimalsLength'] = 0;

    const returnMethod = component['formatToViewValue']('123400');

    expect(returnMethod).toBe('123.400');
  });

  it('should have a call formatToViewValue method else path', () => {
    const returnMethod = component['formatToViewValue']('1234');

    expect(returnMethod).toBe('1.234,00');
  });

  it('should have a call verifyInsertComma method', () => {
    const fakeEvent = {
      target: {
        value: '123,00'
      },
      key: ','
    };

    const isInsertComma = component['verifyInsertComma'](fakeEvent);
    expect(isInsertComma).toBeTruthy();
  });

  it('should have a call verifyValueAfterComma method', () => {
    const fakeEvent = {
      target: {
        value: '10.245,60',
        selectionStart: 7,
      },
      decimalsLength: 2,
      isValueAfterComma: () => { }
    };

    const returnMethod = component['verifyValueAfterComma'](fakeEvent);
    expect(returnMethod).toBeTruthy();
  });

  it('should call callOnChange if input is cleaned', () => {
    component.clean = true;

    spyOn(component, <any>'callOnChange');
    component.clear('');
    expect(component['callOnChange']).toHaveBeenCalled();
  });

  it('should call hasLessDot', () => {

    const fakeThis = {
      oldValue: ''
    };
    const hasLessDot = component['hasLessDot'].call(fakeThis, undefined);
    expect(hasLessDot).toBeFalsy();
  });

  it('should call hasMoreDot', () => {

    const fakeThis = {
      oldValue: ''
    };
    const hasMoreDot = component['hasMoreDot'].call(fakeThis, undefined);
    expect(hasMoreDot).toBeFalsy();
  });

  it('should call verifyInsertMinusSign', () => {
    const fakeEvent = {
      target: {
        value: '--123.004'
      },
      key: '-'
    };

    const verifyInsertMinusSign = component['verifyInsertMinusSign'](fakeEvent);

    expect(verifyInsertMinusSign).toBeTruthy();
  });

  it('should call verifyInsertMinusSign keyboard android', () => {
    const fakeEvent = {
      target: {
        value: '--123.004'
      },
      key: '-'
    };
    component['isKeyboardAndroid'] = true;

    const verifyInsertMinusSign = component['verifyInsertMinusSign'](fakeEvent);

    expect(verifyInsertMinusSign).toBeTruthy();
  });

  it('should call hasMinusSignInvalidPosition', () => {
    const fakeEvent = {
      key: '-',
      target: {
        selectionStart: 2
      }
    };

    const isInvalidMinusSign = component['hasMinusSignInvalidPosition'](fakeEvent);
    expect(isInvalidMinusSign).toBeTruthy();
  });

  it('should calc icons position without clean', fakeAsync(() => {
    const fakeThis = {
      clean: false,
      inputEl: component.inputEl,
      el: component.inputEl,
    };

    component.setPaddingInput.call(fakeThis);
    tick(10);

    expect(fakeThis.inputEl.nativeElement.style.paddingRight).toBe('');
  }));

  it('should have a call isPositionAfterDecimalSeparator method', () => {
    const isPositionAfterDecimalSeparator = component['isPositionAfterDecimalSeparator'](2, undefined);
    expect(isPositionAfterDecimalSeparator).toBeFalsy();
  });

  // testes já utilizando boas práticas.
  describe('Methods:', () => {

    it('setInitialSelectionRange: should set cursor position if selectionStart and selectionEnd is 1', () => {
      const fakeTarget = {
        setSelectionRange: (start, end) => { }
      };

      spyOn(fakeTarget, 'setSelectionRange');
      component['setInitialSelectionRange'](fakeTarget, 1, 1);
      expect(fakeTarget.setSelectionRange).toHaveBeenCalledWith(2, 2);
    });

    it('setInitialSelectionRange: should set cursor position if selectionStart and selectionEnd is different from 1', () => {
      const fakeTarget = {
        setSelectionRange: (start, end) => { }
      };

      spyOn(fakeTarget, 'setSelectionRange');
      component['setInitialSelectionRange'](fakeTarget, 3, 3);
      expect(fakeTarget.setSelectionRange).toHaveBeenCalledWith(2, 2);
    });

    it('replaceAt: should return value with replace characters', () => {
      expect(component['replaceAt']('teste', 3, 'aaa')).toBe('tesaaae');
      expect(component['replaceAt']('teste', 3, '')).toBe('tese');
      expect(component['replaceAt']('teste', 3, 3)).toBe('tes3e');
    });

    it('isSelectionStartDifferentSelectionEnd: should return true if have a selection', () => {
      const fakeTarget = {
        selectionStart: 1,
        selectionEnd: 5
      };

      expect(component['isSelectionStartDifferentSelectionEnd'](fakeTarget)).toBeTruthy();
    });

    it('isSelectionStartDifferentSelectionEnd: should return false if have a selection', () => {
      const fakeTarget = {
        selectionStart: 1,
        selectionEnd: 1
      };

      expect(component['isSelectionStartDifferentSelectionEnd'](fakeTarget)).toBeFalsy();
    });

    it('onFocus: should called `getScreenValue` and `enter.emit`', () => {
      spyOn(component, 'getScreenValue');
      spyOn(component.enter, 'emit');

      component.onFocus(new FocusEvent(''));

      expect(component.enter.emit).toHaveBeenCalled();
      expect(component.getScreenValue).toHaveBeenCalled();
    });

    it('onKeyPress: should called `isValidKey`', () => {
      spyOn(component, <any>'isValidKey');

      component.onKeyPress(new KeyboardEvent(''));

      expect(component['isValidKey']).toHaveBeenCalled();
    });

    it('verifyDecimalLengthIsZeroAndKeyPressedIsComma: should return false if charCode not is 44 and decimalsLength is 0', () => {
      const charCode: number = 2;
      component.decimalsLength = 0;

      expect(component['verifyDecimalLengthIsZeroAndKeyPressedIsComma'](charCode)).toBeFalsy();
    });

    it('verifyDecimalLengthIsZeroAndKeyPressedIsComma: should return false if decimalsLength not is 0 and charCode is 44', () => {
      const charCode: number = 44;
      component.decimalsLength = 5;

      expect(component['verifyDecimalLengthIsZeroAndKeyPressedIsComma'](charCode)).toBeFalsy();
    });

    it('verifyDecimalLengthIsZeroAndKeyPressedIsComma: should return false if decimalsLength not is 0 and charCode is not 44', () => {
      const charCode: number = 2;
      component.decimalsLength = 5;

      expect(component['verifyDecimalLengthIsZeroAndKeyPressedIsComma'](charCode)).toBeFalsy();
    });

    it('verifyDecimalLengthIsZeroAndKeyPressedIsComma: should return true if charCode is 44 and decimalsLength is 0', () => {
      const charCode: number = 44;
      component.decimalsLength = 0;

      expect(component['verifyDecimalLengthIsZeroAndKeyPressedIsComma'](charCode)).toBeTruthy();
    });

    it('isValidKey: should call preventDefault, isInvalidKey and return false if isInvalidKey return true', () => {
      const fakeEvent = {
        target: {
          value: '',
          key: ''
        },
        preventDefault: () => { }
      };

      spyOn(component, <any>'isInvalidKey').and.returnValue(true);
      spyOn(fakeEvent, 'preventDefault');

      const isValidKeyReturn = component['isValidKey'](fakeEvent, ',');

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(isValidKeyReturn).toBeFalsy();
    });

    it('isValidKey: shouldn`t call preventDefault and return true', () => {
      const fakeEvent = {
        target: {
          value: '123'
        },
        preventDefault: () => { }
      };
      component['isKeyboardAndroid'] = true;

      spyOn(component, <any>'isInvalidKey').and.returnValue(false);
      spyOn(fakeEvent, 'preventDefault');

      const isValidKeyReturn = component['isValidKey'](fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      expect(isValidKeyReturn).toBeTruthy();
    });

    it('isValidKey: should return and not call isInvalidKey, and not return true and false', () => {
      const fakeEvent = {
        target: {
          value: ''
        },
        which: 8,
        preventDefault: () => { }
      };
      component['isKeyboardAndroid'] = false;

      const isValidKey = component['isValidKey'](fakeEvent);

      expect(isValidKey).toBeFalsy();
    });

    describe('isInvalidKey:', () => {
      let fakeCharCode;
      let fakeEvent;

      beforeEach(() => {
        fakeCharCode = 0;
        fakeEvent = {
          target: {
            value: ''
          }
        };
      });

      it('should return true if `verifyInsertComma` return true', () => {
        spyOn(component, <any>'verifyInsertComma').and.returnValue(true);

        const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

        expect(component['verifyInsertComma']).toHaveBeenCalledWith(fakeEvent);
        expect(isInvalidKeyReturn).toBeTruthy();
      });

      it('should return true if `verifyThousandLength` return true', () => {
        spyOn(component, <any>'verifyInsertComma').and.returnValue(false);
        spyOn(component, <any>'verifyThousandLength').and.returnValue(true);

        const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

        expect(component['verifyThousandLength']).toHaveBeenCalledWith(fakeEvent);
        expect(isInvalidKeyReturn).toBeTruthy();
      });

      it('should return true if `verifyValueAfterComma` return true', () => {
        spyOn(component, <any>'verifyInsertComma').and.returnValue(false);
        spyOn(component, <any>'verifyThousandLength').and.returnValue(false);
        spyOn(component, <any>'verifyValueAfterComma').and.returnValue(true);

        const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

        expect(component['verifyValueAfterComma']).toHaveBeenCalledWith(fakeEvent);
        expect(isInvalidKeyReturn).toBeTruthy();
      });

      it('should return true if `verifyInsertMinusSign` return true', () => {
        spyOn(component, <any>'verifyInsertComma').and.returnValue(false);
        spyOn(component, <any>'verifyThousandLength').and.returnValue(false);
        spyOn(component, <any>'verifyValueAfterComma').and.returnValue(false);
        spyOn(component, <any>'verifyInsertMinusSign').and.returnValue(true);

        const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

        expect(component['verifyInsertMinusSign']).toHaveBeenCalledWith(fakeEvent);
        expect(isInvalidKeyReturn).toBeTruthy();
      });

      it('should return true if `hasMinusSignInvalidPosition` return true', () => {
        spyOn(component, <any>'verifyInsertComma').and.returnValue(false);
        spyOn(component, <any>'verifyThousandLength').and.returnValue(false);
        spyOn(component, <any>'verifyValueAfterComma').and.returnValue(false);
        spyOn(component, <any>'verifyInsertMinusSign').and.returnValue(false);
        spyOn(component, <any>'hasMinusSignInvalidPosition').and.returnValue(true);

        const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

        expect(component['hasMinusSignInvalidPosition']).toHaveBeenCalledWith(fakeEvent);
        expect(isInvalidKeyReturn).toBeTruthy();
      });

      it('should return true if `isInvalidNumber` is true', () => {
        spyOn(component, <any>'verifyInsertComma').and.returnValue(false);
        spyOn(component, <any>'verifyThousandLength').and.returnValue(false);
        spyOn(component, <any>'verifyValueAfterComma').and.returnValue(false);
        spyOn(component, <any>'verifyInsertMinusSign').and.returnValue(false);
        spyOn(component, <any>'hasMinusSignInvalidPosition').and.returnValue(false);
        spyOn(component, <any>'isValidNumber').and.returnValue(false);

        const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

        expect(component['isValidNumber']).toHaveBeenCalledWith(fakeEvent);
        expect(isInvalidKeyReturn).toBeTruthy();
      });

      it('should return true if `validateCursorPositionBeforeSeparator` return true', () => {
        spyOn(component, <any>'verifyInsertComma').and.returnValue(false);
        spyOn(component, <any>'verifyThousandLength').and.returnValue(false);
        spyOn(component, <any>'verifyValueAfterComma').and.returnValue(false);
        spyOn(component, <any>'verifyInsertMinusSign').and.returnValue(false);
        spyOn(component, <any>'hasMinusSignInvalidPosition').and.returnValue(false);
        spyOn(component, <any>'isValidNumber').and.returnValue(true);
        spyOn(component, <any>'validateCursorPositionBeforeSeparator').and.returnValue(true);

        const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

        expect(component['validateCursorPositionBeforeSeparator']).toHaveBeenCalledWith(fakeEvent);
        expect(isInvalidKeyReturn).toBeTruthy();
      });

      it('should return true if `verifyDecimalLengthIsZeroAndKeyPressedIsComma` return true', () => {
        spyOn(component, <any>'verifyInsertComma').and.returnValue(false);
        spyOn(component, <any>'verifyThousandLength').and.returnValue(false);
        spyOn(component, <any>'verifyValueAfterComma').and.returnValue(false);
        spyOn(component, <any>'verifyInsertMinusSign').and.returnValue(false);
        spyOn(component, <any>'hasMinusSignInvalidPosition').and.returnValue(false);
        spyOn(component, <any>'isValidNumber').and.returnValue(true);
        spyOn(component, <any>'validateCursorPositionBeforeSeparator').and.returnValue(false);
        spyOn(component, <any>'verifyDecimalLengthIsZeroAndKeyPressedIsComma').and.returnValue(true);

        const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

        expect(component['verifyDecimalLengthIsZeroAndKeyPressedIsComma']).toHaveBeenCalledWith(fakeCharCode);
        expect(isInvalidKeyReturn).toBeTruthy();
      });

      it(`should return false if verifyInsertComma, verifyThousandLength, verifyValueAfterComma,
          verifyInsertMinusSign, hasMinusSignInvalidPosition, isInvalidNumber, validateCursorPositionBeforeSeparator,
          verifyDecimalLengthIsZeroAndKeyPressedIsComma is false`, () => {
          spyOn(component, <any>'verifyInsertComma').and.returnValue(false);
          spyOn(component, <any>'verifyThousandLength').and.returnValue(false);
          spyOn(component, <any>'verifyValueAfterComma').and.returnValue(false);
          spyOn(component, <any>'verifyInsertMinusSign').and.returnValue(false);
          spyOn(component, <any>'hasMinusSignInvalidPosition').and.returnValue(false);
          spyOn(component, <any>'isValidNumber').and.returnValue(true);
          spyOn(component, <any>'validateCursorPositionBeforeSeparator').and.returnValue(false);
          spyOn(component, <any>'verifyDecimalLengthIsZeroAndKeyPressedIsComma').and.returnValue(false);

          const isInvalidKeyReturn = component['isInvalidKey'](fakeEvent, fakeCharCode);

          expect(isInvalidKeyReturn).toBeFalsy();
        });
    });

    describe('validateCursorPositionBeforeSeparator:', () => {

      let fakeEvent;

      beforeEach(() => {
        fakeEvent = {
          target: {
            value: '1.234.567.891.234,00',
            selectionStart: 1,
            selectionEnd: 1
          }
        };
      });

      it('should return true if all validators equal true', () => {
        spyOn(component, <any>'isKeyDecimalSeparator');

        expect(component['validateCursorPositionBeforeSeparator'](fakeEvent)).toBeTruthy();
        expect(component['isKeyDecimalSeparator']).toHaveBeenCalled();
      });

      it('should return false if have a selection range', () => {
        fakeEvent.target.selectionEnd = 2;

        spyOn(component, <any>'isKeyDecimalSeparator');

        expect(component['validateCursorPositionBeforeSeparator'](fakeEvent)).toBeFalsy();
        expect(component['isKeyDecimalSeparator']).not.toHaveBeenCalled();
      });

      it('should return false if value is less then thousandMaxlenght', () => {
        fakeEvent.target.value = '1.234.567.891,00';

        expect(component['validateCursorPositionBeforeSeparator'](fakeEvent)).toBeFalsy();
      });

      it('should return false if selectionStart is greater than value before comma', () => {
        fakeEvent.target.selectionStart = 18;

        expect(component['validateCursorPositionBeforeSeparator'](fakeEvent)).toBeFalsy();
      });

      it('should return false if value is different than thousandMaxlenght', () => {
        fakeEvent.target.value = '1.234.567.890.123.456';

        expect(component['validateCursorPositionBeforeSeparator'](fakeEvent)).toBeFalsy();
      });

      it('should return false if isKeyDecimalSeparator is true', () => {
        spyOn(component, <any>'isKeyDecimalSeparator').and.returnValue(true);

        expect(component['validateCursorPositionBeforeSeparator'](fakeEvent)).toBeFalsy();
        expect(component['isKeyDecimalSeparator']).toHaveBeenCalled();
      });
    });

    describe('verifyThousandLength:', () => {

      let fakeEvent;

      beforeEach(() => {
        fakeEvent = {
          target: {
            value: '1.234.567.891.234,00',
            selectionStart: 1,
            selectionEnd: 1
          }
        };
      });

      it('should return true if all validators equal true', () => {
        spyOn(component, <any>'isKeyDecimalSeparator').and.returnValue(false);
        spyOn(component, <any>'isPositionAfterDecimalSeparator').and.returnValue(true);

        expect(component['verifyThousandLength'](fakeEvent)).toBeTruthy();
        expect(component['isKeyDecimalSeparator']).toHaveBeenCalled();
        expect(component['isPositionAfterDecimalSeparator']).toHaveBeenCalled();
      });

      it('should return false if isPositionAfterDecimalSeparator is false', () => {
        spyOn(component, <any>'isPositionAfterDecimalSeparator').and.returnValue(false);

        expect(component['verifyThousandLength'](fakeEvent)).toBeFalsy();

      });

      it('should return false if isKeyDecimalSeparator is true', () => {
        spyOn(component, <any>'isKeyDecimalSeparator').and.returnValue(true);

        expect(component['verifyThousandLength'](fakeEvent)).toBeFalsy();

      });

      it('should return false if have a range selection', () => {
        fakeEvent.target.selectionEnd = 2;

        expect(component['verifyThousandLength'](fakeEvent)).toBeFalsy();

      });

      it('should return false if valuebeforeSeparator is less than thousandMaxlenght', () => {
        fakeEvent.target.value = '1.111.111,00';

        expect(component['verifyThousandLength'](fakeEvent)).toBeFalsy();
      });

    });

    it(`onBlur: should call 'setViewValue' with empty string and 'callOnChange' with undefined if 'target.value'
      contains more than one comma`, () => {
        const fakeEvent = {
          target: {
            value: '1,200,50'
          }
        };

        spyOn(component, <any>'setViewValue');
        spyOn(component, <any>'callOnChange');

        component.onBlur(fakeEvent);

        expect(component['setViewValue']).toHaveBeenCalledWith('');
        expect(component['callOnChange']).toHaveBeenCalledWith(undefined);
    });

    it('containsMoreThanOneComma: should return `false` if param contains one comma', () => {
      const value = '1.200,55';

      expect(component['containsMoreThanOneComma'](value)).toBeFalsy();
    });

    it('containsMoreThanOneComma: should return `true` if param contains more than one comma', () => {
      const value = '1.444,200,55';

      expect(component['containsMoreThanOneComma'](value)).toBeTruthy();
    });

    it('containsMoreThanOneComma: should return `false` if param is undefined', () => {
      expect(component['containsMoreThanOneComma'](undefined)).toBeFalsy();
    });

    it('writeValueModel: should call change.emit', () => {
      const value = '123456';
      spyOn(component.change, 'emit');

      component.writeValueModel(value);
      expect(component.change.emit).toHaveBeenCalledWith(value);
    });

    it('writeValueModel: shouldn`t call change.emit if param is undefined', () => {
      spyOn(component.change, 'emit');

      component.writeValueModel(undefined);
      expect(component.change.emit).not.toHaveBeenCalled();
    });

    it('controlChangeEmitter: should emit change', fakeAsync((): void => {
      const value = 'value';
      const fakeThis = {
        valueBeforeChange: '1',
        fireChange: true,
        change: component.change,
        getScreenValue: () => value
      };

      spyOn(fakeThis.change, 'emit');
      component['controlChangeEmitter'].call(fakeThis);
      tick(250);
      expect(fakeThis.change.emit).toHaveBeenCalledWith(value);
    }));

    it('controlChangeEmitter: should not emit change if value is equal', () => {
      component.inputEl.nativeElement.value = 1;
      const fakeThis = {
        valueBeforeChange: 1,
        fireChange: false,
        change: component.change,
        getScreenValue: () => { }
      };

      spyOn(fakeThis.change, 'emit');
      component['controlChangeEmitter'].call(fakeThis);
      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    });

    it(`onInput: should call 'setViewValue' and 'setCursorInput' if 'viewValue' is valid value.`, () => {
      const fakeEvent = {
        target: {
          value: '1'
        }
      };

      spyOn(component, <any>'setViewValue');
      spyOn(component, <any>'setCursorInput');

      component.onInput(fakeEvent);

      expect(component['setViewValue']).toHaveBeenCalled();
      expect(component['setCursorInput']).toHaveBeenCalled();
    });

    it(`onInput: shouldn't call 'setViewValue' and 'setCursorInput' if 'viewValue' is invalid value.`, () => {
      const fakeEvent = {
        target: {
          value: ''
        }
      };

      spyOn(component, <any>'setViewValue');
      spyOn(component, <any>'setCursorInput');

      component.onInput(fakeEvent);

      expect(component['setViewValue']).not.toHaveBeenCalled();
      expect(component['setCursorInput']).not.toHaveBeenCalled();
    });

    it('hasLetters: should return true with numbers.', () => {
      expect(component.hasLetters('333')).toBeFalsy();
    });

    it('hasLetters: should return true wird letters.', () => {
      expect(component.hasLetters('AAAAAA')).toBeTruthy();
    });

    it('hasLetters: should return true with special characteres.', () => {
      expect(component.hasLetters('!@#$%&')).toBeTruthy();
    });

    it('hasLetters: should return true with undefined value.', () => {
      expect(component.hasLetters(undefined)).toBeFalsy();
    });

  });

  describe('Templates:', () => {

    it('shouldn`t have an icon.', () => {
      component.icon = undefined;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-container-left')).toBeFalsy();
    });

    it('should includes an icon.', () => {
      component.icon = 'po-icon-settings';
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-settings')).toBeTruthy();
    });

    it('should attribute `po-field-icon-disabled` class if input is disabled.', () => {
      component.icon = 'po-icon-settings';
      component.disabled = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeTruthy();
    });

    it('shouldn`t attribute `po-field-icon-disabled` class if input is not disabled.', () => {
      component.icon = 'po-icon-settings';
      component.disabled = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeFalsy();
    });

    it(`should show optional if the field isn't 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = false;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeTruthy();
    });

    it(`shouldn't show optional if the field is 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = true;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it(`shouldn't show optional if the field isn't 'required', has 'label' but 'p-optional' is false.`, () => {
      component.required = true;
      component.optional = false;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

  });

});
