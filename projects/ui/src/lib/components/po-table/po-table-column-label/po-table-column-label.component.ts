import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PoColorPaletteService } from './../../../services/po-color-palette/po-color-palette.service';
import { PoTableColumnLabel } from './po-table-column-label.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para a criação da representação da legenda, em formato de texto .
 */

@Component({
  selector: 'po-table-column-label',
  templateUrl: './po-table-column-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoTableColumnLabelComponent {
  private _value: PoTableColumnLabel;

  /** Objeto com os dados do label */
  @Input('p-value') set value(value: PoTableColumnLabel) {
    if (value) {
      value.color = this.poColorPaletteService.getColor(value);
    }

    this._value = value;
  }
  get value(): PoTableColumnLabel {
    return this._value;
  }

  constructor(private poColorPaletteService: PoColorPaletteService) {}
}
