import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { configureTestSuite, expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoLoadingIconComponent } from './po-loading-icon.component';
import { PoLoadingModule } from '../po-loading.module';

describe('PoLoadingOverlayComponent', () => {
  let component: PoLoadingIconComponent;
  let fixture: ComponentFixture<PoLoadingIconComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoLoadingModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLoadingIconComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoLoadingIconComponent).toBeTruthy();
  });

  describe('Properties', () => {
    it('p-neutral-color: should update property with valid values', () => {
      const validValuesTrue = [true, 'true', 1, ''];
      const validValuesFalse = [false, 'false', 0];

      expectPropertiesValues(component, 'neutralColor', validValuesTrue, true);
      expectPropertiesValues(component, 'neutralColor', validValuesFalse, false);
    });

    it('p-neutral-color: should update property with false if it receives an invalid values', () => {
      const invalidValues = [null, undefined, NaN, 'teste'];

      expectPropertiesValues(component, 'neutralColor', invalidValues, false);
    });
  });

  describe('Templates', () => {
    it('should count the amount of `po-loading-icon-bar` elements', () => {
      const iconBars = fixture.debugElement.queryAll(By.css('.po-loading-icon-bar'));

      expect(iconBars.length).toBe(8);
    });
  });
});
