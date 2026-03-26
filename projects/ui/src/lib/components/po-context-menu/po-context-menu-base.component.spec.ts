import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PoContextMenuBaseComponent } from './po-context-menu-base.component';
import { PoContextMenuItem } from './po-context-menu-item.interface';

@Component({
  template: '',
  standalone: true
})
class PoContextMenuTestComponent extends PoContextMenuBaseComponent {}

describe('PoContextMenuBaseComponent:', () => {
  let component: PoContextMenuTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoContextMenuTestComponent]
    }).compileComponents();

    component = TestBed.runInInjectionContext(() => new PoContextMenuTestComponent());
  });

  it('should be created', () => {
    expect(component instanceof PoContextMenuBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('contextTitle: should have default value as empty string', () => {
      expect(component.contextTitle()).toBe('');
    });

    it('title: should have default value as empty string', () => {
      expect(component.title()).toBe('');
    });

    it('items: should have default value as empty array', () => {
      expect(component.items()).toEqual([]);
    });

    it('expanded: should have default value as true', () => {
      expect(component.expanded()).toBe(true);
    });

    it('expanded: should allow setting value to false', () => {
      component.expanded.set(false);
      expect(component.expanded()).toBe(false);
    });

    it('expanded: should allow setting value back to true', () => {
      component.expanded.set(false);
      component.expanded.set(true);
      expect(component.expanded()).toBe(true);
    });

    it('itemSelected: should be defined', () => {
      expect(component.itemSelected).toBeTruthy();
    });

    it('itemSelected: should emit value', () => {
      const item: PoContextMenuItem = { label: 'Item 1', action: () => {} };

      spyOn(component.itemSelected, 'emit');
      component.itemSelected.emit(item);

      expect(component.itemSelected.emit).toHaveBeenCalledWith(item);
    });
  });
});
