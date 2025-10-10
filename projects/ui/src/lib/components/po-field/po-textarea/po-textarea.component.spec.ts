import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoTextareaBaseComponent } from './po-textarea-base.component';
import { PoTextareaComponent } from './po-textarea.component';
import { EventEmitter } from '@angular/core';

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

  describe('eventOnBlur', () => {
    let setupTest;

    beforeEach(() => {
      setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
        component.additionalHelpTooltip = tooltip;
        component.displayAdditionalHelp = displayHelp;
        component.additionalHelp = additionalHelpEvent;
        spyOn(component, 'showAdditionalHelp');
      };
    });

    it('shouldn´t throw error if onTouched is falsy', () => {
      component['onTouched'] = null;

      const fnError = () => component.eventOnBlur();

      expect(fnError).not.toThrow();
    });

    it('should not call showAdditionalHelp when tooltip is not displayed', () => {
      setupTest('Mensagem de apoio adicional.', false, { observed: false });
      component.eventOnBlur();
      expect(component.showAdditionalHelp).not.toHaveBeenCalled();
    });

    it('should not call showAdditionalHelp when additionalHelp event is true', () => {
      setupTest('Mensagem de apoio adicional.', true, { observed: true });
      component.eventOnBlur();
      expect(component.showAdditionalHelp).not.toHaveBeenCalled();
    });
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

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        (component as any).label = 'this.label';
        spyOn(component.additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        spyOn(component.additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });

      it('should include additionalHelp when event is triggered', () => {
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
        component.additionalHelp = new EventEmitter<any>();

        const result = component.setHelper('label', 'tooltip');

        expect(result).toBeDefined();
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

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
      });

      it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
        component.additionalHelpTooltip = undefined;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeUndefined();
      });
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

    describe('getErrorPattern:', () => {
      it('should return true in hasInvalidClass if fieldErrorMessage and required is true', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = 'Field Invalid';
        component.required = true;
        expect(component.hasInvalidClass()).toBeTruthy();
        expect(component.getErrorPattern()).toBe('Field Invalid');
      });

      it('should return true in hasInvalidClass if fieldErrorMessage and hasValidatorRequired is true', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = 'Field Invalid';
        component['hasValidatorRequired'] = true;
        expect(component.hasInvalidClass()).toBeTruthy();
        expect(component.getErrorPattern()).toBe('Field Invalid');
      });

      it('should return empty if fieldErrorMessage is undefined', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = undefined;
        expect(component.getErrorPattern()).toBe('');
      });
    });

    describe('onKeyDown:', () => {
      it('should emit event when field is focused', () => {
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

      it('should not emit event when field is not focused', () => {
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
    });

    describe('showAdditionalHelp:', () => {
      let helperEl: any;
      beforeEach(() => {
        helperEl = {
          openHelperPopover: jasmine.createSpy('openHelperPopover'),
          closeHelperPopover: jasmine.createSpy('closeHelperPopover'),
          helperIsVisible: jasmine.createSpy('helperIsVisible').and.returnValue(false)
        };
      });

      it('should call closeHelperPopover and return early when helperIsVisible is true', () => {
        (component as any).label = '';
        component.additionalHelpTooltip = undefined as any;
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.and.returnValue(true);
        component.helperEl = helperEl;
        spyOn(component as any, 'poHelperComponent').and.returnValue({});
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should emit additionalHelp and return early when isAdditionalHelpEventTriggered is true', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.and.returnValue(false);
        component.helperEl = helperEl;
        spyOn(component as any, 'poHelperComponent').and.returnValue({});
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.and.returnValue(false);
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: jasmine.createSpy('eventOnClick') };
        spyOn(component as any, 'poHelperComponent').and.returnValue(helperMock);
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(helperMock.eventOnClick).toHaveBeenCalledTimes(1);
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should enter the block via additionalHelpTooltip when helper is falsy and isHelpEvt is false, then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.and.returnValue(false);
        component.helperEl = helperEl;
        spyOn(component as any, 'poHelperComponent').and.returnValue(undefined);
        component.additionalHelpTooltip = 'any text';
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should enter the block via isHelpEvt when helper and tooltip are falsy, emit and then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.and.returnValue(false);
        component.helperEl = helperEl;
        spyOn(component as any, 'poHelperComponent').and.returnValue(undefined);
        component.additionalHelpTooltip = undefined as any;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBeTrue();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBeFalse();
        expect(component.displayAdditionalHelp).toBeFalse();
      });

      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBeTrue();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBeFalse();
        expect(component.displayAdditionalHelp).toBeFalse();
      });
    });

    describe('isAdditionalHelpEventTriggered:', () => {
      it('should return true when additionalHelpEventTrigger is "event"', () => {
        component.additionalHelpEventTrigger = 'event';
        expect((component as any).isAdditionalHelpEventTriggered()).toBeTrue();
      });

      it('should return true when additionalHelpEventTrigger is undefined and additionalHelp is observed', () => {
        component.additionalHelpEventTrigger = undefined;
        component.additionalHelp = {
          observed: true
        } as any;

        expect((component as any).isAdditionalHelpEventTriggered()).toBeTrue();
      });

      it('should return false when additionalHelpEventTrigger is not "event" and additionalHelp is not observed', () => {
        component.additionalHelpEventTrigger = 'noEvent';
        expect((component as any).isAdditionalHelpEventTriggered()).toBeFalse();
      });
    });
  });

  describe('isAdditionalHelpEventTriggered:', () => {
    it('should return true when additionalHelpEventTrigger is "event"', () => {
      component.additionalHelpEventTrigger = 'event';
      expect((component as any).isAdditionalHelpEventTriggered()).toBeTrue();
    });

    it('should return true when additionalHelpEventTrigger is undefined and additionalHelp is observed', () => {
      component.additionalHelpEventTrigger = undefined;
      component.additionalHelp = {
        observed: true
      } as any;

      expect((component as any).isAdditionalHelpEventTriggered()).toBeTrue();
    });

    it('should return false when additionalHelpEventTrigger is not "event" and additionalHelp is not observed', () => {
      component.additionalHelpEventTrigger = 'noEvent';
      expect((component as any).isAdditionalHelpEventTriggered()).toBeFalse();
    });
  });
});
