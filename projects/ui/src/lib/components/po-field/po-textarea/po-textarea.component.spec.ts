import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoTextareaBaseComponent } from './po-textarea-base.component';
import { PoTextareaComponent } from './po-textarea.component';

describe('PoTextareaComponent:', () => {
  let component: PoTextareaComponent;
  let fixture: ComponentFixture<PoTextareaComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoTextareaComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTextareaComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoTextareaBaseComponent).toBeTruthy();
    expect(component instanceof PoTextareaComponent).toBeTruthy();
  });

  it('write values in the model', () => {
    spyOn(component.change, 'emit');
    component.writeValue('teste');
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('write whitespace value in the model', () => {
    component.writeValue(null);
    expect(component['inputEl'].nativeElement.value).toBe('');
  });

  it('attempting to write with the undefined element', () => {
    component['inputEl'] = undefined;
    spyOn(component.change, 'emit');
    component.writeValue('teste');
    expect(component['inputEl']).toBeUndefined();
  });

  it('validating maximum characters if string is larger', () => {
    component.maxlength = 10;
    const fakeEvent = {
      target: {
        value: 'Somos TOTVERS'
      }
    };

    component.eventOnInput(fakeEvent);

    expect(component['inputEl'].nativeElement.value).toBe('Somos TOTV');
  });

  it('validating maximum characters if string is less', () => {
    component.maxlength = 20;
    const fakeEvent = {
      target: {
        value: 'Somos TOTVERS'
      }
    };

    component.eventOnInput(fakeEvent);

    expect(component['inputEl'].nativeElement.value).toBe('Somos TOTVERS');
  });

  it('enter event must be called', () => {
    spyOn(component.enter, 'emit');

    component.eventOnFocus();
    expect(component.enter.emit).toHaveBeenCalled();
  });

  it('blur event must be called', () => {
    component['onTouched'] = () => {};

    spyOn(component.blur, 'emit');
    spyOn(component, 'controlChangeEmitter');
    spyOn(component, <any>'onTouched');

    component.eventOnBlur();

    expect(component['onTouched']).toHaveBeenCalled();
    expect(component.blur.emit).toHaveBeenCalled();
    expect(component.controlChangeEmitter).toHaveBeenCalled();
  });

  it('eventOnBlur: shouldn´t throw error if onTouched is falsy', () => {
    component['onTouched'] = null;

    const fnError = () => component.eventOnBlur();

    expect(fnError).not.toThrow();
  });

  describe('Methods:', () => {
    it('controlChangeEmitter: shouldn´t call change event if input value is not changed', () => {
      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: 'Somos TOTVERS'
          }
        },
        valueBeforeChange: 'Somos TOTVERS',
        change: {
          emit: () => {}
        }
      };
      spyOn(fakeThis.change, 'emit');

      component.controlChangeEmitter.call(fakeThis);
      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    });

    it('controlChangeEmitter: should call change event if input value is changed', () => {
      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: 'Somos TOTVERS'
          }
        },
        valueBeforeChange: 'TOTVERS',
        change: {
          emit: arg => {}
        }
      };
      spyOn(fakeThis.change, 'emit');
      component.controlChangeEmitter.call(fakeThis);

      expect(fakeThis.change.emit).toHaveBeenCalledWith(fakeThis.inputEl.nativeElement.value);
    });

    describe('ngAfterViewInit:', () => {
      let inputFocus: jasmine.Spy;

      beforeEach(() => {
        inputFocus = spyOn(component, 'focus');
      });

      it('should call `focus` if autoFocus is true.', () => {
        component.autoFocus = true;
        component.ngAfterViewInit();
        expect(inputFocus).toHaveBeenCalled();
      });

      it('should not call `focus` if autoFocus is false.', () => {
        component.autoFocus = false;
        component.ngAfterViewInit();
        expect(inputFocus).not.toHaveBeenCalled();
      });
    });

    it('focus: should call `focus` of textarea', () => {
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of textarea if `disabled`', () => {
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

    it('writeValueModel: should call change if value exists', () => {
      const value = 'value';
      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: undefined
          }
        },
        change: {
          emit: arg => {}
        }
      };

      spyOn(fakeThis.change, 'emit');

      component.writeValueModel.call(fakeThis, value);
      expect(fakeThis.change.emit).toHaveBeenCalledWith(value);
    });

    it('writeValueModel: should not call change if value doesn`t exist', () => {
      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: undefined
          }
        },
        change: {
          emit: () => {}
        }
      };

      spyOn(fakeThis.change, 'emit');
      component.writeValueModel.call(fakeThis);

      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
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
