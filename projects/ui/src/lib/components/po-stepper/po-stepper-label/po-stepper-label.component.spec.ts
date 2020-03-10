import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoStepperLabelComponent } from './po-stepper-label.component';
import { PoStepperModule } from '../po-stepper.module';

describe('PoStepperLabelComponent: ', () => {
  let component: PoStepperLabelComponent;
  let fixture: ComponentFixture<PoStepperLabelComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoStepperModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoStepperLabelComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoStepperLabelComponent).toBeTruthy();
  });
});
