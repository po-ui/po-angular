import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PoButtonModule } from '../../po-button';
import { PoIconModule } from '../../po-icon/po-icon.module';
import { PoFieldModule } from '../../po-field/po-field.module';

import { PoTreeViewService } from '../services/po-tree-view.service';
import { PoTreeViewItemComponent } from './po-tree-view-item.component';
import { PoTreeViewKeyboardService } from '../services/po-tree-view-keyboard.service';
import { PoTreeViewItemContentComponent } from '../po-tree-view-item-content/po-tree-view-item-content.component';

describe('PoTreeviewItemComponent:', () => {
  let component: PoTreeViewItemComponent;
  let fixture: ComponentFixture<PoTreeViewItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule, PoFieldModule, PoButtonModule, PoIconModule],
      declarations: [PoTreeViewItemComponent, PoTreeViewItemContentComponent],
      providers: [PoTreeViewService, PoTreeViewKeyboardService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTreeViewItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('p-item', { label: 'Test', value: '1' });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewItemComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('hasSubItems: should return true if has subItems', () => {
      fixture.componentRef.setInput('p-item', {
        label: 'Nivel 0',
        value: '220',
        subItems: [{ label: 'Nivel 01', value: 11 }]
      });

      expect(component.hasSubItems).toBe(true);
    });

    it('hasSubItems: should return false if subItems is undefined', () => {
      fixture.componentRef.setInput('p-item', {
        label: 'Nivel 0',
        value: '220',
        subItems: undefined
      });

      expect(component.hasSubItems).toBe(false);
    });
  });

  describe('Methods:', () => {
    it('onClick: should toggle expanded and call treeViewService.emitExpandedEvent', () => {
      const item = { label: 'Label 01', value: 12, expanded: false };
      fixture.componentRef.setInput('p-item', item);

      const spyEmitEvent = spyOn(component['treeViewService'], 'emitExpandedEvent');

      component.onClick();

      expect(item.expanded).toBe(true);
      expect(spyEmitEvent).toHaveBeenCalled();
    });

    it('onSelect: should call treeViewService.emitSelectedEvent with item', () => {
      const item = { label: 'Label 01', value: 12 };

      const spyEmitEvent = spyOn(component['treeViewService'], 'emitSelectedEvent');

      component.onSelect(item);

      expect(spyEmitEvent).toHaveBeenCalledWith({ ...item });
    });

    it('onActivate: should call treeViewService.emitActivatedEvent with item', () => {
      const item = { label: 'Label 01', value: 12 };

      const spyEmitEvent = spyOn(component['treeViewService'], 'emitActivatedEvent');

      component['onActivate'](item);

      expect(spyEmitEvent).toHaveBeenCalledWith({ ...item });
    });

    it('trackByFunction: should return index param', () => {
      expect(component.trackByFunction(1)).toBe(1);
    });
  });
});
