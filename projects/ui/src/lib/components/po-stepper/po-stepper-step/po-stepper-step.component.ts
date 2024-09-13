import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';

import { getShortBrowserLanguage, convertToBoolean, isTypeof } from './../../../utils/util';
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
export class PoStepperStepComponent implements OnChanges {
  // Alinhamento do *step* e da label.
  @Input('p-align-center') alignCenter: boolean;

  // Conteúdo que será repassado para o componente `p-circle-content` através da propriedade `p-content`.
  @Input('p-circle-content') circleContent: any;

  // Informa o status da próxima etapa.
  @Input('p-next-status') nextStatus;

  // Define a orientação de exibição.
  @Input('p-orientation') orientation: PoStepperOrientation;

  // Label do *step*.
  @Input('p-label') set label(value: string) {
    this._label = isTypeof(value, 'string') ? value : `${this.literals.label} ${this.circleContent}`;
  }

  get label(): string {
    return this._label;
  }

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

  @Input('p-icon-default') set iconDefault(value: string | TemplateRef<void>) {
    this._iconDefault = value;
  }

  get iconDefault(): string | TemplateRef<void> {
    return this._iconDefault;
  }

  @Input('p-step-icon-done') set iconDone(value: string | TemplateRef<void>) {
    this._iconDone = value;
  }

  get iconDone(): string | TemplateRef<void> {
    return this._iconDone;
  }

  @Input('p-step-icon-active') set iconActive(value: string | TemplateRef<void>) {
    this._iconActive = value;
  }

  get iconActive(): string | TemplateRef<void> {
    return this._iconActive;
  }

  // Informa se a orientação do stepper é vertical.
  @Input('p-vertical-orientation') isVerticalOrientation: boolean;

  // Evento que será emitido quando o status do *step* estiver ativo (`PoStepperStatus.Active`).
  @Output('p-activated') activated = new EventEmitter<any>();

  // Evento que será emitido ao clicar no *step*.
  @Output('p-click') click = new EventEmitter<any>();

  // Evento que será emitido ao focar no *step* e pressionar a tecla *enter*.
  @Output('p-enter') enter = new EventEmitter<any>();

  readonly literals = {
    ...poStepLiteralsDefault[poLocaleDefault],
    ...poStepLiteralsDefault[getShortBrowserLanguage()]
  };

  stepSizeOriginal: number;
  private _label: string;
  private _status: PoStepperStatus;
  private _stepIcons?: boolean = false;
  private _stepSize: number = poStepperStepSizeDefault;
  private _iconDefault?: string | TemplateRef<void>;
  private _iconDone?: string | TemplateRef<void>;
  private _iconActive?: string | TemplateRef<void>;

  get minHeightCircle(): number | null {
    if (this.stepSize === 24) {
      return 32;
    }

    return this.isVerticalOrientation ? Math.max(this.stepSize, 24) + 8 : null;
  }

  get minWidthCircle(): number | null {
    if (this.isVerticalOrientation && this.stepSize === 24) {
      return 32;
    }
    return null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.stepSizeOriginal === undefined || changes['stepSize']) {
      this.stepSizeOriginal = this._stepSize;
    }

    if (changes['status'] || changes['stepSize']) {
      this.setDefaultStepSize();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case PoStepperStatus.Active:
        return 'po-stepper-step-default';
      case PoStepperStatus.Disabled:
        return 'po-stepper-step-disabled';
      case PoStepperStatus.Done:
        return 'po-stepper-step-default';
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

  setDefaultStepSize(): void {
    if (this._stepSize === poStepperStepSizeDefault && this._status === PoStepperStatus.Active) {
      this._stepSize = poStepperStepSizeDefault + 8;
    } else if (
      this.stepSizeOriginal === poStepperStepSizeDefault &&
      (this._status === PoStepperStatus.Error || this._status === PoStepperStatus.Active)
    ) {
      this._stepSize = poStepperStepSizeDefault + 8;
    } else {
      this._stepSize = this.stepSizeOriginal;
    }
  }
}
