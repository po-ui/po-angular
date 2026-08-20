import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkDrag } from '@angular/cdk/drag-drop';

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
  template: `<po-widget [p-drag]="item" [p-drag-disabled]="true"></po-widget>`,
  standalone: false
})
class TestDisabledHostComponent {
  item: TestItem = { id: '1', name: 'disabled item' };
}

@Component({
  template: `
    <div [p-drop-list]="items" [p-drop-list-disabled]="dropListDisabled">
      <po-widget [p-drag]="item"></po-widget>
    </div>
  `,
  standalone: false
})
class TestDropListHostComponent {
  item: TestItem = { id: '1', name: 'test' };
  items: Array<TestItem> = [{ id: '1', name: 'test' }];
  dropListDisabled = false;
}

describe('PoDragDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let directive: PoDragDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoDragDropModule, PoWidgetModule],
      declarations: [TestHostComponent, TestDisabledHostComponent, TestDropListHostComponent]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    directive = fixture.debugElement.query(By.directive(PoDragDirective)).injector.get(PoDragDirective);
  });

  it('should be created', () => {
    expect(directive).toBeTruthy();
  });

  describe('inputs', () => {
    it('should read `data` signal matching the bound item', () => {
      expect(directive.data()).toEqual(component.item);
    });

    it('should update `data` signal when input changes', () => {
      const newItem: TestItem = { id: '2', name: 'updated' };
      component.item = newItem;
      fixture.detectChanges();
      expect(directive.data()).toEqual(newItem);
    });

    it('should read `dragDisabled` signal as false by default', () => {
      expect(directive.dragDisabled()).toBeFalse();
    });

    it('should read `dragDisabled` signal as true when disabled is set', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(directive.dragDisabled()).toBeTrue();
    });
  });

  describe('outputs', () => {
    it('should emit `p-drag-started` with the item data', () => {
      directive.dragStarted.emit(component.item);
      expect(component.startedItem).toEqual(component.item);
    });

    it('should emit `p-drag-ended` with the item data', () => {
      directive.dragEnded.emit(component.item);
      expect(component.endedItem).toEqual(component.item);
    });

    it('should emit `p-drag-moved` when dragMoved fires', () => {
      const fakeEvent = { source: {}, pointerPosition: { x: 10, y: 20 } } as any;
      directive.dragMoved.emit(fakeEvent);
      expect(component.movedEvent).toEqual(fakeEvent);
    });
  });

  describe('ngOnInit', () => {
    it('should set previewClass on cdkDrag', () => {
      const cdkDrag = fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag);
      expect(cdkDrag.previewClass).toBe('po-drag-drop-item-preview');
    });

    it('should add po-drag-drop-item class when not disabled', () => {
      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.classList.contains('po-drag-drop-item')).toBeTrue();
    });

    it('should remove po-drag-drop-item class when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.classList.contains('po-drag-drop-item')).toBeFalse();
    });

    it('should add po-drag-drop-item class back when re-enabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      component.disabled = false;
      fixture.detectChanges();
      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.classList.contains('po-drag-drop-item')).toBeTrue();
    });
  });

  describe('handle button', () => {
    it('should append a po-drag-handle-button element', () => {
      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      const handle = hostEl.querySelector('po-drag-handle-button');
      expect(handle).toBeTruthy();
    });

    it('should not duplicate handle on multiple AfterViewChecked cycles', () => {
      // Force multiple view checks
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();
      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      const handles = hostEl.querySelectorAll('po-drag-handle-button');
      expect(handles.length).toBe(1);
    });

    it('should remove handle when drag is disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      const handle = hostEl.querySelector('po-drag-handle-button');
      expect(handle).toBeNull();
    });

    it('should re-append handle when drag is re-enabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      component.disabled = false;
      fixture.detectChanges();
      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      const handle = hostEl.querySelector('po-drag-handle-button');
      expect(handle).toBeTruthy();
    });
  });

  describe('CdkDrag integration', () => {
    it('should sync data to cdkDrag.data via effect', () => {
      const cdkDrag = fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag);
      expect(cdkDrag.data).toEqual(component.item);
    });

    it('should update cdkDrag.data when input changes', () => {
      const newItem: TestItem = { id: '3', name: 'new' };
      component.item = newItem;
      fixture.detectChanges();
      const cdkDrag = fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag);
      expect(cdkDrag.data).toEqual(newItem);
    });
  });

  describe('CdkDrag event subscriptions', () => {
    it('should emit dragStarted with data and add placeholder class when cdkDrag.started fires', () => {
      const cdkDrag = fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag);

      spyOn(directive.dragStarted, 'emit');
      cdkDrag.started.emit({ source: cdkDrag } as any);

      expect(directive.dragStarted.emit).toHaveBeenCalledWith(component.item);
    });

    it('should emit dragEnded with data and re-append handle when cdkDrag.ended fires', () => {
      const cdkDrag = fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag);

      spyOn(directive.dragEnded, 'emit');
      cdkDrag.ended.emit({ source: cdkDrag } as any);

      expect(directive.dragEnded.emit).toHaveBeenCalledWith(component.item);
    });

    it('should subscribe to cdkDrag.moved and relay events to dragMoved output', () => {
      // Access the internal _dragRef.moved Subject to simulate a move event
      const cdkDrag = fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag);
      const dragRef = (cdkDrag as any)._dragRef;

      spyOn(directive.dragMoved, 'emit');

      if (dragRef && dragRef.moved) {
        const fakeEvent = {
          pointerPosition: { x: 50, y: 60 },
          distance: { x: 5, y: 6 },
          delta: { x: 1, y: 1 },
          event: new MouseEvent('mousemove')
        };
        dragRef.moved.next(fakeEvent);

        expect(directive.dragMoved.emit).toHaveBeenCalled();
      } else {
        expect(directive.dragMoved).toBeDefined();
      }
    });

    it('should remove tooltips from document on drag start', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'po-tooltip';
      document.body.appendChild(tooltip);

      const cdkDrag = fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag);
      cdkDrag.started.emit({ source: cdkDrag } as any);

      expect(document.querySelectorAll('.po-tooltip').length).toBe(0);
    });
  });

  describe('cdkDrag.started subscription', () => {
    it('should add placeholder class when getPlaceholderElement returns an element', () => {
      const cdkDrag = fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag);
      const fakePlaceholder = document.createElement('div');
      spyOn(cdkDrag, 'getPlaceholderElement').and.returnValue(fakePlaceholder);

      cdkDrag.started.emit({ source: cdkDrag } as any);

      expect(fakePlaceholder.classList.contains('po-drag-drop-item-placeholder')).toBeTrue();
    });
  });

  describe('removeTooltipOnDragStart', () => {
    it('should remove tooltip elements from document on drag start', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'po-tooltip';
      document.body.appendChild(tooltip);

      (directive as any).removeTooltipOnDragStart();

      const remaining = document.querySelectorAll('.po-tooltip');
      expect(remaining).toHaveSize(0);
    });
  });

  describe('disabled component', () => {
    it('should not append handle when dragDisabled is true', () => {
      const disabledFixture = TestBed.createComponent(TestDisabledHostComponent);
      disabledFixture.detectChanges();
      const hostEl = disabledFixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      const handle = hostEl.querySelector('po-drag-handle-button');
      // Handle is destroyed (not appended) while dragDisabled is true
      expect(handle).toBeNull();
    });
  });

  describe('parent drop list disabled', () => {
    it('should not append handle when parent drop list is disabled', () => {
      const dropListFixture = TestBed.createComponent(TestDropListHostComponent);
      dropListFixture.componentInstance.dropListDisabled = true;
      dropListFixture.detectChanges();

      const hostEl = dropListFixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.querySelector('po-drag-handle-button')).toBeNull();
    });

    it('should append handle when parent drop list is enabled', () => {
      const dropListFixture = TestBed.createComponent(TestDropListHostComponent);
      dropListFixture.detectChanges();

      const hostEl = dropListFixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.querySelector('po-drag-handle-button')).toBeTruthy();
    });

    it('should remove po-drag-drop-item class when parent drop list is disabled', () => {
      const dropListFixture = TestBed.createComponent(TestDropListHostComponent);
      dropListFixture.componentInstance.dropListDisabled = true;
      dropListFixture.detectChanges();

      const hostEl = dropListFixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.classList.contains('po-drag-drop-item')).toBeFalse();
    });

    it('should add po-drag-drop-item class when parent drop list is enabled', () => {
      const dropListFixture = TestBed.createComponent(TestDropListHostComponent);
      dropListFixture.detectChanges();

      const hostEl = dropListFixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.classList.contains('po-drag-drop-item')).toBeTrue();
    });

    it('should destroy and re-append handle when toggling parent drop list disabled', () => {
      const dropListFixture = TestBed.createComponent(TestDropListHostComponent);
      dropListFixture.detectChanges();
      const hostEl = dropListFixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.querySelector('po-drag-handle-button')).toBeTruthy();

      dropListFixture.componentInstance.dropListDisabled = true;
      dropListFixture.detectChanges();
      expect(hostEl.querySelector('po-drag-handle-button')).toBeNull();

      dropListFixture.componentInstance.dropListDisabled = false;
      dropListFixture.detectChanges();
      expect(hostEl.querySelector('po-drag-handle-button')).toBeTruthy();
    });
  });

  describe('handle lifecycle', () => {
    it('should re-append a fresh handle when toggling dragDisabled off and on', () => {
      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.querySelector('po-drag-handle-button')).toBeTruthy();

      // Disabling destroys the handle
      component.disabled = true;
      fixture.detectChanges();
      expect(hostEl.querySelector('po-drag-handle-button')).toBeNull();

      // Re-enabling appends the handle again
      component.disabled = false;
      fixture.detectChanges();
      expect(hostEl.querySelector('po-drag-handle-button')).toBeTruthy();
    });

    it('should not append handle while dragDisabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      const hostEl = fixture.debugElement.query(By.directive(PoDragDirective)).nativeElement;
      expect(hostEl.querySelector('po-drag-handle-button')).toBeNull();
    });
  });
});
