import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues } from '../../util-test/util-expect.spec';
import { InputBoolean } from './input-boolean.decorator';

@Component({
  selector: 'mock-component',
  template: ''
})
class PoMockComponent {
  @InputBoolean() myProperty: boolean;
}

describe('InputBoolean:', () => {
  let fixture: any;
  let component: PoMockComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoMockComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMockComponent);
    component = fixture.componentInstance;
  });

  it('should update property with `true` if valid values', () => {
    const validValues = [true, 'true', 1, ''];

    expectPropertiesValues(component, 'myProperty', validValues, true);
  });

  it('should update property with `false` if invalid values', () => {
    const invalidValues = [10, 0.5, 'test', undefined];

    expectPropertiesValues(component, 'myProperty', invalidValues, false);
  });
});
