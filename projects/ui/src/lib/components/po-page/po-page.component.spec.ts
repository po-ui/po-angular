import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoPageComponent } from './po-page.component';

describe('PoPageComponent', () => {
  let component: PoPageComponent;
  let fixture: ComponentFixture<PoPageComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoPageComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
