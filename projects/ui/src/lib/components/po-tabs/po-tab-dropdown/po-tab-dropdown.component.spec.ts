import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoButtonComponent } from '../../po-button';
import { PoPopoverComponent, PoPopoverModule } from '../../po-popover';
import { PoTabDropdownComponent } from './po-tab-dropdown.component';

describe('PoTabDropdownComponent:', () => {
  let component: PoTabDropdownComponent;
  let fixture: ComponentFixture<PoTabDropdownComponent>;
  let nativeElement: any;

  const tabs: Array<any> = [
    { label: 'Tab 1', overflow: true, click: () => {} },
    { label: 'Tab 2', overflow: true, click: () => {} },
    { label: 'Tab 3', overflow: true, click: () => {} },
    { label: 'Tab 4', overflow: true, click: () => {} }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoPopoverModule, RouterTestingModule.withRoutes([])],
      declarations: [PoTabDropdownComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTabDropdownComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    component.tabs = tabs;
    component.button = new PoButtonComponent();
    component.popover = new PoPopoverComponent(null, null);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('closeAndReturnToButtom: should close popover and focus on the button', () => {
      spyOn(component.popover, 'close');
      spyOn(component.button, 'focus');
      component.closeAndReturnToButtom();

      expect(component.popover.close).toHaveBeenCalled();
      expect(component.button.focus).toHaveBeenCalled();
    });
  });
});
