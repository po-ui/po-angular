import { Component, EventEmitter, Input, Output } from '@angular/core';

import { browserLanguage, convertToBoolean, isTypeof } from './../../../utils/util';
import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { PoStepperOrientation } from '../enums/po-stepper-orientation.enum';
import { PoStepperStatus } from '../enums/po-stepper-status.enum';

const poStepperStepSizeDefault = 24;
const poStepperStepSizeMax = 64;
const poStepLiteralsDefault = {
  en: { label: 'Step' },
  es: { label: 'Paso' },
  pt: { label: 'Passo' }
};

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que representa um *step* contendo as ligações das laterais (`po-stepper-step-bar`) e a label.
 */
@Component({
  selector: 'po-stepper-step',
  templateUrl: 'po-stepper-step.component.html'
})
export class PoStepperStepComponent {
  private _label: string;
  private _status: PoStepperStatus;
  private _stepIcons?: boolean = false;
  private _stepSize: number = poStepperStepSizeDefault;

  readonly literals = {
    ...poStepLiteralsDefault[poLocaleDefault],
    ...poStepLiteralsDefault[browserLanguage()]
  };

  // Conteúdo que será repassado para o componente `p-circle-content` através da propriedade `p-content`.
  @Input('p-circle-content') circleContent: any;

  // Label do *step*.
  @Input('p-label') set label(value: string) {
    this._label = isTypeof(value, 'string') ? value : `${this.literals.label} ${this.circleContent}`;
  }

  get label(): string {
    return this._label;
  }

  // Define a orientação de exibição.
  @Input('p-orientation') orientation: PoStepperOrientation;

  // Define o estado de exibição.
  @Input('p-status') set status(value: PoStepperStatus) {
    this._status = (value as string) ? value : undefined;

    if (this.status === PoStepperStatus.Active) {
      this.activated.emit();
    }
  }

  get status(): PoStepperStatus {
    return this._status;
  }

  @Input('p-step-icons') set stepIcons(stepIcons: boolean) {
    this._stepIcons = convertToBoolean(stepIcons);
  }

  get stepIcons(): boolean {
    return this._stepIcons;
  }

  // Tamanho do `step` em *pixels*, possibilitando um maior destaque.
  // O valor informado deve ser entre `24` e `64`.
  @Input('p-step-size') set stepSize(value: number) {
    this._stepSize =
      value >= poStepperStepSizeDefault && value <= poStepperStepSizeMax ? value : poStepperStepSizeDefault;
  }

  get stepSize(): number {
    return this._stepSize;
  }

  // Evento que será emitido quando o status do *step* estiver ativo (`PoStepperStatus.Active`).
  @Output('p-activated') activated = new EventEmitter<any>();

  // Evento que será emitido ao clicar no *step*.
  @Output('p-click') click = new EventEmitter<any>();

  // Evento que será emitido ao focar no *step* e pressionar a tecla *enter*.
  @Output('p-enter') enter = new EventEmitter<any>();

  get halfStepSize(): number {
    return this.stepSize / 2;
  }

  get isVerticalOrientation(): boolean {
    return this.orientation === PoStepperOrientation.Vertical;
  }

  get marginHorizontalBar(): number {
    return this.isVerticalOrientation ? undefined : this.halfStepSize;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case PoStepperStatus.Active:
        return 'po-stepper-step-active';
      case PoStepperStatus.Disabled:
        return 'po-stepper-step-disabled';
      case PoStepperStatus.Done:
        return 'po-stepper-step-done';
      case PoStepperStatus.Error:
        return 'po-stepper-step-error';
      default:
        return 'po-stepper-step-default';
    }
  }

  onClick(): void {
    if (this.status !== PoStepperStatus.Disabled) {
      this.click.emit();
    }
  }

  onEnter(): void {
    if (this.status !== PoStepperStatus.Disabled) {
      this.enter.emit();
    }
  }
}
