import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTableListManagerComponent } from './po-table-list-manager.component';
import { PoCheckboxGroupModule } from '../../po-field/po-checkbox-group/po-checkbox-group.module';
import { PoFieldContainerModule } from '../../po-field/po-field-container/po-field-container.module';
import { PoPopoverModule } from '../../po-popover/po-popover.module';
import { PoTableModule } from '../po-table.module';
import { configureTestSuite } from '../../../util-test/util-expect.spec';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('PoTableListManagerComponent:', () => {
  let component: PoTableListManagerComponent;
  let fixture: ComponentFixture<PoTableListManagerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [PoCheckboxGroupModule, PoFieldContainerModule, PoPopoverModule, PoTableModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableListManagerComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`verifyArrowDisabled: Should return true if it is the up arrow of the first column`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    const arrowDisabled = component.verifyArrowDisabled({ property: 'id', label: 'Code', value: 'id' }, 'up');

    expect(arrowDisabled).toEqual(true);
  });

  it(`verifyArrowDisabled: Should return true if it is the down arrow of the last column`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    const arrowDisabled = component.verifyArrowDisabled({ property: 'name', label: 'Name', value: 'name' }, 'down');

    expect(arrowDisabled).toEqual(true);
  });

  it(`verifyArrowDisabled: Should return false if not last column down arrow or first column up arrow`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    const arrowDisabled = component.verifyArrowDisabled(
      { property: 'initial', label: 'initial', value: 'initial' },
      'up'
    );

    expect(arrowDisabled).toEqual(false);
  });

  it(`emitChangePosition: should 'emit' if item position is not first and direction is 'up'`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    spyOn(component['changePosition'], 'emit');

    component.emitChangePosition({ property: 'initial', label: 'initial', value: 'initial' }, 'up');

    expect(component['changePosition'].emit).toHaveBeenCalled();
  });

  it(`emitChangePosition: shouldn't 'emit' if item position is first and direction is 'up'`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    spyOn(component['changePosition'], 'emit');
    component.emitChangePosition({ property: 'id', label: 'Code', value: 'id' }, 'up');

    expect(component['changePosition'].emit).not.toHaveBeenCalled();
  });

  it(`emitChangePosition: should 'emit' if item position is not last and direction is 'down'`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    spyOn(component['changePosition'], 'emit');

    component.emitChangePosition({ property: 'initial', label: 'initial', value: 'initial' }, 'down');

    expect(component['changePosition'].emit).toHaveBeenCalled();
  });

  it(`emitChangePosition: shouldn't 'emit' if item position is last and direction is 'down'`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    spyOn(component['changePosition'], 'emit');
    component.emitChangePosition({ property: 'name', label: 'name', value: 'name' }, 'down');

    expect(component['changePosition'].emit).not.toHaveBeenCalled();
  });
});
