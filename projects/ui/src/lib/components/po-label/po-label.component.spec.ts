import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoLabelComponent } from './po-label.component';

describe('PoLinkComponent', () => {
  let component: PoLabelComponent;
  let fixture: ComponentFixture<PoLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoLabelComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const booleanValidTrueValues = [true, 'true', 1, ''];
  const booleanValidFalseValues = [false, 'false', 0];
  const booleanInvalidValues = [undefined, null, 2, 'string'];

  it('should create', () => {
    expect(component instanceof PoLabelComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('should update property `p-disabled` with valid values', () => {
      expectPropertiesValues(component, 'disabled', booleanValidTrueValues, true);
      expectPropertiesValues(component, 'disabled', booleanValidFalseValues, false);
    });

    it('should update property `p-disabled` with `false` when invalid values', () => {
      expectPropertiesValues(component, 'disabled', booleanInvalidValues, false);
    });

    it('should update property `p-field` with valid values', () => {
      expectPropertiesValues(component, 'field', booleanValidTrueValues, true);
      expectPropertiesValues(component, 'field', booleanValidFalseValues, false);
    });

    it('should update property `p-field` with `false` when invalid values', () => {
      expectPropertiesValues(component, 'field', booleanInvalidValues, false);
    });
  });
});
