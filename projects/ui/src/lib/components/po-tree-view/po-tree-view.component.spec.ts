import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoTreeViewModule } from './po-tree-view.module';
import { PoTreeViewComponent } from './po-tree-view.component';
import { PoTreeViewItem } from './po-tree-view-item/po-tree-view-item.interface';

describe('PoTreeViewComponent:', () => {
  let component: PoTreeViewComponent;
  let fixture: ComponentFixture<PoTreeViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoTreeViewModule]
    }).compileComponents();
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
      component.items = [{ label: 'Nivel 01', value: 11 }];

      expect(component.hasItems).toBe(true);
    });

    it('hasItems: should return false if items is empty or undefined', () => {
      const invalidValues = [[], undefined];

      invalidValues.forEach(invalidValue => {
        component.items = invalidValue;

        expect(component.hasItems).toBe(false);
      });
    });
  });

  describe('Methods: ', () => {
    it('ngOnInit: should subscribe onExpand and call emitExpanded with treeViewItem', () => {
      const expectedValue: PoTreeViewItem = { label: 'Nivel 01', value: 1 };

      const spyReceiveEvent = spyOn(component['treeViewService'], 'onExpand').and.returnValue(of(expectedValue));
      const spyEmitEvent = spyOn(component, <any>'emitExpanded');

      component.ngOnInit();

      expect(spyReceiveEvent).toHaveBeenCalled();
      expect(spyEmitEvent).toHaveBeenCalledWith(expectedValue);
    });

    it('ngOnInit: should subscribe onSelect and call emitSelected with treeViewItem', () => {
      const expectedValue: PoTreeViewItem = { label: 'Nivel 01', value: 1 };

      const spyOnSelect = spyOn(component['treeViewService'], 'onSelect').and.returnValue(of(expectedValue));
      const spyEmitSelected = spyOn(component, <any>'emitSelected');

      component.ngOnInit();

      expect(spyOnSelect).toHaveBeenCalled();
      expect(spyEmitSelected).toHaveBeenCalledWith(expectedValue);
    });

    it('ngOnInit: should subscribe onActivate and emit activated with treeViewItem', () => {
      const expectedValue: PoTreeViewItem = { label: 'Nivel 01', value: 1 };

      spyOn(component['treeViewService'], 'onActivate').and.returnValue(of(expectedValue));
      spyOn(component.activated, 'emit');

      component.ngOnInit();

      expect(component.activated.emit).toHaveBeenCalledWith({ ...expectedValue });
    });

    it('onTreeFocus: should call focusLastOrFirst when target is po-tree-view ul', () => {
      const spyFocus = spyOn(component['keyboardService'], 'focusLastOrFirst');
      const event = { target: { classList: { contains: () => true } } } as any;

      component['onTreeFocus'](event);

      expect(spyFocus).toHaveBeenCalled();
    });

    it('onTreeFocus: should not call focusLastOrFirst when target is not po-tree-view', () => {
      const spyFocus = spyOn(component['keyboardService'], 'focusLastOrFirst');
      const event = { target: { classList: { contains: () => false } } } as any;

      component['onTreeFocus'](event);

      expect(spyFocus).not.toHaveBeenCalled();
    });

    it('onTreeKeydown: should set tabindex to -1 on Tab and restore it', done => {
      const tree = document.createElement('ul');
      tree.setAttribute('tabindex', '0');

      const event = { key: 'Tab', currentTarget: tree } as any;

      component['onTreeKeydown'](event);

      expect(tree.getAttribute('tabindex')).toBe('-1');

      setTimeout(() => {
        expect(tree.getAttribute('tabindex')).toBe('0');
        done();
      }, 10);
    });

    it('onTreeKeydown: should not change tabindex for non-Tab keys', () => {
      const tree = document.createElement('ul');
      tree.setAttribute('tabindex', '0');

      const event = { key: 'ArrowDown', currentTarget: tree } as any;

      component['onTreeKeydown'](event);

      expect(tree.getAttribute('tabindex')).toBe('0');
    });

    it('trackByFunction: should return index param', () => {
      expect(component['trackByFunction'](1)).toBe(1);
    });

    it('ngAfterViewInit: should call keyboardService.setHostElement', () => {
      const spySetHost = spyOn(component['keyboardService'], 'setHostElement');
      component.ngAfterViewInit();
      expect(spySetHost).toHaveBeenCalled();
    });

    it('constructor effect: should update items when inputedItems changes', () => {
      fixture.componentRef.setInput('p-items', [{ label: 'Test', value: 1 }]);
      fixture.detectChanges();
      expect(component.items.length).toBe(1);
    });

    it('constructor effect: should reprocess items when disabled changes', () => {
      fixture.componentRef.setInput('p-items', [{ label: 'Test', value: 1 }]);
      fixture.detectChanges();
      fixture.componentRef.setInput('p-disabled', true);
      fixture.detectChanges();
      expect(component.items[0].disabled).toBe(true);
    });
  });
});
