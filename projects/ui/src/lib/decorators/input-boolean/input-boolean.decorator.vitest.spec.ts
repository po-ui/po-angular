import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { InputBoolean } from './input-boolean.decorator';

@Component({
  selector: 'mock-component',
  template: '',
  standalone: false
})
class PoMockComponent {
  @InputBoolean() myProperty: boolean;
}

describe('InputBoolean:', () => {
  let fixture: any;
  let component: PoMockComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoMockComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoMockComponent);
    component = fixture.componentInstance;
  });

  it('should update property with `true` if valid values', () => {
    expectPropertiesValues(component, 'myProperty', true, true);
  });

  it('should update property with `false` if invalid values', () => {
    expectPropertiesValues(component, 'myProperty', false, false);
  });
});
