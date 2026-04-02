import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoProgressCircleComponent } from './po-progress-circle.component';
import { PoProgressModule } from '../po-progress.module';

describe('PoProgressCircleComponent:', () => {
  let component: PoProgressCircleComponent;
  let fixture: ComponentFixture<PoProgressCircleComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoProgressModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoProgressCircleComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoProgressCircleComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('radius: should return 40 when size is medium', () => {
      component.size = 'medium';
      expect(component.radius).toBe(40);
    });

    it('radius: should return 52 when size is large', () => {
      component.size = 'large';
      expect(component.radius).toBe(52);
    });

    it('strokeWidth: should return 6 when size is medium', () => {
      component.size = 'medium';
      expect(component.strokeWidth).toBe(6);
    });

    it('strokeWidth: should return 8 when size is large', () => {
      component.size = 'large';
      expect(component.strokeWidth).toBe(8);
    });

    it('viewBoxSize: should return (radius + strokeWidth) * 2', () => {
      component.size = 'large';
      expect(component.viewBoxSize).toBe((52 + 8) * 2);
    });

    it('center: should return radius + strokeWidth', () => {
      component.size = 'large';
      expect(component.center).toBe(52 + 8);
    });

    it('circumference: should return 2 * PI * radius', () => {
      component.size = 'large';
      expect(component.circumference).toBeCloseTo(2 * Math.PI * 52);
    });

    it('dashOffset: should return full circumference when value is 0', () => {
      component.size = 'large';
      component.value = 0;
      expect(component.dashOffset).toBeCloseTo(component.circumference);
    });

    it('dashOffset: should return 0 when value is 100', () => {
      component.value = 100;
      expect(component.dashOffset).toBeCloseTo(0);
    });

    it('dashOffset: should return half circumference when value is 50', () => {
      component.size = 'large';
      component.value = 50;
      expect(component.dashOffset).toBeCloseTo(component.circumference / 2);
    });

    it('fontSize: should return 0.875rem when size is medium', () => {
      component.size = 'medium';
      expect(component.fontSize).toBe('0.875rem');
    });

    it('fontSize: should return 1rem when size is large', () => {
      component.size = 'large';
      expect(component.fontSize).toBe('1rem');
    });

    it('statusClass: should return po-progress-circle-success when status is success', () => {
      component.status = 'success';
      expect(component.statusClass).toBe('po-progress-circle-success');
    });

    it('statusClass: should return po-progress-circle-error when status is error', () => {
      component.status = 'error';
      expect(component.statusClass).toBe('po-progress-circle-error');
    });

    it('statusClass: should return po-progress-circle-default when status is default', () => {
      component.status = 'default';
      expect(component.statusClass).toBe('po-progress-circle-default');
    });

    it('statusClass: should return po-progress-circle-default when status is unknown', () => {
      component.status = 'unknown';
      expect(component.statusClass).toBe('po-progress-circle-default');
    });
  });

  describe('Templates:', () => {
    it('should render determinate progress circle with role progressbar', () => {
      component.indeterminate = false;
      component.value = 50;

      fixture.detectChanges();

      const container = nativeElement.querySelector('[role="progressbar"]');
      expect(container).toBeTruthy();
      expect(container.getAttribute('aria-valuenow')).toBe('50');
      expect(container.getAttribute('aria-valuemin')).toBe('0');
      expect(container.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should render two circle elements for determinate mode', () => {
      component.indeterminate = false;
      component.value = 25;

      fixture.detectChanges();

      const circles = nativeElement.querySelectorAll('circle');
      expect(circles.length).toBe(2);
    });

    it('should show percentage text when showPercentage is true and not indeterminate', () => {
      component.indeterminate = false;
      component.showPercentage = true;
      component.value = 75;

      fixture.detectChanges();

      const percentageText = nativeElement.querySelector('.po-progress-circle-percentage');
      expect(percentageText).toBeTruthy();
      expect(percentageText.textContent.trim()).toBe('75%');
    });

    it('should not show percentage text when showPercentage is false', () => {
      component.indeterminate = false;
      component.showPercentage = false;
      component.value = 75;

      fixture.detectChanges();

      const percentageText = nativeElement.querySelector('.po-progress-circle-percentage');
      expect(percentageText).toBeNull();
    });

    it('should render indeterminate circle when indeterminate is true', () => {
      component.indeterminate = true;

      fixture.detectChanges();

      const indeterminateContainer = nativeElement.querySelector('.po-progress-circle-indeterminate');
      expect(indeterminateContainer).toBeTruthy();
    });

    it('should not show percentage text in indeterminate mode', () => {
      component.indeterminate = true;
      component.showPercentage = true;

      fixture.detectChanges();

      const percentageText = nativeElement.querySelector('.po-progress-circle-percentage');
      expect(percentageText).toBeNull();
    });

    it('should apply success status class', () => {
      component.indeterminate = false;
      component.status = 'success';

      fixture.detectChanges();

      const container = nativeElement.querySelector('.po-progress-circle-success');
      expect(container).toBeTruthy();
    });

    it('should apply error status class', () => {
      component.indeterminate = false;
      component.status = 'error';

      fixture.detectChanges();

      const container = nativeElement.querySelector('.po-progress-circle-error');
      expect(container).toBeTruthy();
    });

    it('should apply default status class', () => {
      component.indeterminate = false;
      component.status = 'default';

      fixture.detectChanges();

      const container = nativeElement.querySelector('.po-progress-circle-default');
      expect(container).toBeTruthy();
    });

    it('should have aria-live polite in indeterminate mode', () => {
      component.indeterminate = true;

      fixture.detectChanges();

      const container = nativeElement.querySelector('[aria-live="polite"]');
      expect(container).toBeTruthy();
    });
  });
});
