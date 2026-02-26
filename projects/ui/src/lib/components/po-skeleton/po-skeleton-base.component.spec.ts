import { PoSkeletonAnimation } from './po-skeleton-animation.enum';
import { PoSkeletonBaseComponent } from './po-skeleton-base.component';
import { PoSkeletonVariant } from './po-skeleton-variant.enum';

describe('PoSkeletonBaseComponent', () => {
  let component: PoSkeletonBaseComponent;

  beforeEach(() => {
    component = new PoSkeletonBaseComponent();
  });

  it('should create an instance', () => {
    expect(component instanceof PoSkeletonBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('p-variant:', () => {
      it('should set variant to text by default', () => {
        expect(component.variant).toBe(PoSkeletonVariant.text);
      });

      it('should set variant to rect when value is rect', () => {
        component.variant = PoSkeletonVariant.rect;
        expect(component.variant).toBe(PoSkeletonVariant.rect);
      });

      it('should set variant to circle when value is circle', () => {
        component.variant = PoSkeletonVariant.circle;
        expect(component.variant).toBe(PoSkeletonVariant.circle);
      });

      it('should set variant to text when value is invalid', () => {
        component.variant = 'invalid' as any;
        expect(component.variant).toBe(PoSkeletonVariant.text);
      });
    });

    describe('p-animation:', () => {
      it('should set animation to shimmer by default', () => {
        expect(component.animation).toBe(PoSkeletonAnimation.shimmer);
      });

      it('should set animation to pulse when value is pulse', () => {
        component.animation = PoSkeletonAnimation.pulse;
        expect(component.animation).toBe(PoSkeletonAnimation.pulse);
      });

      it('should set animation to none when value is none', () => {
        component.animation = PoSkeletonAnimation.none;
        expect(component.animation).toBe(PoSkeletonAnimation.none);
      });

      it('should set animation to shimmer when value is invalid', () => {
        component.animation = 'invalid' as any;
        expect(component.animation).toBe(PoSkeletonAnimation.shimmer);
      });
    });

    describe('p-width:', () => {
      it('should set width to 100% by default', () => {
        expect(component.width).toBe('100%');
      });

      it('should set width to 200px when value is 200px', () => {
        component.width = '200px';
        expect(component.width).toBe('200px');
      });

      it('should set width to 50% when value is 50%', () => {
        component.width = '50%';
        expect(component.width).toBe('50%');
      });

      it('should set width to 100% when value is empty', () => {
        component.width = '';
        expect(component.width).toBe('100%');
      });
    });

    describe('p-height:', () => {
      it('should have height undefined by default', () => {
        expect(component.height).toBeUndefined();
      });

      it('should set height to 100px when value is 100px', () => {
        component.height = '100px';
        expect(component.height).toBe('100px');
      });

      it('should set height to 2em when value is 2em', () => {
        component.height = '2em';
        expect(component.height).toBe('2em');
      });
    });

    describe('p-border-radius:', () => {
      it('should have borderRadius undefined by default', () => {
        expect(component.borderRadius).toBeUndefined();
      });

      it('should set borderRadius to 8px when value is 8px', () => {
        component.borderRadius = '8px';
        expect(component.borderRadius).toBe('8px');
      });

      it('should set borderRadius to 50% when value is 50%', () => {
        component.borderRadius = '50%';
        expect(component.borderRadius).toBe('50%');
      });
    });

    describe('computedStyles:', () => {
      it('should return width 100% by default', () => {
        const styles = component.computedStyles;
        expect(styles['width']).toBe('100%');
      });

      it('should return height 1em for text variant when height is not set', () => {
        component.variant = PoSkeletonVariant.text;
        const styles = component.computedStyles;
        expect(styles['height']).toBe('1em');
      });

      it('should not return default height for rect variant when height is not set', () => {
        component.variant = PoSkeletonVariant.rect;
        const styles = component.computedStyles;
        expect(styles['height']).toBeUndefined();
      });

      it('should return custom height when set', () => {
        component.height = '200px';
        const styles = component.computedStyles;
        expect(styles['height']).toBe('200px');
      });

      it('should return custom border-radius when set', () => {
        component.borderRadius = '10px';
        const styles = component.computedStyles;
        expect(styles['border-radius']).toBe('10px');
      });

      it('should return all custom properties', () => {
        component.width = '300px';
        component.height = '150px';
        component.borderRadius = '12px';
        const styles = component.computedStyles;

        expect(styles['width']).toBe('300px');
        expect(styles['height']).toBe('150px');
        expect(styles['border-radius']).toBe('12px');
      });
    });

    describe('computedClasses:', () => {
      it('should return base skeleton class', () => {
        const classes = component.computedClasses;
        expect(classes['po-skeleton']).toBeTruthy();
      });

      it('should return text variant class by default', () => {
        const classes = component.computedClasses;
        expect(classes['po-skeleton-text']).toBeTruthy();
      });

      it('should return shimmer animation class by default', () => {
        const classes = component.computedClasses;
        expect(classes['po-skeleton-animation-shimmer']).toBeTruthy();
      });

      it('should return rect variant class when variant is rect', () => {
        component.variant = PoSkeletonVariant.rect;
        const classes = component.computedClasses;
        expect(classes['po-skeleton-rect']).toBeTruthy();
      });

      it('should return circle variant class when variant is circle', () => {
        component.variant = PoSkeletonVariant.circle;
        const classes = component.computedClasses;
        expect(classes['po-skeleton-circle']).toBeTruthy();
      });

      it('should return pulse animation class when animation is pulse', () => {
        component.animation = PoSkeletonAnimation.pulse;
        const classes = component.computedClasses;
        expect(classes['po-skeleton-animation-pulse']).toBeTruthy();
      });

      it('should return none animation class when animation is none', () => {
        component.animation = PoSkeletonAnimation.none;
        const classes = component.computedClasses;
        expect(classes['po-skeleton-animation-none']).toBeTruthy();
      });
    });
  });
});
