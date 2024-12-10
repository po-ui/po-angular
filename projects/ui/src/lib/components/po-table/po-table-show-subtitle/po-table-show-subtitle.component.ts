import { Component, Input } from '@angular/core';

import { PoTableSubtitleColumn } from '../po-table-subtitle-footer/po-table-subtitle-column.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para a criação de um botão e modal para visualização de todas as legendas.
 */
@Component({
  selector: 'po-table-show-subtitle',
  templateUrl: './po-table-show-subtitle.component.html',
  standalone: false
})
export class PoTableShowSubtitleComponent {
  /** Objeto com os dados da legenda. */
  @Input('p-subtitles') subtitles: Array<PoTableSubtitleColumn>;

  /** Propriedade que recebe as literais definidas no `po-table`. */
  @Input('p-literals') literals;

  /** Define o tamanho dos elementos que possuem `p-size` dentro do componente. */
  @Input('p-components-size') componentsSize: string;
}
