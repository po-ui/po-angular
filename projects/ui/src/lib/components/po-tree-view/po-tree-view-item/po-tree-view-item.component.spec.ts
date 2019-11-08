import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as UtilsFunctions from '../../../utils/util';

import { PoTreeViewItemComponent } from './po-tree-view-item.component';
import { PoTreeViewItemHeaderComponent } from '../po-tree-view-item-header/po-tree-view-item-header.component';
import { PoTreeViewService } from '../services/po-tree-view.service';

describe('PoTreeviewItemComponent:', () => {
  let component: PoTreeViewItemComponent;
  let fixture: ComponentFixture<PoTreeViewItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      declarations: [ PoTreeViewItemComponent, PoTreeViewItemHeaderComponent ],
      providers: [ PoTreeViewService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTreeViewItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewItemComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('hasSubItems: should return true if has subItems', () => {
      component.subItems = [ { label: 'Nivel 01', value: 11 } ];

      expect(component.hasSubItems).toBe(true);
    });

    it('hasSubItems: should return false if subItems is empty or undefined', () => {
      const invalidValues = [ [], undefined ];

      invalidValues.forEach(invalidValue => {
        component.subItems = invalidValue;

        expect(component.hasSubItems).toBe(false);
      });
    });
  });

  describe('Methods:', () => {

    it('getTreeViewItemObject: should call clearObject and return the object', () => {
      const label = 'Nivel 01';
      const value = 123;

      const expectedValue = { label, value };

      component.label = label;
      component.value = value;
      component.subItems = null;

      const spyClearObject = spyOn(UtilsFunctions, 'clearObject').and.callThrough();

      const treeViewItem = component['getTreeViewItemObject']();

      expect(treeViewItem).toEqual(expectedValue);
      expect(spyClearObject).toHaveBeenCalled();
    });

    it('onClick: should call event.preventDefault, event.stopPropagation and treeViewService.emitEvent with treeViewItemObject', () => {
      const fakeTreeViewItem = { label: 'Label 01', value: 12 };

      const fakeEvent = {
        preventDefault: () => { },
        stopPropagation: () => {}
      };

      const spyPreventDefault = spyOn(fakeEvent, 'preventDefault');
      const spyStopPropagation = spyOn(fakeEvent, 'stopPropagation');
      const spyTreeViewItemObject = spyOn(component, <any> 'getTreeViewItemObject').and.returnValue(fakeTreeViewItem);
      const spyEmitEvent = spyOn(component['treeViewService'], 'emitEvent');

      component.onClick(<any> fakeEvent);

      expect(spyPreventDefault).toHaveBeenCalled();
      expect(spyStopPropagation).toHaveBeenCalled();
      expect(spyTreeViewItemObject).toHaveBeenCalled();
      expect(spyEmitEvent).toHaveBeenCalledWith(fakeTreeViewItem);
    });

  });

  describe('Templates:', () => {

    it('should find .po-tree-view-item-group if has subItems', () => {
      component.label = 'Nivel 01';
      component.subItems = [ { label: 'Nivel 02', value: 12 } ];

      fixture.detectChanges();

      const treeViewItemGroup = fixture.debugElement.nativeElement.querySelector('.po-tree-view-item-group');
      expect(treeViewItemGroup).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-group if hasn`t subItems', () => {
      component.label = 'Nivel 01';
      component.subItems = undefined;

      fixture.detectChanges();

      const treeViewItemGroup = fixture.debugElement.nativeElement.querySelector('.po-tree-view-item-group');
      expect(treeViewItemGroup).toBe(null);
    });
  });
});
