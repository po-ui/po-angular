import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSkeletonComponent } from './po-skeleton.component';

describe('PoSkeletonComponent', () => {
  let component: PoSkeletonComponent;
  let fixture: ComponentFixture<PoSkeletonComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoSkeletonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoSkeletonComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have aria-hidden attribute', () => {
    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should apply default classes', () => {
    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton')).toBeTruthy();
    expect(skeletonElement.classList.contains('po-skeleton-text')).toBeTruthy();
    expect(skeletonElement.classList.contains('po-skeleton-animation-shimmer')).toBeTruthy();
  });

  it('should apply custom width style', () => {
    component.width = '250px';
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('250px');
  });

  it('should apply custom height style', () => {
    component.height = '100px';
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.height).toBe('100px');
  });

  it('should apply custom border-radius style', () => {
    component.borderRadius = '16px';
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.borderRadius).toBe('16px');
  });

  it('should apply rect variant class', () => {
    component.variant = 'rect';
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-rect')).toBeTruthy();
  });

  it('should apply circle variant class', () => {
    component.variant = 'circle';
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-circle')).toBeTruthy();
  });

  it('should apply pulse animation class', () => {
    component.animation = 'pulse';
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-animation-pulse')).toBeTruthy();
  });

  it('should apply none animation class', () => {
    component.animation = 'none';
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-animation-none')).toBeTruthy();
  });
});
