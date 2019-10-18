import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as utilsFunctions from '../../../utils/util';
import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoFieldModule } from '../../po-field';
import { PoPopoverModule } from '../../po-popover';

import { PoTableColumnManagerComponent } from './po-table-column-manager.component';
import { PoTableModule } from '../po-table.module';

describe('PoTableColumnManagerComponent:', () => {
  let component: PoTableColumnManagerComponent;
  let fixture: ComponentFixture<PoTableColumnManagerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [ PoPopoverModule, PoFieldModule, PoTableModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableColumnManagerComponent);
    component = fixture.componentInstance;

    component.columns = [
      { property: 'id', label: 'Code', type: 'number' },
      { property: 'initial', label: 'initial' },
      { property: 'name', label: 'Name' },
      { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
      { property: 'atualization', label: 'Atualization', type: 'date' }
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {

    it('ngOnInit: should call `updateColumnsOptions` with `columns`', () => {
      component.columns = [
        { property: 'id', label: 'Code', type: 'number' },
        { property: 'initial', label: 'initial' },
        { property: 'name', label: 'Name' },
        { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
        { property: 'atualization', label: 'Atualization', type: 'date' }
      ];

      spyOn(component, <any>'updateColumnsOptions');

      expect(component['updateColumnsOptions']).toHaveBeenCalledWith(component.columns);
    });

    it(`ngOnChanges: should set 'defaultColumns' with 'columns.currentValue' if 'columns', 'columns.firstChange'
      and 'columns.currentValue' is defined`, () => {
      component['defaultColumns'] = undefined;

      const columns = {
        firstChange: true,
        currentValue: 'current value'
      };

      component.ngOnChanges(<any>columns);

      expect(component['defaultColumns']).toBe(<any>columns.currentValue);
    });

    it(`getColumnTitleLabel: should return true if have 'column.label'.`, () => {
      const fakeColumn = { property: 'name', label: 'Name' };

      expect(component['getColumnTitleLabel'](<any>fakeColumn)).toBeTruthy();
    });

    it(`getColumnTitleLabel: should return true if 'capitalizeFirstLetter' is true.`, () => {
      const fakeColumn = { property: 'name' };

      spyOn(utilsFunctions, <any>'capitalizeFirstLetter').and.returnValue(true);

      expect(component['getColumnTitleLabel'](fakeColumn)).toBeTruthy();
    });

    it(`getColumnTitleLabel: should return fase if not have 'column.label' and 'capitalizeFirstLetter' is false.`, () => {
      const fakeColumn = { property: 'name' };

      spyOn(utilsFunctions, <any>'capitalizeFirstLetter').and.returnValue(false);

      expect(component['getColumnTitleLabel'](fakeColumn)).toBeFalsy();
    });

  });

});
