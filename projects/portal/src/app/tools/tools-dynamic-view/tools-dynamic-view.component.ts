import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

import {
  PoDynamicFormField,
  PoDynamicFormComponent,
  PoTableColumn,
  PoTableAction,
  PoNotificationService,
  PoToasterOrientation,
  PoModalAction,
  PoModalComponent,
  PoPageAction
} from '@po-ui/ng-components';

@Component({
  selector: 'app-tools-dynamic-view',
  templateUrl: 'tools-dynamic-view.component.html',
  styleUrls: ['tools-dynamic-view.component.css']
})
export class ToolsDynamicViewComponent {
  @ViewChild('generatorForm') generatorForm: NgForm;
  @ViewChild('jsonImportForm') jsonImportForm: NgForm;

  @ViewChild('formFieldModal') formFieldModal: PoModalComponent;
  @ViewChild('importJsonModal') importJsonModal: PoModalComponent;
  @ViewChild('viewJsonModal') viewJsonModal: PoModalComponent;

  @ViewChild('valueForms') valueForms: PoModalComponent;

  @ViewChild('gridSystemForm') gridSystemForm: PoDynamicFormComponent;
  @ViewChild('booleansForm') booleansForm: PoDynamicFormComponent;

  dynamicForm: NgForm;

  field = <any>{};
  fields = [];

  fieldsJson = '';
  jsonImport = '';
  fieldId;

  quickField = <any>{};
  editFieldId;

  valueFields;
  value = JSON.stringify({});
  model = {};

  displayMessageError = false;

  readonly columns: Array<PoTableColumn> = [
    { label: 'Property', property: 'property' },
    { label: 'Type', property: 'type' },
    { label: 'Format', property: 'format' },
    { label: 'Label', property: 'label' },
    { label: 'Visible', property: 'visible' }
  ];

  readonly actions: Array<PoTableAction> = [
    { label: 'Editar', action: this.onEditField.bind(this) },
    { label: 'Excluir', type: 'danger', separator: true, action: this.removeField.bind(this) }
  ];

  readonly columnsFields: Array<PoDynamicFormField> = [
    { property: 'gridColumns', type: 'number', label: 'Grid', gridXlColumns: 2, gridMdColumns: 4, gridSmColumns: 6 },
    { property: 'gridSmColumns', type: 'number', label: 'Sm', gridXlColumns: 2, gridMdColumns: 4, gridSmColumns: 6 },
    { property: 'gridMdColumns', type: 'number', label: 'Md', gridXlColumns: 2, gridMdColumns: 4, gridSmColumns: 6 },
    { property: 'gridLgColumns', type: 'number', label: 'Lg', gridXlColumns: 2, gridMdColumns: 6, gridSmColumns: 6 },
    { property: 'gridXlColumns', type: 'number', label: 'Xl', gridXlColumns: 2, gridMdColumns: 6, gridSmColumns: 6 }
  ];

  readonly booleansFields: Array<PoDynamicFormField> = [
    { property: 'tag', type: 'boolean', gridColumns: 6, gridMdColumns: 3, booleanFalse: 'No', booleanTrue: 'Yes' },
    { property: 'visible', type: 'boolean', gridColumns: 6, gridMdColumns: 3, booleanFalse: 'No', booleanTrue: 'Yes' }
  ];

  defaultFields: Array<PoDynamicFormField> = [
    { property: 'property', required: true, gridColumns: 6 },
    {
      property: 'type',
      options: ['Boolean', 'Currency', 'Date', 'DateTime', 'Number', 'String', 'Time'],
      gridColumns: 6
    },
    { property: 'label', gridXlColumns: 4 },
    { property: 'divider', gridXlColumns: 4 },
    { property: 'format', gridMdColumns: 6, gridXlColumns: 4 }
  ];

  readonly importJsonModalAction: PoModalAction = {
    label: 'Importar',
    action: this.importJson.bind(this)
  };

  readonly primaryAction: PoModalAction = {
    label: 'Adicionar',
    action: () => {
      this.addField(this.field);

      this.formFieldModal.close();
    }
  };

  readonly secondaryAction: PoModalAction = {
    label: 'Cancelar',
    action: () => {
      this.resetForm();

      this.formFieldModal.close();
    }
  };

  readonly addValueAction: PoModalAction = {
    label: 'Adicionar',
    action: () => {
      this.model = Object.assign({}, this.value);

      this.valueForms.close();
    }
  };

