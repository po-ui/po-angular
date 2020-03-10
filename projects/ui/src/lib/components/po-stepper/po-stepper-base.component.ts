import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';

import { PoStepComponent } from './po-step/po-step.component';
import { PoStepperItem } from './po-stepper-item.interface';
import { PoStepperOrientation } from './enums/po-stepper-orientation.enum';
import { PoStepperStatus } from './enums/po-stepper-status.enum';

const poStepperOrientationDefault = PoStepperOrientation.Horizontal;

/**
 * @description
 *
 * O `po-stepper` permite que um processo seja dividido em passos para que o usuário o realize
 * mais facilmente.
 *
 * Existem duas formas de utilização:
 *
 * 1 - Usando o componente [**po-step**](/documentation/po-step) para renderizar e descrever os passos.
 *
 * 2 - Através da propriedade `p-steps` para descrever os passos do processo, sendo responsabilidade do desenvolvedor o controle
 * de renderização do que será exibido a cada *step* ativo.
 *
 * Através de suas propriedades, é possível definir se sua orientação será horizontal ou vertical,
 * além da possibilidade de aumentar o tamanho dos *steps*.
 *
 * Também é possível navegar entre os *steps* através do teclado utilizando a tecla *tab* e, para ativar o *step* em foco basta
 * pressionar a tecla *enter*. Além disso, é possível ativar a exibição de ícones no lugar de números nos *steps* através da
 * propriedade [`p-step-icons`](/documentation/po-stepper#stepIconsProperty).
 *
 * #### Utilizando os métodos do componente:
 *
 * Para acessar os métodos do componente é necessário ter a referência do mesmo.
 *
 * Por exemplo, utilizando um [**ViewChild**](https://angular.io/api/core/ViewChild):
 *
 * ```
 * @ViewChild(PoStepperComponent) poStepperComponent: PoStepperComponent;
 * ```
 *
 * E para acessar o método:
 *
 * ```
 * poStepperComponent.next();
 * ```
 *
 * #### Boas práticas
 *
 * - Evite `labels` extensos que quebram o layout do `po-stepper`, use `labels` diretos, curtos e intuitivos.
 * - Utilize apenas um `po-stepper` por página.
 */
@Directive()
export class PoStepperBaseComponent {
  private _orientation?: PoStepperOrientation = poStepperOrientationDefault;
  private _sequential?: boolean = true;
  private _step: number = 1;
  private _steps: Array<PoStepperItem> = [];

  /**
   * @optional
   *
   * @description
   *
   * Define a orientação de exibição do `po-stepper`.
   *
   * > Veja os valores válidos no *enum* [PoStepperOrientation](documentation/po-stepper#stepperOrientation).
   *
   * @default `PoStepperOrientation.Horizontal`
   */
  @Input('p-orientation') set orientation(value: PoStepperOrientation) {
    this._orientation = (<any>Object).values(PoStepperOrientation).includes(value)
      ? value
      : poStepperOrientationDefault;
  }

  get orientation(): PoStepperOrientation {
    return this._orientation;
  }

  /**
   * @optional
   *
   * @description
   *
   * Controla o passo atual do `po-stepper`.
   *
   * > Ao utilizar esta propriedade e também utilizar o componente [**po-step**](/documentation/po-step),
   * o valor desta propriedade será ignorada permanecendo a definição do [**po-step**](/documentation/po-step).
   *
   * @default `1`
   */
  @Input('p-step') set step(step: number) {
    if (step >= 1 && step <= this.steps.length) {
      this._step = step;
      this._steps[this._step - 1].status = PoStepperStatus.Active;
    }
  }

  get step(): number {
    return this._step;
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista dos itens do stepper. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio.
   *
   * > Ao utilizar esta propriedade e também utilizar o componente [**po-step**](/documentation/po-step),
   * o valor desta propriedade será ignorada permanecendo a definição do [**po-step**](/documentation/po-step).
   */
  @Input('p-steps') set steps(steps: Array<PoStepperItem>) {
    this._steps = Array.isArray(steps) ? steps : [];
    this._steps.forEach(step => (step.status = PoStepperStatus.Default));
    this.step = 1;
  }

  get steps(): Array<PoStepperItem> {
    return this._steps;
  }

  /**
   *
   * @optional
   *
   * @description
   *
   * <a id="stepIconsProperty"></a>
   *
   * Habilita a exibição de ícone ao invés de número no centro do círculo dos *steps*.
   *
   * @default `false`
   */
  @Input('p-step-icons') stepIcons: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos *steps* em *pixels*, possibilitando um maior destaque.
   *
   * O valor informado deve ser entre `24` e `64`.
   *
   * > Valores que não se enquadrarem a esta regra serão ignorados, mantendo-se o valor *default*.
   *
   * @default `24`
   */
  @Input('p-step-size') stepSize: number;

  /**
   * @optional
   *
   * @description
   *
   * Define se o `po-stepper` será sequencial ou aleatório.
   *
   * > Ao utilizar o componente [**po-step**](/documentation/po-step), o valor desta propriedade sempre será verdadeiro.
   *
   * @default `true`
   */
  @Input('p-sequential') set sequential(sequential: boolean) {
    this._sequential = convertToBoolean(sequential);
  }

  get sequential(): boolean {
    return this._sequential;
  }

  /** Ação que será executada quando o usuário mudar o passo do `po-stepper`. */
  @Output('p-change-step') onChangeStep = new EventEmitter<number | PoStepComponent>();
}
