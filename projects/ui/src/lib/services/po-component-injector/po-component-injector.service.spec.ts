import { NgModule, Component } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoComponentInjectorService } from './po-component-injector.service';

@Component({
  template: ` <div class="test-component-class">test component</div> `
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
  let componentRef;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [PoComponentInjectorService]
    });
  });

  it('should create TestComponent', inject(
    [PoComponentInjectorService],
    (poComponentInjectorService: PoComponentInjectorService) => {
      componentRef = poComponentInjectorService.createComponentInApplication(TestComponent);
      expect(document.body.querySelectorAll('.test-component-class').length).toBe(1);

      poComponentInjectorService.destroyComponentInApplication(componentRef);
    }
  ));

  it('should destroy TestComponent', inject(
    [PoComponentInjectorService],
    (poComponentInjectorService: PoComponentInjectorService) => {
      componentRef = poComponentInjectorService.createComponentInApplication(TestComponent);

      poComponentInjectorService.destroyComponentInApplication(componentRef);
      expect(document.body.querySelectorAll('.test-component-class').length).toBe(0);
    }
  ));
});
