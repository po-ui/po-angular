import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoSearchAiResponse, PoSearchAiResponseType } from './interfaces/po-search-ai.interface';
import { PoSearchAiComponent } from './po-search-ai.component';
import { PoSearchAiService } from './po-search-ai.service';

describe('PoSearchAiComponent: ', () => {
  let component: PoSearchAiComponent;
  let fixture: ComponentFixture<PoSearchAiComponent>;
  let serviceSpy: jasmine.SpyObj<PoSearchAiService>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PoSearchAiComponent],
      providers: [{ provide: PoLanguageService, useValue: { getShortLanguage: () => 'en' } }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSearchAiComponent);
    component = fixture.componentInstance;

    serviceSpy = (component as any).searchAiService;
    spyOn(serviceSpy, 'sendQuery').and.returnValue(of({} as PoSearchAiResponse));
    spyOn(serviceSpy, 'extractColumnsMetadata').and.returnValue([]);

    fixture.componentRef.setInput('p-url', '/api/ai-search');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should register itself as NG_VALUE_ACCESSOR and NG_VALIDATORS', () => {
    const valueAccessors = fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    const validators = fixture.debugElement.injector.get(NG_VALIDATORS);

    expect(valueAccessors).toContain(component);
    expect(validators).toContain(component);
  });

  it('should return null in extraValidation', () => {
    expect(component.extraValidation(null as any)).toBeNull();
  });

  describe('Properties:', () => {
    it('p-timeout: should set default when value is not greater than zero', () => {
      fixture.componentRef.setInput('p-timeout', 0);
      expect(component.timeout()).toBe(10000);

      fixture.componentRef.setInput('p-timeout', 5000);
      expect(component.timeout()).toBe(5000);
    });

    it('p-min-confidence: should accept values between 0 and 1 and fallback otherwise', () => {
      fixture.componentRef.setInput('p-min-confidence', 0.8);
      expect(component.minConfidence()).toBe(0.8);

      fixture.componentRef.setInput('p-min-confidence', 2);
      expect(component.minConfidence()).toBe(0.5);

      fixture.componentRef.setInput('p-min-confidence', -1);
      expect(component.minConfidence()).toBe(0.5);
    });

    it('p-url: should get and set the url', () => {
      fixture.componentRef.setInput('p-url', '/custom');
      expect(component.url()).toBe('/custom');
    });

    it('p-columns: should pass the signal value to extractColumnsMetadata on search', () => {
      const columns = [{ property: 'name', label: 'Name', type: 'string' }];
      fixture.componentRef.setInput('p-columns', columns);
      spyOn(component, 'getScreenValue').and.returnValue('query');
      serviceSpy.extractColumnsMetadata.and.returnValue([{ property: 'name', label: 'Name', type: 'string' }]);
      serviceSpy.sendQuery.and.returnValue(of({ filter: '', confidence: 1 }));

      component.search();

      expect(serviceSpy.extractColumnsMetadata).toHaveBeenCalledWith(columns);
    });

    it('p-literals: should use the custom error message when p-literals is set and error has no message', () => {
      fixture.componentRef.setInput('p-literals', { errorMessage: 'Custom AI error' });
      spyOn(component, 'getScreenValue').and.returnValue('query');
      serviceSpy.extractColumnsMetadata.and.returnValue([]);
      serviceSpy.sendQuery.and.returnValue(throwError(() => ({})));
      const errorSpy = spyOn(component.error, 'emit');

      component.search();

      expect(errorSpy).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Custom AI error' }));
    });
  });

  describe('Methods:', () => {
    describe('ngOnChanges:', () => {
      it('should reset displayAdditionalHelp when label changes', () => {
        component.displayAdditionalHelp = true;
        component.ngOnChanges({ label: new SimpleChange(undefined, 'test', true) });
        expect(component.displayAdditionalHelp).toBeFalse();
      });

      it('should not change displayAdditionalHelp when label does not change', () => {
        component.displayAdditionalHelp = true;
        component.ngOnChanges({});
        expect(component.displayAdditionalHelp).toBeTrue();
      });
    });

    describe('search:', () => {
      beforeEach(() => {
        spyOn(component, 'getScreenValue').and.returnValue('clientes de SP');
      });

      it('should not call the service when query is empty', () => {
        (component.getScreenValue as jasmine.Spy).and.returnValue('   ');
        component.search();
        expect(serviceSpy.sendQuery).not.toHaveBeenCalled();
      });

      it('should not call the service when getScreenValue returns a falsy value', () => {
        (component.getScreenValue as jasmine.Spy).and.returnValue(undefined);
        component.search();
        expect(serviceSpy.sendQuery).not.toHaveBeenCalled();
      });

      it('should not call the service when url is not defined', () => {
        fixture.componentRef.setInput('p-url', undefined);
        component.search();
        expect(serviceSpy.sendQuery).not.toHaveBeenCalled();
      });

      it('should not call the service when disabled', () => {
        component.disabled = true;
        component.search();
        expect(serviceSpy.sendQuery).not.toHaveBeenCalled();
      });

      it('should not call the service when readonly', () => {
        component.readonly = true;
        component.search();
        expect(serviceSpy.sendQuery).not.toHaveBeenCalled();
      });

      it('should emit p-result on a confident response', () => {
        const response: PoSearchAiResponse = { filter: `city eq 'SP'`, description: 'cidade SP', confidence: 0.9 };
        serviceSpy.sendQuery.and.returnValue(of(response));
        const resultSpy = spyOn(component.result, 'emit');

        component.search();

        expect(serviceSpy.sendQuery).toHaveBeenCalled();
        expect((component as any).aiLoading).toBeFalse();
        expect(component.loading).toBeFalse();
        expect(resultSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({ filter: `city eq 'SP'`, description: 'cidade SP', confidence: 0.9 })
        );
      });

      it('should treat missing confidence as fully confident (1)', () => {
        const response: PoSearchAiResponse = { filter: `city eq 'SP'`, description: 'cidade SP' };
        serviceSpy.sendQuery.and.returnValue(of(response));
        const resultSpy = spyOn(component.result, 'emit');

        component.search();

        expect(resultSpy).toHaveBeenCalled();
      });

      it('should emit p-low-confidence when confidence is below min-confidence', () => {
        const response: PoSearchAiResponse = { filter: '', description: 'incerto', confidence: 0.2 };
        serviceSpy.sendQuery.and.returnValue(of(response));
        const lowSpy = spyOn(component.lowConfidence, 'emit');
        const resultSpy = spyOn(component.result, 'emit');

        component.search();

        expect(lowSpy).toHaveBeenCalled();
        expect(resultSpy).not.toHaveBeenCalled();
      });

      it('should emit p-error when the service fails', () => {
        serviceSpy.sendQuery.and.returnValue(throwError(() => ({ statusCode: 408, message: 'timeout' })));
        const errorSpy = spyOn(component.error, 'emit');

        component.search();

        expect(errorSpy).toHaveBeenCalledWith(jasmine.objectContaining({ statusCode: 408, message: 'timeout' }));
        expect((component as any).aiLoading).toBeFalse();
        expect(component.loading).toBeFalse();
      });

      it('should emit p-error with defaults when error object is empty', () => {
        serviceSpy.sendQuery.and.returnValue(throwError(() => ({})));
        const errorSpy = spyOn(component.error, 'emit');

        component.search();

        expect(errorSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({ statusCode: 500, message: 'AI search error' })
        );
      });

      it('should infer type as "filter" when response has filter property', () => {
        const response: PoSearchAiResponse = { filter: `age gt 30`, confidence: 0.9 };
        serviceSpy.sendQuery.and.returnValue(of(response));
        const resultSpy = spyOn(component.result, 'emit');

        component.search();

        expect(resultSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({ type: PoSearchAiResponseType.filter, filter: 'age gt 30' })
        );
      });

      it('should infer type as "custom" when response has no filter and no type', () => {
        const response: PoSearchAiResponse = {
          description: 'something',
          confidence: 0.9,
          data: { action: 'navigate' }
        };
        serviceSpy.sendQuery.and.returnValue(of(response));
        const resultSpy = spyOn(component.result, 'emit');

        component.search();

        expect(resultSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({ type: PoSearchAiResponseType.custom, data: { action: 'navigate' } })
        );
      });

      it('should use explicit type from response when provided', () => {
        const response: PoSearchAiResponse = {
          type: PoSearchAiResponseType.chat,
          description: 'Here is your answer',
          confidence: 0.95,
          data: { message: 'Hello' }
        };
        serviceSpy.sendQuery.and.returnValue(of(response));
        const resultSpy = spyOn(component.result, 'emit');

        component.search();

        expect(resultSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({ type: PoSearchAiResponseType.chat, data: { message: 'Hello' } })
        );
      });

      it('should propagate data field to the emitted result', () => {
        const response: PoSearchAiResponse = { filter: 'x eq 1', confidence: 0.9, data: { extra: true } };
        serviceSpy.sendQuery.and.returnValue(of(response));
        const resultSpy = spyOn(component.result, 'emit');

        component.search();

        expect(resultSpy).toHaveBeenCalledWith(jasmine.objectContaining({ data: { extra: true } }));
      });

      it('should emit result with undefined data when response has no data', () => {
        const response: PoSearchAiResponse = { filter: 'x eq 1', confidence: 0.9 };
        serviceSpy.sendQuery.and.returnValue(of(response));
        const resultSpy = spyOn(component.result, 'emit');

        component.search();

        expect(resultSpy).toHaveBeenCalledWith(jasmine.objectContaining({ data: undefined }));
      });
    });

    describe('clearAndFocus:', () => {
      it('should call clearSearch and focus the input after the delay', fakeAsync(() => {
        const clearSearchSpy = spyOn(component, 'clearSearch');
        const focusSpy = spyOn(component.inputEl.nativeElement, 'focus');

        component.clearAndFocus();

        expect(clearSearchSpy).toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();

        tick(200);

        expect(focusSpy).toHaveBeenCalled();
      }));
    });

    describe('handleCleanKeydown:', () => {
      it('should focus the search button and prevent default on Tab without Shift', () => {
        const buttonSpy = jasmine.createSpyObj('PoButtonComponent', ['focus']);
        component.iconSearchAiEl = buttonSpy;
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
        spyOn(event, 'preventDefault');

        component.handleCleanKeydown(event);

        expect(buttonSpy.focus).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should focus the input, prevent default and stop propagation on Tab + Shift', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        const focusSpy = spyOn(component.inputEl.nativeElement, 'focus');
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');

        component.handleCleanKeydown(event);

        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should do nothing for non-Tab keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(event, 'preventDefault');

        component.handleCleanKeydown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('hasValue:', () => {
      it('should return true when the screen value is not empty', () => {
        spyOn(component, 'getScreenValue').and.returnValue('some text');
        expect(component.hasValue()).toBeTrue();
      });

      it('should return false when the screen value is empty or undefined', () => {
        spyOn(component, 'getScreenValue').and.returnValue(undefined);
        expect(component.hasValue()).toBeFalse();
      });
    });

    describe('clearSearch:', () => {
      it('should reset state, clear the input value and emit p-clear', () => {
        const clearSpy = spyOn(component.clearEvent, 'emit');
        const onChangeSpy = spyOn(component, 'callOnChange');
        (component as any).aiLoading = true;
        component.inputEl.nativeElement.value = 'algum texto';

        component.clearSearch();

        expect((component as any).aiLoading).toBeFalse();
        expect(component.inputEl.nativeElement.value).toBe('');
        expect(onChangeSpy).toHaveBeenCalledWith('');
        expect(clearSpy).toHaveBeenCalled();
      });

      it('should not reset consumer-controlled loading state on clear', () => {
        component.loading = true;
        component.clearSearch();
        expect(component.loading).toBeTrue();
      });

      it('should skip clearing the input value when inputEl is not defined', () => {
        const clearSpy = spyOn(component.clearEvent, 'emit');
        (component as any).inputEl = undefined;

        expect(() => component.clearSearch()).not.toThrow();
        expect(clearSpy).toHaveBeenCalled();
      });
    });

    describe('onSearchKeydown:', () => {
      it('should call search and prevent default when Enter is pressed', () => {
        const searchSpy = spyOn(component, 'search');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        const preventSpy = spyOn(event, 'preventDefault');

        component.onSearchKeydown(event);

        expect(searchSpy).toHaveBeenCalled();
        expect(preventSpy).toHaveBeenCalled();
      });

      it('should not call search for other keys', () => {
        const searchSpy = spyOn(component, 'search');
        const event = new KeyboardEvent('keydown', { key: 'a' });

        component.onSearchKeydown(event);

        expect(searchSpy).not.toHaveBeenCalled();
      });
    });

    describe('ngOnDestroy:', () => {
      it('should unsubscribe the ai subscription', () => {
        const response: PoSearchAiResponse = { filter: 'x', description: 'd', confidence: 1 };
        serviceSpy.sendQuery.and.returnValue(of(response));
        spyOn(component, 'getScreenValue').and.returnValue('algo');
        component.search();

        const unsubscribeSpy = spyOn(component['aiSubscription'], 'unsubscribe');
        component.ngOnDestroy();

        expect(unsubscribeSpy).toHaveBeenCalled();
      });

      it('should not throw when there is no ai subscription', () => {
        component['aiSubscription'] = undefined;
        expect(() => component.ngOnDestroy()).not.toThrow();
      });
    });
  });
});
