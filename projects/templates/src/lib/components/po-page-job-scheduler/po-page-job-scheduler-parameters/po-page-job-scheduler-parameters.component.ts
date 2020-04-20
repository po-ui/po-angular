import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoDynamicFormField } from '@po-ui/ng-components';

@Component({
  selector: 'po-page-job-scheduler-parameters',
  templateUrl: 'po-page-job-scheduler-parameters.component.html'
})
export class PoPageJobSchedulerParametersComponent implements AfterViewInit {
  @ViewChild('parametersForm') form: NgForm;

  @Input('p-literals') literals = <any>{};

  @Input('p-parameters') parameters: Array<PoDynamicFormField> = [];

  @Input('p-value') value;

  @Output('p-valueChange') valueChange: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit() {
    if (this.form) {
      setTimeout(() => {
        this.form.valueChanges.subscribe(value => {
          this.valueChange.emit(value);
        });
      });
    }
  }
}
