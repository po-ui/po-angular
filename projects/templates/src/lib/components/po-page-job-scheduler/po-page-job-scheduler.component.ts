import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  OnInit,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import {
  PoDialogService,
  PoDynamicFormField,
  PoLanguageService,
  PoNotificationService,
  PoPageAction,
  PoStepperItem,
  PoStepperStatus,
  poLocaleDefault
} from '@po-ui/ng-components';

import { PoJobSchedulerInternal } from './interfaces/po-job-scheduler-internal.interface';
import { PoPageJobSchedulerBaseComponent } from './po-page-job-scheduler-base.component';
import { PoPageJobSchedulerInternal } from './po-page-job-scheduler-internal';
import { poPageJobSchedulerLiteralsDefault } from './po-page-job-scheduler-literals';
import { PoPageJobSchedulerLookupService } from './po-page-job-scheduler-lookup.service';
import { PoJobSchedulerParametersTemplateDirective } from './po-page-job-scheduler-parameters';
import { PoJobSchedulerSummaryTemplateDirective } from './po-page-job-scheduler-summary';
import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';

/**
 * @docsExtends PoPageJobSchedulerBaseComponent
 *
 * @example
 *
 * <example name="po-page-job-scheduler-background-process" title="PO Page Job Scheduler - Background Process">
 *  <file name="sample-po-page-job-scheduler-background-process/sample-po-page-job-scheduler-background-process.component.html"> </file>
 *  <file name="sample-po-page-job-scheduler-background-process/sample-po-page-job-scheduler-background-process.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-job-scheduler-directives" title="PO Page Job Scheduler - Directives">
 *  <file name="sample-po-page-job-scheduler-directives/sample-po-page-job-scheduler-directives.component.html"> </file>
 *  <file name="sample-po-page-job-scheduler-directives/sample-po-page-job-scheduler-directives.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-page-job-scheduler',
  templateUrl: './po-page-job-scheduler.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      po-container .po-container {
        overflow-y: unset;
      }
    `
  ],
  standalone: false
})
export class PoPageJobSchedulerComponent extends PoPageJobSchedulerBaseComponent implements OnInit, AfterContentInit {
  @ViewChild('schedulerExecution', { static: true }) schedulerExecution: { form: NgForm };
  @ViewChild('schedulerParameters') schedulerParameters: { form: NgForm };
  @ContentChildren(PoJobSchedulerParametersTemplateDirective)
  parametersTemplate: QueryList<PoJobSchedulerParametersTemplateDirective>;

  @ContentChild(PoJobSchedulerSummaryTemplateDirective)
  jobSchedulerSummaryTemplate: PoJobSchedulerSummaryTemplateDirective;

  isEdit = false;
  literals = {
    ...poPageJobSchedulerLiteralsDefault[poLocaleDefault]
  };

  publicValues: PoJobSchedulerInternal;
  saveOperation: Observable<any>;
  step: number = 1;
  parametersEmpty: boolean = true;

  stepParametersInitialized = false;

  protected steps: Array<PoStepperItem> = [];

  private backPageAction: PoPageAction = {
    label: this.literals.back,
    action: this.nextStepOperation.bind(this, 'back'),
    disabled: this.isDisabledBack.bind(this)
  };

  private concludePageAction: PoPageAction = {
    label: this.literals.conclude,
    action: this.confirmJobScheduler.bind(this)
  };

  private nextPageAction: PoPageAction = {
    label: this.literals.next,
    action: this.nextStepOperation.bind(this, 'next'),
    disabled: this.isDisabledAdvance.bind(this)
  };

  private concludePageActions: Array<PoPageAction> = [this.concludePageAction, this.backPageAction];

  private nextPageActions: Array<PoPageAction> = [this.nextPageAction, this.backPageAction];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  jobSchedulerActions: Array<PoPageAction> = [...this.nextPageActions];

  protected stepExecution = 1;
  protected stepParameters = 2;
  protected stepSummary = 3;
  protected _stepExecutionLast: boolean;

  constructor(
    public poPageDynamicLookupService: PoPageJobSchedulerLookupService,
    private activatedRoute: ActivatedRoute,
    private poDialogService: PoDialogService,
    private poNotification: PoNotificationService,
    protected poPageJobSchedulerService: PoPageJobSchedulerService,
    languageService: PoLanguageService
  ) {
    super(poPageJobSchedulerService);

    const language = languageService.getShortLanguage();

    this.literals = {
      ...this.literals,
      ...poPageJobSchedulerLiteralsDefault[language]
    };

    this.backPageAction.label = this.literals.back;
    this.concludePageAction.label = this.literals.conclude;
    this.nextPageAction.label = this.literals.next;
  }

  get stepperOrientation(): 'horizontal' | 'vertical' {
    return (
      this.stepperDefaultOrientation || (window.innerWidth > 481 && window.innerWidth < 960 ? 'horizontal' : 'vertical')
    );
  }

  ngOnInit() {
    const paramId = this.activatedRoute.snapshot.params['id'];

    this.isEdit = !!paramId;

    this.poPageJobSchedulerService.configServiceApi({ endpoint: this.serviceApi });

    if (this.parameters.length) {
      this.parametersEmpty = false;
    }

    this.loadData(paramId);
  }

  ngAfterContentInit(): void {
    this.checkStepExecutionLast();
    this.getSteps();
  }

  changePageActionsBySteps(currentStep: number, nextStep: number) {
    const stepsLength = this.steps.length;

    if (nextStep === stepsLength) {
      this.jobSchedulerActions = [...this.concludePageActions];
    } else if (currentStep === stepsLength && nextStep < currentStep) {
      this.jobSchedulerActions = [...this.nextPageActions];
    }
  }

  nextStep(stepNumber: number) {
    const operation: 'back' | 'next' = stepNumber > this.step ? 'next' : 'back';

    // Previne o usuário pular etapas
    const jumpStep = (stepNumber - this.step) * (operation === 'back' ? -1 : 1);
    if (jumpStep > 1) {
      return;
    }

    if (!this.validateStepExecution()) {
      return;
    }

    if (operation === 'next' && !this.validateStepSchedulerParameters()) {
      return;
    }

    if (operation === 'next' && !this.validateStepTemplateParameters()) {
      return;
    }

    if (this.step === this.stepExecution) {
      this.setModelRecurrent();
    }

    // Busca os parâmetros do template
    this.setPropertiesFromTemplate();

    if (stepNumber === this.steps.length) {
      const model = JSON.parse(JSON.stringify(this.model));
      this.publicValues = this.hidesSecretValues(model);
    }

    this.steps[this.step - 1].status = operation === 'next' ? PoStepperStatus.Done : PoStepperStatus.Default;

    this.changePageActionsBySteps(this.step, stepNumber);
    this.step = stepNumber;

    // Caso já tenha iniciado a etapa de parametrização,
    // guarda essa informação para não precisar renderizar novamente
    this.stepParametersInitialized = this.stepParametersInitialized || stepNumber === this.stepParameters;
  }

  onChangeProcess(process: { processId: string; existAPI: boolean }) {
    if (process.existAPI && process.processId && this.parametersEmpty && !this.parametersTemplate.length) {
      this.getParametersByProcess(process.processId);
      if (!this.isEdit) {
        this.model.executionParameter = {};
      }
    }
  }

  private checkStepExecutionLast() {
    if (!this.parametersTemplate.length) {
      this._stepExecutionLast = false;
      return;
    }

    this._stepExecutionLast = this.stepExecutionLast;
  }

  private confirmJobScheduler() {
    const paramId = this.activatedRoute.snapshot.params['id'];

    const confirmMessage = paramId ? this.literals.confirmUpdateMessage : this.literals.confirmSaveMessage;

    this.poDialogService.confirm({
      title: this.literals.confirmation,
      message: confirmMessage,
      confirm: () => {
        const beforeSendModel = this.beforeSendAction ? this.beforeSendAction(this.model) : undefined;

        const model = { ...(beforeSendModel || this.model) };

        this.save(model, paramId);
      }
    });
  }

  private emitSuccessMessage(msgSuccess: any, saveOperation: Observable<any>) {
    saveOperation.subscribe({
      next: () => {
        this.success.emit();
        this.poNotification.success(msgSuccess);
        this.resetJobSchedulerForm();
      },
      error: e => this.error.emit(e)
    });
  }

  private getParametersByProcess(process: any) {
    this.poPageJobSchedulerService.getParametersByProcess(process).subscribe(parameters => {
      this.parameters = parameters;
    });
  }

  private hidesSecretValues(model: PoJobSchedulerInternal): PoJobSchedulerInternal {
    const hiddenSecretValue = '**********';
    this.parameters.forEach(parameter => {
      if (this.isSecretParameter(model, parameter)) {
        model.executionParameter[parameter.property] = hiddenSecretValue;
      }
    });
    return model;
  }

  private getSteps() {
    const templateArray: Array<PoStepperItem> = [];

    this.parametersTemplate.toArray().forEach((value, index, array) => {
      templateArray.push({
        label: value.title || `${this.literals.parameterization} ${array.length > 1 ? index + 1 : ''}`
      });
    });

    let _steps = [];

    if (!this._stepExecutionLast) {
      _steps.push({ label: this.literals.scheduling });
    }

    if (!templateArray.length) {
      _steps.push({ label: this.literals.parameterization });
    } else {
      _steps = [..._steps, ...templateArray];
    }

    if (this._stepExecutionLast) {
      _steps.push({ label: this.literals.scheduling });
    }

    _steps.push({ label: this.literals.conclude });

    this.steps = _steps;

    this.stepSummary = this.steps.length;
    if (this._stepExecutionLast) {
      this.stepExecution = this.stepSummary - 1;
    }
  }

  private getTemplateCurrent() {
    const indexTemplate = this.step - (this.stepExecutionLast ? 1 : 2);
    return this.parametersTemplate.toArray()[indexTemplate];
  }

  private templateHasDisable(): boolean {
    const template = this.getTemplateCurrent();

    return !template?.disabledAdvance;
  }

  private isDisabledAdvance(): boolean {
    if (this.step === this.stepExecution) {
      return this.schedulerExecution?.form?.invalid;
    }

    if (this.schedulerParameters) {
      return this.schedulerParameters?.form?.invalid;
    }

    const templateCurrent = this.getTemplateCurrent();

    if (templateCurrent) {
      return templateCurrent.disabledAdvance;
    }

    return false;
  }

  private isDisabledBack(): boolean {
    return this.step === 1;
  }

  private isSecretParameter(model: PoJobSchedulerInternal, parameter: PoDynamicFormField): boolean {
    return (
      model.executionParameter &&
      parameter.hasOwnProperty('secret') &&
      parameter['secret'] === true &&
      model.executionParameter.hasOwnProperty(parameter.property)
    );
  }

  private nextStepOperation(operation?: 'back' | 'next') {
    const stepNumber = operation === 'back' ? this.step - 1 : this.step + 1;

    this.nextStep(stepNumber);
  }

  private resetJobSchedulerForm() {
    this.schedulerExecution.form.reset();

    // radiogroup não estava atribuindo novo valor, fica vermelho sem o timetout.
    setTimeout(() => {
      this.model = new PoPageJobSchedulerInternal();

      this.step = 1;
      this.steps.forEach(step => {
        step.status = PoStepperStatus.Default;
      });

      this.jobSchedulerActions = [...this.nextPageActions];
    });
  }

  private save(model: PoJobSchedulerInternal, paramId) {
    const saveOperation = paramId
      ? this.poPageJobSchedulerService.updateResource(paramId, model)
      : this.poPageJobSchedulerService.createResource(model);

    const msgSuccess = paramId
      ? this.literals.saveNotificationSuccessUpdate
      : this.literals.saveNotificationSuccessSave;

    this.emitSuccessMessage(msgSuccess, saveOperation);
  }

  private setModelRecurrent() {
    this.model.recurrent = this.model.periodicity === 'single' ? false : this.model.recurrent;
  }

  private setPropertiesFromTemplate() {
    const templateCurrent = this.getTemplateCurrent();

    if (!templateCurrent) {
      return;
    }

    this.model = {
      ...this.model,
      executionParameter: { ...this.model.executionParameter, ...templateCurrent.executionParameter }
    };
  }

  private validateStepExecution(): boolean {
    const stepCurrent = this.step;

    if (stepCurrent == this.stepExecution && this.schedulerExecution.form.invalid) {
      this.markAsDirtyInvalidControls(this.schedulerExecution.form.controls);
      return false;
    }

    return true;
  }

  private validateStepSchedulerParameters(): boolean {
    if (this.step === this.stepExecution || this.step === this.stepSummary) {
      return true;
    }

    if (this.schedulerParameters && this.schedulerParameters.form && this.schedulerParameters.form.invalid) {
      this.markAsDirtyInvalidControls(this.schedulerParameters.form.controls);
      return false;
    }

    return true;
  }

  private validateStepTemplateParameters(): boolean {
    if (this.step === this.stepExecution || this.step === this.stepSummary) {
      return true;
    }

    if (!this.parametersTemplate.length) {
      return true;
    }

    return this.templateHasDisable();
  }
}
