import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PoHelperBaseComponent } from './po-helper-base.component';

import { PoPopoverComponent } from '../po-popover/po-popover.component';

@Component({
  selector: 'po-helper',
  standalone: false,
  templateUrl: './po-helper.component.html',
  styleUrls: ['./po-helper.component.css']
})
export class PoHelperComponent extends PoHelperBaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('target', { read: ElementRef, static: true }) target: ElementRef;
  @ViewChild('popover', { static: false }) popover: PoPopoverComponent;

  private static instances: Array<PoHelperComponent> = [];
  private boundFocusIn: (e: FocusEvent) => void;

  ngOnInit() {
    console.log('this.helper', this.helper());
    console.log('Initial size:', this.size());
  }

  ngAfterViewInit(): void {
    PoHelperComponent.instances.push(this);
    this.boundFocusIn = (event: FocusEvent) => {
      if (!this.popover || this.popover.isHidden) {
        return;
      }
      const targetEl = this.target?.nativeElement;
      const popEl = (this.popover as any).popoverElement?.nativeElement;
      const focusNode = event.target as Node;
      if (focusNode && !targetEl.contains(focusNode) && !(popEl && popEl.contains(focusNode))) {
        this.popover.close();
      }
    };
    window.addEventListener('focusin', this.boundFocusIn, true);
  }

  ngOnDestroy(): void {
    PoHelperComponent.instances = PoHelperComponent.instances.filter(i => i !== this);
    if (this.boundFocusIn) {
      window.removeEventListener('focusin', this.boundFocusIn, true);
    }
  }

  onSpace(event: KeyboardEvent) {
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
    } else {
      this.popover.close();
    }
  }
}
