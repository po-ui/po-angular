import { Component } from '@angular/core';

import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PoChartModule } from '../../../po-chart.module';

import { PoChartTooltipDirective } from './po-chart-tooltip.directive';

@Component({
  template: `
    <div class="po-chart-wrapper">
      <svg
        preserveAspectRatio="xMidYMin meet"
        class="po-chart-svg-element"
        viewBox="1 -1 300 300"
        width="964"
        height="300"
      >
        <path
          p-chart-tooltip="TooltipLabel"
          class="po-path-item"
          fill="#0C6C94"
          d="M 150 0 A 150 150 0 1,1 68.90387738166027 23.81197007532289 L 150 150 Z"
        ></path>
      </svg>
    </div>
  `,
  standalone: false
})
export class TestComponent {}

describe('PoChartTooltipDirective', () => {
  let directiveElement;
  let directive;

  let fixture: ComponentFixture<TestComponent>;

  let event;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartTooltipDirective, TestComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    directiveElement = fixture.debugElement.query(By.directive(PoChartTooltipDirective));

    directive = directiveElement.injector.get(PoChartTooltipDirective);
    directive.createTooltip();
    fixture.detectChanges();

    spyOnProperty(directive.tooltipElement, 'offsetWidth').and.returnValue(154);
    spyOnProperty(directive.tooltipElement, 'offsetHeight').and.returnValue(60);

    event = document.createEvent('MouseEvents');
    event.initEvent('scroll', false, true);
  });

  it('should be created TestComponent', () => {
    expect(TestComponent).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('onMouseEnter: should call `showTooltip` if tooltipElement is true', fakeAsync(() => {
      directive.tooltip = 'TEXT';
      directive.tooltipElement = true;

      spyOn(directive, <any>'showTooltip');
      spyOn(directive, <any>'tooltipPosition');

      directive.onMouseEnter(event);
      tick(100);

      expect(directive['showTooltip']).toHaveBeenCalled();
      expect(directive['tooltipPosition']).toHaveBeenCalledWith(event);
      expect(directive.lastTooltipText).toBe(directive.tooltip);
    }));

    it('onMouseEnter: should call `showTooltip` if tooltipElement is false', fakeAsync(() => {
      directive.tooltip = 'TEXT';
      directive.tooltipElement = false;

      spyOn(directive, <any>'showTooltip');
      spyOn(directive, <any>'tooltipPosition');

      directive.onMouseEnter(event);
      tick(100);

      expect(directive['showTooltip']).not.toHaveBeenCalled();
      expect(directive['tooltipPosition']).toHaveBeenCalledWith(event);
      expect(directive.lastTooltipText).toBe(directive.tooltip);
    }));

    it('onMouseLeave: should call `hideTooltip`', fakeAsync(() => {
      spyOn(directive, <any>'hideTooltip');

      directive.onMouseLeave();
      tick(100);

      expect(directive['hideTooltip']).toHaveBeenCalled();
    }));

    it('onMouseMove: should call `tooltipPosition`', fakeAsync(() => {
      spyOn(directive, <any>'tooltipPosition');

      directive.onMouseMove(event);
      tick(100);

      expect(directive['tooltipPosition']).toHaveBeenCalled();
    }));

    it('calculateTooltipPosition: should return tooltipPosition', () => {
      const tooltipEvent = { clientX: 300, clientY: 300 };
      const expectedResult = { left: 223, top: 228 };
      const result = directive.calculateTooltipPosition(tooltipEvent);

      expect(result).toEqual(expectedResult);
    });

    it('createTooltip: should create', () => {
      directive.tooltip = 'TEXT';

      expect(directive.tooltipElement.classList.contains('po-chart-tooltip')).toBeTruthy();
      expect(directive.tooltipElement.classList.contains('po-tooltip')).toBeTruthy();
    });

    it('hideTooltip: should set `hidden` in `visibility`', () => {
      directive.tooltipElement = document.createElement('div');
      const rendererSetStyleSpy = spyOn(directive['renderer'], 'setStyle');
      directive['hideTooltip']();

      expect(rendererSetStyleSpy).toHaveBeenCalledWith(directive.tooltipElement, 'visibility', 'hidden');
    });

    it('showTooltip: should set visibility to visible and update text content', () => {
      directive.tooltipElement = document.createElement('div');
      directive.tooltip = 'Novo Texto';
      directive.lastTooltipText = 'Texto Antigo';

      const rendererSetStyleSpy = spyOn(directive['renderer'], 'setStyle');
      const rendererRemoveChildSpy = spyOn(directive['renderer'], 'removeChild');
      const rendererCreateTextSpy = spyOn(directive['renderer'], 'createText');
      const rendererAppendChildSpy = spyOn(directive['renderer'], 'appendChild');

      directive['showTooltip']();

      expect(rendererSetStyleSpy).toHaveBeenCalledWith(directive.tooltipElement, 'visibility', 'visible');
      expect(rendererSetStyleSpy).toHaveBeenCalledWith(directive.tooltipElement, 'opacity', 0.9);
      expect(rendererRemoveChildSpy).toHaveBeenCalled();
      expect(rendererCreateTextSpy).toHaveBeenCalledWith('Novo Texto');
      expect(rendererAppendChildSpy).toHaveBeenCalled();
    });

    it('tooltipPosition: should add class `po-invisible`', () => {
      directive.tooltip = 'TEXT';

      spyOn(directive.renderer, <any>'setStyle');
      spyOn(directive, <any>'calculateTooltipPosition').and.returnValue({ left: 10, top: 10 });

      directive['tooltipPosition'](event);

      expect(directive.renderer.setStyle).toHaveBeenCalledTimes(2);
      expect(directive['calculateTooltipPosition']).toHaveBeenCalled();
    });

    it('updatetooltipTextContent: should update text content', () => {
      directive.tooltip = 'TEXT';
      directive['lastTooltipText'] = 'last';

      spyOn(directive.renderer, <any>'appendChild');
      spyOn(directive, <any>'calculateTooltipPosition');

      directive['updatetooltipTextContent']();

      expect(directive.renderer.appendChild).toHaveBeenCalled();
    });

    it('updatetooltipTextContent: should update text content', () => {
      directive.tooltip = 'last';
      directive['lastTooltipText'] = 'last';

      spyOn(directive.renderer, <any>'appendChild');
      spyOn(directive, <any>'calculateTooltipPosition');

      directive['updatetooltipTextContent']();

      expect(directive.renderer.appendChild).not.toHaveBeenCalled();
    });
  });
});
