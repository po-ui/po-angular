import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PoDropListDirective } from './po-drop-list.directive';
import { PoDropEvent, PoDragEnterEvent } from './interfaces/po-draggable-item.interface';
import { PoDragDropModule } from './po-drag-drop.module';

interface TestItem {
  id: string;
  value: number;
}

@Component({
  template: `
    <div
      [p-drop-list]="items"
      [p-drop-list-id]="listId"
      [p-drop-list-disabled]="disabled"
      [p-drop-list-orientation]="orientation"
      [p-drop-list-connected-to]="connectedTo"
      [p-drop-sorting-disabled]="sortingDisabled"
      (p-dropped)="onDropped($event)"
      (p-drag-entered)="onEntered($event)"
    ></div>
  `,
  standalone: false
})
class TestHostComponent {
  items: Array<TestItem> = [
    { id: '1', value: 10 },
    { id: '2', value: 20 }
  ];
  listId = 'test-list';
  disabled = false;
  orientation: 'horizontal' | 'vertical' | 'mixed' = 'vertical';
  connectedTo: Array<string> = [];
  sortingDisabled = false;
  droppedEvent: PoDropEvent | null = null;
  enteredEvent: PoDragEnterEvent<TestItem> | null = null;

  onDropped(event: PoDropEvent) {
    this.droppedEvent = event;
  }

  onEntered(event: PoDragEnterEvent<TestItem>) {
    this.enteredEvent = event;
  }
}

@Component({
  template: `<div [p-drop-list]="[]" [p-drop-list-disabled]="'true'"></div>`,
  standalone: false
})
class TestStringBooleanHostComponent {}

@Component({
  template: `<div [p-drop-list]="[]" [p-drop-sorting-disabled]="'true'"></div>`,
  standalone: false
})
class TestStringSortingDisabledHostComponent {}

