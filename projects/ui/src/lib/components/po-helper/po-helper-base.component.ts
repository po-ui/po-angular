import { Directive, input } from '@angular/core';
import { PoHelperOptions } from './interfaces/po-helper.interface';
import { PoThemeService } from '../../services';
import { PoHelperSize } from './enums/po-helper-size.enum';
import { getDefaultSize, validateSize } from '../../utils/util';

@Directive()
export class PoHelperBaseComponent {
  helper = input<PoHelperOptions | string>(undefined, { alias: 'p-helper' });

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura do input como 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura do input como 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  size = input<'small' | 'medium'>('medium', { alias: 'p-size' });
}
