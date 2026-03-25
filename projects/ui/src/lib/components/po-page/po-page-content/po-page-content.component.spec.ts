import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoPageContentComponent } from './po-page-content.component';

describe('PoPageContentComponent:', () => {
  let component: PoPageContentComponent;
  let fixture: ComponentFixture<PoPageContentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoPageContentComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoPageContentComponent).toBeTruthy();
  });
});
