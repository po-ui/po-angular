import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente de uso interno, responsável por gerar uma margem inferior nos componentes que utilizam o po-field-container.
 * Essa margem inferior pode conter uma mensagem de erro.
 */
@Component({
  selector: 'po-field-container-bottom',
  templateUrl: './po-field-container-bottom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoFieldContainerBottomComponent {
  /**
   * Mensagem que será apresentada quando o pattern ou a máscara não for satisfeita.
   * Obs: Esta mensagem não é apresentada quando o campo estiver vazio, mesmo que ele seja requerido.
   */
  @Input('p-error-pattern') errorPattern?: string = '';
}
