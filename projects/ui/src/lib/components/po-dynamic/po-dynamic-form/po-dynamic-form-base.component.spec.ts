import { TestBed } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';

describe('PoDynamicFormBaseComponent:', () => {
  let component: PoDynamicFormBaseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleCasePipe]
    });

    component = new PoDynamicFormBaseComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('p-group-from: should set property to `false` if aren`t valid values', () => {
      const invalidValues = [undefined, null, false, 0, 'string'];

      expectPropertiesValues(component, 'groupForm', invalidValues, false);
    });

    it('p-group-from: should update property with `true` if valid values', () => {
      const validValues = ['true', true, ''];

      expectPropertiesValues(component, 'groupForm', validValues, true);
    });
  });
});
