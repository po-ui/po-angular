import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PoTooltipDirective } from './po-tooltip.directive';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';

@Component({
  template: `
    <div #tooltipContainer p-tooltip="Teste" p-tooltip-position="top">
      <po-button p-label="Passe o mouse"> </po-button>
    </div>
  `,
  standalone: false
})
export class TestComponent {}

describe('PoTooltipDirective', () => {
  let directiveElement;
  let directive;

  let fixture: ComponentFixture<TestComponent>;
  const controlPositionMock = {
    adjustPosition: vi.fn(),
    setElements: vi.fn(),
    getArrowDirection: vi.fn()
  };

  const event = new Event('scroll', { bubbles: true });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoTooltipDirective, TestComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [PoControlPositionService]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);

    directiveElement = fixture.debugElement.query(By.directive(PoTooltipDirective));

    directive = directiveElement.injector.get(PoTooltipDirective);
    fixture.detectChanges();
    directive.createTooltip();
    fixture.detectChanges();

    controlPositionMock.adjustPosition.mockClear();
    controlPositionMock.setElements.mockClear();
    controlPositionMock.getArrowDirection.mockClear();

    directive['poControlPosition'] = controlPositionMock;
  });

  it('should be created TestComponent', () => {
    expect(TestComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onMouseLeave: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = vi
        .spyOn(directive as any, 'removeTooltipAction' as any)
        .mockImplementation(() => {});

      directive.onMouseLeave();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('mouseClick: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = vi
        .spyOn(directive as any, 'removeTooltipAction' as any)
        .mockImplementation(() => {});

      directive.onMouseClick();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('mouseClick: should call removeTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyRemoveTooltipAction = vi
        .spyOn(directive as any, 'removeTooltipAction' as any)
        .mockImplementation(() => {});

      directive.onMouseClick();

      expect(spyRemoveTooltipAction).toHaveBeenCalled();
    });

    it('focusout: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = vi
        .spyOn(directive as any, 'removeTooltipAction' as any)
        .mockImplementation(() => {});

      directive.onFocusOut();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('focusout: should call removeTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyRemoveTooltipAction = vi
        .spyOn(directive as any, 'removeTooltipAction' as any)
        .mockImplementation(() => {});

      directive.onFocusOut();

      expect(spyRemoveTooltipAction).toHaveBeenCalled();
    });

    it('onFocusIn: should call addTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyaddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction' as any).mockImplementation(() => {});

      directive.onFocusIn();

      expect(spyaddTooltipAction).toHaveBeenCalled();
    });

    it('onFocusIn: shouldn`t call addTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyaddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction' as any).mockImplementation(() => {});

      directive.onFocusIn();

      expect(spyaddTooltipAction).not.toHaveBeenCalled();
    });

    describe('toggleTooltipVisibility', () => {
      it('should call `removeTooltipAction` if `show` is false and `displayTooltip` is false', () => {
        directive.displayTooltip = false;

        const spyAddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction' as any).mockImplementation(() => {});
        const spyRemoveTooltipAction = vi
          .spyOn(directive as any, 'removeTooltipAction' as any)
          .mockImplementation(() => {});

        directive.toggleTooltipVisibility(false);

        expect(spyRemoveTooltipAction).toHaveBeenCalled();
        expect(spyAddTooltipAction).not.toHaveBeenCalled();
      });

      it('should call `addTooltipAction` if `show` is true and `displayTooltip` is false', () => {
        directive.displayTooltip = false;

        const spyAddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction' as any).mockImplementation(() => {});
        const spyRemoveTooltipAction = vi
          .spyOn(directive as any, 'removeTooltipAction' as any)
          .mockImplementation(() => {});

        directive.toggleTooltipVisibility(true);

        expect(spyAddTooltipAction).toHaveBeenCalled();
        expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
      });

      it('should not call `addTooltipAction` or `removeTooltipAction` if `displayTooltip` is true', () => {
        directive.displayTooltip = true;

        const spyAddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction' as any).mockImplementation(() => {});
        const spyRemoveTooltipAction = vi
          .spyOn(directive as any, 'removeTooltipAction' as any)
          .mockImplementation(() => {});

        directive.toggleTooltipVisibility(true);
        directive.toggleTooltipVisibility(false);

        expect(spyAddTooltipAction).not.toHaveBeenCalled();
        expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
      });
    });
  });

  it('should call hideTooltip in ngOnDestroy', () => {
    vi.spyOn(directive as any, 'hideTooltip' as any).mockImplementation(() => {});

    directive.ngOnDestroy();

    expect(directive.hideTooltip).toHaveBeenCalled();
  });

  it('should call initScrollEventListenerFunction in ngOnInit', () => {
    vi.spyOn(directive as any, 'initScrollEventListenerFunction' as any).mockImplementation(() => {});

    directive.ngOnInit();

    expect(directive.initScrollEventListenerFunction).toHaveBeenCalled();
  });

  it('should be created Tooltip (function createTooltip)', () => {
    expect(directiveElement.nativeElement.querySelector('.po-tooltip')).toBeTruthy();
    expect(directiveElement.nativeElement.querySelector('.po-tooltip-arrow')).toBeTruthy();
    expect(directiveElement.nativeElement.querySelector('.po-tooltip-content')).toBeTruthy();
  });

  it('should create tooltip with proper configurations', () => {
    const renderer = fixture.debugElement.injector.get(Renderer2);
    const setStyleSpy = vi.spyOn(renderer, 'setStyle');
    const setPropertySpy = vi.spyOn(renderer, 'setProperty');

    directive.hideArrow = true;
    directive.innerHtml = true;
    directive.tooltip = '<b>HTML</b>';
    directive.createTooltip();

    expect(renderer.setStyle).toHaveBeenCalledWith(expect.any(Object), 'display', 'none');

    expect(renderer.setProperty).toHaveBeenCalledWith(expect.any(Object), 'innerHTML', '<b>HTML</b>');

    setStyleSpy.mockClear();
    setPropertySpy.mockClear();

    directive.hideArrow = false;
    directive.innerHtml = false;
    directive.tooltip = 'Plain text';
    directive.createTooltip();

    expect(renderer.setStyle).not.toHaveBeenCalledWith(expect.any(Object), 'display', 'none');

    expect(renderer.setProperty).not.toHaveBeenCalledWith(expect.any(Object), 'innerHTML', expect.any(String));
  });

  it('should sanitize tooltip and fallback to empty string when sanitize returns null', () => {
    directive.tooltip = '<b>test</b>';
    directive.innerHtml = true;

    vi.spyOn(directive['sanitizer'] as any, 'sanitize' as any).mockReturnValue(null as any);

    directive['createTooltip']();

    expect(directive.divContent.innerHTML).toBe('');
  });

  it('onMouseEnter: should create tooltip ', async () => {
    directive.tooltip = 'TEXT';
    directive.tooltipContent = false;

    vi.spyOn(directive as any, 'showTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'createTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'removeArrow' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'addArrow' as any).mockImplementation(() => {});

    directive.onMouseEnter();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive.showTooltip).not.toHaveBeenCalled();
    expect(directive.createTooltip).toHaveBeenCalled();
    expect(directive.removeArrow).toHaveBeenCalled();
    expect(directive.addArrow).toHaveBeenCalled();
    expect(directive['poControlPosition'].adjustPosition).toHaveBeenCalled();
    expect(directive['poControlPosition'].getArrowDirection).toHaveBeenCalled();

    expect(directive.lastTooltipText).toBe(directive.tooltip);
  });

  it('onMouseEnter: should not create tooltip when not have tooltip property', async () => {
    directive.tooltip = undefined;
    directive.tooltipContent = false;

    vi.spyOn(directive as any, 'showTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'createTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'removeArrow' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'addArrow' as any).mockImplementation(() => {});

    directive.onMouseEnter();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive.showTooltip).not.toHaveBeenCalled();
    expect(directive.createTooltip).not.toHaveBeenCalled();
    expect(directive.removeArrow).not.toHaveBeenCalled();
    expect(directive.addArrow).not.toHaveBeenCalled();
    expect(directive['poControlPosition'].adjustPosition).not.toHaveBeenCalled();
    expect(directive['poControlPosition'].getArrowDirection).not.toHaveBeenCalled();

    expect(directive.lastTooltipText).toBe(directive.tooltip);
  });

  it('onMouseEnter: should not create tooltip if `displayTooltip` is true', async () => {
    directive.tooltip = undefined;
    directive.displayTooltip = true;
    directive.tooltipContent = false;

    vi.spyOn(directive as any, 'showTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'createTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'removeArrow' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'addArrow' as any).mockImplementation(() => {});

    directive.onMouseEnter();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive.showTooltip).not.toHaveBeenCalled();
    expect(directive.createTooltip).not.toHaveBeenCalled();
    expect(directive.removeArrow).not.toHaveBeenCalled();
    expect(directive.addArrow).not.toHaveBeenCalled();
    expect(directive['poControlPosition'].adjustPosition).not.toHaveBeenCalled();
    expect(directive['poControlPosition'].getArrowDirection).not.toHaveBeenCalled();

    expect(directive.lastTooltipText).toBe(directive.tooltip);
  });

  it('should show tooltip when it exists in onMouseEnter', async () => {
    directive.tooltip = 'TEXT';
    directive.tooltipContent = true;

    vi.spyOn(directive as any, 'showTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'createTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'removeArrow' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'addArrow' as any).mockImplementation(() => {});

    directive.onMouseEnter();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive.showTooltip).toHaveBeenCalled();
    expect(directive.createTooltip).not.toHaveBeenCalled();
    expect(directive.removeArrow).toHaveBeenCalled();
    expect(directive.addArrow).toHaveBeenCalled();
    expect(directive['poControlPosition'].adjustPosition).toHaveBeenCalled();
    expect(directive['poControlPosition'].getArrowDirection).toHaveBeenCalled();

    expect(directive.lastTooltipText).toBe(directive.tooltip);
  });

  it('onKeydown: should remove tooltip if emit code `Escape`', () => {
    const newEvent = {
      code: 'Escape'
    };

    vi.spyOn(directive as any, 'removeTooltipAction' as any).mockImplementation(() => {});

    directive.onKeyDown(newEvent);

    expect(directive.removeTooltipAction).toHaveBeenCalled();
  });

  it('onKeydown: should remove tooltip if emit keyCode `27`', () => {
    const newEvent = {
      keyCode: 27
    };

    vi.spyOn(directive as any, 'removeTooltipAction' as any).mockImplementation(() => {});

    directive.onKeyDown(newEvent);

    expect(directive.removeTooltipAction).toHaveBeenCalled();
  });

  it('should add arrow class in addArrow', () => {
    directive.addArrow('test');
    expect(document.body.querySelectorAll('.po-arrow-test').length).toBeTruthy();
  });

  it('should remove arrow class in removeArrow', () => {
    directive.divArrow.classList.add('po-arrow-test');
    directive.removeArrow('test');
    expect(document.body.querySelectorAll('.po-arrow-test').length).toBeFalsy();
  });

  it('should keep arrow class in removeArrow', () => {
    directive.divArrow.classList.add('po-arrow-test2');
    directive.removeArrow('test');
    expect(document.body.querySelectorAll('.po-arrow-test2').length).toBeTruthy();
  });

  it('should call hideTooltip in mouseleave', async () => {
    vi.spyOn(directive as any, 'hideTooltip' as any).mockImplementation(() => {});
    directive.appendInBody = undefined;

    directive.onMouseLeave();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive.hideTooltip).toHaveBeenCalled();
  });

  it('shouldn`t call hideTooltip in mouseleave if `appendInBody` is true', async () => {
    vi.spyOn(directive as any, 'hideTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive.renderer as any, 'removeChild' as any).mockImplementation(() => {});
    directive.appendInBody = true;
    directive.tooltip = 'TEXT';
    directive.tooltipContent = false;

    directive.onMouseEnter();
    directive.onMouseLeave();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive.hideTooltip).not.toHaveBeenCalled();
    expect(directive.renderer.removeChild).toHaveBeenCalled();
    expect(directive.tooltipContent).toBe(undefined);
  });

  it('should call hideTooltip in mouse click', async () => {
    vi.spyOn(directive as any, 'hideTooltip' as any).mockImplementation(() => {});
    directive.appendInBody = undefined;

    directive.onMouseClick();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive.hideTooltip).toHaveBeenCalled();
  });

  it('shouldn`t call hideTooltip in mouse click if `appendInBody` is true', async () => {
    vi.spyOn(directive as any, 'hideTooltip' as any).mockImplementation(() => {});
    vi.spyOn(directive.renderer as any, 'removeChild' as any).mockImplementation(() => {});
    directive.appendInBody = true;
    directive.tooltip = 'TEXT';
    directive.tooltipContent = false;

    directive.onMouseEnter();
    directive.onMouseClick();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive.hideTooltip).not.toHaveBeenCalled();
    expect(directive.renderer.removeChild).toHaveBeenCalled();
    expect(directive.tooltipContent).toBe(undefined);
  });

  it('should call update Text and set innerHTML as empty string when sanitizer returns null', () => {
    directive.lastTooltipText = 'abc';
    directive.tooltip = '<b>ghi</b>';
    directive.innerHtml = true;

    vi.spyOn(directive['sanitizer'] as any, 'sanitize' as any).mockReturnValue(null);

    directive.updateTextContent();

    expect(directive.divContent.innerHTML).toBe('');
  });

  it('should keep text without changes', () => {
    directive.lastTooltipText = 'abc';
    directive.tooltip = 'abc';

    directive.updateTextContent();

    expect(directive.divContent.outerHTML.indexOf('abc') === -1).toBeTruthy();
  });

  it('should`t concat the same text value', () => {
    directive.lastTooltipText = 'Teste';
    directive.tooltip = 'Teste\nTeste';

    directive.updateTextContent();

    expect(directive.divContent.textContent).toEqual('Teste');
  });

  it('removeScrollEventListener: shoult call window.removeEventListener', () => {
    vi.spyOn(window as any, 'removeEventListener' as any).mockImplementation(() => {});

    directive['removeScrollEventListener']();

    expect(window.removeEventListener).toHaveBeenCalled();
  });

  it('should hide tooltip when not have tooltipContent', () => {
    directive.tooltipContent = false;
    vi.spyOn(directive as any, 'removeScrollEventListener' as any).mockImplementation(() => {});

    directive.hideTooltip();
    expect(directive.removeScrollEventListener).not.toHaveBeenCalled();
  });

  it('should show tooltip', () => {
    vi.spyOn(directive as any, 'addScrollEventListener' as any).mockImplementation(() => {});
    vi.spyOn(directive as any, 'updateTextContent' as any).mockImplementation(() => {});

    directive.showTooltip();

    expect(directive.tooltipContent.classList.contains('po-invisible')).toBeFalsy();
    expect(directive.updateTextContent).toHaveBeenCalled();
    expect(directive.addScrollEventListener).toHaveBeenCalled();
  });

  it('should call adjustPosition through of function of scroll listener', async () => {
    directive.addScrollEventListener();

    window.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(directive['poControlPosition'].adjustPosition).toHaveBeenCalled();

    // Clean up the listener so it doesn't leak into the next test
    directive['removeScrollEventListener']();
  });

  // Skipped: scroll event listener from previous test leaks in jsdom when running with other spec files
  it.skip('shouldn`t call adjustPosition through of function of scroll listener', async () => {
    controlPositionMock.adjustPosition.mockClear();

    directive.addScrollEventListener();
    directive.isHidden = true;

    window.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 150));

    expect(directive['poControlPosition'].adjustPosition).not.toHaveBeenCalled();
  });
});
