import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoIconModule } from '../po-icon/po-icon.module';

import { PoContextMenuBaseComponent } from './po-context-menu-base.component';
import { PoContextMenuComponent } from './po-context-menu.component';
import { PoContextMenuItem } from './po-context-menu-item.interface';

describe('PoContextMenuComponent:', () => {
  let component: PoContextMenuComponent;
  let fixture: ComponentFixture<PoContextMenuComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoIconModule],
      declarations: [PoContextMenuComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoContextMenuComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoContextMenuBaseComponent).toBeTruthy();
    expect(component instanceof PoContextMenuComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('should have expanded as true by default', () => {
      component.ngOnInit();
      expect(component.expanded()).toBe(true);
    });
  });

  describe('Methods:', () => {
    describe('toggleExpand:', () => {
      it('should toggle expanded from true to false', () => {
        component.expanded.set(true);
        component.toggleExpand();
        expect(component.expanded()).toBe(false);
      });

      it('should toggle expanded from false to true', () => {
        component.expanded.set(false);
        component.toggleExpand();
        expect(component.expanded()).toBe(true);
      });
    });

    describe('selectItem:', () => {
      it('should set the clicked item as selected and deselect others', () => {
        const items: Array<PoContextMenuItem> = [
          { label: 'Item 1', action: () => {}, selected: true },
          { label: 'Item 2', action: () => {} },
          { label: 'Item 3', action: () => {} }
        ];
        component.items.set(items);

        const targetItem = items[1];
        component.selectItem(targetItem);

        const updatedItems = component.items();
        expect(updatedItems[0].selected).toBe(false);
        expect(updatedItems[1].selected).toBe(true);
        expect(updatedItems[2].selected).toBe(false);
      });

      it('should call the action of the selected item', () => {
        const actionSpy = jasmine.createSpy('action');
        const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: actionSpy }];
        component.items.set(items);

        component.selectItem(items[0]);
        expect(actionSpy).toHaveBeenCalledWith(items[0]);
      });
    });

    describe('sanitizeSelection (via effect):', () => {
      it('should keep only the first selected item when multiple are selected', fakeAsync(() => {
        const items: Array<PoContextMenuItem> = [
          { label: 'Item 1', action: () => {}, selected: true },
          { label: 'Item 2', action: () => {}, selected: true },
          { label: 'Item 3', action: () => {}, selected: true }
        ];
        component.items.set(items);
        TestBed.flushEffects();

        const updatedItems = component.items();
        expect(updatedItems[0].selected).toBe(true);
        expect(updatedItems[1].selected).toBe(false);
        expect(updatedItems[2].selected).toBe(false);
      }));

      it('should not modify items when only one is selected', fakeAsync(() => {
        const items: Array<PoContextMenuItem> = [
          { label: 'Item 1', action: () => {} },
          { label: 'Item 2', action: () => {}, selected: true },
          { label: 'Item 3', action: () => {} }
        ];
        component.items.set(items);
        TestBed.flushEffects();

        const updatedItems = component.items();
        expect(updatedItems[0].selected).toBeFalsy();
        expect(updatedItems[1].selected).toBe(true);
        expect(updatedItems[2].selected).toBeFalsy();
      }));
    });
  });

  describe('Templates:', () => {
    it('should show context title when expanded and contextTitle has value', () => {
      fixture.componentRef.setInput('p-context-title', 'Jornada');
      component.expanded.set(true);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-context-title')).toBeTruthy();
      expect(nativeElement.querySelector('.po-context-menu-context-title').textContent.trim()).toBe('Jornada');
    });

    it('should show title when expanded and title has value', () => {
      fixture.componentRef.setInput('p-title', 'Prestador de compra');
      component.expanded.set(true);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-title')).toBeTruthy();
      expect(nativeElement.querySelector('.po-context-menu-title').textContent.trim()).toBe('Prestador de compra');
    });

    it('should add po-context-menu-collapsed class when not expanded', () => {
      component.expanded.set(false);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-collapsed')).toBeTruthy();
    });

    it('should render items when expanded', () => {
      const items: Array<PoContextMenuItem> = [
        { label: 'Item 1', action: () => {} },
        { label: 'Item 2', action: () => {} }
      ];
      component.items.set(items);
      component.expanded.set(true);
      fixture.detectChanges();

      const listItems = nativeElement.querySelectorAll('.po-context-menu-list-item');
      expect(listItems.length).toBe(2);
    });

    it('should not render items when collapsed', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: () => {} }];
      component.items.set(items);
      component.expanded.set(false);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-list-item')).toBeFalsy();
    });

    it('should add po-context-menu-item-selected class on selected item', () => {
      const items: Array<PoContextMenuItem> = [
        { label: 'Item 1', action: () => {}, selected: true },
        { label: 'Item 2', action: () => {} }
      ];
      component.items.set(items);
      component.expanded.set(true);
      fixture.detectChanges();

      const selectedItems = nativeElement.querySelectorAll('.po-context-menu-item-selected');
      expect(selectedItems.length).toBe(1);
    });
  });
});
