import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoTreeViewComponent } from './po-tree-view.component';
import { PoTreeViewItem } from './po-tree-view-item/po-tree-view-item.interface';
import { PoTreeViewModule } from './po-tree-view.module';

describe('PoTreeViewComponent:', () => {
  let component: PoTreeViewComponent;
  let fixture: ComponentFixture<PoTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PoTreeViewModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTreeViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewComponent).toBeTruthy();
  });

  describe('Properties: ', () => {

    it('hasItems: should return true if items contains value', () => {
      component.items = [ { label: 'Nivel 01', value: 11 } ];

      expect(component.hasItems).toBe(true);
    });

    it('hasItems: should return false if items is empty or undefined', () => {
      const invalidValues = [ [], undefined ];

      invalidValues.forEach(invalidValue => {
        component.items = invalidValue;

        expect(component.hasItems).toBe(false);
      });
    });
  });

  describe('Methods: ', () => {

    it('ngOnInit: should subscribe receiveEvent and call emitEvent with treeViewItem', () => {
      const expectedValue: PoTreeViewItem = { label: 'Nivel 01', value: 1 };

      const spyReceiveEvent = spyOn(component['treeViewService'], 'receiveEvent').and.returnValue(of(expectedValue));
      const spyEmitEvent = spyOn(component, <any> 'emitEvent');

      component.ngOnInit();

      expect(spyReceiveEvent).toHaveBeenCalled();
      expect(spyEmitEvent).toHaveBeenCalledWith(expectedValue);
    });

  });
});
