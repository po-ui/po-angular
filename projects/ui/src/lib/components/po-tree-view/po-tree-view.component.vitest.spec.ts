import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { PoTreeViewComponent } from './po-tree-view.component';
import { PoTreeViewItem } from './po-tree-view-item/po-tree-view-item.interface';
import { PoTreeViewService } from './services/po-tree-view.service';

describe('PoTreeViewComponent:', () => {
  let component: PoTreeViewComponent;
  let fixture: ComponentFixture<PoTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NoopAnimationsModule],
      declarations: [PoTreeViewComponent],
      providers: [PoTreeViewService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTreeViewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewComponent).toBe(true);
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

      const spyReceiveEvent = vi.spyOn(component['treeViewService'], 'onExpand').mockReturnValue(of(expectedValue));
      const spyEmitEvent = vi.spyOn(component as any, 'emitExpanded').mockImplementation(() => {});

      component.ngOnInit();

      expect(spyReceiveEvent).toHaveBeenCalled();
      expect(spyEmitEvent).toHaveBeenCalledWith(expectedValue);
    });

    it('ngOnInit: should subscribe onChecked and call emitSelected with treeViewItem', () => {
      const expectedValue: PoTreeViewItem = { label: 'Nivel 01', value: 1 };

      const spyOnChecked = vi.spyOn(component['treeViewService'], 'onSelect').mockReturnValue(of(expectedValue));
      const spyEmitChecked = vi.spyOn(component as any, 'emitSelected').mockImplementation(() => {});

      component.ngOnInit();

      expect(spyOnChecked).toHaveBeenCalled();
      expect(spyEmitChecked).toHaveBeenCalledWith(expectedValue);
    });

    it('trackByFunction: should return index param', () => {
      expect(component.trackByFunction(1)).toBe(1);
    });

    it('ngOnChanges: should update items when inputedItems changes', () => {
      const changes: SimpleChanges = {
        inputedItems: {
          currentValue: [{ label: 'example', value: 1 }],
          firstChange: true,
          isFirstChange: () => true,
          previousValue: undefined
        }
      };

      component.items = undefined;

      component.ngOnChanges(changes);

      expect(component.items).toBeDefined();
    });
  });
});
