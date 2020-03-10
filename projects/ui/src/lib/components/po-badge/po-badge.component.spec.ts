import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../util-test/util-expect.spec';

import { PoBadgeBaseComponent } from './po-badge-base.component';
import { PoBadgeComponent } from './po-badge.component';

describe('PoBadgeComponent:', () => {
  let component: PoBadgeComponent;
  let fixture: ComponentFixture<PoBadgeComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoBadgeComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof PoBadgeBaseComponent).toBeTruthy();
    expect(component instanceof PoBadgeComponent).toBeTruthy();
  });

  describe('Templates:', () => {
    const badgeColorDefaultSelector = '.po-badge.po-color-07';
    const badgeValueSelector = '.po-badge-value';

    it('should create `po-badge` with value `55` if `value` is `55`', () => {
      const result = '55';
      component.value = 55;

      fixture.detectChanges();

      const badgeValue = fixture.nativeElement.querySelector(badgeValueSelector);

      expect(badgeValue.innerHTML).toBe(result);
    });

    it('should create `po-badge` with value `0` if `value` is `0`', () => {
      const result = '0';
      component.value = 0;

      fixture.detectChanges();

      const badgeValue = fixture.nativeElement.querySelector(badgeValueSelector);

      expect(badgeValue.innerHTML).toBe(result);
    });

    it('should create `po-badge` with value `99+` if `value` is greater than 99', () => {
      const result = '99+';
      component.value = 101;

      fixture.detectChanges();

      const badgeValue = fixture.nativeElement.querySelector(badgeValueSelector);

      expect(badgeValue.innerHTML).toBe(result);
    });

    it('should create `po-badge` with value `99` if `value` is `99`', () => {
      const result = '99';
      component.value = 99;

      fixture.detectChanges();

      const badgeValue = fixture.nativeElement.querySelector(badgeValueSelector);

      expect(badgeValue.innerHTML).toBe(result);
    });

    it('should create `po-badge` with `po-color-07` if `color` is `undefined`', () => {
      component.value = 10;
      component.color = undefined;

      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector(badgeColorDefaultSelector);

      expect(badge).toBeTruthy();
    });

    it('should create `po-badge` with `po-color-07` if `color` is `invalid`', () => {
      component.value = 10;
      component.color = 'color-33';

      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector(badgeColorDefaultSelector);

      expect(badge).toBeTruthy();
    });

    it('should create `po-badge` with `po-color-03` if `color` is `color-03`', () => {
      component.value = 10;
      component.color = 'color-03';

      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.po-badge.po-color-03');

      expect(badge).toBeTruthy();
    });
  });
});
