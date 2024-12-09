import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, QueryList } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { take, tap, catchError, map, mergeMap } from 'rxjs/operators';

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
 *
 * <example name="po-stepper-active" title="PO Stepper - Active">
 *  <file name="sample-po-stepper-active/sample-po-stepper-active.component.html"> </file>
 *  <file name="sample-po-stepper-active/sample-po-stepper-active.component.ts"> </file>
 *  <file name="sample-po-stepper-active/sample-po-stepper-active.service.ts"> </file>
 * </example>
 *
 * <example name="po-stepper-steps" title="PO Stepper - Steps">
 *  <file name="sample-po-stepper-steps/sample-po-stepper-steps.component.html"> </file>
 *  <file name="sample-po-stepper-steps/sample-po-stepper-steps.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-stepper',
  templateUrl: './po-stepper.component.html',
  standalone: false
})
export class PoStepperComponent extends PoStepperBaseComponent implements AfterContentInit {
  @ContentChildren(PoStepComponent) poSteps: QueryList<PoStepComponent>;

  private currentActiveStep: PoStepComponent;
  private previousActiveStepIndex: number | null = null;

  get currentStepIndex(): number {
    return this.step - 1;
  }

  get isVerticalOrientation(): boolean {
    return this.orientation === 'vertical';
  }

  get stepList(): QueryList<PoStepComponent> | Array<PoStepperItem> {
    return (this.usePoSteps && this.poSteps) || this.steps;
  }