describe('PoDropListBaseDirective (via PoDropListDirective)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let directive: PoDropListDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoDragDropModule],
      declarations: [TestHostComponent, TestStringBooleanHostComponent, TestStringSortingDisabledHostComponent]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    directive = fixture.debugElement.query(By.directive(PoDropListDirective)).injector.get(PoDropListDirective);
  });

  it('should create the host component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('items input (p-drop-list)', () => {
    it('should read `items` signal with the bound array', () => {
      expect(directive.items()).toHaveSize(2);
      expect(directive.items()).toEqual(component.items);
    });

    it('should update items when bound array changes', () => {
      component.items = [{ id: '3', value: 30 }];
      fixture.detectChanges();
      expect(directive.items()).toHaveSize(1);
      expect(directive.items()[0]).toEqual(jasmine.objectContaining({ id: '3', value: 30 }));
    });

    it('should accept empty array', () => {
      component.items = [];
      fixture.detectChanges();
      expect(directive.items()).toEqual([]);
    });
  });

  describe('dropListId input (p-drop-list-id)', () => {
    it('should read `dropListId` signal with the bound value', () => {
      expect(directive.dropListId()).toBe('test-list');
    });

    it('should default to empty string when not provided', () => {
      const noIdFixture = TestBed.createComponent(TestStringBooleanHostComponent);
      noIdFixture.detectChanges();
      const noIdDirective = noIdFixture.debugElement
        .query(By.directive(PoDropListDirective))
        .injector.get(PoDropListDirective);
      expect(noIdDirective.dropListId()).toBe('');
    });
  });

  describe('dropListDisabled input (p-drop-list-disabled)', () => {
    it('should read `dropListDisabled` signal as false by default', () => {
      expect(directive.dropListDisabled()).toBeFalse();
    });

    it('should read `dropListDisabled` signal as true when bound to true', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(directive.dropListDisabled()).toBeTrue();
    });

    it('should toggle back to false', () => {
      component.disabled = true;
      fixture.detectChanges();
      component.disabled = false;
      fixture.detectChanges();
      expect(directive.dropListDisabled()).toBeFalse();
    });

    it('should accept string "true" via convertToBoolean transform', () => {
      const strFixture = TestBed.createComponent(TestStringBooleanHostComponent);
      strFixture.detectChanges();
      const strDirective = strFixture.debugElement
        .query(By.directive(PoDropListDirective))
        .injector.get(PoDropListDirective);
      expect(strDirective.dropListDisabled()).toBeTrue();
    });
  });

  describe('dropListOrientation input (p-drop-list-orientation)', () => {
    it('should read `dropListOrientation` signal as "vertical" by default', () => {
      expect(directive.dropListOrientation()).toBe('vertical');
    });

    it('should update to "horizontal" when input changes', () => {
      component.orientation = 'horizontal';
      fixture.detectChanges();
      expect(directive.dropListOrientation()).toBe('horizontal');
    });

    it('should accept "mixed" value', () => {
      component.orientation = 'mixed';
      fixture.detectChanges();
      expect(directive.dropListOrientation()).toBe('mixed');
    });
  });

  describe('dropListConnectedTo input (p-drop-list-connected-to)', () => {
    it('should read `dropListConnectedTo` signal as empty array by default', () => {
      expect(directive.dropListConnectedTo()).toEqual([]);
    });

    it('should update when string ids are provided', () => {
      component.connectedTo = ['list-x', 'list-y'];
      fixture.detectChanges();
      expect(directive.dropListConnectedTo()).toEqual(['list-x', 'list-y']);
    });

    it('should update back to empty array', () => {
      component.connectedTo = ['list-x'];
      fixture.detectChanges();
      component.connectedTo = [];
      fixture.detectChanges();
      expect(directive.dropListConnectedTo()).toEqual([]);
    });
  });

  describe('dropSortingDisabled input (p-drop-sorting-disabled)', () => {
    it('should read `dropSortingDisabled` signal as false by default', () => {
      expect(directive.dropSortingDisabled()).toBeFalse();
    });

    it('should read `dropSortingDisabled` as true when bound to true', () => {
      component.sortingDisabled = true;
      fixture.detectChanges();
      expect(directive.dropSortingDisabled()).toBeTrue();
    });

    it('should accept string "true" via convertToBoolean transform', () => {
      const strFixture = TestBed.createComponent(TestStringSortingDisabledHostComponent);
      strFixture.detectChanges();
      const strDirective = strFixture.debugElement
        .query(By.directive(PoDropListDirective))
        .injector.get(PoDropListDirective);
      expect(strDirective.dropSortingDisabled()).toBeTrue();
    });
  });

  describe('dropped output (p-dropped)', () => {
    it('should emit PoDropEvent when `dropped` fires', () => {
      const event: PoDropEvent = {
        previousIndex: 0,
        currentIndex: 1,
        item: component.items[0],
        items: component.items,
        container: 'test-list'
      };
      directive.dropped.emit(event);
      expect(component.droppedEvent).toEqual(event);
    });

    it('should include previousContainer when provided', () => {
      const event: PoDropEvent = {
        previousIndex: 0,
        currentIndex: 0,
        item: component.items[0],
        items: component.items,
        container: 'test-list',
        previousContainer: 'other-list'
      };
      directive.dropped.emit(event);
      expect(component.droppedEvent.previousContainer).toBe('other-list');
    });

    it('should include dropPoint when provided', () => {
      const event: PoDropEvent = {
        previousIndex: 0,
        currentIndex: 1,
        item: component.items[0],
        items: component.items,
        container: 'test-list',
        dropPoint: { x: 100, y: 200 }
      };
      directive.dropped.emit(event);
      expect(component.droppedEvent.dropPoint).toEqual({ x: 100, y: 200 });
    });
  });

  describe('dragEntered output (p-drag-entered)', () => {
    it('should emit PoDragEnterEvent when `dragEntered` fires', () => {
      const event: PoDragEnterEvent<TestItem> = {
        item: component.items[1],
        container: 'test-list'
      };
      directive.dragEntered.emit(event);
      expect(component.enteredEvent).toEqual(event);
    });
  });
});