  readonly cancelValueAction: PoModalAction = {
    label: 'Cancelar',
    action: () => {
      this.valueForms.close();
    }
  };

  readonly pageActions: Array<PoPageAction> = [
    { label: 'Importar JSON', icon: 'po-icon-upload', action: () => this.importJsonModal.open() },
    { label: 'Visualizar JSON', disabled: () => !this.fields.length, action: () => this.viewJsonModal.open() },
    { label: 'Dynamic Form', url: '/tools/dynamic-form' }
  ];

  constructor(private poNotification: PoNotificationService) {}

  openValueForm() {
    this.valueFields = this.fields.map(field => {
      return { property: field.property, gridColumns: 6 };
    });

    this.valueForms.open();
  }

  onChangeValueField() {
    if (!this.value) {
      this.model = {};
      return;
    }

    try {
      this.model = JSON.parse(this.value);
      this.displayMessageError = false;
    } catch (e) {
      this.model = {};
      this.displayMessageError = true;
    }

    if (!Array.isArray(this.model) && Object.keys(this.model).length) {
      for (const key in this.model) {
        if (this.model.hasOwnProperty(key) && !this.fields.find(f => f.property === key)) {
          this.fields.push({ property: key });
        }
      }

      // tslint:disable-next-line:no-self-assignment
      this.fields = [...this.fields];
    }
  }

  addField(field) {
    this.cleanField(field);

    const newField = Object.assign({}, field);
    const isEditField = this.editFieldId || this.editFieldId === 0;
    const existField = this.fields.find(f => f.property === newField.property);

    if (existField && !isEditField) {
      this.poNotification.warning({
        message: `Property ${newField.property} já existe na lista`,
        orientation: PoToasterOrientation.Bottom
      });

      return;
    }

    if (isEditField) {
      this.fields.splice(this.editFieldId, 1, newField);
    } else {
      this.fields.push(newField);
    }

    this.addPropertyInValue(newField.property);

    // tslint:disable-next-line:no-self-assignment
    this.fields = [...this.fields];
    this.resetForm();
  }

  addPropertyInValue(property) {
    let convertedValue;

    try {
      convertedValue = JSON.parse(this.value);
    } catch (e) {
      convertedValue = {};
    }

    const val = { ...convertedValue, [property]: convertedValue[property] || '' };

    this.value = JSON.stringify(val);
  }

  advancedFields() {
    if (this.quickField.property) {
      this.field = { ...this.quickField };
    } else {
      this.resetForm();
    }

    this.formFieldModal.open();
  }

  copyToClipboard() {
    const fieldJsonElement = document.querySelector('#fieldsJson');

    if (window.getSelection) {
      window.getSelection().selectAllChildren(fieldJsonElement);
      document.execCommand('copy');

      this.poNotification.success('JSON copied to clipboard.');
    }
  }

  removeAll() {
    this.value = JSON.stringify({});
    this.fields = [];
  }

  getForm(form) {
    this.dynamicForm = form;

    this.dynamicForm.statusChanges.subscribe(status => {
      this.primaryAction.disabled = status === 'INVALID';
    });
  }

  private cleanField(field) {
    Object.keys(field).forEach(key => {
      if (field[key] === null) {
        delete field[key];
      }
    });
  }

  private removeField(removedField) {
    this.fields = this.fields.filter(field => field.property !== removedField.property);
  }

  private importJson() {
    try {
      const fieldsJson = JSON.parse(this.jsonImport);

      this.fields = fieldsJson;

      this.convertFieldsToValues(this.fields);

      this.jsonImport = '';
      this.importJsonModal.close();
    } catch (e) {
      this.poNotification.error('Invalid JSON');
      console.error(e);
    }
  }

  private convertFieldsToValues(fields) {
    const value = {};

    if (Array.isArray(fields)) {
      fields.forEach(field => {
        value[field.property] = '';
      });

      this.value = JSON.stringify(value);
    }
  }

  private onEditField(field) {
    const editField = Object.assign({}, field);
    this.editFieldId = this.fields.findIndex(f => f.property === editField.property);

    this.field = editField;

    this.formFieldModal.open();
  }

  private resetForm() {
    this.generatorForm.reset();
    this.dynamicForm.reset();

    if (this.gridSystemForm) {
      this.gridSystemForm.form.reset();
    }
    if (this.booleansForm) {
      this.booleansForm.form.reset();
    }

    this.editFieldId = undefined;
  }
}