  get stepSizeCircle(): number {
    return this.calculateDividerPosition();
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
      this.controlStepsStatus(this.poSteps.first);
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

    if (index < 0 || index >= stepsArray.length) {
      return;
    }

    const step = stepsArray[index];
    this.changeStep(index, step);
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

    if (nextIndex >= steps.length) {
      return;
    }

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

    if (previousIndex < 0) {
      return;
    }

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
            this.controlStepsStatus(step);
            this.onChangeStep.emit(step);
          } else if (!this.usePoSteps && stepIndex !== this.currentStepIndex) {
            // if para tratamento do modelo antigo do po-stepper
            this.onChangeStep.emit(stepIndex + 1);
          }
        }
      });
  }

  getNextPoSteps(stepIndex: number): PoStepComponent {
    const poSteps = this.getPoSteps();
    return poSteps[stepIndex + 1];
  }

  getNextSteps(stepIndex: number): PoStepperItem {
    return this.steps[stepIndex + 1];
  }

  getPreviousPoSteps(stepIndex: number): PoStepComponent {
    const poSteps = this.getPoSteps();
    return poSteps[stepIndex - 1];
  }

  getPreviousSteps(stepIndex: number): PoStepperItem {
    return this.steps[stepIndex - 1];
  }

  isDashedBorder(step: PoStepComponent, index: number): boolean {
    const nextStepPoSteps = this.getNextPoSteps(index);
    const nextStepSteps = this.getNextSteps(index);
    return (
      !(step.status === 'active' && (nextStepPoSteps?.status === 'done' || nextStepSteps?.status === 'done')) &&
      step.status !== 'done' &&
      (this.usePoSteps || this.sequential)
    );
  }

  isDashedBorderTop(step: PoStepComponent, index: number): boolean {
    const previousStepPoSteps = this.getPreviousPoSteps(index);
    const getPreviousSteps = this.getPreviousSteps(index);

    return (
      ((step.status === 'done' && previousStepPoSteps?.status !== 'done' && previousStepPoSteps?.status !== 'active') ||
        step.status !== 'done') &&
      ((step.status === 'done' && getPreviousSteps?.status !== 'done' && getPreviousSteps?.status !== 'active') ||
        step.status !== 'done') &&
      (step.status !== 'active' || (step.status === 'active' && getPreviousSteps?.status === 'error')) &&
      ((step.status === 'default' && getPreviousSteps?.status !== 'done') ||
        step.status === 'disabled' ||
        getPreviousSteps?.status !== 'done') &&
      previousStepPoSteps?.status !== 'done' &&
      (this.usePoSteps || this.sequential)
    );
  }

  onStepActive(step: PoStepComponent) {
    this.currentActiveStep = step;

    const { stepIndex } = this.getStepsAndIndex(this.currentActiveStep);

    this.poSteps.forEach((stepChild, i) => {
      if (i < stepIndex) {
        stepChild.status = PoStepperStatus.Done;
      }
    });
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

    if (this.hasStepWithCanActiveNextStep() && this.hasDefaultBeforeDone(nextStepIndex)) {
      return of(false);
    }

    const isAllowNextStep$ = this.checkAllowNextStep(nextStepIndex);

    return typeof isAllowNextStep$ === 'boolean' ? of(isAllowNextStep$) : isAllowNextStep$;
  }

  private canActiveNextStep(currentActiveStep = <PoStepComponent>{}, nextStepIndex?: number): Observable<boolean> {
    const isCurrentStep = this.isCurrentStep(nextStepIndex);

    if (!currentActiveStep.canActiveNextStep) {
      if (!isCurrentStep) {
        currentActiveStep.status = PoStepperStatus.Done;
      }
      return of(true);
    }

    const canActiveNextStep$ = this.getCanActiveNextStepObservable(currentActiveStep);

    return of(this.isBeforeStep(nextStepIndex)).pipe(
      mergeMap(isBefore => {
        if (isBefore && !isCurrentStep) {
          return canActiveNextStep$.pipe(
            tap(isCanActiveNextStep => {
              currentActiveStep.status = isCanActiveNextStep ? PoStepperStatus.Done : PoStepperStatus.Default;
            }),
            map(() => true)
          );
        } else {
          return canActiveNextStep$;
        }
      }),
      tap(isCanActiveNextStep => {
        if (!this.isBeforeStep(nextStepIndex) && !isCurrentStep) {
          this.updateStepStatus(currentActiveStep, isCanActiveNextStep);
        }
      }),
      catchError(err => {
        currentActiveStep.status = PoStepperStatus.Error;
        return throwError(err);
      })
    );
  }

  private checkAllowNextStep(nextStepIndex: number): Observable<boolean> {
    return this.usePoSteps
      ? this.canActiveNextStep(this.currentActiveStep, nextStepIndex)
      : of(this.steps.slice(this.step, nextStepIndex).every(step => step.status === PoStepperStatus.Done));
  }

  private getCanActiveNextStepObservable(currentActiveStep: PoStepComponent): Observable<boolean> {
    const canActiveNextStep = currentActiveStep.canActiveNextStep(currentActiveStep);
    return canActiveNextStep instanceof Observable ? canActiveNextStep : of(canActiveNextStep);
  }

  private hasDefaultBeforeDone(nextStepIndex: number): boolean {
    return this.getPoSteps()
      .slice(this.step, nextStepIndex)
      .some(step => step.status === PoStepperStatus.Default);
  }

  private isCurrentStep(stepIndex: number): boolean {
    return (
      this.currentActiveStep && this.getPoSteps().findIndex(step => step.id === this.currentActiveStep.id) === stepIndex
    );
  }

  private controlStepsStatus(step: PoStepComponent): void {
    if (this.usePoSteps) {
      const { steps, stepIndex: currentStepIndex } = this.getStepsAndIndex(step);

      if (!this.hasStepWithCanActiveNextStep()) {
        this.updatePreviousStepStatus(steps, currentStepIndex);
      }
      this.setStepAsActive(step);

      this.handleNextStep(steps, currentStepIndex);

      this.previousActiveStepIndex = currentStepIndex;
      this.changeDetector.detectChanges();
    }
  }

  private calculateDividerPosition(): number {
    return this.stepSize >= 24 && this.stepSize <= 64 ? this.stepSize : 24;
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

  private handleNextStep(steps: Array<PoStepComponent>, currentStepIndex: number): void {
    const nextStep = steps[currentStepIndex + 1];
    const currentStep = steps[currentStepIndex];
    const isNextStepDisabled = nextStep && nextStep.status === PoStepperStatus.Disabled;

    if (!this.hasStepWithCanActiveNextStep() && isNextStepDisabled) {
      this.setNextStepAsDefault(steps[currentStepIndex]);
      if (this.isBeforeStep(currentStepIndex)) {
        this.setFinalSteppersAsDisabled(currentStepIndex);
      }
    }
    if (this.hasStepWithCanActiveNextStep() && isNextStepDisabled) {
      this.setNextStepAsDefault(currentStep);
      this.setFinalSteppersAsDisabled(currentStepIndex);
    }
  }

  private hasStepWithCanActiveNextStep(): boolean {
    return this.getPoSteps().some(step => step.canActiveNextStep && step.canActiveNextStep(step));
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

  private updatePreviousStepStatus(steps: Array<PoStepComponent>, currentStepIndex: number): void {
    if (this.previousActiveStepIndex !== null && this.previousActiveStepIndex !== currentStepIndex) {
      steps[this.previousActiveStepIndex].status = PoStepperStatus.Done;
    }
  }

  private updateStepStatus(currentActiveStep: PoStepComponent, isCanActiveNextStep: boolean): void {
    currentActiveStep.status = this.getStepperStatusByCanActive(isCanActiveNextStep);
  }
}
