import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';

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
import { PoPageJobSchedulerInternal } from './po-page-job-scheduler-internal';
import { PoPageJobSchedulerBaseComponent } from './po-page-job-scheduler-base.component';
import { poPageJobSchedulerLiteralsDefault } from './po-page-job-scheduler-literals';
import { PoPageJobSchedulerLookupService } from './po-page-job-scheduler-lookup.service';
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
  ]
})
export class PoPageJobSchedulerComponent extends PoPageJobSchedulerBaseComponent implements OnInit {
  isEdit = false;
  literals = {
    ...poPageJobSchedulerLiteralsDefault[poLocaleDefault]
  };
  parameters: Array<PoDynamicFormField> = [];
  publicValues: PoJobSchedulerInternal;
  saveOperation: Observable<any>;
  step: number = 1;

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

  jobSchedulerActions: Array<PoPageAction> = [...this.nextPageActions];

  readonly steps: Array<PoStepperItem> = [];

  @ViewChild('schedulerExecution', { static: true }) schedulerExecution: { form: NgForm };
  @ViewChild('schedulerParameters') schedulerParameters: { form: NgForm };

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

    this.steps = [
      { label: this.literals.scheduling },
      { label: this.literals.parameterization },
      { label: this.literals.conclude }
    ];
  }

  get stepperOrientation(): 'horizontal' | 'vertical' {
    return window.innerWidth > 481 && window.innerWidth < 960 ? 'horizontal' : 'vertical';
  }

  ngOnInit() {
    const paramId = this.activatedRoute.snapshot.params['id'];

    this.isEdit = !!paramId;

    this.poPageJobSchedulerService.configServiceApi({ endpoint: this.serviceApi });

    this.loadData(paramId);
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
    if (stepNumber > 1 && this.schedulerExecution.form.invalid) {
      this.markAsDirtyInvalidControls(this.schedulerExecution.form.controls);
      return;
    }

    if (
      stepNumber > 2 &&
      this.schedulerParameters &&
      this.schedulerParameters.form &&
      this.schedulerParameters.form.invalid
    ) {
      this.markAsDirtyInvalidControls(this.schedulerParameters.form.controls);
      return;
    }
    this.setModelRecurrent();

    const model = JSON.parse(JSON.stringify(this.model));

    if (stepNumber === this.steps.length) {
      this.publicValues = this.hidesSecretValues(model);
    }

    this.changePageActionsBySteps(this.step, stepNumber);

    const steps = this.steps[this.step - 1];
    this.step = stepNumber;

    if (steps) {
      steps.status = PoStepperStatus.Done;
    }
  }

  onChangeProcess(process: { processId: string; existAPI: boolean }) {
    if (process.existAPI && process.processId) {
      this.getParametersByProcess(process.processId);

      if (!this.isEdit) {
        this.model.executionParameter = {};
      }

      return;
    }
  }

  private confirmJobScheduler() {
    const paramId = this.activatedRoute.snapshot.params['id'];

    const confirmMessage = paramId ? this.literals.confirmUpdateMessage : this.literals.confirmSaveMessage;

    this.poDialogService.confirm({
      title: this.literals.confirmation,
      message: confirmMessage,
      confirm: () => {
        const model = { ...this.model };

        this.save(model, paramId);
      }
    });
  }

  private async emitSuccessMessage(msgSuccess: any, saveOperation: Observable<any>) {
    await saveOperation.toPromise();
    this.poNotification.success(msgSuccess);
    this.resetJobSchedulerForm();
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

  private isDisabledAdvance(): boolean {
    const componentByStep = {
      1: this.schedulerExecution,
      2: this.schedulerParameters
    };

    return componentByStep[this.step]?.form?.invalid || false;
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
}
