import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { InputRequired } from './input-required.decorator';

@Component({
  selector: 'mock-component',
  template: '',
  standalone: false
})
class PoMockComponent implements OnInit {
  @InputRequired() myProperty: any;
  ngOnInit() {
    let a;
  }
}

describe('InputRequired:', () => {
  let fixture: any;
  let component: PoMockComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoMockComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoMockComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call console.warn if `myProperty` is null', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleMessage = 'PoMockComponent: myProperty is required, but was not provided';

    component.ngOnInit();

    expect(console.warn).toHaveBeenCalledWith(consoleMessage);
  });

  it('shouldn`t call console.warn if `myProperty` is defined', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    component.myProperty = 'value';

    component.ngOnInit();

    expect(console.warn).not.toHaveBeenCalled();
  });
});
