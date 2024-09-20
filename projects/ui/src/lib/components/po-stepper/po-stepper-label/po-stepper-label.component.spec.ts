import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoStepperLabelComponent } from './po-stepper-label.component';
import { configureTestSuite } from '../../../util-test/util-expect.spec';
import { PoStepperModule } from '../po-stepper.module';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';

describe('PoStepperLabelComponent: ', () => {
  let component: PoStepperLabelComponent;
  let fixture: ComponentFixture<PoStepperLabelComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoStepperModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoStepperLabelComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoStepperLabelComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('should set content property correctly', () => {
      component.content = 'Step 1';
      fixture.detectChanges();
      expect(component.content).toBe('Step 1');
    });

    it('should handle vertical orientation property', () => {
      component.isVerticalOrientation = true;
      fixture.detectChanges();
      expect(component.isVerticalOrientation).toBeTrue();
    });

    it('should handle status property', () => {
      component.status = 'active';
      fixture.detectChanges();
      expect(component.status).toBe('active');
    });
  });

  describe('Methods:', () => {
    it('should call `updateLabel` and detectChanges when content changes', () => {
      const updateLabelSpy = spyOn(component as any, 'updateLabel').and.callThrough();

      const changes = {
        content: new SimpleChange(null, 'Step 1', true),
        isVerticalOrientation: null
      };

      component.ngOnChanges(changes);

      fixture.detectChanges();

      expect(updateLabelSpy).toHaveBeenCalled();
    });

    it('should call `updateLabel` and detectChanges when isVerticalOrientation changes', () => {
      const updateLabelSpy = spyOn(component as any, 'updateLabel').and.callThrough();

      const changes = {
        content: null,
        isVerticalOrientation: new SimpleChange(null, true, true)
      };

      component.ngOnChanges(changes);

      fixture.detectChanges();

      expect(updateLabelSpy).toHaveBeenCalled();
    });

    it('should call updateLabel and detectChanges when both content and isVerticalOrientation change', () => {
      const updateLabelSpy = spyOn(component as any, 'updateLabel').and.callThrough();

      const changes = {
        content: new SimpleChange(null, 'New Content', true),
        isVerticalOrientation: new SimpleChange(null, true, true)
      };

      component.ngOnChanges(changes);

      fixture.detectChanges();

      expect(updateLabelSpy).toHaveBeenCalled();
    });

    it('should not update label if labelElement is null', () => {
      const updateLabelSpy = spyOn<any>(component, 'updateLabel').and.callThrough();
      component.labelElement = null;

      (component as any).updateLabel();

      expect(updateLabelSpy).toHaveBeenCalled();
      expect(component.tooltipContent).toBeNull();
    });

    it('should truncate content when isVerticalOrientation is true and content length exceeds maxLabelLength', () => {
      const originalContent = 'This is a long content that needs truncation';
      component.content = originalContent;
      component.isVerticalOrientation = true;
      (component as any).maxLabelLength = 10;

      (component as any).updateLabel();

      expect(component.displayedContent).toBe('This is a ...');
    });

    it('should set tooltipContent to content if text overflows horizontally', () => {
      const labelElement = document.createElement('div');
      component.labelElement = { nativeElement: labelElement } as any;

      component.content = 'Content that will overflow horizontally';
      component.isVerticalOrientation = false;
      (component as any).maxLabelLength = 50;

      Object.defineProperty(labelElement, 'scrollWidth', { value: 200 });
      Object.defineProperty(labelElement, 'clientWidth', { value: 50 });

      (component as any).updateTooltip();

      expect(component.tooltipContent).toBe(component.content);
    });

    it('should set tooltipContent to null if content length does not exceed maxLabelLength and no text overflow', () => {
      const labelElement = document.createElement('div');
      component.labelElement = { nativeElement: labelElement } as any;

      component.content = 'Short content';
      component.isVerticalOrientation = true;
      (component as any).maxLabelLength = 20;

      Object.defineProperty(labelElement, 'scrollWidth', { value: 50 });
      Object.defineProperty(labelElement, 'clientWidth', { value: 50 });
      Object.defineProperty(labelElement, 'scrollHeight', { value: 20 });
      Object.defineProperty(labelElement, 'clientHeight', { value: 20 });

      (component as any).updateTooltip();

      expect(component.tooltipContent).toBeNull();
    });

    it('should set tooltipContent to content if content length exceeds maxLabelLength', () => {
      const labelElement = document.createElement('div');
      component.labelElement = { nativeElement: labelElement } as any;

      component.content = 'This is a long content that needs truncation';
      component.isVerticalOrientation = true;
      (component as any).maxLabelLength = 20;

      Object.defineProperty(labelElement, 'scrollWidth', { value: 50 });
      Object.defineProperty(labelElement, 'clientWidth', { value: 50 });
      Object.defineProperty(labelElement, 'scrollHeight', { value: 20 });
      Object.defineProperty(labelElement, 'clientHeight', { value: 20 });

      (component as any).updateTooltip();

      expect(component.tooltipContent).toBe(component.content);
    });

    it('should call updateTooltip and add class on mouseover', () => {
      const updateTooltipSpy = spyOn<any>(component, 'updateTooltip').and.callThrough();
      const addClassSpy = spyOn((component as any).renderer, 'addClass').and.callThrough();

      component.onMouseOver();

      expect(updateTooltipSpy).toHaveBeenCalled();
      expect(addClassSpy).toHaveBeenCalledWith(component.labelElement.nativeElement, 'hovered');
    });

    it('should remove class on mouseout', () => {
      const removeClassSpy = spyOn((component as any).renderer, 'removeClass').and.callThrough();

      component.onMouseOut();

      expect(removeClassSpy).toHaveBeenCalledWith(component.labelElement.nativeElement, 'hovered');
    });

    it('should set tooltipContent to content if text overflows vertically', () => {
      const labelElement = document.createElement('div');

      component.labelElement = { nativeElement: labelElement } as any;

      component.content =
        'Content that is very long and will overflow horizontally or exceed 100 characters vertically';
      component.isVerticalOrientation = true;
      (component as any).maxLabelLength = 100;

      Object.defineProperty(labelElement, 'scrollWidth', { value: 150 });
      Object.defineProperty(labelElement, 'clientWidth', { value: 100 });

      (component as any).updateTooltip();

      expect(component.tooltipContent).toBe(component.content);
    });
  });

  describe('Templates:', () => {
    it('should apply `po-stepper-label-vertical` when isVerticalOrientation is true', () => {
      component.isVerticalOrientation = true;
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('div'));

      expect(element.nativeElement.classList.contains('po-stepper-label-vertical')).toBeTrue();
    });

    it('should apply `po-stepper-label-active` when status is active', () => {
      component.status = 'active';
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('div'));

      expect(element.nativeElement.classList.contains('po-stepper-label-active')).toBeTrue();
    });

    it('should apply `po-stepper-label-active` when status is error', () => {
      component.status = 'error';
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('div'));

      expect(element.nativeElement.classList.contains('po-stepper-label-active')).toBeTrue();
    });

    it('should apply `po-stepper-label` when content is set', () => {
      component.content = 'Step 1';
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('div'));

      expect(element.nativeElement.classList.contains('po-stepper-label')).toBeTrue();
    });

    it('should apply `po-stepper-label-done` when status is done', () => {
      component.status = 'done';
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('div'));

      expect(element.nativeElement.classList.contains('po-stepper-label-done')).toBeTrue();
    });

    it('should add `po-link` class when status is not `disabled`.', () => {
      component.status = 'active';
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('div'));

      expect(element.nativeElement.classList.contains('po-link')).toBeTrue();
    });

    it('should not add `po-link` class when status is `disabled`.', () => {
      component.status = 'disabled';
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('div'));

      expect(element.nativeElement.classList.contains('po-link')).toBeFalse();
    });
  });
});
