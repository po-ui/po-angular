import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por exibir um ícone na tabela.
 */
@Component({
  selector: 'po-table-icon',
  templateUrl: './po-table-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoTableIconComponent {
  tooltip: string;

  /** Define se o ícone é clicável. */
  @Input('p-clickable') clickable: boolean;

  /** Cor do ícone. */
  @Input('p-color') color: string;

  /** Desabilitado. */
  @Input('p-disabled') disabled: boolean;

  /** Classe css do ícone. */
  @Input('p-icon') icon: string;

  /** Texto do tooltip. */
  @Input('p-icon-tooltip') iconTooltip: string;

  /** Output click. */
  @Output('p-click') click: EventEmitter<any> = new EventEmitter();

  private get allowTooltip() {
    return !this.disabled && this.iconTooltip;
  }

  onClick(event) {
    if (this.clickable) {
      this.click.emit(event);
    }
  }

  tooltipMouseEnter() {
    if (this.allowTooltip) {
      this.tooltip = this.iconTooltip;
    }
  }

  tooltipMouseLeave() {
    this.tooltip = undefined;
  }
}
