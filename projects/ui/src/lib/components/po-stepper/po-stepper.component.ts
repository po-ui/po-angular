import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, QueryList } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { take, tap, catchError } from 'rxjs/operators';

import { PoStepperStatus } from './enums/po-stepper-status.enum';
import { PoStepComponent } from './po-step/po-step.component';
import { PoStepperBaseComponent } from './po-stepper-base.component';
import { PoStepperItem } from './po-stepper-item.interface';

/**
 * @docsExtends PoStepperBaseComponent
 *
 * @example
 *
 * <example name="po-stepper-basic" title="PO Stepper Basic">
 *  <file name="sample-po-stepper-basic/sample-po-stepper-basic.component.html"> </file>
 *  <file name="sample-po-stepper-basic/sample-po-stepper-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-stepper-labs" title="PO Stepper Labs">
 *  <file name="sample-po-stepper-labs/sample-po-stepper-labs.component.html"> </file>
 *  <file name="sample-po-stepper-labs/sample-po-stepper-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-stepper-sales" title="PO Stepper - Sales">
 *  <file name="sample-po-stepper-sales/sample-po-stepper-sales.component.html"> </file>
 *  <file name="sample-po-stepper-sales/sample-po-stepper-sales.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-stepper',
  templateUrl: './po-stepper.component.html'
})
export class PoStepperComponent extends PoStepperBaseComponent implements AfterContentInit {
  @ContentChildren(PoStepComponent) poSteps: QueryList<PoStepComponent>;

  private currentActiveStep: PoStepComponent;
  private previousActiveStep: PoStepComponent;

  get currentStepIndex(): number {
    return this.step - 1;
  }

  get stepList(): QueryList<PoStepComponent> | Array<PoStepperItem> {
    return (this.usePoSteps && this.poSteps) || this.steps;
  }

  get usePoSteps(): boolean {
    return !!this.poSteps.length;
  }

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngAfterContentInit() {
    this.activeFirstStep();

    this.poSteps.changes.subscribe(() => {
      this.controlStepsStatus(0, this.poSteps.first);
    });
  }

  /**
   * Altera o status do *step* para ativo.
   *
   * > Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).
   *
   * @param {number} index Índice do `po-step` que se deseja ativar.
   */
  active(index: number): void {
    if (!this.usePoSteps) {
      return;
    }

    const stepsArray = this.getPoSteps();
    const step = stepsArray[index];
    const isDisabledStep = step.status === PoStepperStatus.Disabled;
    const isErrorStep = step.status === PoStepperStatus.Error;

    if (!isDisabledStep || isErrorStep) {
      this.changeStep(index, step);
    }
  }

  /**
   * Ativa o primeiro *step*.
   *
   * > Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).
   */
  first(): void {
    if (!this.usePoSteps) {
      return;
    }

    const firstStep = this.poSteps.first;
    const firstStepIndex = 0;

    this.changeStep(firstStepIndex, firstStep);
  }

  /**
   * Ativa o próximo *step*.
   *
   * > Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).
   */
  next(): void {
    if (!this.usePoSteps) {
      return;
    }

    const { steps, stepIndex } = this.getStepsAndIndex(this.currentActiveStep);
    const nextIndex = stepIndex + 1;
    const nextStep = steps[nextIndex];

    this.changeStep(nextIndex, nextStep);
  }

  /**
   * Ativa o *step* anterior.
   *
   * > Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).
   */
  previous(): void {
    if (!this.usePoSteps) {
      return;
    }

    const { steps, stepIndex } = this.getStepsAndIndex(this.currentActiveStep);
    const previousIndex = stepIndex - 1;
    const previousStep = steps[previousIndex];

    this.changeStep(previousIndex, previousStep);
  }

  changeStep(stepIndex: number, step?: PoStepComponent): void {
    this.allowNextStep(stepIndex)
      .pipe(take(1))
      .subscribe(nextStepAllowed => {
        if (nextStepAllowed) {
          const isDifferentStep = !this.currentActiveStep || step.id !== this.currentActiveStep.id;

          if (this.usePoSteps && isDifferentStep) {
            this.controlStepsStatus(stepIndex, step);
            this.onChangeStep.emit(step);
          } else if (!this.usePoSteps && stepIndex !== this.currentStepIndex) {
            // if para tratamento do modelo antigo do po-stepper
            this.onChangeStep.emit(stepIndex + 1);
          }
        }
      });
  }

  onStepActive(step: PoStepComponent) {
    this.currentActiveStep = step;

    this.previousActiveStep = this.poSteps.find(
      stepChild => stepChild.status === PoStepperStatus.Active && stepChild.id !== step.id
    );

    this.setPreviousStepAsDone();
  }

  trackByFn(step: PoStepComponent) {
    return step.id;
  }

  private activeFirstStep() {
    const hasStepActive = this.poSteps.some(poStep => poStep.status === PoStepperStatus.Active);

    if (this.usePoSteps && !hasStepActive) {
      this.changeStep(0, this.poSteps.first);
    }
  }

  private allowNextStep(nextStepIndex: number): Observable<boolean> {
    if (!this.sequential) {
      return of(true);
    }

    const isAllowNextStep$ = this.usePoSteps
      ? this.isBeforeStep(nextStepIndex) || this.canActiveNextStep(this.currentActiveStep)
      : this.steps.slice(this.step, nextStepIndex).every(step => step.status === PoStepperStatus.Done);

    return typeof isAllowNextStep$ === 'boolean' ? of(isAllowNextStep$) : isAllowNextStep$;
  }

  private canActiveNextStep(currentActiveStep = <PoStepComponent>{}): Observable<boolean> {
    if (!currentActiveStep.canActiveNextStep) {
      return of(true);
    }

    const canActiveNextStep = currentActiveStep.canActiveNextStep(currentActiveStep);

    const canActiveNextStep$ = canActiveNextStep instanceof Observable ? canActiveNextStep : of(canActiveNextStep);

    return canActiveNextStep$.pipe(
      tap(isCanActiveNextStep => {
        currentActiveStep.status = this.getStepperStatusByCanActive(isCanActiveNextStep);
      }),
      catchError(err => {
        currentActiveStep.status = PoStepperStatus.Error;

        return throwError(err);
      })
    );
  }

  private controlStepsStatus(stepIndex: number, step: PoStepComponent): void {
    if (this.usePoSteps) {
      this.setStepAsActive(step);
      this.setNextStepAsDefault(step);

      if (this.isBeforeStep(stepIndex)) {
        this.setFinalSteppersAsDisabled(stepIndex);
      }

      this.changeDetector.detectChanges();
    }
  }

  private getStepperStatusByCanActive(canActiveNextStep: boolean): PoStepperStatus {
    return canActiveNextStep ? PoStepperStatus.Done : PoStepperStatus.Error;
  }

  private getStepsAndIndex(step: PoStepComponent = <any>{}): { steps: Array<PoStepComponent>; stepIndex: number } {
    const steps = this.getPoSteps();
    const stepIndex = steps.findIndex(poStep => poStep.id === step.id);

    return { steps, stepIndex };
  }

  private getPoSteps(): Array<PoStepComponent> {
    return this.poSteps.toArray();
  }

  private isBeforeStep(stepIndex: number): boolean {
    const currentActiveStepIndex = () => this.getPoSteps().findIndex(step => step.id === this.currentActiveStep.id);

    return !!this.currentActiveStep && currentActiveStepIndex() >= stepIndex;
  }

  private setFinalSteppersAsDisabled(stepIndex: number): void {
    this.getPoSteps()
      .filter((step, index) => step && index >= stepIndex + 2)
      .forEach(step => (step.status = PoStepperStatus.Disabled));
  }

  private setStepAsActive(step: PoStepComponent): void {
    step.status = PoStepperStatus.Active;
  }

  private setNextStepAsDefault(currentStep: PoStepComponent): void {
    const { steps, stepIndex } = this.getStepsAndIndex(currentStep);
    const nextIndex = stepIndex + 1;

    if (nextIndex < this.poSteps.length) {
      steps[nextIndex].status = PoStepperStatus.Default;
    }
  }

  private setPreviousStepAsDone(): void {
    if (this.previousActiveStep) {
      this.previousActiveStep.status = PoStepperStatus.Done;
    }
  }
}
