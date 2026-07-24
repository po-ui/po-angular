import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PoContextTabButtonComponent } from './po-context-tab-button.component';

describe('PoContextTabButtonComponent:', () => {
  let component: PoContextTabButtonComponent;
  let fixture: ComponentFixture<PoContextTabButtonComponent>;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoContextTabButtonComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoContextTabButtonComponent);
    component = fixture.componentInstance;
    // Set required inputs that the template references
    component.literals = { close: 'Fechar' } as any;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('afterViewInit: should apply initial properties', () => {
      // Set required inputs that the template uses
      component.literals = { close: 'Fechar' } as any;
      component['tabButtom'] = { nativeElement: { offsetWidth: 100 } } as any;
      component.afterViewChecked = false;
      component.ngAfterViewInit();

      expect(component.afterViewChecked).toBe(true);
    });

    it('ngOnChanges: should emit `changeState` if hide currentValue is true', () => {
      const emitSpy = vi.spyOn(component.changeState, 'emit');

      component.ngOnChanges({ hide: { currentValue: true } } as any);

      expect(emitSpy).toHaveBeenCalled();
    });

    it('ngOnChanges: should emit `changeState` if disabled currentValue is true', () => {
      const emitSpy = vi.spyOn(component.changeState, 'emit');

      component.ngOnChanges({ disabled: { currentValue: true } } as any);

      expect(emitSpy).toHaveBeenCalled();
    });

    it('ngOnChanges: shouldn`t emit `changeState` if hide or disabled currentValue is false', () => {
      const emitSpy = vi.spyOn(component.changeState, 'emit');

      component.ngOnChanges({ disabled: { currentValue: false }, hide: { currentValue: false } } as any);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should emit `changeVisible` if hide currentValue is true', () => {
      const emitSpy = vi.spyOn(component.changeVisible, 'emit');

      component.afterViewChecked = true;
      component.ngOnChanges({ hide: { currentValue: true } } as any);

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit close when closeTab is called with Enter key and not disabled', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      vi.spyOn(event, 'preventDefault');
      vi.spyOn(event, 'stopPropagation');
      const closeSpy = vi.spyOn(component.close, 'emit');

      component.disabled = false;

      component.closeTab(event as any);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should stopPropagation when closeTab is called with ArrowLeft or ArrowRight key', () => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowLeft', key: 'ArrowLeft' });
      vi.spyOn(event, 'preventDefault');
      vi.spyOn(event, 'stopPropagation');
      const closeSpy = vi.spyOn(component.close, 'emit');

      component.closeTab(event as any);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(closeSpy).not.toHaveBeenCalled();

      const event2 = new KeyboardEvent('keydown', { code: 'ArrowRight', key: 'ArrowLeft' });
      vi.spyOn(event2, 'preventDefault');
      vi.spyOn(event2, 'stopPropagation');

      component.closeTab(event2 as any);

      expect(event2.preventDefault).toHaveBeenCalled();
      expect(event2.stopPropagation).toHaveBeenCalled();
    });

    it('should not emit close if component is disabled', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const closeSpy = vi.spyOn(component.close, 'emit');

      component.disabled = true;

      component.closeTab(event as any);

      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should activate close icon on focus in and deactivate on focus out', () => {
      component.disabled = false;

      component.onFocusIn();
      expect(component.activeCloseIcon).toBe(true);

      component.onFocusOut();
      expect(component.activeCloseIcon).toBe(false);
    });
  });
});
