import { Component, SimpleChanges, OnChanges } from '@angular/core';

import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { TitleCasePipe } from '@angular/common';
import { ControlContainer, NgForm } from '@angular/forms';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente de criação dos campos dinâmicos.
 */
@Component({
  selector: 'po-dynamic-form-fields',
  templateUrl: 'po-dynamic-form-fields.component.html',
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class PoDynamicFormFieldsComponent extends PoDynamicFormFieldsBaseComponent implements OnChanges {

  constructor(titleCasePipe: TitleCasePipe) {
    super(titleCasePipe);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.visibleFields = this.getVisibleFields();
    }
  }

  trackBy(index) {
    return index;
  }

}
