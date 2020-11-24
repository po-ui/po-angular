import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PoFieldModule } from '../../po-field/po-field.module';

import { PoTreeViewItemHeaderComponent } from './po-tree-view-item-header.component';

describe('PoTreeViewItemHeaderComponent:', () => {
  let component: PoTreeViewItemHeaderComponent;
  let fixture: ComponentFixture<PoTreeViewItemHeaderComponent>;
  let debugNativeElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, PoFieldModule],
        declarations: [PoTreeViewItemHeaderComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTreeViewItemHeaderComponent);
    component = fixture.componentInstance;

    debugNativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewItemHeaderComponent).toBeTruthy();
  });

  describe('Templates: ', () => {
    it('shouldn`t find .po-tree-view-item-header-button if hasSubItems is false', () => {
      component.item = {
        label: 'Nivel 02',
        value: '02',
        subItems: []
      };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button')).toBe(null);
    });

    it('should find .po-tree-view-item-header-button if hasSubItems is true', () => {
      component.item = {
        label: 'Nivel 02',
        value: '02',
        subItems: [{ label: 'Nivel 02', value: '02' }]
      };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button')).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-header-button-icon-transform if expanded is false', () => {
      component.item = {
        label: 'Nivel 02',
        value: '02',
        expanded: false,
        subItems: [{ label: 'Nivel 02', value: '02' }]
      };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button-icon-transform')).toBe(null);
    });

    it('should find .po-tree-view-item-header-button-icon-transform if expanded and hasSubItems are true', () => {
      component.item = {
        label: 'Nivel 02',
        value: '02',
        expanded: true,
        subItems: [{ label: 'Nivel 02', value: '02' }]
      };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button-icon-transform')).toBeTruthy();
    });

    it('should find .po-tree-view-item-header-padding if hasSubItems is false', () => {
      component.item = {
        label: 'Nivel 02',
        value: '02',
        subItems: []
      };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-padding')).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-header-padding if hasSubItems is true', () => {
      component.item = {
        label: 'Nivel 02',
        value: '02',
        subItems: [{ label: 'Nivel 02', value: '02' }]
      };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-padding')).toBe(null);
    });

    it('should find .po-tree-view-item-header-checkbox and shouldn`t find .po-tree-view-item-header-label if selectable is true', () => {
      component.selectable = true;
      component.item = {
        label: 'Nivel 02',
        value: '02',
        subItems: [{ label: 'Nivel 02', value: '02' }]
      };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-checkbox')).toBeTruthy();
      expect(debugNativeElement.querySelector('.po-tree-view-item-header-label')).toBe(null);
    });

    it('shouldn`t find .po-tree-view-item-header-checkbox and should find .po-tree-view-item-header-label if selectable is false', () => {
      component.selectable = false;
      component.item = {
        label: 'Nivel 02',
        value: '02',
        subItems: [{ label: 'Nivel 02', value: '02' }]
      };

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-checkbox')).toBe(null);
      expect(debugNativeElement.querySelector('.po-tree-view-item-header-label')).toBeTruthy();
    });
  });
});
