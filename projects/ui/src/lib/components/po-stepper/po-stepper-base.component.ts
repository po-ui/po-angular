import { EventEmitter, Input, Output, Directive, TemplateRef } from '@angular/core';

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
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                              | Descrição                                             | Valor Padrão                                      |
 * |------------------------------------------|-------------------------------------------------------|---------------------------------------------------|
 * | **Label**                                |                                                       |                                                   |
 * | `--font-family`                          | Família tipográfica usada                             | `var(--font-family-theme)`                        |
 * | `--font-size`                            | Tamanho da fonte                                      | `var(--font-size-default)`                        |
 * | `--font-weight`                          | Peso da fonte                                         | `var(--font-weight-normal)`                       |
 * | **Step - Done**                          |                                                       |                                                   |
 * | `--text-color`                           | Cor do texto no step concluído                        | `var(--color-neutral-dark-70)`                    |
 * | `--color-icon-done`                      | Cor do ícone no step concluído                        | `var(--color-neutral-dark-70)`                    |
 * | `--background-done`                      | Cor de fundo no step concluído                        | `var(--color-neutral-light-00)`                   |
 * | **Line - Done**                          |                                                       |                                                   |
 * | `--color-line-done`                      | Cor da linha no step concluído                        | `var(--color-neutral-mid-40)`                     |
 * | **Step - Current**                       |                                                       |                                                   |
 * | `--color-icon-current`                   | Cor do ícone no step atual                            | `var(--color-neutral-light-00)`                   |
 * | `--background-current`                   | Cor de fundo no step atual                            | `var(--color-action-default)`                     |
 * | `--font-weight-current`                  | Peso da fonte no step atual                           | `var(--font-weight-bold)`                         |
 * | **Step - Next**                          |                                                       |                                                   |
 * | `--font-size-circle`                     | Tamanho da fonte no círculo do próximo step           | `var(--font-size-sm)`                             |
 * | `--color-next`                           | Cor do ícone no próximo step                          | `var(--color-action-disabled)`                    |
 * | `--text-color-next`                      | Cor do texto no próximo step                          | `var(--color-neutral-light-30)`                   |
 * | **Focused**                              |                                                       |                                                   |
 * | `--outline-color-focused`                | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |
 */
@Directive()
export class PoStepperBaseComponent {
  /**
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

  /** Ação que será executada quando o usuário mudar o passo do `po-stepper`. */
  @Output('p-change-step') onChangeStep = new EventEmitter<number | PoStepComponent>();

  private _alignCenter?: boolean = true;
  private _orientation?: PoStepperOrientation = poStepperOrientationDefault;
  private _sequential?: boolean = true;
  private _step: number = 1;
  private _steps: Array<PoStepperItem> = [];

  /**
   * @optional
   *
   * @description
   *
   * Define o alinhamento dos *steps* e *labels* no *stepper*, dependendo da orientação.
   *
   * - Quando `true`, ficam centralizados em ambas as orientações (horizontal e vertical).
   * - Quando `false`, ficam alinhados à esquerda na orientação horizontal e ao topo na orientação vertical.
   *
   * @default `true`
   */

  @Input('p-align-center') set alignCenter(alignCenter: boolean) {
    this._alignCenter = convertToBoolean(alignCenter);
  }

  get alignCenter(): boolean {
    return this._alignCenter;
  }

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
    this._steps.forEach(step => (step.status = step.status ?? PoStepperStatus.Default));
    this.initializeSteps();
  }

  get steps(): Array<PoStepperItem> {
    return this._steps;
  }

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

  /**
   * @optional
   *
   * @description
   * Permite definir o ícone do step no status concluído.
   * Esta propriedade permite usar ícones da [Biblioteca de ícones](https://po-ui.io/icons) ou da biblioteca [Phosphor](https://phosphoricons.com/).
   *
   * Exemplo usando a biblioteca de ícones padrão:
   * ```
   * <po-stepper p-step-icon-done="po-icon po-icon-eye">
   *    ...
   * </po-stepper>
   * ```
   * Exemplo usando a biblioteca *Phosphor*:
   * ```
   * <po-stepper p-step-icon-done="ph ph-check-circle">
   *    ...
   * </po-stepper>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-stepper [p-step-icon-done]="doneIcon">
   *    ...
   * </po-stepper>
   *
   * <ng-template #doneIcon>
   *    <i class="ph ph-check-fat"></i>
   * </ng-template>
   * ```
   * > Deve-se usar `font-size: inherit` para ajustar ícones que não se ajustam automaticamente.
   *
   * @default `po-icon-ok`
   */
  @Input('p-step-icon-done') iconDone?: string | TemplateRef<void>;

  /**
   * @optional
   *
   * @description
   * Permite definir o ícone do step no status ativo.
   * Esta propriedade permite usar ícones da [Biblioteca de ícones](https://po-ui.io/icons) ou da biblioteca [Phosphor](https://phosphoricons.com/).
   *
   * Exemplo usando a biblioteca de ícones padrão:
   * ```
   * <po-stepper p-step-icon-active="po-icon po-icon-settings">
   *    ...
   * </po-stepper>
   * ```
   * Exemplo usando a biblioteca *Phosphor*:
   * ```
   * <po-stepper p-step-icon-active="ph ph-pencil-simple-line">
   *    ...
   * </po-stepper>
   * ```
   * Para customizar o ícone através do `TemplateRef`, veja a documentação da propriedade `p-step-icon-done`.
   *
   * > Deve-se usar `font-size: inherit` para ajustar ícones que não se ajustam automaticamente.
   *
   * @default `po-icon-edit`
   */
  @Input('p-step-icon-active') iconActive?: string | TemplateRef<void>;

  private initializeSteps(): void {
    const hasStatus = this._steps.some(step => step.status !== PoStepperStatus.Default);

    if (!hasStatus && this.step === 1) {
      this.step = 1;
    }
  }
}
