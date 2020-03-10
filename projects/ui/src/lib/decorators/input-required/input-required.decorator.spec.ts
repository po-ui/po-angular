import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../util-test/util-expect.spec';
import { InputRequired } from './input-required.decorator';

@Component({
  selector: 'mock-component',
  template: ''
})
class PoMockComponent implements OnInit {
  @InputRequired() myProperty: any;
  ngOnInit() {}
}

describe('InputRequired:', () => {
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

  it('should call console.warn if `myProperty` is null', () => {
    spyOn(console, 'warn');
    const consoleMessage = 'PoMockComponent: myProperty is required, but was not provided';

    component.ngOnInit();

    expect(console.warn).toHaveBeenCalledWith(consoleMessage);
  });

  it('shouldn`t call console.warn if `myProperty` is defined', () => {
    spyOn(console, 'warn');
    component.myProperty = 'value';

    component.ngOnInit();

    expect(console.warn).not.toHaveBeenCalled();
  });
});
