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

    it('should have padding.', () => {
      component.noPadding = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-no-padding')).toBeNull();
    });

    it('shouldn`t have padding.', () => {
      component.noPadding = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-no-padding')).toBeTruthy();
    });

    it('should have `500px` height without padding.', () => {
      component.noPadding = true;
      component.height = 500;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-content').style.height).toBe('500px');
      expect(nativeElement.querySelector('.po-container-no-padding')).toBeTruthy();
    });

    it('should have auto height.', () => {
      component.height = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-content').style.height).toBe('auto');
    });

    it('should have title.', () => {
      component.title = 'Title';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-title')).toBeTruthy();
    });

    it('should not have title.', () => {
      component.title = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-container-title')).toBeFalsy();
    });
  });
});
