import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTreeViewItemHeaderComponent } from './po-tree-view-item-header.component';

describe('PoTreeViewItemHeaderComponent:', () => {
  let component: PoTreeViewItemHeaderComponent;
  let fixture: ComponentFixture<PoTreeViewItemHeaderComponent>;
  let debugNativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoTreeViewItemHeaderComponent ]
    })
    .compileComponents();
  }));

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
      component.hasSubItems = false;

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button')).toBe(null);
    });

    it('should find .po-tree-view-item-header-button if hasSubItems is true', () => {
      component.hasSubItems = true;

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button')).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-header-button-icon-transform if expanded is false', () => {
      component.expanded = false;

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button-icon-transform')).toBe(null);
    });

    it('should find .po-tree-view-item-header-button-icon-transform if expanded and hasSubItems are true', () => {
      component.hasSubItems = true;
      component.expanded = true;

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-button-icon-transform')).toBeTruthy();
    });

    it('should find .po-tree-view-item-header-label-padding if hasSubItems is false', () => {
      component.hasSubItems = false;

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-label-padding')).toBeTruthy();
    });

    it('shouldn`t find .po-tree-view-item-header-label-padding if hasSubItems is true', () => {
      component.hasSubItems = true;

      fixture.detectChanges();

      expect(debugNativeElement.querySelector('.po-tree-view-item-header-label-padding')).toBe(null);
    });

  });
});
