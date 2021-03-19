import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoButtonModule } from '../../components/po-button/po-button.module';

import { PoTooltipDirective } from './po-tooltip.directive';

@Component({
  template: `
    <div #tooltipContainer p-tooltip="Teste" p-tooltip-position="top">
      <po-button p-label="Passe o mouse"> </po-button>
    </div>
  `
})
export class TestComponent {}

describe('PoTooltipDirective', () => {
  let directiveElement;
  let directive;

  let fixture: ComponentFixture<TestComponent>;

  let event;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonModule],
      declarations: [PoTooltipDirective, TestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    directiveElement = fixture.debugElement.query(By.directive(PoTooltipDirective));

    directive = directiveElement.injector.get(PoTooltipDirective);
    directive.createTooltip();
    fixture.detectChanges();

    event = document.createEvent('MouseEvents');
    event.initEvent('scroll', false, true);
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

  it('onMouseEnter: should create tooltip ', fakeAsync(() => {
    directive.tooltip = 'TEXT';
    directive.tooltipContent = false;

    spyOn(directive, 'showTooltip');
    spyOn(directive, 'createTooltip');
    spyOn(directive, 'removeArrow');
    spyOn(directive, 'addArrow');
    spyOn(directive['poControlPosition'], 'adjustPosition');
    spyOn(directive['poControlPosition'], 'getArrowDirection');

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
    spyOn(directive['poControlPosition'], 'adjustPosition');
    spyOn(directive['poControlPosition'], 'getArrowDirection');

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
    spyOn(directive['poControlPosition'], 'adjustPosition');
    spyOn(directive['poControlPosition'], 'getArrowDirection');

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
    spyOn(directive['poControlPosition'], 'adjustPosition');
    spyOn(directive['poControlPosition'], 'getArrowDirection');

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

  it('should call update Text', () => {
    directive.lastTooltipText = 'abc';
    directive.tooltip = 'def';

    directive.updateTextContent();

    expect(directive.divContent.outerHTML.indexOf('def') > -1).toBeTruthy();
  });

  it('should keep text without changes', () => {
    directive.lastTooltipText = 'abc';
    directive.tooltip = 'abc';

    directive.updateTextContent();

    expect(directive.divContent.outerHTML.indexOf('abc') === -1).toBeTruthy();
  });

  it('should hide tooltip when have tooltipContent', () => {
    spyOn(directive, <any>'removeScrollEventListener');

    directive.hideTooltip();

    expect(directive.tooltipContent.classList.contains('po-invisible')).toBeTruthy();
    expect(directive['removeScrollEventListener']).toHaveBeenCalled();
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
    spyOn(directive['poControlPosition'], 'adjustPosition');

    directive.addScrollEventListener();

    window.dispatchEvent(event);

    tick(100);

    expect(directive['poControlPosition'].adjustPosition).toHaveBeenCalled();
  }));

  it('shouldn`t call adjustPosition through of function of scroll listener', fakeAsync(() => {
    spyOn(directive['poControlPosition'], 'adjustPosition');

    directive.addScrollEventListener();
    directive.isHidden = true;

    window.dispatchEvent(event);

    tick(100);

    expect(directive['poControlPosition'].adjustPosition).not.toHaveBeenCalled();
  }));
});
