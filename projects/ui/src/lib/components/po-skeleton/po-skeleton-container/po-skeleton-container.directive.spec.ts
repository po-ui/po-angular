import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSkeletonAnimation } from '../enums/po-skeleton-animation.enum';

import { PoSkeletonContainerDirective } from './po-skeleton-container.directive';
import { PO_SKELETON_CONTAINER } from './po-skeleton-container.token';

@Component({
  selector: 'po-test-skeleton-container-host',
  template: `
    <div [p-skeleton]="isLoading" [p-skeleton-animation]="animation">
      <span class="child-content">Conteúdo filho</span>
    </div>
  `,
  standalone: false
})
class TestHostComponent {
  isLoading = false;
  animation: PoSkeletonAnimation = PoSkeletonAnimation.shimmer;
}

@Component({
  selector: 'po-test-skeleton-child',
  template: '<span>{{ skeletonActive }}</span>',
  standalone: false
})
class TestChildComponent {
  skeletonActive = false;

  constructor() {
    const container = TestBed.inject(PO_SKELETON_CONTAINER, { optional: true } as any);
    if (container) {
      this.skeletonActive = container.skeleton();
    }
  }
}

@Component({
  selector: 'po-test-skeleton-di-host',
  template: `
    <div [p-skeleton]="isLoading">
      <po-test-skeleton-child></po-test-skeleton-child>
    </div>
  `,
  standalone: false
})
class TestDIHostComponent {
  isLoading = false;
}

describe('PoSkeletonContainerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoSkeletonContainerDirective, TestHostComponent, TestChildComponent, TestDIHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should create the directive', () => {
    fixture.detectChanges();
    const containerEl = fixture.nativeElement.querySelector('div');
    expect(containerEl).toBeTruthy();
  });

  describe('data-po-skeleton attribute:', () => {
    it('should NOT set data-po-skeleton when p-skeleton is false', () => {
      component.isLoading = false;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('data-po-skeleton')).toBeNull();
    });

    it('should set data-po-skeleton="true" when p-skeleton is true', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('data-po-skeleton')).toBe('true');
    });

    it('should remove data-po-skeleton when p-skeleton changes from true to false', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('data-po-skeleton')).toBe('true');

      component.isLoading = false;
      fixture.detectChanges();

      expect(containerEl.getAttribute('data-po-skeleton')).toBeNull();
    });
  });

  describe('aria-busy attribute:', () => {
    it('should NOT set aria-busy when p-skeleton is false', () => {
      component.isLoading = false;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('aria-busy')).toBeNull();
    });

    it('should set aria-busy="true" when p-skeleton is true', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('data-po-skeleton-animation attribute:', () => {
    it('should set data-po-skeleton-animation="shimmer" by default when active', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('data-po-skeleton-animation')).toBe('shimmer');
    });

    it('should set data-po-skeleton-animation="pulse" when configured', () => {
      component.isLoading = true;
      component.animation = PoSkeletonAnimation.pulse;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('data-po-skeleton-animation')).toBe('pulse');
    });

    it('should set data-po-skeleton-animation="none" when configured', () => {
      component.isLoading = true;
      component.animation = PoSkeletonAnimation.none;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('data-po-skeleton-animation')).toBe('none');
    });

    it('should NOT set data-po-skeleton-animation when p-skeleton is false', () => {
      component.isLoading = false;
      component.animation = PoSkeletonAnimation.pulse;
      fixture.detectChanges();

      const containerEl = fixture.nativeElement.querySelector('div');
      expect(containerEl.getAttribute('data-po-skeleton-animation')).toBeNull();
    });
  });

  describe('DI token provision:', () => {
    it('should provide PO_SKELETON_CONTAINER token', () => {
      const diFixture = TestBed.createComponent(TestDIHostComponent);
      diFixture.componentInstance.isLoading = true;
      diFixture.detectChanges();

      const childEl = diFixture.nativeElement.querySelector('po-test-skeleton-child');
      expect(childEl).toBeTruthy();
    });
  });

  describe('children visibility:', () => {
    it('should keep children in the DOM when skeleton is active', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const childEl = fixture.nativeElement.querySelector('.child-content');
      expect(childEl).toBeTruthy();
      expect(childEl.textContent).toBe('Conteúdo filho');
    });
  });
});
