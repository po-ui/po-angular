import { Component, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';

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

  @ViewChildren('component') components: QueryList<{ name: string, focus: () => void }>;

  constructor(titleCasePipe: TitleCasePipe) {
    super(titleCasePipe);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.visibleFields = this.getVisibleFields();
    }
  }

  focus(property: string) {
    const foundComponent = this.components.find(component => component.name === property);
    if (foundComponent) {
      foundComponent.focus();
    }
  }

  trackBy(index) {
    return index;
  }

}
