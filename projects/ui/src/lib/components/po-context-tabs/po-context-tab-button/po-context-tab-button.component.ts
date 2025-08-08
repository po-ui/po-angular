import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { PoTabButtonComponent } from '../../po-tabs/po-tab-button/po-tab-button.component';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por manipular os botões de aba.
 */
@Component({
  selector: 'po-context-tab-button',
  templateUrl: './po-context-tab-button.component.html',
  standalone: false
})
export class PoContextTabButtonComponent extends PoTabButtonComponent implements OnChanges, AfterViewInit {
  @Input('p-hide-close') hideClose: boolean = false;
  @Input('p-show-tooltip') showTooltip: boolean = false;
  @Input('p-literals') literals;
  @Output('p-close') close: EventEmitter<any> = new EventEmitter<any>();

  // Função sera emitida quando ocorre mudança da visibilidade da tab
  @Output('p-change-visible') changeVisible = new EventEmitter();

  activeCloseIcon = false;
  afterViewChecked = false;

  ngAfterViewInit(): void {
    this.afterViewChecked = true;
    this.widthButton = this.tabButtom.nativeElement.offsetWidth;
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hide?.currentValue || changes.disabled?.currentValue) {
      this.changeState.emit(this);
    }

    if (!changes.hide?.firstChange && changes.hide && this.afterViewChecked) {
      this.changeVisible.emit(this);
    }
  }

  closeTab(event) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
    }

    if ((!event.key || event?.key === 'Enter') && !this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      this.close.emit(this.tabButtom);
    }
  }

  onFocusIn() {
    if (!this.disabled) {
      this.activeCloseIcon = true;
    }
  }

  onFocusOut() {
    this.activeCloseIcon = false;
  }
}
