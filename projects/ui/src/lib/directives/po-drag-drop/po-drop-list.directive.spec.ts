import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkDropList } from '@angular/cdk/drag-drop';

import { PoDropListDirective } from './po-drop-list.directive';
import { PoDropEvent, PoDragEnterEvent } from './interfaces/po-draggable-item.interface';
import { PoDragDropModule } from './po-drag-drop.module';
import { PoWidgetModule } from '../../components/po-widget/po-widget.module';

interface TestItem {
  id: string;
  name: string;
}

@Component({
  template: `
    <div
      [p-drop-list]="items"
      p-drop-list-id="list-a"
      [p-drop-list-disabled]="disabled"
      [p-drop-list-orientation]="orientation"
      [p-drop-list-connected-to]="connectedTo"
      [p-drop-sorting-disabled]="sortingDisabled"
      (p-dropped)="onDropped($event)"
      (p-drag-entered)="onDragEntered($event)"
    >
      @for (item of items; track item.id) {
        <po-widget [p-drag]="item" [p-title]="item.name"></po-widget>
      }
    </div>
  `,
  standalone: false
})
class TestHostComponent {
  items: Array<TestItem> = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ];
  disabled = false;
  orientation: 'horizontal' | 'vertical' | 'mixed' = 'vertical';
  connectedTo: Array<string> = [];
  sortingDisabled = false;
  droppedEvent: PoDropEvent | null = null;
  dragEnteredEvent: PoDragEnterEvent<TestItem> | null = null;

  onDropped(event: PoDropEvent) {
    this.droppedEvent = event;
  }

  onDragEntered(event: PoDragEnterEvent<TestItem>) {
    this.dragEnteredEvent = event;
  }
}

@Component({
  template: `
    <div
      [p-drop-list]="itemsA"
      p-drop-list-id="list-a"
      [p-drop-list-connected-to]="['list-b']"
      (p-dropped)="onDroppedA($event)"
    >
      @for (item of itemsA; track item.id) {
        <po-widget [p-drag]="item" [p-title]="item.name"></po-widget>
      }
    </div>
    <div
      [p-drop-list]="itemsB"
      p-drop-list-id="list-b"
      [p-drop-list-connected-to]="['list-a']"
      (p-dropped)="onDroppedB($event)"
    >
      @for (item of itemsB; track item.id) {
        <po-widget [p-drag]="item" [p-title]="item.name"></po-widget>
      }
    </div>
  `,
  standalone: false
})
class TestConnectedHostComponent {
  itemsA: Array<TestItem> = [
    { id: '1', name: 'A1' },
    { id: '2', name: 'A2' }
  ];
  itemsB: Array<TestItem> = [
    { id: '3', name: 'B1' },
    { id: '4', name: 'B2' }
  ];
  droppedEventA: PoDropEvent | null = null;
  droppedEventB: PoDropEvent | null = null;

  onDroppedA(event: PoDropEvent) {
    this.droppedEventA = event;
  }

  onDroppedB(event: PoDropEvent) {
    this.droppedEventB = event;
  }
}

