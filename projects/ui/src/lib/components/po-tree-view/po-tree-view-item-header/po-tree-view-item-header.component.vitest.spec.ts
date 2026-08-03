import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { PoTreeViewItemHeaderComponent } from './po-tree-view-item-header.component';

describe('PoTreeViewItemHeaderComponent:', () => {
  let component: PoTreeViewItemHeaderComponent;
  let fixture: ComponentFixture<PoTreeViewItemHeaderComponent>;
  let debugNativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoTreeViewItemHeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTreeViewItemHeaderComponent);
    component = fixture.componentInstance;

    debugNativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewItemHeaderComponent).toBe(true);
  });

  describe('Templates: ', () => {
    it('shouldn`t find .po-tree-view-item-header-button if hasSubItems is false', () => {
      component.item = { label: 'Nivel 02', value: '02', subItems: [] };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button')).toBe(null);
    });

    it('should find .po-tree-view-item-header-button if hasSubItems is true', () => {
      component.item = { label: 'Nivel 02', value: '02', subItems: [{ label: 'Nivel 02', value: '02' }] };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button')).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-header-button-icon-transform if expanded is false', () => {
      component.item = { label: 'Nivel 02', value: '02', expanded: false, subItems: [{ label: 'Nivel 02', value: '02' }] };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button-icon-transform')).toBe(null);
    });

    it('should find .po-tree-view-item-header-button-icon-transform if expanded and hasSubItems are true', () => {
      component.item = { label: 'Nivel 02', value: '02', expanded: true, subItems: [{ label: 'Nivel 02', value: '02' }] };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button-icon-transform')).toBeTruthy();
    });

    it('should find .po-tree-view-item-header-padding if hasSubItems is false', () => {
      component.item = { label: 'Nivel 02', value: '02', subItems: [] };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-padding')).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-header-padding if hasSubItems is true', () => {
      component.item = { label: 'Nivel 02', value: '02', subItems: [{ label: 'Nivel 02', value: '02' }] };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-padding')).toBe(null);
    });

    it('should find .po-tree-view-item-header-checkbox if selectable is true', () => {
      component.selectable = true;
      component.item = { label: 'Nivel 02', value: '02', subItems: [{ label: 'Nivel 02', value: '02' }] };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-checkbox')).toBeTruthy();
      expect(debugNativeElement.querySelector('.po-tree-view-item-header-label')).toBe(null);
    });

    it('shouldn`t find .po-tree-view-item-header-checkbox if selectable is false', () => {
      component.selectable = false;
      component.item = { label: 'Nivel 02', value: '02', subItems: [{ label: 'Nivel 02', value: '02' }] };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-checkbox')).toBe(null);
      expect(debugNativeElement.querySelector('.po-tree-view-item-header-label')).toBeTruthy();
    });
  });
});
