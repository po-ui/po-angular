import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoIconModule } from '../po-icon/po-icon.module';
import { PoTooltipModule } from '../../directives';

import { PoContextMenuBaseComponent } from './po-context-menu-base.component';
import { PoContextMenuComponent } from './po-context-menu.component';
import { PoContextMenuItem } from './po-context-menu-item.interface';

describe('PoContextMenuComponent:', () => {
  let component: PoContextMenuComponent;
  let fixture: ComponentFixture<PoContextMenuComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoIconModule, PoTooltipModule],
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
      expect(component.expanded()).toBe(true);
    });

    it('should have _items as empty array by default', () => {
      expect(component['_items']()).toEqual([]);
    });

    it('should have contextTitle as empty string by default', () => {
      expect(component.contextTitle()).toBe('');
    });

    it('should have title as empty string by default', () => {
      expect(component.title()).toBe('');
    });

    it('should have items as empty array by default', () => {
      expect(component.items()).toEqual([]);
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
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        const targetItem = items[1];
        component.selectItem(targetItem);

        const updatedItems = component['_items']();
        expect(updatedItems[0].selected).toBe(false);
        expect(updatedItems[1].selected).toBe(true);
        expect(updatedItems[2].selected).toBe(false);
      });

      it('should call the action of the selected item', () => {
        const actionSpy = jasmine.createSpy('action');
        const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: actionSpy }];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        component.selectItem(items[0]);
        expect(actionSpy).toHaveBeenCalledWith(items[0]);
      });

      it('should not call action when action is undefined', () => {
        const items: Array<PoContextMenuItem> = [{ label: 'Item 1' }];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        expect(() => component.selectItem(items[0])).not.toThrow();
      });

      it('should emit itemSelected event when an item is selected', () => {
        const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: () => {} }];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        spyOn(component.itemSelected, 'emit');
        component.selectItem(items[0]);

        expect(component.itemSelected.emit).toHaveBeenCalledWith(items[0]);
      });

      it('should select item by label comparison, not by reference', () => {
        const items: Array<PoContextMenuItem> = [
          { label: 'Item 1', action: () => {} },
          { label: 'Item 2', action: () => {} }
        ];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        // Cria um novo objeto com o mesmo label (referencia diferente)
        const itemCopy = { label: 'Item 2', action: () => {} };
        component.selectItem(itemCopy);

        const updatedItems = component['_items']();
        expect(updatedItems[0].selected).toBe(false);
        expect(updatedItems[1].selected).toBe(true);
      });
    });

    describe('sanitizeSelection (via effect):', () => {
      it('should keep only the first selected item when multiple are selected', () => {
        const items: Array<PoContextMenuItem> = [
          { label: 'Item 1', action: () => {}, selected: true },
          { label: 'Item 2', action: () => {}, selected: true },
          { label: 'Item 3', action: () => {}, selected: true }
        ];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        const updatedItems = component['_items']();
        expect(updatedItems[0].selected).toBe(true);
        expect(updatedItems[1].selected).toBe(false);
        expect(updatedItems[2].selected).toBe(false);
      });

      it('should not modify items when only one is selected', () => {
        const items: Array<PoContextMenuItem> = [
          { label: 'Item 1', action: () => {} },
          { label: 'Item 2', action: () => {}, selected: true },
          { label: 'Item 3', action: () => {} }
        ];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        const updatedItems = component['_items']();
        expect(updatedItems[0].selected).toBeFalsy();
        expect(updatedItems[1].selected).toBe(true);
        expect(updatedItems[2].selected).toBeFalsy();
      });

      it('should not modify items when none is selected', () => {
        const items: Array<PoContextMenuItem> = [
          { label: 'Item 1', action: () => {} },
          { label: 'Item 2', action: () => {} }
        ];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        const updatedItems = component['_items']();
        expect(updatedItems[0].selected).toBeFalsy();
        expect(updatedItems[1].selected).toBeFalsy();
      });

      it('should sync _items with items input when items change', () => {
        const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: () => {} }];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        expect(component['_items']().length).toBe(1);
        expect(component['_items']()[0].label).toBe('Item 1');
      });
    });

    describe('handlerTooltip:', () => {
      it('should not set tooltip if item already has tooltip', () => {
        const item = { label: 'Item 1', tooltip: 'existing tooltip' };
        const li = document.createElement('li');
        const span = document.createElement('span');
        li.appendChild(span);

        component['handlerTooltip'](item as any, li);
        expect(item.tooltip).toBe('existing tooltip');
      });

      it('should set tooltip when label text overflows', () => {
        const items = [{ label: 'Long text that overflows' }, { label: 'Short text' }];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        const item = component['_items']()[0];
        const li = document.createElement('li');
        const span = document.createElement('span');
        li.appendChild(span);

        Object.defineProperty(span, 'scrollHeight', { value: 40, configurable: true });
        Object.defineProperty(span, 'offsetHeight', { value: 20, configurable: true });

        component['handlerTooltip'](item as any, li);

        const updatedItem = component['_items']().find(i => i.label === 'Long text that overflows');
        expect(updatedItem?.tooltip).toBe('Long text that overflows');
      });

      it('should not set tooltip when label text does not overflow', () => {
        const items = [{ label: 'Short text' }];
        fixture.componentRef.setInput('p-items', items);
        fixture.detectChanges();

        const item = component['_items']()[0];
        const li = document.createElement('li');
        const span = document.createElement('span');
        li.appendChild(span);

        Object.defineProperty(span, 'scrollHeight', { value: 20, configurable: true });
        Object.defineProperty(span, 'offsetHeight', { value: 20, configurable: true });

        component['handlerTooltip'](item as any, li);

        const updatedItem = component['_items']().find(i => i.label === 'Short text');
        expect(updatedItem?.tooltip).toBeUndefined();
      });
    });
  });

  describe('Templates:', () => {
    it('should show context title when expanded and contextTitle has value', () => {
      fixture.componentRef.setInput('p-context-title', 'Jornada');
      component.expanded.set(true);
      fixture.detectChanges();

      const contextTitleEl = nativeElement.querySelector('.po-context-menu-context-title');
      expect(contextTitleEl).toBeTruthy();
      expect(contextTitleEl.textContent.trim()).toBe('Jornada');
    });

    it('should not show context title when contextTitle is empty', () => {
      fixture.componentRef.setInput('p-context-title', '');
      component.expanded.set(true);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-context-title')).toBeFalsy();
    });

    it('should show title when expanded and title has value', () => {
      fixture.componentRef.setInput('p-title', 'Prestador de compra');
      component.expanded.set(true);
      fixture.detectChanges();

      const titleEl = nativeElement.querySelector('.po-context-menu-title');
      expect(titleEl).toBeTruthy();
      expect(titleEl.textContent.trim()).toBe('Prestador de compra');
    });

    it('should not show title when title is empty', () => {
      fixture.componentRef.setInput('p-title', '');
      component.expanded.set(true);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-title')).toBeFalsy();
    });

    it('should not show header-content when collapsed', () => {
      component.expanded.set(false);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-header-content')).toBeFalsy();
    });

    it('should add po-context-menu-collapsed class when not expanded', () => {
      component.expanded.set(false);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-collapsed')).toBeTruthy();
    });

    it('should not have po-context-menu-collapsed class when expanded', () => {
      component.expanded.set(true);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-collapsed')).toBeFalsy();
    });

    it('should render items when expanded', () => {
      const items: Array<PoContextMenuItem> = [
        { label: 'Item 1', action: () => {} },
        { label: 'Item 2', action: () => {} }
      ];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      const listItems = nativeElement.querySelectorAll('.po-context-menu-list-item');
      expect(listItems.length).toBe(2);
    });

    it('should not render items when collapsed', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: () => {} }];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(false);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-list-item')).toBeFalsy();
    });

    it('should not render nav element when collapsed', () => {
      component.expanded.set(false);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-context-menu-body')).toBeFalsy();
    });

    it('should add po-context-menu-item-selected class on selected item', () => {
      const items: Array<PoContextMenuItem> = [
        { label: 'Item 1', action: () => {}, selected: true },
        { label: 'Item 2', action: () => {} }
      ];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      const selectedItems = nativeElement.querySelectorAll('.po-context-menu-item-selected');
      expect(selectedItems.length).toBe(1);
    });

    it('should display correct label text for each item', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Alpha' }, { label: 'Beta' }];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      const labels = nativeElement.querySelectorAll('.po-context-menu-item-label');
      expect(labels[0].textContent.trim()).toBe('Alpha');
      expect(labels[1].textContent.trim()).toBe('Beta');
    });

    it('should call selectItem when item is clicked', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: () => {} }];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      spyOn(component, 'selectItem');
      const listItem: HTMLElement = nativeElement.querySelector('.po-context-menu-list-item');
      listItem.click();

      expect(component.selectItem).toHaveBeenCalled();
    });

    it('should call selectItem on keydown.enter', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: () => {} }];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      spyOn(component, 'selectItem');
      const listItem: HTMLElement = nativeElement.querySelector('.po-context-menu-list-item');
      listItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(component.selectItem).toHaveBeenCalled();
    });

    it('should call selectItem on keydown.space', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Item 1', action: () => {} }];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      spyOn(component, 'selectItem');
      const listItem: HTMLElement = nativeElement.querySelector('.po-context-menu-list-item');
      listItem.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(component.selectItem).toHaveBeenCalled();
    });

    it('should call toggleExpand when toggle button is clicked', () => {
      component.expanded.set(true);
      fixture.detectChanges();

      spyOn(component, 'toggleExpand');
      const toggleBtn: HTMLElement = nativeElement.querySelector('.po-context-menu-toggle');
      toggleBtn.click();

      expect(component.toggleExpand).toHaveBeenCalled();
    });

    it('should show aria-label "Recolher menu" when expanded', () => {
      component.expanded.set(true);
      fixture.detectChanges();

      const toggleBtn = nativeElement.querySelector('.po-context-menu-toggle');
      expect(toggleBtn.getAttribute('aria-label')).toBe('Recolher menu');
    });

    it('should show aria-label "Expandir menu" when collapsed', () => {
      component.expanded.set(false);
      fixture.detectChanges();

      const toggleBtn = nativeElement.querySelector('.po-context-menu-toggle');
      expect(toggleBtn.getAttribute('aria-label')).toBe('Expandir menu');
    });

    it('should have role="menu" on the list element', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Item 1' }];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      const ul = nativeElement.querySelector('.po-context-menu-list');
      expect(ul.getAttribute('role')).toBe('menu');
    });

    it('should have role="menuitem" on list items', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Item 1' }];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      const li = nativeElement.querySelector('.po-context-menu-list-item');
      expect(li.getAttribute('role')).toBe('menuitem');
    });

    it('should have tabindex="0" on list items', () => {
      const items: Array<PoContextMenuItem> = [{ label: 'Item 1' }];
      fixture.componentRef.setInput('p-items', items);
      component.expanded.set(true);
      fixture.detectChanges();

      const li = nativeElement.querySelector('.po-context-menu-list-item');
      expect(li.getAttribute('tabindex')).toBe('0');
    });
  });
});
