import {
  effect,
  inject,
  OnInit,
  Injector,
  Renderer2,
  Directive,
  OnDestroy,
  ElementRef,
  ComponentRef,
  ApplicationRef,
  createComponent,
  EnvironmentInjector
} from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { PoDragBaseDirective } from './po-drag-base.directive';
import { PoDropListDirective } from './po-drop-list.directive';
import { PoDragMovedEvent } from './interfaces/po-draggable-item.interface';
import { PoDragHandleButtonComponent } from './po-drag-handle-button/po-drag-handle-button.component';

/**
 * @docsExtends PoDragBaseDirective
 *
 * @description
 *
 * A diretiva `p-drag` torna um elemento arrastável, encapsulando o `CdkDrag` do Angular CDK.
 *
 * Ela pode ser usada em conjunto com a diretiva `p-drop-list`. O valor atribuído ao seletor (`p-drag`)
 * corresponde ao dado do item, que é emitido nos eventos de drag.
 *
 * > Atualmente validada com o componente `po-widget`. O suporte a outros componentes
 * > PO UI será avaliado em versões futuras.
 *
 * @example
 *
 * <example name="po-drag-basic" title="PO Drag Basic" >
 *  <file name="sample-po-drag-basic/sample-po-drag-basic.component.html"> </file>
 *  <file name="sample-po-drag-basic/sample-po-drag-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-drop-list-vertical" title="PO Drop List - Vertical (Kanban)" >
 *  <file name="sample-po-drop-list-vertical/sample-po-drop-list-vertical.component.html"> </file>
 *  <file name="sample-po-drop-list-vertical/sample-po-drop-list-vertical.component.ts"> </file>
 * </example>
 *
 * <example name="po-drop-list-horizontal" title="PO Drop List - Horizontal (Pipeline)" >
 *  <file name="sample-po-drop-list-horizontal/sample-po-drop-list-horizontal.component.html"> </file>
 *  <file name="sample-po-drop-list-horizontal/sample-po-drop-list-horizontal.component.ts"> </file>
 * </example>
 *
 * <example name="po-drop-list-mixed" title="PO Drop List - Mixed (Dashboard)" >
 *  <file name="sample-po-drop-list-mixed/sample-po-drop-list-mixed.component.html"> </file>
 *  <file name="sample-po-drop-list-mixed/sample-po-drop-list-mixed.component.ts"> </file>
 * </example>
 *
 */
@Directive({
  selector: '[p-drag]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkDrag,
      inputs: ['cdkDragDisabled: p-drag-disabled', 'cdkDragData: p-drag']
    }
  ]
})
export class PoDragDirective extends PoDragBaseDirective implements OnInit, OnDestroy {
  private readonly cdkDrag = inject(CdkDrag);
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly injector = inject(Injector);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);
  private readonly parentDropList = inject(PoDropListDirective, { optional: true });
  private handleRef: ComponentRef<PoDragHandleButtonComponent> | null = null;

  constructor() {
    super();

    effect(() => {
      this.cdkDrag.data = this.data() as any;
    });

    effect(
      () => {
        if (this.dragDisabled() || this.parentDropList?.dropListDisabled()) {
          this.destroyHandle();
        } else {
          this.appendHandle();
        }
      },
      { injector: this.injector }
    );
  }

  ngOnInit(): void {
    this.cdkDrag.previewClass = 'po-drag-drop-item-preview';

    this.appendItemHover();

    this.cdkDrag.started.subscribe(() => {
      this.removeTooltipOnDragStart();

      const placeholder = this.cdkDrag.getPlaceholderElement();
      if (placeholder) {
        this.renderer.addClass(placeholder, 'po-drag-drop-item-placeholder');
      }

      this.dragStarted.emit(this.data());
    });

    this.cdkDrag.ended.subscribe(() => {
      this.dragEnded.emit(this.data());
    });

    this.cdkDrag.moved.subscribe((event: PoDragMovedEvent) => {
      this.dragMoved.emit(event);
    });
  }

  ngOnDestroy(): void {
    this.destroyHandle();
  }

  private appendHandle(): void {
    this.destroyHandle();

    const handleRef = createComponent(PoDragHandleButtonComponent, {
      environmentInjector: this.envInjector,
      elementInjector: this.injector
    });

    this.appRef.attachView(handleRef.hostView);
    handleRef.changeDetectorRef.detectChanges();
    this.renderer.appendChild(this.el.nativeElement, handleRef.location.nativeElement);
    this.handleRef = handleRef;
  }

  private destroyHandle(): void {
    if (this.handleRef) {
      this.appRef.detachView(this.handleRef.hostView);
      this.renderer.removeChild(this.el.nativeElement, this.handleRef.location.nativeElement);
      this.handleRef.destroy();
      this.handleRef = null;
    }
  }

  private removeTooltipOnDragStart(): void {
    const tooltips = document.querySelectorAll('.po-tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
  }

  private appendItemHover(): void {
    effect(
      () => {
        if (this.dragDisabled() || this.parentDropList?.dropListDisabled()) {
          this.renderer.removeClass(this.el.nativeElement, 'po-drag-drop-item');
        } else {
          this.renderer.addClass(this.el.nativeElement, 'po-drag-drop-item');
        }
      },
      { injector: this.injector }
    );
  }
}
