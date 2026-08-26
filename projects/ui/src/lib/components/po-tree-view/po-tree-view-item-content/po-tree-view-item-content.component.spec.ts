import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';

import { PoButtonModule } from '../../po-button';
import { PoIconModule } from '../../po-icon/po-icon.module';
import { PoFieldModule } from '../../po-field/po-field.module';

import { PoTreeViewItemContentComponent } from './po-tree-view-item-content.component';
import { PoTreeViewKeyboardService } from '../services/po-tree-view-keyboard.service';

describe('PoTreeViewItemContentComponent:', () => {
  let component: PoTreeViewItemContentComponent;
  let fixture: ComponentFixture<PoTreeViewItemContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, PoFieldModule, PoButtonModule, PoIconModule],
      declarations: [PoTreeViewItemContentComponent],
      providers: [PoTreeViewKeyboardService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTreeViewItemContentComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('p-item', { label: 'Test', value: '1' });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTreeViewItemContentComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('hasSubItems: should return true if item has subItems', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, subItems: [{ label: 'B', value: 2 }] });
      expect(component['hasSubItems']).toBe(true);
    });

    it('hasSubItems: should return false if item has no subItems', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
      expect(component['hasSubItems']).toBe(false);
    });

    it('expandIcon: should return ICON_ARROW_DOWN when expanded', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, expanded: true });
      expect(component['expandIcon']).toBe('ICON_ARROW_DOWN');
    });

    it('expandIcon: should return ICON_ARROW_RIGHT when collapsed', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, expanded: false });
      expect(component['expandIcon']).toBe('ICON_ARROW_RIGHT');
    });

    it('isDisabled: should return true when item is disabled', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, disabled: true });
      expect(component['isDisabled']).toBe(true);
    });

    it('isDisabled: should return false when item is not disabled', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
      expect(component['isDisabled']).toBe(false);
    });

    it('isExpanded: should return true when item is expanded', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, expanded: true });
      expect(component['isExpanded']).toBe(true);
    });

    it('isSelected: should return true when item is selected in multi-select', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, selected: true });
      fixture.componentRef.setInput('p-selectable', true);
      expect(component['isSelected']).toBe(true);
    });

    it('isSelected: should use selectedValue in single-select mode', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
      fixture.componentRef.setInput('p-single-select', true);
      fixture.componentRef.setInput('p-selected-value', 1);
      expect(component['isSelected']).toBe(true);
    });

    it('isSelected: should return false when value does not match in single-select', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
      fixture.componentRef.setInput('p-single-select', true);
      fixture.componentRef.setInput('p-selected-value', 2);
      expect(component['isSelected']).toBe(false);
    });

    it('isSelected: should compare with selectedValue when selectable and singleSelect', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
      fixture.componentRef.setInput('p-selectable', true);
      fixture.componentRef.setInput('p-single-select', true);
      fixture.componentRef.setInput('p-selected-value', 1);
      expect(component['isSelected']).toBe(true);
    });

    it('should set --po-tree-view-item-level custom property with the current level', () => {
      fixture.componentRef.setInput('p-level', 2);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('.po-tree-view-item-content') as HTMLElement;
      expect(content.style.getPropertyValue('--po-tree-view-item-level')).toBe('2');
    });

    it('should reflect deep levels without limit in --po-tree-view-item-level', () => {
      fixture.componentRef.setInput('p-level', 7);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('.po-tree-view-item-content') as HTMLElement;
      expect(content.style.getPropertyValue('--po-tree-view-item-level')).toBe('7');
    });

    it('should add po-tree-view-item-content-root class when level is 0', () => {
      fixture.componentRef.setInput('p-level', 0);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('.po-tree-view-item-content') as HTMLElement;
      expect(content.classList.contains('po-tree-view-item-content-root')).toBe(true);
    });

    it('should not add po-tree-view-item-content-root class when level is greater than 0', () => {
      fixture.componentRef.setInput('p-level', 1);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('.po-tree-view-item-content') as HTMLElement;
      expect(content.classList.contains('po-tree-view-item-content-root')).toBe(false);
    });

    it('itemIcon: should return ICON_FOLDER_SIMPLE for items with subItems and showIcon', () => {
      fixture.componentRef.setInput('p-item', {
        label: 'A',
        value: 1,
        showIcon: true,
        subItems: [{ label: 'B', value: 2 }]
      });
      expect(component['itemIcon']).toBe('ICON_FOLDER_SIMPLE');
    });

    it('itemIcon: should return ICON_FILE for leaf items with showIcon', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, showIcon: true });
      expect(component['itemIcon']).toBe('ICON_FILE');
    });

    it('itemIcon: should return undefined when showIcon is false', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
      expect(component['itemIcon']).toBeUndefined();
    });

    it('itemIcon: should return undefined when selectable is true', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, showIcon: true });
      fixture.componentRef.setInput('p-selectable', true);
      expect(component['itemIcon']).toBeUndefined();
    });
  });

  describe('Methods:', () => {
    it('onLineClick: should emit expanded when item has subItems', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, subItems: [{ label: 'B', value: 2 }] });
      fixture.detectChanges();

      spyOn(component.expanded, 'emit');
      const event = { target: fixture.nativeElement.querySelector('.po-tree-view-item-content-padding') } as any;

      component['onLineClick'](event);

      expect(component.expanded.emit).toHaveBeenCalled();
    });

    it('onLineClick: should emit activated for leaf items', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
      fixture.detectChanges();

      spyOn(component.activated, 'emit');
      const event = { target: fixture.nativeElement.querySelector('.po-tree-view-item-content-padding') } as any;

      component['onLineClick'](event);

      expect(component.activated.emit).toHaveBeenCalled();
    });

    it('onLineClick: should not emit when disabled and not arrow click', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1, disabled: true });
      fixture.detectChanges();

      spyOn(component.activated, 'emit');
      const event = { target: fixture.nativeElement.querySelector('.po-tree-view-item-content-padding') } as any;

      component['onLineClick'](event);

      expect(component.activated.emit).not.toHaveBeenCalled();
    });

    it('onLineClick: should not emit when click is on checkbox', () => {
      fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
      fixture.componentRef.setInput('p-selectable', true);
      fixture.detectChanges();

      spyOn(component.expanded, 'emit');
      const checkbox = fixture.nativeElement.querySelector('po-checkbox') || document.createElement('po-checkbox');
      const event = { target: checkbox } as any;

      component['onLineClick'](event);

      expect(component.expanded.emit).not.toHaveBeenCalled();
    });

    describe('onKeydown:', () => {
      let keyboardService: PoTreeViewKeyboardService;

      beforeEach(() => {
        keyboardService = TestBed.inject(PoTreeViewKeyboardService);
      });

      function buildNodeWithContent(): HTMLElement {
        const node = document.createElement('div');
        const content = document.createElement('div');
        content.classList.add('po-tree-view-item-content');
        node.appendChild(content);
        return node;
      }

      it('ArrowDown: should call focusNext', () => {
        spyOn(keyboardService, 'focusNext');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusNext).toHaveBeenCalledWith(node);
      });

      it('ArrowUp: should call focusPrevious', () => {
        spyOn(keyboardService, 'focusPrevious');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusPrevious).toHaveBeenCalledWith(node);
      });

      it('ArrowRight: should expand when collapsed with subItems', () => {
        fixture.componentRef.setInput('p-item', {
          label: 'A',
          value: 1,
          expanded: false,
          subItems: [{ label: 'B', value: 2 }]
        });
        spyOn(component.expanded, 'emit');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(component.expanded.emit).toHaveBeenCalled();
      });

      it('ArrowRight: should call focusFirstChild when expanded with subItems', () => {
        fixture.componentRef.setInput('p-item', {
          label: 'A',
          value: 1,
          expanded: true,
          subItems: [{ label: 'B', value: 2 }]
        });
        spyOn(keyboardService, 'focusFirstChild');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusFirstChild).toHaveBeenCalledWith(node);
      });

      it('ArrowRight: should do nothing for leaf item', () => {
        fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
        spyOn(component.expanded, 'emit');
        spyOn(keyboardService, 'focusFirstChild');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(component.expanded.emit).not.toHaveBeenCalled();
        expect(keyboardService.focusFirstChild).not.toHaveBeenCalled();
      });

      it('ArrowLeft: should collapse when expanded with subItems', () => {
        fixture.componentRef.setInput('p-item', {
          label: 'A',
          value: 1,
          expanded: true,
          subItems: [{ label: 'B', value: 2 }]
        });
        spyOn(component.expanded, 'emit');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(component.expanded.emit).toHaveBeenCalled();
      });

      it('ArrowLeft: should call focusParent when has parent', () => {
        fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
        spyOn(keyboardService, 'hasParentNode').and.returnValue(true);
        spyOn(keyboardService, 'focusParent');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusParent).toHaveBeenCalledWith(node);
      });

      it('ArrowLeft: should do nothing when no parent and not expanded', () => {
        fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
        spyOn(keyboardService, 'hasParentNode').and.returnValue(false);
        spyOn(keyboardService, 'focusParent');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusParent).not.toHaveBeenCalled();
      });

      it('Home: should call focusFirst', () => {
        spyOn(keyboardService, 'focusFirst');
        const event = new KeyboardEvent('keydown', { key: 'Home' });
        Object.defineProperty(event, 'currentTarget', { value: document.createElement('div') });

        component['onKeydown'](event);

        expect(keyboardService.focusFirst).toHaveBeenCalled();
      });

      it('End: should call focusLast', () => {
        spyOn(keyboardService, 'focusLast');
        const event = new KeyboardEvent('keydown', { key: 'End' });
        Object.defineProperty(event, 'currentTarget', { value: document.createElement('div') });

        component['onKeydown'](event);

        expect(keyboardService.focusLast).toHaveBeenCalled();
      });

      it('Enter: should emit selected when selectable', () => {
        fixture.componentRef.setInput('p-item', { label: 'A', value: 1, selected: false });
        fixture.componentRef.setInput('p-selectable', true);

        spyOn(component.selected, 'emit');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'currentTarget', { value: buildNodeWithContent() });

        component['onKeydown'](event);

        expect(component.selected.emit).toHaveBeenCalled();
      });

      it('Space: should emit activated for leaf item without selectable', () => {
        fixture.componentRef.setInput('p-item', { label: 'A', value: 1 });
        fixture.componentRef.setInput('p-selectable', false);

        spyOn(component.activated, 'emit');
        const event = new KeyboardEvent('keydown', { key: ' ' });
        Object.defineProperty(event, 'currentTarget', { value: buildNodeWithContent() });

        component['onKeydown'](event);

        expect(component.activated.emit).toHaveBeenCalled();
      });

      it('Enter: should not act when disabled', () => {
        fixture.componentRef.setInput('p-item', { label: 'A', value: 1, disabled: true });
        fixture.componentRef.setInput('p-selectable', true);

        spyOn(component.selected, 'emit');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'currentTarget', { value: buildNodeWithContent() });

        component['onKeydown'](event);

        expect(component.selected.emit).not.toHaveBeenCalled();
      });

      it('Enter: should add and remove the pressed class after the timeout', fakeAsync(() => {
        fixture.componentRef.setInput('p-item', { label: 'A', value: 1, selected: false });
        fixture.componentRef.setInput('p-selectable', true);

        const node = buildNodeWithContent();
        const contentElement = node.querySelector('.po-tree-view-item-content');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);
        expect(contentElement.classList.contains('po-tree-view-item-content-pressed')).toBe(true);

        tick(150);
        expect(contentElement.classList.contains('po-tree-view-item-content-pressed')).toBe(false);
      }));

      it('character key: should call focusByCharacter', () => {
        spyOn(keyboardService, 'focusByCharacter');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'a' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusByCharacter).toHaveBeenCalledWith('a', node);
      });

      it('character key with ctrl: should not call focusByCharacter', () => {
        spyOn(keyboardService, 'focusByCharacter');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusByCharacter).not.toHaveBeenCalled();
      });

      it('multi-character key (e.g. Shift): should not call focusByCharacter', () => {
        spyOn(keyboardService, 'focusByCharacter');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusByCharacter).not.toHaveBeenCalled();
      });

      it('character key with alt: should not call focusByCharacter', () => {
        spyOn(keyboardService, 'focusByCharacter');
        const node = document.createElement('div');
        const event = new KeyboardEvent('keydown', { key: 'a', altKey: true });
        Object.defineProperty(event, 'currentTarget', { value: node });

        component['onKeydown'](event);

        expect(keyboardService.focusByCharacter).not.toHaveBeenCalled();
      });
    });

    it('onLineFocus: should call setLastFocusedNode', () => {
      const keyboardService = TestBed.inject(PoTreeViewKeyboardService);
      spyOn(keyboardService, 'setLastFocusedNode');
      const node = document.createElement('div');
      const event = { currentTarget: node } as any;

      component['onLineFocus'](event);

      expect(keyboardService.setLastFocusedNode).toHaveBeenCalledWith(node);
    });

    describe('updateLabelTruncation:', () => {
      function buildNodeWithLabel(scrollHeight: number, clientHeight: number): HTMLElement {
        const node = document.createElement('div');
        const label = document.createElement('span');
        label.classList.add('po-tree-view-item-content-label');
        Object.defineProperty(label, 'scrollHeight', { value: scrollHeight, configurable: true });
        Object.defineProperty(label, 'clientHeight', { value: clientHeight, configurable: true });
        node.appendChild(label);
        return node;
      }

      it('onLineFocus: should set isLabelTruncated true when label is truncated', () => {
        const node = buildNodeWithLabel(40, 20);
        const event = { currentTarget: node } as any;

        component['onLineFocus'](event);

        expect(component['isLabelTruncated']).toBe(true);
      });

      it('onLineMouseEnter: should set isLabelTruncated false when label is not truncated', () => {
        const node = buildNodeWithLabel(20, 20);
        const event = { currentTarget: node } as any;

        component['onLineMouseEnter'](event);

        expect(component['isLabelTruncated']).toBe(false);
      });

      it('onLineMouseEnter: should set isLabelTruncated false when node has no label', () => {
        const node = document.createElement('div');
        const event = { currentTarget: node } as any;

        component['onLineMouseEnter'](event);

        expect(component['isLabelTruncated']).toBe(false);
      });
    });
  });
});
