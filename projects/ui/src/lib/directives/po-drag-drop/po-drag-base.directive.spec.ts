import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PoDragDirective } from './po-drag.directive';
import { PoDragDropModule } from './po-drag-drop.module';
import { PoWidgetModule } from '../../components/po-widget/po-widget.module';

interface TestItem {
  id: string;
  name: string;
}

@Component({
  template: `
    <po-widget
      [p-drag]="item"
      [p-drag-disabled]="disabled"
      (p-drag-started)="onStarted($event)"
      (p-drag-ended)="onEnded($event)"
      (p-drag-moved)="onMoved($event)"
    ></po-widget>
  `,
  standalone: false
})
class TestHostComponent {
  item: TestItem = { id: '1', name: 'test' };
  disabled = false;
  startedItem: TestItem | null = null;
  endedItem: TestItem | null = null;
  movedEvent: any = null;

  onStarted(item: TestItem) {
    this.startedItem = item;
  }

  onEnded(item: TestItem) {
    this.endedItem = item;
  }

  onMoved(event: any) {
    this.movedEvent = event;
  }
}

@Component({
  template: `<po-widget [p-drag]="item" [p-drag-disabled]="'true'"></po-widget>`,
  standalone: false
})
class TestStringBooleanHostComponent {
  item: TestItem = { id: '2', name: 'string boolean' };
}

describe('PoDragBaseDirective (via PoDragDirective)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let directive: PoDragDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoDragDropModule, PoWidgetModule],
      declarations: [TestHostComponent, TestStringBooleanHostComponent]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    directive = fixture.debugElement.query(By.directive(PoDragDirective)).injector.get(PoDragDirective);
  });

  it('should create the host component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a po-widget with poDrag applied', () => {
    const el = fixture.nativeElement.querySelector('po-widget');
    expect(el).toBeTruthy();
  });

  describe('data input (p-drag)', () => {
    it('should read `data` signal with the bound item', () => {
      expect(directive.data()).toEqual(jasmine.objectContaining({ id: '1', name: 'test' }));
    });

    it('should reflect changes when input item is updated', () => {
      component.item = { id: '99', name: 'changed' };
      fixture.detectChanges();
      expect(directive.data()).toEqual(jasmine.objectContaining({ id: '99', name: 'changed' }));
    });

    it('should accept undefined as data value', () => {
      component.item = undefined;
      fixture.detectChanges();
      expect(directive.data()).toBeUndefined();
    });

    it('should accept null as data value', () => {
      component.item = null;
      fixture.detectChanges();
      expect(directive.data()).toBeNull();
    });
  });

  describe('dragDisabled input (p-drag-disabled)', () => {
    it('should read `dragDisabled` signal as false by default', () => {
      expect(directive.dragDisabled()).toBeFalse();
    });

    it('should read `dragDisabled` signal as true when bound to true', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(directive.dragDisabled()).toBeTrue();
    });

    it('should toggle dragDisabled back to false', () => {
      component.disabled = true;
      fixture.detectChanges();
      component.disabled = false;
      fixture.detectChanges();
      expect(directive.dragDisabled()).toBeFalse();
    });

    it('should accept string "true" via convertToBoolean transform', () => {
      const strFixture = TestBed.createComponent(TestStringBooleanHostComponent);
      strFixture.detectChanges();
      const strDirective = strFixture.debugElement.query(By.directive(PoDragDirective)).injector.get(PoDragDirective);
      expect(strDirective.dragDisabled()).toBeTrue();
    });
  });

  describe('dragStarted output (p-drag-started)', () => {
    it('should emit the item data when dragStarted fires', () => {
      directive.dragStarted.emit(component.item);
      expect(component.startedItem).toEqual(component.item);
    });

    it('should emit updated item data after input change', () => {
      const newItem: TestItem = { id: '5', name: 'new item' };
      component.item = newItem;
      fixture.detectChanges();
      directive.dragStarted.emit(directive.data());
      expect(component.startedItem).toEqual(newItem);
    });
  });

  describe('dragEnded output (p-drag-ended)', () => {
    it('should emit the item data when dragEnded fires', () => {
      directive.dragEnded.emit(component.item);
      expect(component.endedItem).toEqual(component.item);
    });
  });

  describe('dragMoved output (p-drag-moved)', () => {
    it('should emit CdkDragMove event when dragMoved fires', () => {
      const fakeEvent = {
        source: {},
        pointerPosition: { x: 100, y: 200 },
        distance: { x: 10, y: 20 },
        delta: { x: 1, y: 0 }
      } as any;
      directive.dragMoved.emit(fakeEvent);
      expect(component.movedEvent).toEqual(fakeEvent);
    });
  });
});
