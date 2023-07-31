import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTableListManagerComponent } from './po-table-list-manager.component';
import { PoCheckboxGroupModule } from '../../po-field/po-checkbox-group/po-checkbox-group.module';
import { PoFieldContainerModule } from '../../po-field/po-field-container/po-field-container.module';
import { PoPopoverModule } from '../../po-popover/po-popover.module';
import { PoTableModule } from '../po-table.module';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('PoTableListManagerComponent:', () => {
  let component: PoTableListManagerComponent;
  let fixture: ComponentFixture<PoTableListManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [PoCheckboxGroupModule, PoFieldContainerModule, PoPopoverModule, PoTableModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTableListManagerComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);

    component.columnsManager = [{ property: 'column1' }, { property: 'column2' }, { property: 'detail' }];
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

  it(`verifyArrowDisabled: Should return true if it is the up arrow of the first column`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code', fixed: true },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    const arrowDisabled = component.verifyArrowDisabled(
      { property: 'initial', label: 'initial', value: 'initial' },
      'up'
    );

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

  it('should return true when existsDetail is true', () => {
    const option = { value: 'column2' };
    const direction = 'down';
    const result = component.verifyArrowDisabled(option, direction);
    expect(result).toBe(true);
  });

  it('should return false when existsDetail is false', () => {
    component.columnsManager = [{ property: 'column1' }, { property: 'column2' }];

    const option = { value: 'column1' };
    const direction = 'down';
    const result = component.verifyArrowDisabled(option, direction);
    expect(result).toBe(false);
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

  it(`isFixed: should return true if option is fixed`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code', fixed: true },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    const resultIsfixed = component.isFixed({ property: 'id', value: 'id' });

    expect(resultIsfixed).toBeTrue();
  });

  it(`isFixed: should return false if option is not fixed`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Code' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];

    const resultIsfixed = component.isFixed({ property: 'id', value: 'id' });

    expect(resultIsfixed).toBeFalse();
  });

  it(`emitFixed: should emit option with fixed true`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Id', fixed: false },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];
    spyOn(component['changeColumnFixed'], 'emit');

    component.emitFixed({ property: 'id', value: 'id', visible: true });

    expect(component['changeColumnFixed'].emit).toHaveBeenCalledWith({
      property: 'id',
      value: 'id',
      visible: true,
      fixed: true
    });
  });

  it(`emitFixed: should emit option with fixed false`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Id', fixed: true },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' }
    ];
    spyOn(component['changeColumnFixed'], 'emit');

    component.emitFixed({ property: 'id', value: 'id', visible: true });

    expect(component['changeColumnFixed'].emit).toHaveBeenCalledWith({
      property: 'id',
      value: 'id',
      visible: true,
      fixed: false
    });
  });

  it(`clickSwitch: should call checkOption`, () => {
    spyOn(component, 'checkOption');

    component.clickSwitch({ property: 'id', label: 'Id', fixed: true });

    expect(component.checkOption).toHaveBeenCalled();
  });

  it(`checksIfHasFiveFixed: should return true if has more than 5 fixed and item is not fixed`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Id', fixed: true },
      { property: 'initial', label: 'initial', fixed: true },
      { property: 'name', label: 'Name', fixed: true },
      { property: 'city', label: 'City', fixed: true },
      { property: 'lastName', label: 'LastName', fixed: true },
      { property: 'test', label: 'Teste', fixed: false }
    ];

    const result = component.checksIfHasFiveFixed({ property: 'test', label: 'Teste', value: 'test', fixed: false });

    expect(result).toBeTrue();
  });

  it(`checksIfHasFiveFixed: should return true if has less than 5 fixed and item is not fixed`, () => {
    component.columnsManager = [
      { property: 'id', label: 'Id', fixed: true },
      { property: 'initial', label: 'initial', fixed: true },
      { property: 'name', label: 'Name', fixed: true },
      { property: 'city', label: 'City', fixed: true },
      { property: 'lastName', label: 'LastName', fixed: false },
      { property: 'test', label: 'Teste', fixed: false }
    ];

    const result = component.checksIfHasFiveFixed({ property: 'test', label: 'Teste', value: 'test', fixed: false });

    expect(result).toBeFalse();
  });
});
