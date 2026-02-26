import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSkeletonBaseComponent } from './po-skeleton-base.component';

@Component({
  selector: 'po-test-skeleton',
  template: '',
  standalone: false
})
class TestSkeletonComponent extends PoSkeletonBaseComponent {}

describe('PoSkeletonBaseComponent', () => {
  let component: TestSkeletonComponent;
  let fixture: ComponentFixture<TestSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestSkeletonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(PoSkeletonBaseComponent).toBeDefined();
  });

  describe('variant input:', () => {
    it('should return default value "text" when value is empty', () => {
      fixture.componentRef.setInput('p-variant', '');
      fixture.detectChanges();
      expect(component.variant()).toBe('text');
    });

    it('should return default value "text" when value is invalid', () => {
      fixture.componentRef.setInput('p-variant', 'invalid');
      fixture.detectChanges();
      expect(component.variant()).toBe('text');
    });

    it('should return valid value when provided', () => {
      fixture.componentRef.setInput('p-variant', 'circle');
      fixture.detectChanges();
      expect(component.variant()).toBe('circle');
    });
  });

  describe('type input:', () => {
    it('should return default value "normal" when value is empty', () => {
      fixture.componentRef.setInput('p-type', '');
      fixture.detectChanges();
      expect(component.type()).toBe('normal');
    });

    it('should return default value "normal" when value is invalid', () => {
      fixture.componentRef.setInput('p-type', 'invalid');
      fixture.detectChanges();
      expect(component.type()).toBe('normal');
    });

    it('should return valid value when provided', () => {
      fixture.componentRef.setInput('p-type', 'primary');
      fixture.detectChanges();
      expect(component.type()).toBe('primary');
    });
  });

  describe('animation input:', () => {
    it('should return default value "shimmer" when value is empty', () => {
      fixture.componentRef.setInput('p-animation', '');
      fixture.detectChanges();
      expect(component.animation()).toBe('shimmer');
    });

    it('should return default value "shimmer" when value is invalid', () => {
      fixture.componentRef.setInput('p-animation', 'invalid');
      fixture.detectChanges();
      expect(component.animation()).toBe('shimmer');
    });

    it('should return valid value when provided', () => {
      fixture.componentRef.setInput('p-animation', 'pulse');
      fixture.detectChanges();
      expect(component.animation()).toBe('pulse');
    });
  });

  describe('size input:', () => {
    it('should return default value "md" when value is empty', () => {
      fixture.componentRef.setInput('p-size', '');
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should return default value "md" when value is invalid', () => {
      fixture.componentRef.setInput('p-size', 'invalid');
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should return valid value when provided', () => {
      fixture.componentRef.setInput('p-size', 'lg');
      fixture.detectChanges();
      expect(component.size()).toBe('lg');
    });
  });
});
