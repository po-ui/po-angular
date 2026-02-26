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
    fixture.componentRef.setInput('p-width', '250px');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('250px');
  });

  it('should apply custom height style', () => {
    fixture.componentRef.setInput('p-height', '100px');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.height).toBe('100px');
  });

  it('should apply custom border-radius style', () => {
    fixture.componentRef.setInput('p-border-radius', '16px');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.borderRadius).toBe('16px');
  });

  it('should apply rectangle variant class', () => {
    fixture.componentRef.setInput('p-variant', 'rectangle');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-rectangle')).toBeTruthy();
  });

  it('should apply square variant class', () => {
    fixture.componentRef.setInput('p-variant', 'square');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-square')).toBeTruthy();
  });

  it('should apply circle variant class', () => {
    fixture.componentRef.setInput('p-variant', 'circle');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-circle')).toBeTruthy();
  });

  it('should apply pulse animation class', () => {
    fixture.componentRef.setInput('p-animation', 'pulse');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-animation-pulse')).toBeTruthy();
  });

  it('should apply none animation class', () => {
    fixture.componentRef.setInput('p-animation', 'none');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-animation-none')).toBeTruthy();
  });

  it('should apply normal type class by default', () => {
    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-type-normal')).toBeTruthy();
  });

  it('should apply primary type class', () => {
    fixture.componentRef.setInput('p-type', 'primary');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-type-primary')).toBeTruthy();
  });

  it('should apply content type class', () => {
    fixture.componentRef.setInput('p-type', 'content');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-type-content')).toBeTruthy();
  });

  it('should set type to normal when value is invalid', () => {
    fixture.componentRef.setInput('p-type', 'invalid');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-type-normal')).toBeTruthy();
  });

  it('should set variant to text when value is invalid', () => {
    fixture.componentRef.setInput('p-variant', 'invalid');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-text')).toBeTruthy();
  });

  it('should set animation to shimmer when value is invalid', () => {
    fixture.componentRef.setInput('p-animation', 'invalid');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper');
    expect(skeletonElement.classList.contains('po-skeleton-animation-shimmer')).toBeTruthy();
  });

  it('should set width to 100% when value is empty and variant is text', () => {
    fixture.componentRef.setInput('p-width', '');
    fixture.componentRef.setInput('p-variant', 'text');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('100%');
  });

  it('should apply default size for square variant', () => {
    fixture.componentRef.setInput('p-variant', 'square');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('64px');
    expect(skeletonElement.style.height).toBe('64px');
  });

  it('should apply sm size for circle variant', () => {
    fixture.componentRef.setInput('p-variant', 'circle');
    fixture.componentRef.setInput('p-size', 'sm');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('32px');
    expect(skeletonElement.style.height).toBe('32px');
  });

  it('should apply lg size for rectangle variant', () => {
    fixture.componentRef.setInput('p-variant', 'rectangle');
    fixture.componentRef.setInput('p-size', 'lg');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('288px');
    expect(skeletonElement.style.height).toBe('96px');
  });

  it('should apply xl size for square variant', () => {
    fixture.componentRef.setInput('p-variant', 'square');
    fixture.componentRef.setInput('p-size', 'xl');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('128px');
    expect(skeletonElement.style.height).toBe('128px');
  });

  it('should use md size as default when invalid size is provided', () => {
    fixture.componentRef.setInput('p-variant', 'square');
    fixture.componentRef.setInput('p-size', 'invalid');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('64px');
    expect(skeletonElement.style.height).toBe('64px');
  });

  it('should override size with custom width and height', () => {
    fixture.componentRef.setInput('p-variant', 'square');
    fixture.componentRef.setInput('p-size', 'lg');
    fixture.componentRef.setInput('p-width', '200px');
    fixture.componentRef.setInput('p-height', '150px');
    fixture.detectChanges();

    const skeletonElement = nativeElement.querySelector('.po-skeleton-wrapper') as HTMLElement;
    expect(skeletonElement.style.width).toBe('200px');
    expect(skeletonElement.style.height).toBe('150px');
  });

  describe('computedStyles:', () => {
    it('should return width 100% by default', () => {
      const styles = component.computedStyles();
      expect(styles['width']).toBe('100%');
    });

    it('should return height 1em for text variant when height is not set', () => {
      const styles = component.computedStyles();
      expect(styles['height']).toBe('1em');
    });

    it('should not return default height for rectangle variant when height is not set', () => {
      fixture.componentRef.setInput('p-variant', 'rectangle');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['height']).toBe('64px');
    });

    it('should return custom height when set', () => {
      fixture.componentRef.setInput('p-height', '200px');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['height']).toBe('200px');
    });

    it('should return custom border-radius when set', () => {
      fixture.componentRef.setInput('p-border-radius', '10px');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['border-radius']).toBe('10px');
    });

    it('should return all custom properties', () => {
      fixture.componentRef.setInput('p-width', '300px');
      fixture.componentRef.setInput('p-height', '150px');
      fixture.componentRef.setInput('p-border-radius', '12px');
      fixture.detectChanges();
      const styles = component.computedStyles();

      expect(styles['width']).toBe('300px');
      expect(styles['height']).toBe('150px');
      expect(styles['border-radius']).toBe('12px');
    });

    it('should return correct width and height for square variant with sm size', () => {
      fixture.componentRef.setInput('p-variant', 'square');
      fixture.componentRef.setInput('p-size', 'sm');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['width']).toBe('32px');
      expect(styles['height']).toBe('32px');
    });

    it('should return correct width and height for circle variant with lg size', () => {
      fixture.componentRef.setInput('p-variant', 'circle');
      fixture.componentRef.setInput('p-size', 'lg');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['width']).toBe('96px');
      expect(styles['height']).toBe('96px');
    });

    it('should return correct width and height for rectangle variant with xl size', () => {
      fixture.componentRef.setInput('p-variant', 'rectangle');
      fixture.componentRef.setInput('p-size', 'xl');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['width']).toBe('384px');
      expect(styles['height']).toBe('128px');
    });

    it('should override width for text variant when custom width is provided', () => {
      fixture.componentRef.setInput('p-variant', 'text');
      fixture.componentRef.setInput('p-width', '50%');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['width']).toBe('50%');
      expect(styles['height']).toBe('1em');
    });

    it('should not add border-radius to styles when border-radius is not provided', () => {
      fixture.componentRef.setInput('p-variant', 'square');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['border-radius']).toBeUndefined();
    });

    it('should handle empty width value for text variant', () => {
      fixture.componentRef.setInput('p-variant', 'text');
      fixture.componentRef.setInput('p-width', '');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['width']).toBe('100%');
    });

    it('should handle empty height value for text variant', () => {
      fixture.componentRef.setInput('p-variant', 'text');
      fixture.componentRef.setInput('p-height', '');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['height']).toBe('1em');
    });

    it('should not add border-radius when border-radius is empty string', () => {
      fixture.componentRef.setInput('p-border-radius', '');
      fixture.detectChanges();
      const styles = component.computedStyles();
      expect(styles['border-radius']).toBeUndefined();
    });
  });

  describe('computedClasses:', () => {
    it('should return base skeleton class', () => {
      const classes = component.computedClasses();
      expect(classes['po-skeleton']).toBeTruthy();
    });

    it('should return text variant class by default', () => {
      const classes = component.computedClasses();
      expect(classes['po-skeleton-text']).toBeTruthy();
    });

    it('should return shimmer animation class by default', () => {
      const classes = component.computedClasses();
      expect(classes['po-skeleton-animation-shimmer']).toBeTruthy();
    });

    it('should return rectangle variant class when variant is rectangle', () => {
      fixture.componentRef.setInput('p-variant', 'rectangle');
      fixture.detectChanges();
      const classes = component.computedClasses();
      expect(classes['po-skeleton-rectangle']).toBeTruthy();
    });

    it('should return square variant class when variant is square', () => {
      fixture.componentRef.setInput('p-variant', 'square');
      fixture.detectChanges();
      const classes = component.computedClasses();
      expect(classes['po-skeleton-square']).toBeTruthy();
    });

    it('should return circle variant class when variant is circle', () => {
      fixture.componentRef.setInput('p-variant', 'circle');
      fixture.detectChanges();
      const classes = component.computedClasses();
      expect(classes['po-skeleton-circle']).toBeTruthy();
    });

    it('should return pulse animation class when animation is pulse', () => {
      fixture.componentRef.setInput('p-animation', 'pulse');
      fixture.detectChanges();
      const classes = component.computedClasses();
      expect(classes['po-skeleton-animation-pulse']).toBeTruthy();
    });

    it('should return none animation class when animation is none', () => {
      fixture.componentRef.setInput('p-animation', 'none');
      fixture.detectChanges();
      const classes = component.computedClasses();
      expect(classes['po-skeleton-animation-none']).toBeTruthy();
    });

    it('should return normal type class by default', () => {
      const classes = component.computedClasses();
      expect(classes['po-skeleton-type-normal']).toBeTruthy();
    });

    it('should return primary type class when type is primary', () => {
      fixture.componentRef.setInput('p-type', 'primary');
      fixture.detectChanges();
      const classes = component.computedClasses();
      expect(classes['po-skeleton-type-primary']).toBeTruthy();
    });

    it('should return content type class when type is content', () => {
      fixture.componentRef.setInput('p-type', 'content');
      fixture.detectChanges();
      const classes = component.computedClasses();
      expect(classes['po-skeleton-type-content']).toBeTruthy();
    });
  });
});
