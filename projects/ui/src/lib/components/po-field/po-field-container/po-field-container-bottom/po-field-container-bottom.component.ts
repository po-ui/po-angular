import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { convertToBoolean } from '../../../../utils/util';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoFieldContainerBottomComponent {
  /** Texto exibido no tooltip do ícone de ajuda adicional. */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string = '';

  /** Define se o tooltip será inserido no `body` em vez do componente. */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendBox: boolean = false;

  @Input('p-disabled') disabled: boolean = false;

  /**
   * Mensagem que será apresentada quando o pattern ou a máscara não for satisfeita.
   * Obs: Esta mensagem não é apresentada quando o campo estiver vazio, mesmo que ele seja requerido.
   */
  @Input('p-error-pattern') errorPattern?: string = '';

  /**
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   */
  @Input('p-error-limit') errorLimit: boolean = false;

  @Input('p-help') help?: string;

  /** Exibe o ícone de ajuda adicional. */
  @Input('p-show-additional-help-icon') showAdditionalHelpIcon: boolean = false;

  /** Evento disparado ao clicar no ícone de ajuda adicional. */
  @Output('p-additional-help') additionalHelp = new EventEmitter<any>();
}
