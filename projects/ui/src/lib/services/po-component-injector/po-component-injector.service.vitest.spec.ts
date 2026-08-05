import { NgModule, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { PoComponentInjectorService } from './po-component-injector.service';

@Component({
  template: ` <div class="test-component-class">test component</div> `,
  standalone: false
})
class TestComponent {
  constructor(poComponentInjectorService: PoComponentInjectorService) {}
}

@NgModule({
  imports: [CommonModule],
  declarations: [TestComponent],
  providers: [PoComponentInjectorService]
})
class TestModule {}

describe('PoComponentInjectorService ', () => {
  let componentRef: any;
  let poComponentInjectorService: PoComponentInjectorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [PoComponentInjectorService]
    }).compileComponents();

    poComponentInjectorService = TestBed.inject(PoComponentInjectorService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create TestComponent', () => {
    componentRef = poComponentInjectorService.createComponentInApplication(TestComponent);
    expect(document.body.querySelectorAll('.test-component-class').length).toBe(1);

    poComponentInjectorService.destroyComponentInApplication(componentRef);
  });

  it('should destroy TestComponent', () => {
    componentRef = poComponentInjectorService.createComponentInApplication(TestComponent);

    poComponentInjectorService.destroyComponentInApplication(componentRef);
    expect(document.body.querySelectorAll('.test-component-class').length).toBe(0);
  });
});
