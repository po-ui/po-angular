import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoCheckboxGroupOption, PoRadioGroupOption } from '@po-ui/ng-components';

import { isTypeof } from '../../../utils/util';

import { PoPageJobSchedulerLookupService } from '../po-page-job-scheduler-lookup.service';
import { PoPageJobSchedulerService } from '../po-page-job-scheduler.service';

@Component({
  selector: 'po-page-job-scheduler-execution',
  templateUrl: 'po-page-job-scheduler-execution.component.html'
})
export class PoPageJobSchedulerExecutionComponent implements OnInit, AfterViewInit {
  @ViewChild('formExecution', { static: true }) form: NgForm;

  // templates
  @ViewChild('dailyTemplate', { static: true }) dailyTemplate;
  @ViewChild('monthlyTemplate', { static: true }) monthlyTemplate;
  @ViewChild('weeklyTemplate', { static: true }) weeklyTempalte;

  @Input('p-is-edit') isEdit: boolean = false;

  @Input('p-literals') literals = <any>{};

  @Output('p-change-process') changeProcess: EventEmitter<any> = new EventEmitter<any>();

  dayPattern = '^(3[0-1]|[0-2][0-9]|[1-9]|0[1-9])$';
  existProcessAPI = true;
  minDateFirstExecution = new Date();
  periodicityOptions: Array<PoRadioGroupOption> = [];
  periodicityTemplates: { daily: TemplateRef<any>; weekly: TemplateRef<any>; monthly: TemplateRef<any> };
  timePattern = '^(2[0-3]|[01][0-9]):?([0-5][0-9])$';
  weekDays: Array<PoCheckboxGroupOption> = [];

  private _value: any = {};

  @Input('p-value') set value(value: any) {
    this._value = value && isTypeof(value, 'object') ? value : {};
  }

  get value() {
    return this._value;
  }

  constructor(
    private poPageJobSchedulerService: PoPageJobSchedulerService,
    public poPageJobSchedulerLookup: PoPageJobSchedulerLookupService
  ) {}

  get startDateFirstExecution() {
    return this.isEdit ? undefined : this.minDateFirstExecution;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.subscribeProcessIdValueChanges();
    });
  }

  ngOnInit() {
    this.periodicityTemplates = {
      daily: this.dailyTemplate,
      monthly: this.monthlyTemplate,
      weekly: this.weeklyTempalte
    };

    this.checkExistsProcessesAPI();

    this.periodicityOptions = this.getPeriodicityOptions();
    this.weekDays = this.getWeekDays();
  }

  private checkExistsProcessesAPI() {
    this.poPageJobSchedulerService.getHeadProcesses().subscribe(undefined, error => {
      this.existProcessAPI = false;
    });
  }

  private getPeriodicityOptions() {
    return [
      { label: this.literals.single, value: 'single' },
      { label: this.literals.daily, value: 'daily' },
      { label: this.literals.weekly, value: 'weekly' },
      { label: this.literals.monthly, value: 'monthly' }
    ];
  }

  private getWeekDays() {
    return [
      { label: this.literals.sunday, value: 'Sunday' },
      { label: this.literals.monday, value: 'Monday' },
      { label: this.literals.tuesday, value: 'Tuesday' },
      { label: this.literals.wednesday, value: 'Wednesday' },
      { label: this.literals.thursday, value: 'Thursday' },
      { label: this.literals.friday, value: 'Friday' },
      { label: this.literals.saturday, value: 'Saturday' }
    ];
  }

  private subscribeProcessIdValueChanges() {
    this.form.controls['processID'].valueChanges.subscribe(processId => {
      this.changeProcess.emit({ processId, existAPI: this.existProcessAPI });
    });
  }
}
