import type { Mock } from 'vitest';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { EventEmitter, SimpleChanges } from '@angular/core';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
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
  });

  it('should be created', () => {
    expect(component instanceof PoTextareaBaseComponent).toBeTruthy();
    expect(component instanceof PoTextareaComponent).toBeTruthy();
  });

  it('write values in the model', () => {
    vi.spyOn(component.change as any, 'emit');
    component.writeValue('teste');
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('write whitespace value in the model', () => {
    component.writeValue(null);
    expect(component['inputEl'].nativeElement.value).toBe('');
  });

  it('attempting to write with the undefined element', () => {
    component['inputEl'] = undefined;
    vi.spyOn(component.change as any, 'emit');
    component.writeValue('teste');
    expect(component['inputEl']).toBeUndefined();
  });

  it('validating maximum characters if string is larger', () => {
    component.maxlength = 10;
    const fakeEvent = {
      target: {
        value: 'Somos TOTVS'
      }
    };

    component.eventOnInput(fakeEvent);

    expect(component['inputEl'].nativeElement.value).toBe('Somos TOTV');
  });

  it('validating maximum characters if string is less', () => {
    component.maxlength = 20;
    const fakeEvent = {
      target: {
        value: 'Somos TOTVS'
      }
    };

    component.eventOnInput(fakeEvent);

    expect(component['inputEl'].nativeElement.value).toBe('Somos TOTVS');
  });

  describe('eventOnInput:', () => {
    beforeEach(() => {
      component.inputEl = {
        nativeElement: {
          value: ''
        }
      } as any;
    });

    it('should call callOnChange with processed value', () => {
      vi.spyOn(component as any, 'callOnChange');
      vi.spyOn(component as any, 'checkScrollState');

      component.maxlength = 5;

      component.eventOnInput({ target: { value: 'TOTVS123' } });

      expect(component.callOnChange).toHaveBeenCalledWith('TOTVS');
    });

    it('should update textarea value', () => {
      vi.spyOn(component as any, 'checkScrollState');

      component.eventOnInput({ target: { value: 'PO UI' } });

      expect(component.inputEl.nativeElement.value).toBe('PO UI');
    });

    it('should set hasValue=true when value exists', () => {
      vi.spyOn(component as any, 'checkScrollState');

      component.eventOnInput({ target: { value: 'abc' } });

      expect(component.hasValue).toBe(true);
    });

    it('should set hasValue=false when value is empty', () => {
      vi.spyOn(component as any, 'checkScrollState');

      component.eventOnInput({ target: { value: '' } });

      expect(component.hasValue).toBe(false);
    });
  });

  it('enter event must be called', () => {
    vi.spyOn(component.enter as any, 'emit');

    component.eventOnFocus();
    expect(component.enter.emit).toHaveBeenCalled();
  });

  it('blur event must be called', () => {
    component['onTouched'] = () => {};

    vi.spyOn(component.blur as any, 'emit');
    vi.spyOn(component as any, 'controlChangeEmitter');
    vi.spyOn(component as any, 'onTouched');

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
        vi.spyOn(component as any, 'showAdditionalHelp');
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
            value: 'Somos TOTVS'
          }
        },
        valueBeforeChange: 'Somos TOTVS',
        change: {
          emit: () => {}
        }
      };
      vi.spyOn(fakeThis.change as any, 'emit');

      component.controlChangeEmitter.call(fakeThis);
      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    });

    it('controlChangeEmitter: should call change event if input value is changed', () => {
      const fakeThis = {
        inputEl: {
          nativeElement: {
            value: 'Somos TOTVS'
          }
        },
        valueBeforeChange: 'TOTVS',
        change: {
          emit: arg => {}
        }
      };
      vi.spyOn(fakeThis.change as any, 'emit');
      component.controlChangeEmitter.call(fakeThis);

      expect(fakeThis.change.emit).toHaveBeenCalledWith(fakeThis.inputEl.nativeElement.value);
    });

    describe('ngAfterViewInit:', () => {
      let inputFocus: any;
      let initResizeObserverSpy: any;

      beforeEach(() => {
        inputFocus = vi.spyOn(component as any, 'focus');
        initResizeObserverSpy = vi.spyOn(component as any, 'initResizeObserver');
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

      it('should call initResizeObserver', () => {
        component.ngAfterViewInit();
        expect(initResizeObserverSpy).toHaveBeenCalled();
      });

      it('should add window resize event listener', () => {
        vi.spyOn(window as any, 'addEventListener');
        component.ngAfterViewInit();
        expect(window.addEventListener).toHaveBeenCalledWith('resize', component['onWindowResize']);
      });
    });

    describe('ngOnChanges:', () => {
      beforeEach(() => {
        vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: any) => cb());
      });

      it('should call `checkScrollState` when `loading` changes', () => {
        vi.spyOn(component as any, 'checkScrollState');

        component.ngOnChanges({
          loading: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } as any
        });

        expect(component['checkScrollState']).toHaveBeenCalled();
      });

      it('should not call `checkScrollState` when `loading` does not change', () => {
        vi.spyOn(component as any, 'checkScrollState');

        component.ngOnChanges({});

        expect(component['checkScrollState']).not.toHaveBeenCalled();
      });

      it('should call syncContainerWidth and checkScrollState when loading changes', () => {
        vi.spyOn(component as any, 'syncContainerWidth');
        vi.spyOn(component as any, 'checkScrollState');

        component.ngOnChanges({
          loading: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false }
        });

        expect(component['syncContainerWidth']).toHaveBeenCalled();
        expect(component['checkScrollState']).toHaveBeenCalled();
      });

      it('should not call syncContainerWidth when loading does not change', () => {
        vi.spyOn(component as any, 'syncContainerWidth');

        component.ngOnChanges({
          label: { currentValue: 'test', previousValue: '', firstChange: false, isFirstChange: () => false }
        });

        expect(component['syncContainerWidth']).not.toHaveBeenCalled();
      });

      it('should call syncContainerWidth and checkScrollState via requestAnimationFrame on firstChange of loading', () => {
        vi.spyOn(component as any, 'syncContainerWidth');
        vi.spyOn(component as any, 'checkScrollState');

        component.loading = true;

        component.ngOnChanges({
          loading: { currentValue: true, previousValue: undefined, firstChange: true, isFirstChange: () => true }
        });

        expect(component['syncContainerWidth']).toHaveBeenCalled();
        expect(component['checkScrollState']).toHaveBeenCalled();
      });
    });

    describe('ngOnDestroy:', () => {
      it('should call resizeObserver.disconnect if resizeObserver exists', () => {
        component['resizeObserver'] = {
          disconnect: vi.fn(),
          observe: vi.fn()
        } as any;
        component.ngOnDestroy();
        expect(component['resizeObserver'].disconnect).toHaveBeenCalled();
      });

      it('should not throw if resizeObserver is undefined', () => {
        component['resizeObserver'] = undefined;
        expect(() => component.ngOnDestroy()).not.toThrow();
      });

      it('should call window.removeEventListener with onWindowResize', () => {
        vi.spyOn(window as any, 'removeEventListener');
        component.ngOnDestroy();
        expect(window.removeEventListener).toHaveBeenCalledWith('resize', component['onWindowResize']);
      });
    });

    describe('initResizeObserver:', () => {
      it('should observe the input element', () => {
        const observeSpy = vi.fn();
        const disconnectSpy = vi.fn();
        (window as any).ResizeObserver = vi.fn().mockReturnValue({
          observe: observeSpy,
          disconnect: disconnectSpy
        });

        component['initResizeObserver']();

        expect(observeSpy).toHaveBeenCalledWith(component.inputEl.nativeElement);
      });

      it('should not throw if ResizeObserver is not available', () => {
        const original = (window as any).ResizeObserver;
        (window as any).ResizeObserver = undefined;

        expect(() => component['initResizeObserver']()).not.toThrow();

        (window as any).ResizeObserver = original;
      });

      it('should execute ResizeObserver callback and call `checkScrollState`', () => {
        vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: any) => cb());
        vi.spyOn(component as any, 'checkScrollState');

        let observerCallback: any;
        (window as any).ResizeObserver = class {
          constructor(cb: any) {
            observerCallback = cb;
          }
          observe() {}
          disconnect() {}
        };

        component['initResizeObserver']();

        if (observerCallback) {
          observerCallback();
        }

        expect(component['checkScrollState']).toHaveBeenCalled();
      });

      it('should set body width to fit-content when loading is true and textarea has inline width', () => {
        vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: any) => cb());
        vi.spyOn(component as any, 'checkScrollState');

        component.loading = true;

        let observerCallback: any;
        (window as any).ResizeObserver = class {
          constructor(cb: any) {
            observerCallback = cb;
          }
          observe() {}
          disconnect() {}
        };

        component['initResizeObserver']();

        const textarea = component.inputEl.nativeElement;
        textarea.style.width = '300px';

        if (observerCallback) {
          observerCallback();
        }

        const body = component.textareaBodyEl.nativeElement;
        expect(body.style.width).toBe('fit-content');
      });

      it('should not set body width when textarea has no inline width', () => {
        vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: any) => cb());
        vi.spyOn(component as any, 'checkScrollState');

        component.loading = true;

        let observerCallback: any;
        (window as any).ResizeObserver = class {
          constructor(cb: any) {
            observerCallback = cb;
          }
          observe() {}
          disconnect() {}
        };

        component['initResizeObserver']();

        const textarea = component.inputEl.nativeElement;
        textarea.style.width = '';

        if (observerCallback) {
          observerCallback();
        }

        const body = component.textareaBodyEl.nativeElement;
        expect(body.style.width).toBe('');
      });

      it('should not set body width when loading is false', () => {
        vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: any) => cb());
        vi.spyOn(component as any, 'checkScrollState');

        component.loading = false;

        let observerCallback: any;
        (window as any).ResizeObserver = class {
          constructor(cb: any) {
            observerCallback = cb;
          }
          observe() {}
          disconnect() {}
        };

        component['initResizeObserver']();

        const textarea = component.inputEl.nativeElement;
        textarea.style.width = '300px';

        if (observerCallback) {
          observerCallback();
        }

        const body = component.textareaBodyEl.nativeElement;
        expect(body.style.width).toBe('');
      });
    });

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        (component as any).label = 'this.label';
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });

      it('should include additionalHelp when event is triggered', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
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

      vi.spyOn(component.inputEl.nativeElement, 'focus');

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

      vi.spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
    });

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
      });

      it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

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
        },
        checkScrollState: () => {}
      };

      vi.spyOn(fakeThis.change as any, 'emit');
      vi.spyOn(fakeThis as any, 'checkScrollState');

      component.writeValueModel.call(fakeThis, value);

      expect(fakeThis.change.emit).toHaveBeenCalledWith(value);
      expect(fakeThis.checkScrollState).toHaveBeenCalled();
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
        },
        checkScrollState: () => {}
      };

      vi.spyOn(fakeThis.change as any, 'emit');
      vi.spyOn(fakeThis as any, 'checkScrollState');

      component.writeValueModel.call(fakeThis);

      expect(fakeThis.change.emit).not.toHaveBeenCalled();
      expect(fakeThis.checkScrollState).toHaveBeenCalled();
    });

    describe('writeValueModel - internal state:', () => {
      beforeEach(() => {
        component.inputEl = {
          nativeElement: {
            value: ''
          }
        } as any;
      });

      it('should set hasValue=true and call checkScrollState when value exists', () => {
        vi.spyOn(component as any, 'checkScrollState');

        component.writeValueModel('abc');

        expect(component.hasValue).toBe(true);
        expect(component['checkScrollState']).toHaveBeenCalled();
      });

      it('should set hasValue=false and call checkScrollState when value is empty', () => {
        vi.spyOn(component as any, 'checkScrollState');

        component.writeValueModel('');

        expect(component.hasValue).toBe(false);
        expect(component['checkScrollState']).toHaveBeenCalled();
      });
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

        vi.spyOn(component.keydown as any, 'emit');
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(component.inputEl.nativeElement);

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

        vi.spyOn(component.keydown as any, 'emit');
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(document.createElement('div'));
        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).not.toHaveBeenCalled();
      });
    });

    describe('showAdditionalHelp:', () => {
      let helperEl: any;
      beforeEach(() => {
        helperEl = {
          openHelperPopover: vi.fn(),
          closeHelperPopover: vi.fn(),
          helperIsVisible: vi.fn().mockReturnValue(false)
        };
      });

      it('should call closeHelperPopover and return early when helperIsVisible is true', () => {
        (component as any).label = '';
        component.additionalHelpTooltip = undefined;
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should emit additionalHelp and return early when isAdditionalHelpEventTriggered is true', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: vi.fn() };
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(helperMock);
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(helperMock.eventOnClick).toHaveBeenCalledTimes(1);
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via additionalHelpTooltip when helper is falsy and isHelpEvt is false, then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = 'any text';
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via isHelpEvt when helper and tooltip are falsy, emit and then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBe(true);
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBe(false);
        expect(component.displayAdditionalHelp).toBe(false);
      });
    });

    describe('isAdditionalHelpEventTriggered:', () => {
      it('should return true when additionalHelpEventTrigger is "event"', () => {
        component.additionalHelpEventTrigger = 'event';
        expect((component as any).isAdditionalHelpEventTriggered()).toBe(true);
      });

      it('should return true when additionalHelpEventTrigger is undefined and additionalHelp is observed', () => {
        component.additionalHelpEventTrigger = undefined;
        component.additionalHelp = {
          observed: true
        } as any;

        expect((component as any).isAdditionalHelpEventTriggered()).toBe(true);
      });

      it('should return false when additionalHelpEventTrigger is not "event" and additionalHelp is not observed', () => {
        component.additionalHelpEventTrigger = 'noEvent';
        expect((component as any).isAdditionalHelpEventTriggered()).toBe(false);
      });
    });

    describe('onAfterThemeChange:', () => {
      it('should call syncContainerWidth and checkScrollState via requestAnimationFrame', () => {
        vi.spyOn(component as any, 'syncContainerWidth');
        vi.spyOn(component as any, 'checkScrollState');
        vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: any) => {
          cb();
          return 0;
        });

        component['onAfterThemeChange']();

        expect(component['syncContainerWidth']).toHaveBeenCalled();
        expect(component['checkScrollState']).toHaveBeenCalled();
      });

      it('should call requestAnimationFrame in onAfterThemeChange', () => {
        vi.spyOn(component as any, 'syncContainerWidth');
        vi.spyOn(component as any, 'checkScrollState');
        const rafSpy = vi.spyOn(globalThis as any, 'requestAnimationFrame').mockImplementation((cb: any) => {
          cb();
          return 123;
        });

        component['onAfterThemeChange']();

        expect(rafSpy).toHaveBeenCalled();
        expect(component['syncContainerWidth']).toHaveBeenCalled();
        expect(component['checkScrollState']).toHaveBeenCalled();
      });
    });

    describe('onWindowResize:', () => {
      it('should call syncContainerWidth and checkScrollState', () => {
        vi.spyOn(component as any, 'syncContainerWidth');
        vi.spyOn(component as any, 'checkScrollState');
        component['onWindowResize']();
        expect(component['syncContainerWidth']).toHaveBeenCalled();
        expect(component['checkScrollState']).toHaveBeenCalled();
      });
    });

    describe('initResizeObserver:', () => {
      let observeSpy: any;
      let observerCallback: Function;

      beforeEach(() => {
        observeSpy = vi.fn();
        (window as any).ResizeObserver = function (callback: Function) {
          observerCallback = callback;
          return { observe: observeSpy, disconnect: vi.fn() };
        };
      });

      it('should create ResizeObserver and observe the textarea element', () => {
        component['initResizeObserver']();
        expect(observeSpy).toHaveBeenCalledWith(component.inputEl.nativeElement);
      });

      it('should call checkScrollState in the observer callback', fakeAsync(() => {
        vi.spyOn(component as any, 'checkScrollState');

        let observerCallback: Function;
        (window as any).ResizeObserver = function (callback: Function) {
          observerCallback = callback;
          return { observe: vi.fn(), disconnect: vi.fn() };
        };

        component['initResizeObserver']();

        if (observerCallback) {
          observerCallback();
        }

        tick(16);

        expect(component['checkScrollState']).toHaveBeenCalled();
      }));

      it('should not throw if ResizeObserver is undefined', () => {
        (window as any).ResizeObserver = undefined;
        expect(() => component['initResizeObserver']()).not.toThrow();
      });

      it('should not throw if inputEl is undefined', () => {
        component.inputEl = undefined;
        expect(() => component['initResizeObserver']()).not.toThrow();
      });
    });

    describe('checkScrollState:', () => {
      it('should set hasScroll to true when scrollHeight > clientHeight', () => {
        Object.defineProperty(component.inputEl.nativeElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(component.inputEl.nativeElement, 'clientHeight', { value: 100, configurable: true });

        component['checkScrollState']();

        expect(component.hasScroll).toBe(true);
      });

      it('should set hasScroll to false when scrollHeight <= clientHeight', () => {
        Object.defineProperty(component.inputEl.nativeElement, 'scrollHeight', { value: 100, configurable: true });
        Object.defineProperty(component.inputEl.nativeElement, 'clientHeight', { value: 100, configurable: true });

        component['checkScrollState']();

        expect(component.hasScroll).toBe(false);
      });

      it('should call cd.markForCheck', () => {
        vi.spyOn(component['cd'] as any, 'markForCheck');

        component['checkScrollState']();

        expect(component['cd'].markForCheck).toHaveBeenCalled();
      });

      it('should not throw if inputEl is undefined', () => {
        component.inputEl = undefined;

        expect(() => component['checkScrollState']()).not.toThrow();
      });
    });

    describe('syncContainerWidth:', () => {
      it('should set body width to fit-content when loading is true and textarea has inline width', () => {
        component.loading = true;
        const textarea = component.inputEl.nativeElement;
        textarea.style.width = '300px';

        component['syncContainerWidth']();

        const body = component.textareaBodyEl.nativeElement;
        expect(body.style.width).toBe('fit-content');
      });

      it('should not set body width when textarea has no inline width', () => {
        component.loading = true;
        const textarea = component.inputEl.nativeElement;
        textarea.style.width = '';

        component['syncContainerWidth']();

        const body = component.textareaBodyEl.nativeElement;
        expect(body.style.width).toBe('');
      });

      it('should clear body width when loading is false', () => {
        component.loading = false;
        const textarea = component.inputEl.nativeElement;
        textarea.style.width = '300px';

        component['syncContainerWidth']();

        const body = component.textareaBodyEl.nativeElement;
        expect(body.style.width).toBe('');
      });

      it('should not throw if inputEl is undefined', () => {
        component.inputEl = undefined;
        expect(() => component['syncContainerWidth']()).not.toThrow();
      });

      it('should not throw if textareaBodyEl is undefined', () => {
        component.textareaBodyEl = undefined;
        expect(() => component['syncContainerWidth']()).not.toThrow();
      });
    });

    describe('isAdditionalHelpEventTriggered:', () => {
      it('should return true when additionalHelpEventTrigger is "event"', () => {
        component.additionalHelpEventTrigger = 'event';
        expect((component as any).isAdditionalHelpEventTriggered()).toBe(true);
      });

      it('should return true when additionalHelpEventTrigger is undefined and additionalHelp is observed', () => {
        component.additionalHelpEventTrigger = undefined;
        component.additionalHelp = {
          observed: true
        } as any;

        expect((component as any).isAdditionalHelpEventTriggered()).toBe(true);
      });

      it('should return false when additionalHelpEventTrigger is not "event" and additionalHelp is not observed', () => {
        component.additionalHelpEventTrigger = 'noEvent';
        expect((component as any).isAdditionalHelpEventTriggered()).toBe(false);
      });
    });
  });
});
