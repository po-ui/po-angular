import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoContainerComponent } from './po-container.component';

describe('PoContainerComponent:', () => {
  let component: PoContainerComponent;
  let fixture: ComponentFixture<PoContainerComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoContainerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Templates:', () => {
    it('shouldn`t have `.po-container-no-border` if `noBorder` is `true`.', () => {
      component.noBorder = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-no-border')).toBeTruthy();
    });

    it('should have `.po-container-no-border` if `noBorder` is `false`.', () => {
      component.noBorder = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-no-border')).toBeFalsy();
    });

    it('should have shadow and padding.', () => {
      component.noShadow = false;
      component.noPadding = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-no-shadow')).toBeNull();
      expect(nativeElement.querySelector('.po-container-no-padding')).toBeNull();
    });

    it('shouldn`t have shadow and padding.', () => {
      component.noShadow = true;
      component.noPadding = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-no-shadow')).toBeTruthy();
      expect(nativeElement.querySelector('.po-container-no-padding')).toBeTruthy();
    });

    it('should have `500px` height without padding.', () => {
      component.noPadding = true;
      component.height = 500;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container').style.height).toBe('500px');
      expect(nativeElement.querySelector('.po-container-no-padding')).toBeTruthy();
    });

    it('should have auto height.', () => {
      component.height = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container').style.height).toBe('auto');
    });
  });
});
