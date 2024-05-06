import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDynamicContainerComponent } from './po-dynamic-container.component';

describe('PoDynamicContainerComponent', () => {
  let component: PoDynamicContainerComponent;
  let fixture: ComponentFixture<PoDynamicContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoDynamicContainerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDynamicContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set content input', () => {
    const template: TemplateRef<any> = {} as TemplateRef<any>;

    component.content = template;

    expect(component.content).toBe(template);
  });

  it('should set fields input', () => {
    const fields = ['field1', 'field2'];

    component.fields = fields;

    expect(component.fields).toBe(fields);
  });
});
