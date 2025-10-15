import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { PoHelperBaseComponent } from './po-helper-base.component';
import { PoPopoverComponent } from '../po-popover/po-popover.component';
import { PoButtonComponent } from '../po-button';
/**
 * @docsExtends PoHelperBaseComponent
 *
 * @example
 *
 * <example name="po-helper-basic" title="PO Helper Basic">
 *  <file name="sample-po-helper-basic/sample-po-helper-basic.component.html"> </file>
 *  <file name="sample-po-helper-basic/sample-po-helper-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-helper-labs" title="PO Helper Labs">
 *  <file name="sample-po-helper-labs/sample-po-helper-labs.component.html"> </file>
 *  <file name="sample-po-helper-labs/sample-po-helper-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-helper-sales-performance" title="PO Helper Sales Performance">
 *  <file name="sample-po-helper-sales-performance/sample-po-helper-sales-performance.component.html"> </file>
 *  <file name="sample-po-helper-sales-performance/sample-po-helper-sales-performance.component.ts"> </file>
 * </example>
 *
 */

@Component({
  selector: 'po-helper',
  standalone: false,
  templateUrl: './po-helper.component.html'
})
export class PoHelperComponent extends PoHelperBaseComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('target', { read: ElementRef, static: true }) target: ElementRef;
  @ViewChild('popover', { static: false }) popover: PoPopoverComponent;
  @ViewChild(PoButtonComponent, { read: ElementRef, static: true }) poButton: PoButtonComponent;

  private static instances: Array<PoHelperComponent> = [];
  private static idCounter = 0;
  protected popoverPosition = 'right';
  public id: string;
  private boundFocusIn: (e: FocusEvent) => void;
  private readonly poHelperLiterals = {
    en: {
      info: 'Show Information',
      help: 'Show Help'
    },
    pt: {
      info: 'Exibe informação',
      help: 'Exibe ajuda'
    },
    es: {
      info: 'Muestra información',
      help: 'Muestra ayuda'
    },
    ru: {
      info: 'Показать информацию',
      help: 'Показать справку'
    }
  };

  constructor(private readonly cdr: ChangeDetectorRef) {
    super();
    this.id = 'po-helper-' + PoHelperComponent.idCounter++;
  }
  ngAfterViewInit(): void {
    PoHelperComponent.instances.push(this);
    this.boundFocusIn = this.closePopoverOnFocusOut.bind(this);
    window.addEventListener('focusin', this.boundFocusIn, true);
    queueMicrotask(() => {
      this.setPopoverPositionByScreen();
    });
  }

  public setPopoverPositionByScreen(): void {
    if (!this.target?.nativeElement) return;
    const rect = this.target.nativeElement.getBoundingClientRect();
    const screenWidth = window.innerWidth || document.documentElement.clientWidth;
    if (rect.right + 400 > screenWidth) {
      this.popoverPosition = 'left';
    } else {
      this.popoverPosition = 'right';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.size) {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    PoHelperComponent.instances = PoHelperComponent.instances.filter(i => i !== this);
    if (this.boundFocusIn) {
      window.removeEventListener('focusin', this.boundFocusIn, true);
    }
  }

  openHelperPopover(): void {
    requestAnimationFrame(() => {
      if (
        this.popover.isHidden &&
        (this.helper()['content'] || typeof this.helper() === 'string' || this.helper()['title'])
      ) {
        this.popover.open();
      }
    });
  }

  public helperIsVisible(): boolean {
    return this.popover && !this.popover.isHidden;
  }

  closeHelperPopover(): void {
    requestAnimationFrame(() => {
      if (!this.popover.isHidden) {
        this.popover.close();
      }
    });
  }

  emitClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    if (!this.helper() || typeof this.helper() === 'string') {
      return;
    }
    this.handleEmitEvent(event);
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.disabled()) {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      return;
    }
    if (event?.code === 'Space' || event?.code === 'Enter') {
      event.preventDefault();
      if (!this.popover) {
        return;
      }

      PoHelperComponent.instances.forEach(instance => {
        if (instance !== this && instance.popover && !instance.popover.isHidden) {
          instance.popover.close();
        }
      });
      // corrige um problema onde o popover abre quando o helper tem ação customizada via eventOnClick
      if (typeof this.helper() !== 'string') {
        const helperObj = this.helper();
        if (
          helperObj &&
          typeof helperObj === 'object' &&
          'eventOnClick' in helperObj &&
          typeof helperObj.eventOnClick !== 'undefined'
        ) {
          this.handleEmitEvent(event);
          return;
        }
      }
      if (this.popover.isHidden && (this.helper()['content'] || this.helper()['title'])) {
        this.popover.open();
      } else {
        this.popover.close();
      }
      this.handleEmitEvent(event);
    }
  }

  private handleEmitEvent(event: any): void {
    const helper = this.helper();
    const onClick = (helper as any).eventOnClick;

    if (typeof onClick === 'function') {
      onClick(helper);
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (onClick && typeof onClick.emit === 'function') {
      onClick.emit(helper);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  closePopoverOnFocusOut(event: FocusEvent) {
    if (!this.popover || this.popover.isHidden) {
      return;
    }
    const targetEl = this.target?.nativeElement;
    const popEl = (this.popover as any).popoverElement?.nativeElement;
    const focusNode = event.target as Node;
    if (focusNode && !targetEl.contains(focusNode) && !popEl?.contains(focusNode)) {
      this.popover.close();
    }
  }

  protected ariaLabel(): string {
    const helper = this.helper();
    const type = typeof helper !== 'string' && helper?.type === 'info' ? 'info' : 'help';
    const lang = (navigator.language || 'en').substring(0, 2).toLowerCase();
    const literals = this.poHelperLiterals[lang] || this.poHelperLiterals['en'];
    return literals[type];
  }
}
