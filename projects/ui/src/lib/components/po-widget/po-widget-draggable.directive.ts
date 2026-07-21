import { DestroyRef, Directive, ElementRef, Injector, effect, inject, input } from '@angular/core';
import { DragRef, createDragRef } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[poWidgetDraggable]',
  standalone: false
})
export class PoWidgetDraggableDirective {
  readonly enabled = input<boolean>(false, { alias: 'poWidgetDraggable' });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private dragRef?: DragRef;

  constructor() {
    effect(() => {
      if (this.enabled()) {
        this.createDrag();
      } else {
        this.destroyDrag();
      }
    });

    inject(DestroyRef).onDestroy(() => this.destroyDrag());
  }

  private createDrag(): void {
    if (!this.dragRef) {
      this.dragRef = createDragRef(this.injector, this.el);
    }
  }

  private destroyDrag(): void {
    if (this.dragRef) {
      this.dragRef.dispose();
      this.dragRef = undefined;
    }
  }
}
