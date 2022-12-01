import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoFieldContainerBottomComponent } from './po-field-container-bottom.component';

describe('PoFieldContainerBottomComponent', () => {
  let component: PoFieldContainerBottomComponent;
  let fixture: ComponentFixture<PoFieldContainerBottomComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoFieldContainerBottomComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show error pattern if no error pattern', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.po-field-container-bottom-text-error')).toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('.po-field-container-icon-error')).toBeNull();
  });
});
