import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoProgressCircleComponent } from './po-progress-circle.component';

describe('PoProgressCircleComponent:', () => {
  let component: PoProgressCircleComponent;
  let fixture: ComponentFixture<PoProgressCircleComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoProgressCircleComponent]
    });

    fixture = TestBed.createComponent(PoProgressCircleComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoProgressCircleComponent).toBeTruthy();
  });

  describe('Input Signals:', () => {
    describe('p-aria-label:', () => {
      it('should have default value as empty string', () => {
        expect(component.ariaLabel()).toBe('');
      });

      it('should update when status changes', () => {
        fixture.componentRef.setInput('p-status', 'success');
        fixture.detectChanges();

        expect(component.ariaLabel()).toBe('success');

        fixture.componentRef.setInput('p-status', 'error');
        fixture.detectChanges();

        expect(component.ariaLabel()).toBe('error');
      });

      it('should combine status + custom ariaLabel', () => {
        fixture.componentRef.setInput('p-status', 'error');
        fixture.componentRef.setInput('p-aria-label', 'carregando');

        fixture.detectChanges();

        expect(component.ariaLabel()).toBe('error carregando');
      });
    });

    describe('p-indeterminate:', () => {
      it('should have default value as false', () => {
        expect(component.indeterminate()).toBe(false);
      });

      it('should transform truthy values to true', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        expect(component.indeterminate()).toBe(true);
      });

      it('should transform falsy values to false', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        expect(component.indeterminate()).toBe(false);
      });
    });

    describe('p-show-percentage:', () => {
      it('should have default value as false', () => {
        expect(component.showPercentage()).toBe(false);
      });

      it('should transform truthy values to true', () => {
        fixture.componentRef.setInput('p-show-percentage', true);
        expect(component.showPercentage()).toBe(true);
      });

      it('should transform falsy values to false', () => {
        fixture.componentRef.setInput('p-show-percentage', false);
        expect(component.showPercentage()).toBe(false);
      });

      it('should not show percentage when status is error but showPercentage is true', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-status', 'error');
        fixture.componentRef.setInput('p-show-percentage', true);
        fixture.detectChanges();

        const percentage = nativeElement.querySelector('.po-progress-circle-info-percentage');
        expect(percentage).toBeNull();
      });
    });

    describe('p-size:', () => {
      it('should have default value as large', () => {
        expect(component.size()).toBe('large');
      });

      it('should accept medium as valid value', () => {
        fixture.componentRef.setInput('p-size', 'medium');
        expect(component.size()).toBe('medium');
      });

      it('should accept large as valid value', () => {
        fixture.componentRef.setInput('p-size', 'large');
        expect(component.size()).toBe('large');
      });

      it('should default to large for invalid values', () => {
        fixture.componentRef.setInput('p-size', 'small');
        expect(component.size()).toBe('large');

        fixture.componentRef.setInput('p-size', 'extra-large');
        expect(component.size()).toBe('large');
      });
    });

    describe('p-status:', () => {
      it('should have default value as default', () => {
        expect(component.status()).toBe('default');
      });

      it('should accept default as valid value', () => {
        fixture.componentRef.setInput('p-status', 'default');
        expect(component.status()).toBe('default');
      });

      it('should accept success as valid value', () => {
        fixture.componentRef.setInput('p-status', 'success');
        expect(component.status()).toBe('success');
      });

      it('should accept error as valid value', () => {
        fixture.componentRef.setInput('p-status', 'error');
        expect(component.status()).toBe('error');
      });

      it('should default to default for invalid values', () => {
        fixture.componentRef.setInput('p-status', 'warning');
        expect(component.status()).toBe('default');

        fixture.componentRef.setInput('p-status', 'unknown');
        expect(component.status()).toBe('default');
      });
    });

    describe('p-value:', () => {
      it('should have default value as 0', () => {
        expect(component.value()).toBe(0);
      });

      it('should accept valid numeric values', () => {
        fixture.componentRef.setInput('p-value', 50);
        expect(component.value()).toBe(50);

        fixture.componentRef.setInput('p-value', 100);
        expect(component.value()).toBe(100);
      });
    });

    describe('p-radius:', () => {
      it('should have default value as 0', () => {
        expect(component.radius()).toBe(0);
      });

      it('should accept valid numeric values', () => {
        fixture.componentRef.setInput('p-radius', 30);
        expect(component.radius()).toBe(30);

        fixture.componentRef.setInput('p-radius', 60);
        expect(component.radius()).toBe(60);
      });
    });
  });

  describe('Computed Signals:', () => {
    describe('strokeWidth:', () => {
      it('should return 4 when size is medium', () => {
        fixture.componentRef.setInput('p-size', 'medium');
        expect(component.strokeWidth()).toBe(4);
      });

      it('should return 8 when size is large', () => {
        fixture.componentRef.setInput('p-size', 'large');
        expect(component.strokeWidth()).toBe(8);
      });
    });

    describe('viewBoxSize:', () => {
      it('should return (radius + strokeWidth) * 2 for large', () => {
        fixture.componentRef.setInput('p-size', 'large');
        fixture.componentRef.setInput('p-radius', 45);
        expect(component.viewBoxSize()).toBe((45 + 8) * 2);
      });

      it('should return (radius + strokeWidth) * 2 for medium', () => {
        fixture.componentRef.setInput('p-size', 'medium');
        fixture.componentRef.setInput('p-radius', 45);
        expect(component.viewBoxSize()).toBe((45 + 4) * 2);
      });

      it('should recalculate when radius changes', () => {
        fixture.componentRef.setInput('p-size', 'large');
        fixture.componentRef.setInput('p-radius', 30);
        expect(component.viewBoxSize()).toBe((30 + 8) * 2);
      });
    });

    describe('center:', () => {
      it('should return radius + strokeWidth for large', () => {
        fixture.componentRef.setInput('p-size', 'large');
        fixture.componentRef.setInput('p-radius', 45);
        expect(component.center()).toBe(45 + 8);
      });

      it('should return radius + strokeWidth for medium', () => {
        fixture.componentRef.setInput('p-size', 'medium');
        fixture.componentRef.setInput('p-radius', 45);
        expect(component.center()).toBe(45 + 4);
      });

      it('should recalculate when radius changes', () => {
        fixture.componentRef.setInput('p-size', 'large');
        fixture.componentRef.setInput('p-radius', 30);
        expect(component.center()).toBe(30 + 8);
      });
    });

    describe('circumference:', () => {
      it('should return 2 * PI * radius', () => {
        fixture.componentRef.setInput('p-radius', 45);
        expect(component.circumference()).toBeCloseTo(2 * Math.PI * 45);
      });

      it('should recalculate when radius changes', () => {
        fixture.componentRef.setInput('p-radius', 30);
        expect(component.circumference()).toBeCloseTo(2 * Math.PI * 30);
      });
    });

    describe('dashOffset:', () => {
      it('should return full circumference when value is 0', () => {
        fixture.componentRef.setInput('p-value', 0);
        expect(component.dashOffset()).toBeCloseTo(component.circumference());
      });

      it('should return 0 when value is 100', () => {
        fixture.componentRef.setInput('p-value', 100);
        expect(component.dashOffset()).toBeCloseTo(0);
      });

      it('should return half circumference when value is 50', () => {
        fixture.componentRef.setInput('p-value', 50);
        expect(component.dashOffset()).toBeCloseTo(component.circumference() / 2);
      });

      it('should clamp negative values to 0', () => {
        fixture.componentRef.setInput('p-value', -10);
        expect(component.dashOffset()).toBeCloseTo(component.circumference());
      });

      it('should clamp values above 100 to 100', () => {
        fixture.componentRef.setInput('p-value', 150);
        expect(component.dashOffset()).toBeCloseTo(0);
      });

      it('should treat falsy value as 0', () => {
        fixture.componentRef.setInput('p-value', null);
        expect(component.dashOffset()).toBeCloseTo(component.circumference());
      });
    });
  });

  describe('Templates:', () => {
    describe('Determinate mode:', () => {
      it('should render progressbar with aria attributes when not indeterminate', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-value', 50);
        fixture.detectChanges();

        const container = nativeElement.querySelector('[role="progressbar"]');
        expect(container).toBeTruthy();
        expect(container.getAttribute('aria-valuenow')).toBe('50');
        expect(container.getAttribute('aria-valuemin')).toBe('0');
        expect(container.getAttribute('aria-valuemax')).toBe('100');
        expect(container.getAttribute('aria-live')).toBe('polite');
      });

      it('should render two circle elements (tray and indicator)', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-value', 25);
        fixture.detectChanges();

        const tray = nativeElement.querySelector('.po-progress-circle-tray');
        const indicator = nativeElement.querySelector('.po-progress-circle-indicator');
        expect(tray).toBeTruthy();
        expect(indicator).toBeTruthy();
      });

      it('should set correct SVG attributes', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-radius', 45);
        fixture.componentRef.setInput('p-size', 'large');
        fixture.detectChanges();

        const svg = nativeElement.querySelector('.po-progress-circle-svg');
        const expectedViewBoxSize = (45 + 8) * 2;
        expect(svg.getAttribute('width')).toBe(String(expectedViewBoxSize));
        expect(svg.getAttribute('height')).toBe(String(expectedViewBoxSize));
        expect(svg.getAttribute('viewBox')).toBe('0 0 ' + expectedViewBoxSize + ' ' + expectedViewBoxSize);
      });

      it('should set correct circle attributes for tray', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-radius', 45);
        fixture.componentRef.setInput('p-size', 'large');
        fixture.detectChanges();

        const tray = nativeElement.querySelector('.po-progress-circle-tray');
        const expectedCenter = 45 + 8;
        expect(tray.getAttribute('cx')).toBe(String(expectedCenter));
        expect(tray.getAttribute('cy')).toBe(String(expectedCenter));
        expect(tray.getAttribute('r')).toBe('45');
        expect(tray.getAttribute('fill')).toBe('none');
      });

      it('should set correct circle attributes for indicator', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-value', 75);
        fixture.componentRef.setInput('p-radius', 45);
        fixture.componentRef.setInput('p-size', 'large');
        fixture.detectChanges();

        const indicator = nativeElement.querySelector('.po-progress-circle-indicator');
        const expectedCenter = 45 + 8;
        const expectedCircumference = 2 * Math.PI * 45;
        const expectedDashOffset = expectedCircumference - (75 / 100) * expectedCircumference;

        expect(indicator.getAttribute('cx')).toBe(String(expectedCenter));
        expect(indicator.getAttribute('cy')).toBe(String(expectedCenter));
        expect(indicator.getAttribute('r')).toBe('45');
        expect(indicator.getAttribute('fill')).toBe('none');
        expect(parseFloat(indicator.getAttribute('stroke-dasharray'))).toBeCloseTo(expectedCircumference);
        expect(parseFloat(indicator.getAttribute('stroke-dashoffset'))).toBeCloseTo(expectedDashOffset);
      });

      it('should not render indeterminate container', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.detectChanges();

        const indeterminateContainer = nativeElement.querySelector('.po-progress-circle-indeterminate');
        expect(indeterminateContainer).toBeNull();
      });
    });

    describe('Indeterminate mode:', () => {
      it('should render indeterminate container with correct classes', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        fixture.componentRef.setInput('p-size', 'large');
        fixture.detectChanges();

        const container = nativeElement.querySelector('.po-progress-circle-indeterminate');
        const svg = container.querySelector('.po-progress-circle-svg');

        expect(container).toBeTruthy();
        expect(svg.getAttribute('width')).toEqual('106');
        expect(svg.getAttribute('height')).toEqual('106');
      });

      it('should apply medium size class in indeterminate mode', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        fixture.componentRef.setInput('p-size', 'medium');
        fixture.detectChanges();

        const container = nativeElement.querySelector('.po-progress-circle-indeterminate');
        const svg = container.querySelector('.po-progress-circle-svg');

        expect(container).toBeTruthy();
        expect(svg.getAttribute('width')).toEqual('98');
        expect(svg.getAttribute('height')).toEqual('98');
      });

      it('should have role progressbar and aria-live polite', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        fixture.detectChanges();

        const container = nativeElement.querySelector('[role="progressbar"]');
        expect(container).toBeTruthy();
        expect(container.getAttribute('aria-live')).toBe('polite');
      });

      it('should not have aria-valuenow in indeterminate mode', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        fixture.detectChanges();

        const container = nativeElement.querySelector('[role="progressbar"]');
        expect(container.hasAttribute('aria-valuenow')).toBeFalsy();
      });

      it('should render SVG with tray and indicator circles', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        fixture.detectChanges();

        const svg = nativeElement.querySelector('.po-progress-circle-svg');
        const tray = nativeElement.querySelector('.po-progress-circle-tray');
        const indicator = nativeElement.querySelector('.po-progress-circle-indicator');
        expect(svg).toBeTruthy();
        expect(tray).toBeTruthy();
        expect(indicator).toBeTruthy();
      });

      it('should not render determinate progressbar', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        fixture.detectChanges();

        const containers = nativeElement.querySelectorAll('[role="progressbar"]');
        expect(containers.length).toBe(1);
        expect(containers[0].classList.contains('po-progress-circle-indeterminate')).toBeTruthy();
      });

      it('should not show percentage text in indeterminate mode', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        fixture.componentRef.setInput('p-show-percentage', true);
        fixture.detectChanges();

        const percentage = nativeElement.querySelector('.po-progress-circle-info-percentage');
        expect(percentage).toBeNull();
      });
    });

    describe('Percentage display:', () => {
      it('should show percentage text when showPercentage is true and not indeterminate', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-show-percentage', true);
        fixture.componentRef.setInput('p-value', 75);
        fixture.detectChanges();

        const percentage = nativeElement.querySelector('.po-progress-circle-info-percentage');
        expect(percentage).toBeTruthy();
        expect(percentage.textContent.trim()).toBe('75%');
      });

      it('should not show percentage text when showPercentage is false', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-show-percentage', false);
        fixture.componentRef.setInput('p-value', 75);
        fixture.detectChanges();

        const percentage = nativeElement.querySelector('.po-progress-circle-info-percentage');
        expect(percentage).toBeNull();
      });

      it('should have po-progress-circle-info class on percentage span', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-show-percentage', true);
        fixture.componentRef.setInput('p-value', 50);
        fixture.detectChanges();

        const percentage = nativeElement.querySelector('.po-progress-circle-info.po-progress-circle-info-percentage');
        expect(percentage).toBeTruthy();
      });
    });

    describe('Error icon:', () => {
      it('should show error icon when status is error and showPercentage is false', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-status', 'error');
        fixture.componentRef.setInput('p-show-percentage', false);
        fixture.detectChanges();

        const errorIcon = nativeElement.querySelector('.po-progress-circle-info-error');
        expect(errorIcon).toBeTruthy();
        expect(errorIcon.querySelector('.an-warning-circle')).toBeTruthy();
      });

      it('should not show error icon when status is not error', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-status', 'default');
        fixture.componentRef.setInput('p-show-percentage', false);
        fixture.detectChanges();

        const errorIcon = nativeElement.querySelector('.po-progress-circle-info-error');
        expect(errorIcon).toBeNull();
      });

      it('should apply size-specific error class for large', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-status', 'error');
        fixture.componentRef.setInput('p-show-percentage', false);
        fixture.componentRef.setInput('p-size', 'large');
        fixture.detectChanges();

        const errorIcon = nativeElement.querySelector('.po-progress-circle-info-error-large');
        expect(errorIcon).toBeTruthy();
      });

      it('should apply size-specific error class for medium', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-status', 'error');
        fixture.componentRef.setInput('p-show-percentage', false);
        fixture.componentRef.setInput('p-size', 'medium');
        fixture.detectChanges();

        const errorIcon = nativeElement.querySelector('.po-progress-circle-info-error-medium');
        expect(errorIcon).toBeTruthy();
      });
    });

    describe('SVG wrapper:', () => {
      it('should render svg-wrapper in determinate mode', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.detectChanges();

        const wrapper = nativeElement.querySelector('.po-progress-circle-svg-wrapper');
        expect(wrapper).toBeTruthy();
      });

      it('should render svg-wrapper in indeterminate mode', () => {
        fixture.componentRef.setInput('p-indeterminate', true);
        fixture.detectChanges();

        const wrapper = nativeElement.querySelector('.po-progress-circle-svg-wrapper');
        expect(wrapper).toBeTruthy();
      });
    });

    describe('Custom radius:', () => {
      it('should apply custom radius to SVG attributes', () => {
        fixture.componentRef.setInput('p-indeterminate', false);
        fixture.componentRef.setInput('p-radius', 30);
        fixture.componentRef.setInput('p-size', 'large');
        fixture.detectChanges();

        const svg = nativeElement.querySelector('.po-progress-circle-svg');
        const tray = nativeElement.querySelector('.po-progress-circle-tray');
        const expectedViewBoxSize = (30 + 8) * 2;
        const expectedCenter = 30 + 8;

        expect(svg.getAttribute('width')).toBe(String(expectedViewBoxSize));
        expect(svg.getAttribute('height')).toBe(String(expectedViewBoxSize));
        expect(tray.getAttribute('r')).toBe('30');
        expect(tray.getAttribute('cx')).toBe(String(expectedCenter));
        expect(tray.getAttribute('cy')).toBe(String(expectedCenter));
      });
    });
  });

  describe('baseRadius computed:', () => {
    it('should return radius when radius > 0 and parentSize is 0 (popover scenario)', () => {
      fixture.componentRef.setInput('p-radius', 30);
      fixture.componentRef.setInput('p-parent-size', 0);

      expect(component.baseRadius()).toBe(30);
    });

    it('should clamp radius to fit parent when radius > 0 and parentSize > 0', () => {
      fixture.componentRef.setInput('p-radius', 300);
      fixture.componentRef.setInput('p-parent-size', 200);
      fixture.componentRef.setInput('p-size', 'large');

      const maxFit = 200 / 2 - 8;
      expect(component.baseRadius()).toBe(Math.min(300, Math.max(maxFit, 0)));
    });

    it('should use parentSize to calculate radius when radius is 0 and parentSize > 0', () => {
      fixture.componentRef.setInput('p-radius', 0);
      fixture.componentRef.setInput('p-parent-size', 200);
      fixture.componentRef.setInput('p-size', 'large');

      expect(component.baseRadius()).toBe(200 / 2 - 8);
    });

    it('should return default radius (45) when both radius and parentSize are 0', () => {
      fixture.componentRef.setInput('p-radius', 0);
      fixture.componentRef.setInput('p-parent-size', 0);

      expect(component.baseRadius()).toBe(45);
    });

    it('should return 0 when maxFitRadius is negative (parentSize smaller than strokeWidth)', () => {
      fixture.componentRef.setInput('p-radius', 300);
      fixture.componentRef.setInput('p-parent-size', 10);
      fixture.componentRef.setInput('p-size', 'large');

      expect(component.baseRadius()).toBe(0);
    });
  });

  describe('naturalSize computed:', () => {
    it('should return viewBoxSize as string when parentSize is 0', () => {
      fixture.componentRef.setInput('p-radius', 30);
      fixture.componentRef.setInput('p-parent-size', 0);

      const expected = `${component.viewBoxSize()}px`;
      expect(component.naturalSize()).toBe(expected);
    });

    it('should clamp to parentSize when viewBoxSize exceeds parentSize', () => {
      fixture.componentRef.setInput('p-radius', 0);
      fixture.componentRef.setInput('p-parent-size', 40);
      fixture.componentRef.setInput('p-show-percentage', true);

      const vb = component.viewBoxSize();
      expect(vb).toBeGreaterThan(40);
      expect(component.naturalSize()).toBe('40px');
    });

    it('should return viewBoxSize when parentSize > 0 but viewBoxSize is within parentSize', () => {
      fixture.componentRef.setInput('p-radius', 30);
      fixture.componentRef.setInput('p-parent-size', 200);

      const vb = component.viewBoxSize();
      expect(vb).toBeLessThanOrEqual(200);
      expect(component.naturalSize()).toBe(`${vb}px`);
    });
  });

  describe('hasCenterContent computed:', () => {
    it('should return true when showPercentage is true and not indeterminate', () => {
      fixture.componentRef.setInput('p-indeterminate', false);
      fixture.componentRef.setInput('p-show-percentage', true);

      expect(component.hasCenterContent()).toBe(true);
    });

    it('should return true when status is error and not indeterminate', () => {
      fixture.componentRef.setInput('p-indeterminate', false);
      fixture.componentRef.setInput('p-status', 'error');

      expect(component.hasCenterContent()).toBe(true);
    });

    it('should return false when indeterminate is true', () => {
      fixture.componentRef.setInput('p-indeterminate', true);
      fixture.componentRef.setInput('p-show-percentage', true);

      expect(component.hasCenterContent()).toBe(false);
    });

    it('should return false when status is default and showPercentage is false', () => {
      fixture.componentRef.setInput('p-indeterminate', false);
      fixture.componentRef.setInput('p-show-percentage', false);
      fixture.componentRef.setInput('p-status', 'default');

      expect(component.hasCenterContent()).toBe(false);
    });
  });

  describe('effectiveRadius computed:', () => {
    it('should enforce minimum radius when center content is present', () => {
      fixture.componentRef.setInput('p-radius', 30);
      fixture.componentRef.setInput('p-parent-size', 40);
      fixture.componentRef.setInput('p-show-percentage', true);
      fixture.componentRef.setInput('p-size', 'large');

      expect(component.effectiveRadius()).toBeGreaterThanOrEqual(24);
    });

    it('should use baseRadius directly when no center content', () => {
      fixture.componentRef.setInput('p-radius', 30);
      fixture.componentRef.setInput('p-parent-size', 0);
      fixture.componentRef.setInput('p-show-percentage', false);
      fixture.componentRef.setInput('p-status', 'default');

      expect(component.effectiveRadius()).toBe(component.baseRadius());
    });
  });
});
