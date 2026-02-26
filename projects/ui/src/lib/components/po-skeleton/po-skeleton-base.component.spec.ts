import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSkeletonBaseComponent } from './po-skeleton-base.component';
import { PoSkeletonAnimation } from './enums/po-skeleton-animation.enum';
import { PoSkeletonSize } from './enums/po-skeleton-size.enum';
import { PoSkeletonType } from './enums/po-skeleton-type.enum';
import { PoSkeletonVariant } from './enums/po-skeleton-variant.enum';

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
    it('should return default value "text" when no value is provided', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe(PoSkeletonVariant.text);
    });

    it('should return valid value when provided', () => {
      fixture.componentRef.setInput('p-variant', PoSkeletonVariant.circle);
      fixture.detectChanges();
      expect(component.variant()).toBe(PoSkeletonVariant.circle);
    });
  });

  describe('type input:', () => {
    it('should return default value "normal" when no value is provided', () => {
      fixture.detectChanges();
      expect(component.type()).toBe(PoSkeletonType.normal);
    });

    it('should return valid value when provided', () => {
      fixture.componentRef.setInput('p-type', PoSkeletonType.primary);
      fixture.detectChanges();
      expect(component.type()).toBe(PoSkeletonType.primary);
    });
  });

  describe('animation input:', () => {
    it('should return default value "shimmer" when no value is provided', () => {
      fixture.detectChanges();
      expect(component.animation()).toBe(PoSkeletonAnimation.shimmer);
    });

    it('should return valid value when provided', () => {
      fixture.componentRef.setInput('p-animation', PoSkeletonAnimation.pulse);
      fixture.detectChanges();
      expect(component.animation()).toBe(PoSkeletonAnimation.pulse);
    });
  });

  describe('size input:', () => {
    it('should return default value "md" when no value is provided', () => {
      fixture.detectChanges();
      expect(component.size()).toBe(PoSkeletonSize.md);
    });

    it('should return valid value when provided', () => {
      fixture.componentRef.setInput('p-size', PoSkeletonSize.lg);
      fixture.detectChanges();
      expect(component.size()).toBe(PoSkeletonSize.lg);
    });
  });

  describe('ariaLabel input:', () => {
    it('should return default value empty string when no value is provided', () => {
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('');
    });

    it('should return custom value when provided', () => {
      fixture.componentRef.setInput('p-aria-label', 'Carregando dados do usuário');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Carregando dados do usuário');
    });
  });
});
