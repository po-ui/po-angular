import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoMultiselectItemComponent } from './po-multiselect-item.component';

describe('PoMultiselectItemComponent', () => {
  let component: PoMultiselectItemComponent;
  let fixture: ComponentFixture<PoMultiselectItemComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoMultiselectItemComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMultiselectItemComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change', () => {
    component.selected = false;
    spyOn(component.change, 'emit');
    component.itemClicked();
    expect(component.change.emit).toHaveBeenCalledWith(true);
  });

  it('should check input', () => {
    component.selected = true;
    fixture.detectChanges();

    const checked = fixture.debugElement.nativeElement.querySelector(':checked');
    expect(checked).not.toBeNull();
  });
});
