import type { Mock } from 'vitest';
import { Component, Renderer2 } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PoButtonModule } from '../../components/po-button/po-button.module';

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
  let controlPositionMock: any;

  const event = new Event('scroll', { bubbles: true });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoButtonModule],
      declarations: [PoTooltipDirective, TestComponent],
      providers: [PoControlPositionService]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);

    directiveElement = fixture.debugElement.query(By.directive(PoTooltipDirective));

    directive = directiveElement.injector.get(PoTooltipDirective);
    fixture.detectChanges();
    directive.createTooltip();
    fixture.detectChanges();

    controlPositionMock = {
      adjustPosition: vi.fn().mockName('PoControlPositionService.adjustPosition'),
      setElements: vi.fn().mockName('PoControlPositionService.setElements'),
      getArrowDirection: vi.fn().mockName('PoControlPositionService.getArrowDirection')
    };
    directive['poControlPosition'] = controlPositionMock;
  });

  it('should be created TestComponent', () => {
    expect(TestComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onMouseLeave: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = vi.spyOn(directive as any, 'removeTooltipAction');

      directive.onMouseLeave();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('mouseClick: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = vi.spyOn(directive as any, 'removeTooltipAction');

      directive.onMouseClick();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('mouseClick: should call removeTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyRemoveTooltipAction = vi.spyOn(directive as any, 'removeTooltipAction');

      directive.onMouseClick();

      expect(spyRemoveTooltipAction).toHaveBeenCalled();
    });

    it('focusout: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = vi.spyOn(directive as any, 'removeTooltipAction');

      directive.onFocusOut();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('focusout: should call removeTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyRemoveTooltipAction = vi.spyOn(directive as any, 'removeTooltipAction');

      directive.onFocusOut();

      expect(spyRemoveTooltipAction).toHaveBeenCalled();
    });

    it('onFocusIn: should call addTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyaddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction');

      directive.onFocusIn();

      expect(spyaddTooltipAction).toHaveBeenCalled();
    });

    it('onFocusIn: shouldn`t call addTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyaddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction');

      directive.onFocusIn();

      expect(spyaddTooltipAction).not.toHaveBeenCalled();
    });

    describe('toggleTooltipVisibility', () => {
      it('should call `removeTooltipAction` if `show` is false and `displayTooltip` is false', () => {
        directive.displayTooltip = false;

        const spyAddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction');
        const spyRemoveTooltipAction = vi.spyOn(directive as any, 'removeTooltipAction');

        directive.toggleTooltipVisibility(false);

        expect(spyRemoveTooltipAction).toHaveBeenCalled();
        expect(spyAddTooltipAction).not.toHaveBeenCalled();
      });

      it('should call `addTooltipAction` if `show` is true and `displayTooltip` is false', () => {
        directive.displayTooltip = false;

        const spyAddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction');
        const spyRemoveTooltipAction = vi.spyOn(directive as any, 'removeTooltipAction');

        directive.toggleTooltipVisibility(true);

        expect(spyAddTooltipAction).toHaveBeenCalled();
        expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
      });

      it('should not call `addTooltipAction` or `removeTooltipAction` if `displayTooltip` is true', () => {
        directive.displayTooltip = true;

        const spyAddTooltipAction = vi.spyOn(directive as any, 'addTooltipAction');
        const spyRemoveTooltipAction = vi.spyOn(directive as any, 'removeTooltipAction');

        directive.toggleTooltipVisibility(true);
        directive.toggleTooltipVisibility(false);

        expect(spyAddTooltipAction).not.toHaveBeenCalled();
        expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
      });
    });
  });

  it('should call hideTooltip in ngOnDestroy', () => {
    vi.spyOn(directive as any, 'hideTooltip');

    directive.ngOnDestroy();

    expect(directive.hideTooltip).toHaveBeenCalled();
  });

  it('should call initScrollEventListenerFunction in ngOnInit', () => {
    vi.spyOn(directive as any, 'initScrollEventListenerFunction');

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
    vi.spyOn(renderer as any, 'setStyle');
    vi.spyOn(renderer as any, 'setProperty');

    directive.hideArrow = true;
    directive.innerHtml = true;
    directive.tooltip = '<b>HTML</b>';
    directive.createTooltip();

    expect(renderer.setStyle).toHaveBeenCalledWith(expect.any(Object), 'display', 'none');

    expect(renderer.setProperty).toHaveBeenCalledWith(expect.any(Object), 'innerHTML', '<b>HTML</b>');

    (renderer.setStyle as Mock).mockClear();
    (renderer.setProperty as Mock).mockClear();

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

    vi.spyOn(directive['sanitizer'] as any, 'sanitize').mockReturnValue(null as any);

    directive['createTooltip']();

    expect(directive.divContent.innerHTML).toBe('');
  });

  it('onMouseEnter: should create tooltip ', fakeAsync(() => {
    directive.tooltip = 'TEXT';
    directive.tooltipContent = false;

    vi.spyOn(directive as any, 'showTooltip');
    vi.spyOn(directive as any, 'createTooltip');
    vi.spyOn(directive as any, 'removeArrow');
    vi.spyOn(directive as any, 'addArrow');

    directive.onMouseEnter();

    tick(100);

    expect(directive.showTooltip).not.toHaveBeenCalled();
    expect(directive.createTooltip).toHaveBeenCalled();
    expect(directive.removeArrow).toHaveBeenCalled();
    expect(directive.addArrow).toHaveBeenCalled();
    expect(directive['poControlPosition'].adjustPosition).toHaveBeenCalled();
    expect(directive['poControlPosition'].getArrowDirection).toHaveBeenCalled();

    expect(directive.lastTooltipText).toBe(directive.tooltip);
  }));

  it('onMouseEnter: should not create tooltip when not have tooltip property', fakeAsync(() => {
    directive.tooltip = undefined;
    directive.tooltipContent = false;

    vi.spyOn(directive as any, 'showTooltip');
    vi.spyOn(directive as any, 'createTooltip');
    vi.spyOn(directive as any, 'removeArrow');
    vi.spyOn(directive as any, 'addArrow');

    directive.onMouseEnter();

    tick(100);

    expect(directive.showTooltip).not.toHaveBeenCalled();
    expect(directive.createTooltip).not.toHaveBeenCalled();
    expect(directive.removeArrow).not.toHaveBeenCalled();
    expect(directive.addArrow).not.toHaveBeenCalled();
    expect(directive['poControlPosition'].adjustPosition).not.toHaveBeenCalled();
    expect(directive['poControlPosition'].getArrowDirection).not.toHaveBeenCalled();

    expect(directive.lastTooltipText).toBe(directive.tooltip);
  }));

  it('onMouseEnter: should not create tooltip if `displayTooltip` is true', fakeAsync(() => {
    directive.tooltip = undefined;
    directive.displayTooltip = true;
    directive.tooltipContent = false;

    vi.spyOn(directive as any, 'showTooltip');
    vi.spyOn(directive as any, 'createTooltip');
    vi.spyOn(directive as any, 'removeArrow');
    vi.spyOn(directive as any, 'addArrow');

    directive.onMouseEnter();

    tick(100);

    expect(directive.showTooltip).not.toHaveBeenCalled();
    expect(directive.createTooltip).not.toHaveBeenCalled();
    expect(directive.removeArrow).not.toHaveBeenCalled();
    expect(directive.addArrow).not.toHaveBeenCalled();
    expect(directive['poControlPosition'].adjustPosition).not.toHaveBeenCalled();
    expect(directive['poControlPosition'].getArrowDirection).not.toHaveBeenCalled();

    expect(directive.lastTooltipText).toBe(directive.tooltip);
  }));

  it('should show tooltip when it exists in onMouseEnter', fakeAsync(() => {
    directive.tooltip = 'TEXT';
    directive.tooltipContent = true;

    vi.spyOn(directive as any, 'showTooltip');
    vi.spyOn(directive as any, 'createTooltip');
    vi.spyOn(directive as any, 'removeArrow');
    vi.spyOn(directive as any, 'addArrow');

    directive.onMouseEnter();

    tick(100);

    expect(directive.showTooltip).toHaveBeenCalled();
    expect(directive.createTooltip).not.toHaveBeenCalled();
    expect(directive.removeArrow).toHaveBeenCalled();
    expect(directive.addArrow).toHaveBeenCalled();
    expect(directive['poControlPosition'].adjustPosition).toHaveBeenCalled();
    expect(directive['poControlPosition'].getArrowDirection).toHaveBeenCalled();

    expect(directive.lastTooltipText).toBe(directive.tooltip);
  }));

  it('onKeydown: should remove tooltip if emit code `Escape`', () => {
    const newEvent = {
      code: 'Escape'
    };

    vi.spyOn(directive as any, 'removeTooltipAction');

    directive.onKeyDown(newEvent);

    expect(directive.removeTooltipAction).toHaveBeenCalled();
  });

  it('onKeydown: should remove tooltip if emit keyCode `27`', () => {
    const newEvent = {
      keyCode: 27
    };

    vi.spyOn(directive as any, 'removeTooltipAction');

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

  it('should call hideTooltip in mouseleave', fakeAsync(() => {
    vi.spyOn(directive as any, 'hideTooltip');
    directive.appendInBody = undefined;

    directive.onMouseLeave();

    tick(100);

    expect(directive.hideTooltip).toHaveBeenCalled();
  }));

  it('shouldn`t call hideTooltip in mouseleave if `appendInBody` is true', fakeAsync(() => {
    vi.spyOn(directive as any, 'hideTooltip');
    vi.spyOn(directive.renderer as any, 'removeChild');
    directive.appendInBody = true;
    directive.tooltip = 'TEXT';
    directive.tooltipContent = false;

    directive.onMouseEnter();
    directive.onMouseLeave();

    tick(100);

    expect(directive.hideTooltip).not.toHaveBeenCalled();
    expect(directive.renderer.removeChild).toHaveBeenCalled();
    expect(directive.tooltipContent).toBe(undefined);
  }));

  it('should call hideTooltip in mouse click', fakeAsync(() => {
    vi.spyOn(directive as any, 'hideTooltip');
    directive.appendInBody = undefined;

    directive.onMouseClick();

    tick(100);

    expect(directive.hideTooltip).toHaveBeenCalled();
  }));

  it('shouldn`t call hideTooltip in mouse click if `appendInBody` is true', fakeAsync(() => {
    vi.spyOn(directive as any, 'hideTooltip');
    vi.spyOn(directive.renderer as any, 'removeChild');
    directive.appendInBody = true;
    directive.tooltip = 'TEXT';
    directive.tooltipContent = false;

    directive.onMouseEnter();
    directive.onMouseClick();

    tick(100);

    expect(directive.hideTooltip).not.toHaveBeenCalled();
    expect(directive.renderer.removeChild).toHaveBeenCalled();
    expect(directive.tooltipContent).toBe(undefined);
  }));

  it('should call update Text and set innerHTML as empty string when sanitizer returns null', () => {
    directive.lastTooltipText = 'abc';
    directive.tooltip = '<b>ghi</b>';
    directive.innerHtml = true;

    vi.spyOn(directive['sanitizer'] as any, 'sanitize').mockReturnValue(null);

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
    vi.spyOn(window as any, 'removeEventListener');

    directive['removeScrollEventListener']();

    expect(window.removeEventListener).toHaveBeenCalled();
  });

  it('should hide tooltip when not have tooltipContent', () => {
    directive.tooltipContent = false;
    vi.spyOn(directive as any, 'removeScrollEventListener');

    directive.hideTooltip();
    expect(directive.removeScrollEventListener).not.toHaveBeenCalled();
  });

  it('should show tooltip', () => {
    vi.spyOn(directive as any, 'addScrollEventListener');
    vi.spyOn(directive as any, 'updateTextContent');

    directive.showTooltip();

    expect(directive.tooltipContent.classList.contains('po-invisible')).toBeFalsy();
    expect(directive.updateTextContent).toHaveBeenCalled();
    expect(directive.addScrollEventListener).toHaveBeenCalled();
  });

  it('should call adjustPosition through of function of scroll listener', fakeAsync((): void => {
    directive.addScrollEventListener();

    window.dispatchEvent(event);

    tick(100);

    expect(directive['poControlPosition'].adjustPosition).toHaveBeenCalled();
  }));

  it('shouldn`t call adjustPosition through of function of scroll listener', fakeAsync(() => {
    directive.addScrollEventListener();
    directive.isHidden = true;

    window.dispatchEvent(event);

    tick(100);

    expect(directive['poControlPosition'].adjustPosition).not.toHaveBeenCalled();
  }));
});
