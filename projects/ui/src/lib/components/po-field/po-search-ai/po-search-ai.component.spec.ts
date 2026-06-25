import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoSearchAiResponse } from './interfaces/po-search-ai.interface';
import { PoSearchAiComponent } from './po-search-ai.component';
import { PoSearchAiService } from './po-search-ai.service';

describe('PoSearchAiComponent: ', () => {
  let component: PoSearchAiComponent;
  let fixture: ComponentFixture<PoSearchAiComponent>;
  let serviceSpy: jasmine.SpyObj<PoSearchAiService>;

  configureTestSuite(() => {
    serviceSpy = jasmine.createSpyObj('PoSearchAiService', ['sendQuery', 'extractColumnsMetadata']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PoSearchAiComponent],
      providers: [{ provide: PoSearchAiService, useValue: serviceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSearchAiComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('p-url', '/api/ai-search');
    serviceSpy.extractColumnsMetadata.and.returnValue([]);
    serviceSpy.sendQuery.calls.reset();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
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
  });

  describe('Methods:', () => {
    describe('ngOnChanges:', () => {
      it('should reset displayAdditionalHelp when label changes', () => {
        component.displayAdditionalHelp = true;
        component.ngOnChanges({ label: new SimpleChange(undefined, 'test', true) } as SimpleChanges);
        expect(component.displayAdditionalHelp).toBeFalse();
      });

      it('should not change displayAdditionalHelp when label does not change', () => {
        component.displayAdditionalHelp = true;
        component.ngOnChanges({} as SimpleChanges);
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
          jasmine.objectContaining({ statusCode: 500, message: 'Erro na busca com IA' })
        );
      });
    });

    describe('clearSearch:', () => {
      it('should reset state, clear the input value and emit p-clear', () => {
        const clearSpy = spyOn(component.clearEvent, 'emit');
        const onChangeSpy = spyOn(component, 'callOnChange');
        (component as any).aiLoading = true;
        component.loading = true;
        component.inputEl.nativeElement.value = 'algum texto';

        component.clearSearch();

        expect((component as any).aiLoading).toBeFalse();
        expect(component.loading).toBeFalse();
        expect(component.inputEl.nativeElement.value).toBe('');
        expect(onChangeSpy).toHaveBeenCalledWith('');
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
