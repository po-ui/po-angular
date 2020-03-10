import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PoColorPaletteService } from './../../../services/po-color-palette/po-color-palette.service';
import { PoTableSubtitleColumn } from './../po-table-subtitle-footer/po-table-subtitle-column.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para a criação da representação da legenda, em formato de círculo.
 */
@Component({
  selector: 'po-table-subtitle-circle',
  templateUrl: './po-table-subtitle-circle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoTableSubtitleCircleComponent {
  private _subtitle: PoTableSubtitleColumn;

  /** Objeto com os dados da legenda. */
  @Input('p-subtitle') set subtitle(subtitle: PoTableSubtitleColumn) {
    if (subtitle) {
      subtitle.color = this.poColorPaletteService.getColor(subtitle);
    }
    this._subtitle = subtitle;
  }
  get subtitle(): PoTableSubtitleColumn {
    return this._subtitle;
  }

  /** Esconde a tooltip. */
  @Input('p-hide-title')
  hideTitle: boolean = false;

  constructor(private poColorPaletteService: PoColorPaletteService) {}
}
