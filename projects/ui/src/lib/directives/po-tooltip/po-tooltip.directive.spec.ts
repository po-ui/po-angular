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
  let controlPositionMock: jasmine.SpyObj<PoControlPositionService>;

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

    controlPositionMock = jasmine.createSpyObj('PoControlPositionService', [
      'adjustPosition',
      'setElements',
      'getArrowDirection'
    ]);
    directive['poControlPosition'] = controlPositionMock;
  });

  it('should be created TestComponent', () => {
    expect(TestComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onMouseLeave: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = spyOn(directive, <any>'removeTooltipAction');

      directive.onMouseLeave();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('mouseClick: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = spyOn(directive, <any>'removeTooltipAction');

      directive.onMouseClick();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('mouseClick: should call removeTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyRemoveTooltipAction = spyOn(directive, <any>'removeTooltipAction');

      directive.onMouseClick();

      expect(spyRemoveTooltipAction).toHaveBeenCalled();
    });

    it('focusout: shouldn`t call removeTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyRemoveTooltipAction = spyOn(directive, <any>'removeTooltipAction');

      directive.onFocusOut();

      expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
    });

    it('focusout: should call removeTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyRemoveTooltipAction = spyOn(directive, <any>'removeTooltipAction');

      directive.onFocusOut();

      expect(spyRemoveTooltipAction).toHaveBeenCalled();
    });

    it('onFocusIn: should call addTooltipAction if `displayTooltip` is false', () => {
      directive.displayTooltip = false;

      const spyaddTooltipAction = spyOn(directive, <any>'addTooltipAction');

      directive.onFocusIn();

      expect(spyaddTooltipAction).toHaveBeenCalled();
    });

    it('onFocusIn: shouldn`t call addTooltipAction if `displayTooltip` is true', () => {
      directive.displayTooltip = true;

      const spyaddTooltipAction = spyOn(directive, <any>'addTooltipAction');

      directive.onFocusIn();

      expect(spyaddTooltipAction).not.toHaveBeenCalled();
    });

    describe('toggleTooltipVisibility', () => {
      it('should call `removeTooltipAction` if `show` is false and `displayTooltip` is false', () => {
        directive.displayTooltip = false;

        const spyAddTooltipAction = spyOn(directive, <any>'addTooltipAction');
        const spyRemoveTooltipAction = spyOn(directive, <any>'removeTooltipAction');

        directive.toggleTooltipVisibility(false);

        expect(spyRemoveTooltipAction).toHaveBeenCalled();
        expect(spyAddTooltipAction).not.toHaveBeenCalled();
      });

      it('should call `addTooltipAction` if `show` is true and `displayTooltip` is false', () => {
        directive.displayTooltip = false;

        const spyAddTooltipAction = spyOn(directive, <any>'addTooltipAction');
        const spyRemoveTooltipAction = spyOn(directive, <any>'removeTooltipAction');

        directive.toggleTooltipVisibility(true);

        expect(spyAddTooltipAction).toHaveBeenCalled();
        expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
      });

      it('should not call `addTooltipAction` or `removeTooltipAction` if `displayTooltip` is true', () => {
        directive.displayTooltip = true;

        const spyAddTooltipAction = spyOn(directive, <any>'addTooltipAction');
        const spyRemoveTooltipAction = spyOn(directive, <any>'removeTooltipAction');

        directive.toggleTooltipVisibility(true);
        directive.toggleTooltipVisibility(false);

        expect(spyAddTooltipAction).not.toHaveBeenCalled();
        expect(spyRemoveTooltipAction).not.toHaveBeenCalled();
      });
    });
  });

  it('should call hideTooltip in ngOnDestroy', () => {
    spyOn(directive, 'hideTooltip');

    directive.ngOnDestroy();

    expect(directive.hideTooltip).toHaveBeenCalled();
  });

  it('should call initScrollEventListenerFunction in ngOnInit', () => {
    spyOn(directive, 'initScrollEventListenerFunction');

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
    spyOn(renderer, 'setStyle').and.callThrough();
    spyOn(renderer, 'setProperty').and.callThrough();

    directive.hideArrow = true;
    directive.innerHtml = true;
    directive.tooltip = '<b>HTML</b>';
    directive.createTooltip();

    expect(renderer.setStyle).toHaveBeenCalledWith(jasmine.any(Object), 'display', 'none');

    expect(renderer.setProperty).toHaveBeenCalledWith(jasmine.any(Object), 'innerHTML', '<b>HTML</b>');

    (renderer.setStyle as jasmine.Spy).calls.reset();
    (renderer.setProperty as jasmine.Spy).calls.reset();

    directive.hideArrow = false;
    directive.innerHtml = false;
    directive.tooltip = 'Plain text';
    directive.createTooltip();

    expect(renderer.setStyle).not.toHaveBeenCalledWith(jasmine.any(Object), 'display', 'none');

    expect(renderer.setProperty).not.toHaveBeenCalledWith(jasmine.any(Object), 'innerHTML', jasmine.any(String));
  });

  it('onMouseEnter: should create tooltip ', fakeAsync(() => {
    directive.tooltip = 'TEXT';
    directive.tooltipContent = false;

    spyOn(directive, 'showTooltip');
    spyOn(directive, 'createTooltip');
    spyOn(directive, 'removeArrow');
    spyOn(directive, 'addArrow');

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

    spyOn(directive, 'showTooltip');
    spyOn(directive, 'createTooltip');
    spyOn(directive, 'removeArrow');
    spyOn(directive, 'addArrow');

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

    spyOn(directive, 'showTooltip');
    spyOn(directive, 'createTooltip');
    spyOn(directive, 'removeArrow');
    spyOn(directive, 'addArrow');

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

    spyOn(directive, 'showTooltip');
    spyOn(directive, 'createTooltip');
    spyOn(directive, 'removeArrow');
    spyOn(directive, 'addArrow');

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

    spyOn(directive, 'removeTooltipAction');

    directive.onKeyDown(newEvent);

    expect(directive.removeTooltipAction).toHaveBeenCalled();
  });

  it('onKeydown: should remove tooltip if emit keyCode `27`', () => {
    const newEvent = {
      keyCode: 27
    };

    spyOn(directive, 'removeTooltipAction');

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
    spyOn(directive, 'hideTooltip');
    directive.appendInBody = undefined;

    directive.onMouseLeave();

    tick(100);

    expect(directive.hideTooltip).toHaveBeenCalled();
  }));

  it('shouldn`t call hideTooltip in mouseleave if `appendInBody` is true', fakeAsync(() => {
    spyOn(directive, 'hideTooltip');
    spyOn(directive.renderer, 'removeChild');
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
    spyOn(directive, 'hideTooltip');
    directive.appendInBody = undefined;

    directive.onMouseClick();

    tick(100);

    expect(directive.hideTooltip).toHaveBeenCalled();
  }));

  it('shouldn`t call hideTooltip in mouse click if `appendInBody` is true', fakeAsync(() => {
    spyOn(directive, 'hideTooltip');
    spyOn(directive.renderer, 'removeChild');
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

  it('should call update Text and set innerHTML when innerHtml is true', () => {
    directive.lastTooltipText = 'abc';
    directive.tooltip = '<b>def</b>';
    directive.innerHtml = true;
    directive.updateTextContent();

    expect(directive.divContent.innerHTML).toBe('<b>def</b>');
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
    spyOn(window, 'removeEventListener');

    directive['removeScrollEventListener']();

    expect(window.removeEventListener).toHaveBeenCalled();
  });

  it('should hide tooltip when not have tooltipContent', () => {
    directive.tooltipContent = false;
    spyOn(directive, 'removeScrollEventListener');

    directive.hideTooltip();
    expect(directive.removeScrollEventListener).not.toHaveBeenCalled();
  });

  it('should show tooltip', () => {
    spyOn(directive, 'addScrollEventListener');
    spyOn(directive, 'updateTextContent');

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
