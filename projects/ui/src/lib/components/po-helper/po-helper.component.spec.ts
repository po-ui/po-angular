import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';

import { PoHelperComponent } from './po-helper.component';
import { PoHelperOptions } from './interfaces/po-helper.interface';
import { PoPopoverComponent } from '../po-popover';

describe('PoHelperComponent', () => {
  let component: PoHelperComponent;
  let fixture: ComponentFixture<PoHelperComponent>;

  beforeEach(async () => {
    (PoHelperComponent as any).instances = [];
    await TestBed.configureTestingModule({
      declarations: [PoHelperComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ChangeDetectorRef]
    }).compileComponents();

    fixture = TestBed.createComponent(PoHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default id', () => {
    expect(component.id).toContain('po-helper-');
  });

  it('should remove event listener on destroy', () => {
    component.ngAfterViewInit();
    const spy = spyOn(window, 'removeEventListener').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith('focusin', jasmine.any(Function), true);
  });

  describe('emitClick', () => {
    it('should prevent default if disabled', () => {
      spyOn(component, 'disabled').and.returnValue(true);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      spyOn(event, 'preventDefault');
      component.emitClick(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should call eventOnClick if defined', () => {
      spyOn(component, 'disabled').and.returnValue(false);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      spyOn(event, 'preventDefault');
      const eventOnClick = jasmine.createSpy();
      const options: PoHelperOptions = {
        title: 'Ajuda',
        content: 'Conteúdo',
        type: 'info',
        eventOnClick: eventOnClick,
        footerAction: { label: 'Ação', action: () => {} }
      };
      fixture.componentRef.setInput('p-helper', options);
      component.emitClick(event);
      expect(eventOnClick).toHaveBeenCalled();
    });

    it('should not throw if helper is string', () => {
      spyOn(component, 'disabled').and.returnValue(false);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      spyOn(event, 'preventDefault');
      const text = 'Texto explicativo';
      fixture.componentRef.setInput('p-helper', text);
      expect(() => component.emitClick(event)).not.toThrow();
    });

    it('should return early when helper is falsy (undefined) and not call handleEmitEvent', () => {
      spyOn(component, 'disabled').and.returnValue(false);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });

      (component as any).helper = () => undefined;

      const handleSpy = spyOn<any>(component, 'handleEmitEvent');

      component.emitClick(event);

      expect(handleSpy).not.toHaveBeenCalled();
    });

    it('should return early when helper is a string and not call handleEmitEvent', () => {
      spyOn(component, 'disabled').and.returnValue(false);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });

      (component as any).helper = () => 'Texto explicativo';

      const handleSpy = spyOn<any>(component, 'handleEmitEvent');
      expect(() => component.emitClick(event)).not.toThrow();
      expect(handleSpy).not.toHaveBeenCalled();
    });
    it('should call emit when eventOnClick is an object with emit function', () => {
      spyOn(component, 'disabled').and.returnValue(false);

      const event: any = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };

      const emitSpy = jasmine.createSpy('emit');
      (component as any).helper = () => ({
        content: 'conteúdo',
        eventOnClick: { emit: emitSpy }
      });

      component.emitClick(event as MouseEvent);

      expect(emitSpy).toHaveBeenCalledWith(jasmine.objectContaining({ content: 'conteúdo' }));
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('onKeyDown', () => {
    let popover: jasmine.SpyObj<PoPopoverComponent>;

    beforeEach(() => {
      (component as any).helper = () => ({ content: 'texto de ajuda' });
      popover = jasmine.createSpyObj<PoPopoverComponent>('Popover', ['open', 'close']);
      (popover as any).isHidden = true;
      component.popover = popover as any;
      (component as any).disabled = () => false;
    });

    it('should prevent default and stop propagation if disabled', () => {
      spyOn(component, 'disabled').and.returnValue(true);

      const event: any = {
        code: 'Enter',
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };

      component.onKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.popover.open).not.toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should return early if popover is undefined', () => {
      component.popover = undefined;

      const event: any = {
        code: 'Enter',
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };

      component.onKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.popover).toBeUndefined();
    });

    it('should open popover on Enter', () => {
      const event = new KeyboardEvent('keydown', { code: 'Enter' });
      component.onKeyDown(event);
      expect(component.popover.open).toHaveBeenCalled();
    });

    it('should open popover on Space', () => {
      const event = new KeyboardEvent('keydown', { code: 'Space' });
      component.onKeyDown(event);
      expect(component.popover.open).toHaveBeenCalled();
    });

    it('should close popover if already open', () => {
      (component.popover as any).isHidden = false;
      const event = {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        preventDefault: () => {},
        stopPropagation: () => {}
      } as any;

      component.onKeyDown(event);

      expect(component.popover.close).toHaveBeenCalled();
      expect(component.popover.open).not.toHaveBeenCalled();
    });

    it('should close other open popovers', () => {
      component.popover.isHidden = true;
      const otherPopover = { isHidden: false, close: jasmine.createSpy() };
      (PoHelperComponent as any).instances.push({ popover: otherPopover });
      const event = new KeyboardEvent('keydown', { code: 'Enter' });
      component.onKeyDown(event);
      expect(otherPopover.close).toHaveBeenCalled();
      (PoHelperComponent as any).instances.pop();
    });

    it('should open popover when helper is a string (Enter)', () => {
      (component as any).helper = () => 'ajuda simples';

      const event = new KeyboardEvent('keydown', { code: 'Enter' });

      component.onKeyDown(event);

      expect(component.popover.open).toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should open popover when helper has only title (no content)', () => {
      (component as any).helper = () => ({ title: 'Título de ajuda' });

      const event = new KeyboardEvent('keydown', { code: 'Enter' });

      component.onKeyDown(event);

      expect(component.popover.open).toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should close popover when helper has no content and no title', () => {
      (component as any).helper = () => ({});

      const event = new KeyboardEvent('keydown', { code: 'Enter' });

      component.onKeyDown(event);

      expect(component.popover.close).toHaveBeenCalled();
      expect(component.popover.open).not.toHaveBeenCalled();
    });
  });

  it('should call detectChanges on ngOnChanges when size changes', () => {
    const spy = spyOn(component['cdr'], 'detectChanges');
    component.ngOnChanges({
      size: { previousValue: 'small', currentValue: 'medium', firstChange: false, isFirstChange: () => false }
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should return correct ariaLabel for info type', () => {
    const options: PoHelperOptions = {
      title: 'Ajuda',
      content: 'Conteúdo',
      type: 'info',
      eventOnClick: () => {},
      footerAction: { label: 'Ação', action: () => {} }
    };
    fixture.componentRef.setInput('p-helper', options);
    spyOnProperty(navigator, 'language', 'get').and.returnValue('en-US');
    expect(component['ariaLabel']()).toBe('Show Information');
  });

  it('should return correct ariaLabel for help type', () => {
    const options: PoHelperOptions = {
      title: 'Ajuda',
      content: 'Conteúdo',
      type: 'help',
      eventOnClick: () => {},
      footerAction: { label: 'Ação', action: () => {} }
    };
    fixture.componentRef.setInput('p-helper', options);
    spyOnProperty(navigator, 'language', 'get').and.returnValue('pt-BR');
    expect(component['ariaLabel']()).toBe('Exibe ajuda');
  });

  it('should return correct ariaLabel for string helper', () => {
    const text = 'Texto explicativo';
    fixture.componentRef.setInput('p-helper', text);
    spyOnProperty(navigator, 'language', 'get').and.returnValue('es-ES');
    expect(component['ariaLabel']()).toBe('Muestra ayuda');
  });

  it('should fallback to EN when navigator.language is falsy', () => {
    const options: PoHelperOptions = {
      title: 'Ajuda',
      content: 'Conteúdo',
      type: 'info',
      eventOnClick: () => {},
      footerAction: { label: 'Ação', action: () => {} }
    };

    fixture.componentRef.setInput('p-helper', options);
    spyOnProperty(navigator, 'language', 'get').and.returnValue(undefined as any);
    expect(component['ariaLabel']()).toBe('Show Information');
  });

  it('should fallback to EN literals when lang is unsupported', () => {
    const options: PoHelperOptions = {
      title: 'Ajuda',
      content: 'Conteúdo',
      type: 'info',
      eventOnClick: () => {},
      footerAction: { label: 'Ação', action: () => {} }
    };

    fixture.componentRef.setInput('p-helper', options);
    spyOnProperty(navigator, 'language', 'get').and.returnValue('fr-FR');

    expect(component['ariaLabel']()).toBe('Show Information');
  });

  describe('closePopoverOnFocusOut', () => {
    let event: FocusEvent;
    let focusNode: any;
    let targetEl: any;
    let popEl: any;

    beforeEach(() => {
      focusNode = document.createElement('div');
      targetEl = { contains: jasmine.createSpy() };
      popEl = { contains: jasmine.createSpy() };

      component.target = { nativeElement: targetEl };
      const popover = jasmine.createSpyObj<PoPopoverComponent>('Popover', ['close'], {
        isHidden: false,
        popoverElement: { nativeElement: popEl }
      });
      component.popover = popover;
    });

    it('should not call close if popover is undefined', () => {
      component.popover = undefined;
      event = new FocusEvent('focusin', { relatedTarget: focusNode });
      expect(() => component.closePopoverOnFocusOut(event)).not.toThrow();
    });

    it('should not call close if popover isHidden', () => {
      component.popover.isHidden = true;
      event = new FocusEvent('focusin', { relatedTarget: focusNode });
      component.closePopoverOnFocusOut(event);
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should not call close if focusNode is contained in target', () => {
      targetEl.contains.and.returnValue(true);
      popEl.contains.and.returnValue(false);
      event = new FocusEvent('focusin', { relatedTarget: focusNode });
      Object.defineProperty(event, 'target', { value: focusNode });
      component.closePopoverOnFocusOut(event);
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should not call close if focusNode is contained in popover', () => {
      targetEl.contains.and.returnValue(false);
      popEl.contains.and.returnValue(true);
      event = new FocusEvent('focusin', { relatedTarget: focusNode });
      Object.defineProperty(event, 'target', { value: focusNode });
      component.closePopoverOnFocusOut(event);
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should call close if focusNode is not contained in target or popover', () => {
      targetEl.contains.and.returnValue(false);
      popEl.contains.and.returnValue(false);
      event = new FocusEvent('focusin', { relatedTarget: focusNode });
      Object.defineProperty(event, 'target', { value: focusNode });
      component.closePopoverOnFocusOut(event);
      expect(component.popover.close).toHaveBeenCalled();
    });

    it('should not throw if focusNode is falsy', () => {
      event = new FocusEvent('focusin', { relatedTarget: null });
      Object.defineProperty(event, 'target', { value: null });
      expect(() => component.closePopoverOnFocusOut(event)).not.toThrow();
    });
  });

  describe('openHelperPopover / closeHelperPopover', () => {
    let popover: jasmine.SpyObj<PoPopoverComponent>;

    beforeEach(() => {
      spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
        cb(0);
        return 1 as any;
      });

      popover = jasmine.createSpyObj<PoPopoverComponent>('Popover', ['open', 'close']);
      (popover as any).isHidden = true;
      component.popover = popover as any;

      (component as any).helper = () => ({ content: 'texto de ajuda' });
    });

    afterEach(() => {
      popover.open.calls.reset();
      popover.close.calls.reset();
      (window.requestAnimationFrame as jasmine.Spy).calls.reset();
    });

    it('openHelperPopover: It should call open when popover.isHidden is true', () => {
      (component.popover as any).isHidden = true;

      component.openHelperPopover();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component.popover.open).toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('openHelperPopover: It should not call open when popover.isHidden is false', () => {
      (component.popover as any).isHidden = false;

      component.openHelperPopover();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component.popover.open).not.toHaveBeenCalled();
    });

    it('closeHelperPopover: It should call close when popover.isHidden is false', () => {
      (component.popover as any).isHidden = false;

      component.closeHelperPopover();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component.popover.close).toHaveBeenCalled();
      expect(component.popover.open).not.toHaveBeenCalled();
    });

    it('closeHelperPopover: It should not call close when popover.isHidden is true', () => {
      (component.popover as any).isHidden = true;

      component.closeHelperPopover();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('openHelperPopover: It should call open when helper returns a string', () => {
      (component.popover as any).isHidden = true;
      (component as any).helper = () => 'texto simples';

      component.openHelperPopover();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component.popover.open).toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('openHelperPopover: It should call open when helper returns an object with title (no content)', () => {
      (component.popover as any).isHidden = true;
      (component as any).helper = () => ({ title: 'Ajuda' });

      component.openHelperPopover();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component.popover.open).toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('openHelperPopover: It should NOT call open when helper returns empty object (no content/title)', () => {
      (component.popover as any).isHidden = true;
      (component as any).helper = () => ({});

      component.openHelperPopover();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component.popover.open).not.toHaveBeenCalled();
    });
  });

  describe('setPopoverPositionByScreen', () => {
    let originalInnerWidth: number;

    beforeEach(() => {
      originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
    });

    it('should not change popoverPosition when target or nativeElement are falsy', () => {
      (component as any).popoverPosition = 'left';
      component.target = undefined as any;
      expect(() => component.setPopoverPositionByScreen()).not.toThrow();
      expect((component as any).popoverPosition).toBe('left');

      (component as any).popoverPosition = 'right';
      (component as any).target = {} as any;
      expect(() => component.setPopoverPositionByScreen()).not.toThrow();
      expect((component as any).popoverPosition).toBe('right');
    });

    it('should set popoverPosition to "left" when rect.right + 400 > screenWidth', () => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1000 });
      const rect = { right: 700 } as DOMRect;
      (component as any).target = {
        nativeElement: { getBoundingClientRect: () => rect }
      };

      component.setPopoverPositionByScreen();
      expect((component as any).popoverPosition).toBe('left');
    });

    it('should set popoverPosition to "right" when rect.right + 400 <= screenWidth', () => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1000 });
      const rect = { right: 500 } as DOMRect;
      (component as any).target = {
        nativeElement: { getBoundingClientRect: () => rect }
      };
      component.setPopoverPositionByScreen();
      expect((component as any).popoverPosition).toBe('right');
    });

    it('should use document.documentElement.clientWidth when window.innerWidth is falsy', () => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 0 });

      spyOnProperty(document.documentElement, 'clientWidth', 'get').and.returnValue(900);

      const rect = { right: 400 } as DOMRect;
      (component as any).target = {
        nativeElement: { getBoundingClientRect: () => rect }
      };

      component.setPopoverPositionByScreen();

      expect((component as any).popoverPosition).toBe('right');
    });
  });
});
