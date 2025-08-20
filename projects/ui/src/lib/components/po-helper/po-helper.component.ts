import {
  Component,
  ElementRef,
  OnInit,
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
  public id: string;
  private boundFocusIn: (e: FocusEvent) => void;
  private poHelperLiterals = {
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

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.id = 'po-helper-' + PoHelperComponent.idCounter++;
  }

  ngAfterViewInit(): void {
    PoHelperComponent.instances.push(this);
    this.boundFocusIn = this.closePopoverOnFocusOut.bind(this);
    window.addEventListener('focusin', this.boundFocusIn, true);
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
      if (this.popover.isHidden) {
        this.popover.open();
      }
    });
  }

  closeHelperPopover(): void {
    requestAnimationFrame(() => {
      if (!this.popover.isHidden) {
        this.popover.close();
      }
    });
  }

  emitClick(event) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    const helper = this.helper();
    if (helper && typeof helper !== 'string' && typeof helper.eventOnClick === 'function') {
      helper.eventOnClick(helper);
    }
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

      if (this.popover.isHidden) {
        this.popover.open();
        return;
      } else {
        this.popover.close();
        return;
      }
    }
  }

  closePopoverOnFocusOut(event: FocusEvent) {
    if (!this.popover || this.popover.isHidden) {
      return;
    }
    const targetEl = this.target?.nativeElement;
    const popEl = (this.popover as any).popoverElement?.nativeElement;
    const focusNode = event.target as Node;
    if (focusNode && !targetEl.contains(focusNode) && !(popEl && popEl.contains(focusNode))) {
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
