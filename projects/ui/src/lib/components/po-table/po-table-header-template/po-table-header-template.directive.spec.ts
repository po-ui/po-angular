import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PoTableHeaderTemplateDirective } from './po-table-header-template.directive';

@Component({
  template: `
    <ng-template p-table-header-template p-property="status" #specific></ng-template>
    <ng-template p-table-header-template #generic></ng-template>
  `,
  standalone: false
})
class TestHostComponent {
  readonly specific = viewChild.required('specific', { read: PoTableHeaderTemplateDirective });
  readonly generic = viewChild.required('generic', { read: PoTableHeaderTemplateDirective });
}

describe('PoTableHeaderTemplateDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, PoTableHeaderTemplateDirective]
    });
  });

  it('should be created with templateRef and the informed target property', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const directive = fixture.componentInstance.specific();

    expect(directive).toBeTruthy();
    expect(directive.templateRef).toBeTruthy();
    expect(directive.targetProperty()).toBe('status');
  });

  it('should have undefined target property when p-property is not informed', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.generic().targetProperty()).toBeUndefined();
  });
});
