import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { PoTooltipDirective } from '../../../../directives';
import { convertToBoolean } from '../../../../utils/util';
import { PoHelperComponent, PoHelperOptions } from '../../../po-helper';

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
export class PoFieldContainerBottomComponent implements OnChanges {
  @ViewChild(PoTooltipDirective) poTooltip: PoTooltipDirective;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;

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

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  /** Define o tamanho do componente. */
  @Input('p-size') size?: string;

  /** Configurações do ícone de ajuda adicional vínculado ao label. */
  poHelperComponent = input<PoHelperOptions>(undefined, { alias: 'p-helper' });

  /** Define se o componente helper estará visível através das ações customizadas */
  showHelperComponent = input<boolean>(false, { alias: 'p-show-helper' });

  private isInitialChange: boolean = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showHelperComponent && this.showHelperComponent()) {
      if (typeof this.poHelperComponent()?.eventOnClick === 'function') {
        this.poHelperComponent()?.eventOnClick();
        return;
      }
      this.helperEl?.openHelperPopover();
    } else if (changes.showHelperComponent && !this.showHelperComponent()) {
      this.helperEl?.closeHelperPopover();
    }
  }
}
