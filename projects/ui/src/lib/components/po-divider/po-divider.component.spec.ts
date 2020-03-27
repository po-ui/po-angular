import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoDividerBaseComponent } from './po-divider-base.component';
import { PoDividerComponent } from './po-divider.component';

describe('PoDividerComponent:', () => {
  let component: PoDividerComponent;
  let fixture: ComponentFixture<PoDividerComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoDividerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDividerComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoDividerBaseComponent).toBeTruthy();
    expect(component instanceof PoDividerComponent).toBeTruthy();
  });

  describe('Templates:', () => {
    it('should add `po-divider-label` if `label` contains value.', () => {
      component.label = 'PO Divider';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-divider-label')).toBeTruthy();
    });

    it('shouldn`t add `po-divider-label` if `label` doesn`t contain any value.', () => {
      component.label = null;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-divider-label')).toBeFalsy();
    });
  });
});
