import type { Mock } from 'vitest';
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

  describe('emitClick', () => {
    it('should prevent default if disabled', () => {
      vi.spyOn(component as any, 'disabled').mockReturnValue(true);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      vi.spyOn(event as any, 'preventDefault');
      component.emitClick(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should call eventOnClick if defined', () => {
      vi.spyOn(component as any, 'disabled').mockReturnValue(false);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      vi.spyOn(event as any, 'preventDefault');
      const eventOnClick = vi.fn();
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
      vi.spyOn(component as any, 'disabled').mockReturnValue(false);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      vi.spyOn(event as any, 'preventDefault');
      const text = 'Texto explicativo';
      fixture.componentRef.setInput('p-helper', text);
      expect(() => component.emitClick(event)).not.toThrow();
    });

    it('should return early when helper is falsy (undefined) and not call handleEmitEvent', () => {
      vi.spyOn(component as any, 'disabled').mockReturnValue(false);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });

      (component as any).helper = () => undefined;

      const handleSpy = vi.spyOn(component as any, 'handleEmitEvent');

      component.emitClick(event);

      expect(handleSpy).not.toHaveBeenCalled();
    });

    it('should return early when helper is a string and not call handleEmitEvent', () => {
      vi.spyOn(component as any, 'disabled').mockReturnValue(false);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });

      (component as any).helper = () => 'Texto explicativo';

      const handleSpy = vi.spyOn(component as any, 'handleEmitEvent');
      expect(() => component.emitClick(event)).not.toThrow();
      expect(handleSpy).not.toHaveBeenCalled();
    });
    it('should call emit when eventOnClick is an object with emit function', () => {
      vi.spyOn(component as any, 'disabled').mockReturnValue(false);

      const event: any = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      };

      const emitSpy = vi.fn();
      (component as any).helper = () => ({
        content: 'conteúdo',
        eventOnClick: { emit: emitSpy }
      });

      component.emitClick(event as MouseEvent);

      expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ content: 'conteúdo' }));
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('onKeyDown', () => {
    let popover: any;

    beforeEach(() => {
      (component as any).helper = () => ({ content: 'texto de ajuda' });
      popover = {
        open: vi.fn().mockName('Popover.open'),
        close: vi.fn().mockName('Popover.close')
      };
      (popover as any).isHidden = true;
      (component as any).popover = popover;
      (component as any).disabled = () => false;
    });

    it('should prevent default and stop propagation if disabled', () => {
      vi.spyOn(component as any, 'disabled').mockReturnValue(true);

      const event: any = {
        code: 'Enter',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
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
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
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
      const otherPopover = { isHidden: false, close: vi.fn() };
      (PoHelperComponent as any).instances.push({ popover: otherPopover });
      const event = new KeyboardEvent('keydown', { code: 'Enter' });
      component.onKeyDown(event);
      expect(otherPopover.close).toHaveBeenCalled();
      (PoHelperComponent as any).instances.pop();
    });

    it('should open popover when helper is a string (Enter)', () => {
      (component as any).helper = () => ({ content: 'ajuda simples' });

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

  describe('onKeyDown - eventOnClick branch', () => {
    let popover: any;

    beforeEach(() => {
      popover = {
        open: vi.fn().mockName('Popover.open'),
        close: vi.fn().mockName('Popover.close')
      };
      (popover as any).isHidden = true;
      (component as any).popover = popover;
      (component as any).disabled = () => false;
    });

    it('should call handleEmitEvent and return early when helper has eventOnClick (function)', () => {
      const event = new KeyboardEvent('keydown', { code: 'Enter' });
      const handleSpy = vi.spyOn(component as any, 'handleEmitEvent');
      (component as any).helper = () => ({
        content: 'help',
        eventOnClick: vi.fn()
      });

      component.onKeyDown(event);
      expect(handleSpy).toHaveBeenCalledWith(event);
      expect(component.popover.open).not.toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should call handleEmitEvent and return early when helper has eventOnClick as an object (emit)', () => {
      const event = new KeyboardEvent('keydown', { code: 'Enter' });
      const handleSpy = vi.spyOn(component as any, 'handleEmitEvent');
      (component as any).helper = () => ({
        content: 'help',
        eventOnClick: { emit: vi.fn() }
      });

      component.onKeyDown(event);
      expect(handleSpy).toHaveBeenCalledWith(event);
      expect(component.popover.open).not.toHaveBeenCalled();
      expect(component.popover.close).not.toHaveBeenCalled();
    });
  });

  it('should call detectChanges on ngOnChanges when size changes', () => {
    const spy = vi.spyOn(component['cdr'] as any, 'detectChanges');
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
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    expect(component['ariaLabel']()).toBe('Additional information');
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
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('pt-BR');
    expect(component['ariaLabel']()).toBe('Ajuda adicional');
  });

  it('should return correct ariaLabel for string helper', () => {
    const text = 'Texto explicativo';
    fixture.componentRef.setInput('p-helper', text);
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('es-ES');
    expect(component['ariaLabel']()).toBe('Ayuda adicional');
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
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(undefined);
    expect(component['ariaLabel']()).toBe('Additional information');
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
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR');

    expect(component['ariaLabel']()).toBe('Additional information');
  });

  describe('closePopoverOnFocusOut', () => {
    let event: FocusEvent;
    let focusNode: any;
    let targetEl: any;
    let popEl: any;

    beforeEach(() => {
      focusNode = document.createElement('div');
      targetEl = { contains: vi.fn() };
      popEl = { contains: vi.fn() };

      component.target = { nativeElement: targetEl };
      const popover = {
        close: vi.fn().mockName('Popover.close'),
        isHidden: false,
        popoverElement: { nativeElement: popEl }
      };
      (component as any).popover = popover;
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
      targetEl.contains.mockReturnValue(true);
      popEl.contains.mockReturnValue(false);
      event = new FocusEvent('focusin', { relatedTarget: focusNode });
      Object.defineProperty(event, 'target', { value: focusNode });
      component.closePopoverOnFocusOut(event);
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should not call close if focusNode is contained in popover', () => {
      targetEl.contains.mockReturnValue(false);
      popEl.contains.mockReturnValue(true);
      event = new FocusEvent('focusin', { relatedTarget: focusNode });
      Object.defineProperty(event, 'target', { value: focusNode });
      component.closePopoverOnFocusOut(event);
      expect(component.popover.close).not.toHaveBeenCalled();
    });

    it('should call close if focusNode is not contained in target or popover', () => {
      targetEl.contains.mockReturnValue(false);
      popEl.contains.mockReturnValue(false);
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
    let popover: any;

    beforeEach(() => {
      vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      });

      popover = {
        open: vi.fn().mockName('Popover.open'),
        close: vi.fn().mockName('Popover.close')
      };
      (popover as any).isHidden = true;
      (component as any).popover = popover;

      (component as any).helper = () => ({ content: 'texto de ajuda' });
    });

    afterEach(() => {
      popover.open.mockClear();
      popover.close.mockClear();
      (window.requestAnimationFrame as Mock).mockClear();
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

      vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(900);

      const rect = { right: 400 } as DOMRect;
      (component as any).target = {
        nativeElement: { getBoundingClientRect: () => rect }
      };

      component.setPopoverPositionByScreen();

      expect((component as any).popoverPosition).toBe('right');
    });
  });

  describe('helperIsVisible', () => {
    it('should return falsy when popover is undefined', () => {
      component.popover = undefined;
      const visible = (component as any).helperIsVisible();
      expect(visible).toBeFalsy();
    });

    it('should return false when popover.isHidden = true', () => {
      component.popover = { isHidden: true } as any;
      const visible = (component as any).helperIsVisible();
      expect(visible).toBe(false);
    });

    it('should return true when popover.isHidden = false', () => {
      component.popover = { isHidden: false } as any;
      const visible = (component as any).helperIsVisible();
      expect(visible).toBe(true);
    });
  });

  describe('handleOpen', () => {
    afterEach(() => {
      (component as any).boundFocusIn = undefined;
    });

    it('should add focusin listener and store bound function', () => {
      const addSpy = vi.spyOn(window as any, 'addEventListener');

      (component as any).handleOpen();

      expect((component as any).boundFocusIn).toEqual(expect.any(Function));
      expect(addSpy).toHaveBeenCalledWith('focusin', (component as any).boundFocusIn, true);
    });
  });

  describe('handleClose', () => {
    it('should remove focusin listener when boundFocusIn is defined', () => {
      const removeSpy = vi.spyOn(window as any, 'removeEventListener');
      const boundFn = () => {};

      (component as any).boundFocusIn = boundFn;

      (component as any).handleClose();

      expect(removeSpy).toHaveBeenCalledWith('focusin', boundFn, true);
    });

    it('should not remove focusin listener when boundFocusIn is undefined', () => {
      const removeSpy = vi.spyOn(window as any, 'removeEventListener');

      (component as any).boundFocusIn = undefined;

      expect(() => (component as any).handleClose()).not.toThrow();
      expect(removeSpy).not.toHaveBeenCalled();
    });
  });

  describe('contentFragments', () => {
    it('should return empty array when helper is undefined', () => {
      fixture.componentRef.setInput('p-helper', undefined);
      expect(component['contentFragments']()).toEqual([]);
    });

    it('should parse bold tags from helper content', () => {
      fixture.componentRef.setInput('p-helper', { content: 'Texto <b>negrito</b> normal', type: 'info' });
      const fragments = component['contentFragments']();
      expect(fragments.length).toBe(3);
      expect(fragments[0]).toEqual({ text: 'Texto ', bold: false, italic: false, underline: false });
      expect(fragments[1]).toEqual({ text: 'negrito', bold: true, italic: false, underline: false });
      expect(fragments[2]).toEqual({ text: ' normal', bold: false, italic: false, underline: false });
    });

    it('should parse italic and underline tags', () => {
      fixture.componentRef.setInput('p-helper', { content: '<i>itálico</i> e <u>sublinhado</u>', type: 'help' });
      const fragments = component['contentFragments']();
      expect(fragments[0]).toEqual({ text: 'itálico', bold: false, italic: true, underline: false });
      expect(fragments[2]).toEqual({ text: 'sublinhado', bold: false, italic: false, underline: true });
    });

    it('should normalize strong to bold and em to italic', () => {
      fixture.componentRef.setInput('p-helper', { content: '<strong>bold</strong> <em>italic</em>', type: 'info' });
      const fragments = component['contentFragments']();
      expect(fragments[0]).toEqual({ text: 'bold', bold: true, italic: false, underline: false });
      expect(fragments[2]).toEqual({ text: 'italic', bold: false, italic: true, underline: false });
    });

    it('should sanitize script tags (XSS protection)', () => {
      fixture.componentRef.setInput('p-helper', {
        content: '<script>alert("xss")</script>safe <b>text</b>',
        type: 'info'
      });
      const fragments = component['contentFragments']();
      const allText = fragments.map(f => f.text).join('');
      expect(allText).toContain('safe');
      expect(allText).toContain('text');
      expect(allText).not.toContain('<script>');
    });

    it('should parse content from string helper', () => {
      fixture.componentRef.setInput('p-helper', 'Texto <b>string</b> direto');
      const fragments = component['contentFragments']();
      expect(fragments[1]).toEqual({ text: 'string', bold: true, italic: false, underline: false });
    });

    it('should handle content property from object helper', () => {
      fixture.componentRef.setInput('p-helper', { content: '<i>italic</i> text', type: 'info' });
      const fragments = component['contentFragments']();
      expect(fragments[0]).toEqual({ text: 'italic', bold: false, italic: true, underline: false });
      expect(fragments[1]).toEqual({ text: ' text', bold: false, italic: false, underline: false });
    });

    it('should return empty array when helper content is empty', () => {
      fixture.componentRef.setInput('p-helper', { content: '', type: 'info' });
      expect(component['contentFragments']()).toEqual([]);
    });
  });
});
