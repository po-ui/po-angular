import { AfterContentInit, Component, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { uuid } from '../../../utils/util';

import { PoStepperStatus } from '../enums/po-stepper-status.enum';

/**
 * @description
 *
 * O componente `po-step` é utilizado para envolver e renderizar o conteúdo de um passo (*step*) do `po-stepper`, por exemplo:
 *
 * ```
 * <po-stepper>
 *
 *    <po-step p-label="Endereço">
 *
 *        <!-- Conteúdo referente ao endereço -->
 *
 *    </po-step>
 *
 *    <po-step p-label="Pagamento">
 *
 *        <!-- Conteúdo referente ao pagamento -->
 *
 *    </po-step>
 *
 *  </po-stepper>
 * ```
 *
 * A renderização do conteúdo envolvido na tela e o controle dos status são feitos automaticamente. No qual, o primeiro
 * `po-step` encontrado será colocado como ativo, o próximo fica com o status *default* e os demais ficam
 * desabilitados (*disabled*).
 *
 * Ao clicar no `po-step` que está com o status *default*, o que está ativo ficará com o
 * status de concluído (*done*) e o próximo que estava desabilitado ficará com o status *default* e o restante permanecerá
 * com o status desabilitado.
 *
 * > Ao utilizar o `po-step`, o componente `po-stepper` funcionará de forma sequencial, ou seja, não será possível
 * pular para outro `po-step` que esteja com o status igual a desabilitado (*disabled*).
 *
 * Acesse a [documentação do `po-stepper`](/documentation/po-stepper) para ter mais informações sobre o seu funcionamento
 * e exemplos de uso.
 */
@Component({
  selector: 'po-step',
  templateUrl: 'po-step.component.html'
})
export class PoStepComponent implements AfterContentInit {
  private _status?: PoStepperStatus = PoStepperStatus.Disabled;

  // ID do step
  id?: string = uuid();

  /**
   * @optional
   *
   * @description
   *
   * Função chamada quando o próximo *step* for clicado ou quando o método `PoStepperComponent.next()` for chamado.
   * Ao retornar `true` define que esse *step* ficará ativo e o atual como concluído (*done*).
   * Também aceita funções que retornem `Observable<boolean>`. Ao retornar um `Observable<boolean>`,
   * garanta que esse `Observable` será completado, caso houver algum erro durante o processo não será possível prosseguir
   * ao próximo *step*.
   *
   * Ao ser disparada, a mesma receberá por parâmetro o `PoStepComponent` atual.
   *
   * O contexto da função que será chamada, será o mesmo que o do `PoStepComponent`, então para poder alterar
   * para o contexto do componente que o está utilizando, pode ser utilizado a propriedade `bind` do Javascript.
   * Por exemplo, para a função `validate`:
   *
   * ```
   * <po-step p-label="Step 1" [p-can-active-next-step]="validate.bind(this)">
   * ...
   * </po-step>
   * ```
   */
  @Input('p-can-active-next-step') canActiveNextStep:
    | ((currentStep) => boolean)
    | ((currentStep) => Observable<boolean>);

  /** Título que será exibido descrevendo o passo (*step*). */
  @Input('p-label') label: string;

  // Estado de exibição do `po-step`.
  @Input('p-status') set status(status: PoStepperStatus) {
    this._status = status;

    this.setDisplayOnActiveOrError();
  }

  get status() {
    return this._status;
  }

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit() {
    this.setDisplayOnActiveOrError();
  }

  protected setDisplayOnActiveOrError() {
    this.elementRef.nativeElement.style.display =
      this.status === PoStepperStatus.Active || this.status === PoStepperStatus.Error ? '' : 'none';
  }
}