describe('PoDropListDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let directive: PoDropListDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoDragDropModule, PoWidgetModule],
      declarations: [TestHostComponent, TestConnectedHostComponent]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    directive = fixture.debugElement.query(By.directive(PoDropListDirective)).injector.get(PoDropListDirective);
  });

  it('should be created', () => {
    expect(directive).toBeTruthy();
  });

  describe('inputs', () => {
    it('should read `items` signal matching the bound array', () => {
      expect(directive.items()).toEqual(component.items);
    });

    it('should update `items` signal when input changes', () => {
      const newItems: Array<TestItem> = [{ id: '4', name: 'New Item' }];
      component.items = newItems;
      fixture.detectChanges();
      expect(directive.items()).toEqual(newItems);
    });

    it('should read `dropListId` signal as "list-a"', () => {
      expect(directive.dropListId()).toBe('list-a');
    });

    it('should read `dropListDisabled` signal as false by default', () => {
      expect(directive.dropListDisabled()).toBeFalse();
    });

    it('should read `dropListDisabled` signal as true when input changes', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(directive.dropListDisabled()).toBeTrue();
    });

    it('should read `dropListConnectedTo` signal as empty array by default', () => {
      expect(directive.dropListConnectedTo()).toEqual([]);
    });

    it('should update `dropListConnectedTo` when input changes', () => {
      component.connectedTo = ['list-b', 'list-c'];
      fixture.detectChanges();
      expect(directive.dropListConnectedTo()).toEqual(['list-b', 'list-c']);
    });

    it('should read `dropListOrientation` signal as "vertical" by default', () => {
      expect(directive.dropListOrientation()).toBe('vertical');
    });

    it('should update `dropListOrientation` when input changes', () => {
      component.orientation = 'horizontal';
      fixture.detectChanges();
      expect(directive.dropListOrientation()).toBe('horizontal');
    });

    it('should accept "mixed" as orientation value', () => {
      component.orientation = 'mixed';
      fixture.detectChanges();
      expect(directive.dropListOrientation()).toBe('mixed');
    });

    it('should read `dropSortingDisabled` as false by default', () => {
      expect(directive.dropSortingDisabled()).toBeFalse();
    });

    it('should read `dropSortingDisabled` as true when input changes', () => {
      component.sortingDisabled = true;
      fixture.detectChanges();
      expect(directive.dropSortingDisabled()).toBeTrue();
    });
  });

  describe('CdkDropList integration', () => {
    let cdkDropList: CdkDropList;

    beforeEach(() => {
      cdkDropList = fixture.debugElement.query(By.directive(CdkDropList)).injector.get(CdkDropList);
    });

    it('should sync disabled state to CdkDropList', () => {
      expect(cdkDropList.disabled).toBeFalse();
      component.disabled = true;
      fixture.detectChanges();
      expect(cdkDropList.disabled).toBeTrue();
    });

    it('should sync id to CdkDropList', () => {
      expect(cdkDropList.id).toBe('list-a');
    });

    it('should sync data to CdkDropList', () => {
      expect(cdkDropList.data).toEqual(component.items);
    });

    it('should sync sortingDisabled to CdkDropList', () => {
      expect(cdkDropList.sortingDisabled).toBeFalse();
      component.sortingDisabled = true;
      fixture.detectChanges();
      expect(cdkDropList.sortingDisabled).toBeTrue();
    });

    it('should sync connectedTo as string[] to CdkDropList', () => {
      component.connectedTo = ['list-b'];
      fixture.detectChanges();
      expect(cdkDropList.connectedTo).toEqual(['list-b']);
    });
  });

  describe('outputs', () => {
    it('should emit `dropped` when triggered manually', () => {
      const event: PoDropEvent = {
        previousIndex: 0,
        currentIndex: 1,
        item: component.items[0],
        items: component.items,
        container: 'list-a'
      };
      directive.dropped.emit(event);
      expect(component.droppedEvent).toEqual(event);
    });

    it('should emit `dragEntered` when triggered manually', () => {
      const event: PoDragEnterEvent<TestItem> = {
        item: component.items[0],
        container: 'list-a'
      };
      directive.dragEntered.emit(event);
      expect(component.dragEnteredEvent).toEqual(event);
    });
  });

  describe('CdkDropList event subscriptions', () => {
    it('should update lastSortedIndex when CdkDropList.sorted fires', () => {
      const cdkDropList = fixture.debugElement.query(By.directive(CdkDropList)).injector.get(CdkDropList);

      cdkDropList.sorted.emit({
        previousIndex: 0,
        currentIndex: 2,
        container: cdkDropList,
        item: { data: component.items[0] } as any
      } as any);

      expect((directive as any).lastSortedIndex).toBe(2);
    });

    it('should call handleDrop when CdkDropList.dropped fires', () => {
      const cdkDropList = fixture.debugElement.query(By.directive(CdkDropList)).injector.get(CdkDropList);

      const fakeDropEvent = {
        previousContainer: cdkDropList,
        container: cdkDropList,
        previousIndex: 0,
        currentIndex: 1,
        item: { data: component.items[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 10, y: 20 }
      };
      cdkDropList.dropped.emit(fakeDropEvent as any);

      expect(component.droppedEvent).not.toBeNull();
      expect(component.droppedEvent.previousIndex).toBe(0);
      expect(component.droppedEvent.currentIndex).toBe(1);
    });
  });

  describe('handleDrop', () => {
    it('should not emit `dropped` when drop occurs at same index', () => {
      let emitted = false;
      directive.dropped.subscribe(() => (emitted = true));

      const containerRef = { id: 'list-a', data: component.items } as any;
      const fakeEvent = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 1,
        currentIndex: 1,
        item: { data: component.items[1] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 }
      };
      (directive as any).handleDrop(fakeEvent);

      expect(emitted).toBeFalse();
    });

    it('should emit `dropped` with reordered items for same container drop', () => {
      const containerRef = { id: 'list-a', data: component.items } as any;
      const fakeEvent = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 0,
        currentIndex: 2,
        item: { data: component.items[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 100, y: 200 }
      };
      (directive as any).handleDrop(fakeEvent);

      expect(component.droppedEvent).not.toBeNull();
      expect(component.droppedEvent.previousIndex).toBe(0);
      expect(component.droppedEvent.currentIndex).toBe(2);
      expect(component.droppedEvent.container).toBe('list-a');
      expect(component.droppedEvent.items).toBeDefined();
      expect(component.droppedEvent.items[2]).toEqual(jasmine.objectContaining({ id: '1', name: 'Item 1' }));
    });

    it('should emit `dropped` with correct items when drop is in different container', () => {
      const previousItems: Array<TestItem> = [{ id: '10', name: 'Other' }];
      const fakeEvent = {
        previousContainer: { id: 'list-b', data: previousItems } as any,
        container: { id: 'list-a', data: component.items } as any,
        previousIndex: 0,
        currentIndex: 1,
        item: { data: previousItems[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 50, y: 50 }
      };
      (directive as any).handleDrop(fakeEvent);

      expect(component.droppedEvent).not.toBeNull();
      expect(component.droppedEvent.previousContainer).toBe('list-b');
      expect(component.droppedEvent.container).toBe('list-a');
      expect(component.droppedEvent.items[1]).toEqual(jasmine.objectContaining({ id: '10', name: 'Other' }));
    });

    it('should not include previousContainer in event for same container drop', () => {
      const containerRef = { id: 'list-a', data: component.items } as any;
      const fakeEvent = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 0,
        currentIndex: 1,
        item: { data: component.items[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 }
      };
      (directive as any).handleDrop(fakeEvent);

      expect(component.droppedEvent.previousContainer).toBeUndefined();
    });

    it('should use lastSortedIndex for same container when available', () => {
      // Simulate a sorted event updating the lastSortedIndex
      (directive as any).lastSortedIndex = 2;

      const containerRef = { id: 'list-a', data: component.items } as any;
      const fakeEvent = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 0,
        currentIndex: 1, // CDK reports 1, but sorted said 2
        item: { data: component.items[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 }
      };
      (directive as any).handleDrop(fakeEvent);

      expect(component.droppedEvent.currentIndex).toBe(2);
    });

    it('should reset lastSortedIndex to null after handleDrop', () => {
      (directive as any).lastSortedIndex = 2;

      const containerRef = { id: 'list-a', data: component.items } as any;
      const fakeEvent = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 0,
        currentIndex: 1,
        item: { data: component.items[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 }
      };
      (directive as any).handleDrop(fakeEvent);

      expect((directive as any).lastSortedIndex).toBeNull();
    });

    it('should not use lastSortedIndex for cross-container drop', () => {
      (directive as any).lastSortedIndex = 5;

      const previousItems: Array<TestItem> = [{ id: '10', name: 'External' }];
      const fakeEvent = {
        previousContainer: { id: 'list-b', data: previousItems } as any,
        container: { id: 'list-a', data: component.items } as any,
        previousIndex: 0,
        currentIndex: 1,
        item: { data: previousItems[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 }
      };
      (directive as any).handleDrop(fakeEvent);

      // Should use CDK's currentIndex (1), not lastSortedIndex (5)
      expect(component.droppedEvent.currentIndex).toBe(1);
    });

    it('should include dropPoint in the emitted event', () => {
      const containerRef = { id: 'list-a', data: component.items } as any;
      const fakeEvent = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 0,
        currentIndex: 1,
        item: { data: component.items[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 250, y: 300 }
      };
      (directive as any).handleDrop(fakeEvent);

      expect(component.droppedEvent.dropPoint).toEqual({ x: 250, y: 300 });
    });

    it('should not mutate the original items array', () => {
      const originalItems = [...component.items];

      const containerRef = { id: 'list-a', data: component.items } as any;
      const fakeEvent = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 0,
        currentIndex: 2,
        item: { data: component.items[0] } as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 }
      };
      (directive as any).handleDrop(fakeEvent);

      // Original array should not be mutated
      expect(component.items).toEqual(originalItems);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      const subscriptions = (directive as any).subscriptions;
      spyOn(subscriptions, 'unsubscribe');
      fixture.destroy();
      expect(subscriptions.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('entered event', () => {
    it('should emit dragEntered when CdkDropList.entered fires', () => {
      const cdkDropList = fixture.debugElement.query(By.directive(CdkDropList)).injector.get(CdkDropList);

      const fakeEnterEvent = {
        item: { data: component.items[0] } as any,
        container: cdkDropList,
        currentIndex: 0,
        isPointerOverContainer: true
      };
      cdkDropList.entered.emit(fakeEnterEvent as any);

      expect(component.dragEnteredEvent).not.toBeNull();
      expect(component.dragEnteredEvent.item).toEqual(component.items[0]);
      expect(component.dragEnteredEvent.container).toBe('list-a');
    });
  });
});
