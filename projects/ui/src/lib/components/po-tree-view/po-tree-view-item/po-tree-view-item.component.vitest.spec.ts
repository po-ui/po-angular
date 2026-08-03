import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PoTreeViewItemComponent } from './po-tree-view-item.component';
import { PoTreeViewItemHeaderComponent } from '../po-tree-view-item-header/po-tree-view-item-header.component';
import { PoTreeViewService } from '../services/po-tree-view.service';

describe('PoTreeviewItemComponent:', () => {
  let component: PoTreeViewItemComponent;
  let fixture: ComponentFixture<PoTreeViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [PoTreeViewItemComponent, PoTreeViewItemHeaderComponent],
      providers: [PoTreeViewService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTreeViewItemComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewItemComponent).toBe(true);
  });

  describe('Properties:', () => {
    it('hasSubItems: should return true if has subItems', () => {
      component.item = {
        label: 'Nivel 0',
        value: '220',
        subItems: [{ label: 'Nivel 01', value: 11 }]
      };

      expect(component.hasSubItems).toBe(true);
    });

    it('hasSubItems: should return false if subItems is undefined', () => {
      component.item = {
        label: 'Nivel 0',
        value: '220',
        subItems: undefined
      };

      expect(component.hasSubItems).toBe(false);
    });
  });

  describe('Methods:', () => {
    it('onClick: should call event.preventDefault, event.stopPropagation and treeViewService.emitExpandedEvent with item', () => {
      component.item = { label: 'Label 01', value: 12 };

      const fakeEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      };

      const spyEmitEvent = vi.spyOn(component['treeViewService'], 'emitExpandedEvent');

      component.onClick(fakeEvent as any);

      expect(component.item.expanded).toBe(true);
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(spyEmitEvent).toHaveBeenCalledWith(component.item);
    });

    it('onSelect: should call treeViewService.emitSelectedEvent with item', () => {
      component.item = { label: 'Label 01', value: 12 };

      const spyEmitEvent = vi.spyOn(component['treeViewService'], 'emitSelectedEvent');

      component.onSelect(component.item);

      expect(spyEmitEvent).toHaveBeenCalledWith(component.item);
    });
  });

  describe('Templates:', () => {
    it('should find .po-tree-view-item-group if has subItems', () => {
      component.item = {
        label: 'Nivel 01',
        subItems: [{ label: 'Nivel 02', value: 12 }],
        value: '110'
      };

      fixture.detectChanges();

      const treeViewItemGroup = fixture.debugElement.nativeElement.querySelector('.po-tree-view-item-group');
      expect(treeViewItemGroup).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-group if hasn`t subItems', () => {
      component.item = {
        label: 'Nivel 01',
        value: '1',
        subItems: undefined
      };

      fixture.detectChanges();

      const treeViewItemGroup = fixture.debugElement.nativeElement.querySelector('.po-tree-view-item-group');
      expect(treeViewItemGroup).toBe(null);
    });

    it('trackByFunction: should return index param', () => {
      expect(component.trackByFunction(1)).toBe(1);
    });
  });
});
