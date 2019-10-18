import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoFieldModule } from '../../po-field';
import { PoPopoverModule } from '../../po-popover';

import { PoTableColumnManagerComponent } from './po-table-column-manager.component';
import { configureTestSuite } from '../../../util-test/util-expect.spec';
import { PoTableModule } from '../po-table.module';

fdescribe('PoTableColumnManagerComponent:', () => {
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
  });

});
