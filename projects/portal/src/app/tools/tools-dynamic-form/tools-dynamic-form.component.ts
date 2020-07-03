import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

import {
  PoDynamicFormField,
  PoTableColumn,
  PoTableAction,
  PoNotificationService,
  PoToasterOrientation,
  PoModalAction,
  PoModalComponent,
  PoPageAction
} from '@po-ui/ng-components';

@Component({
  selector: 'app-tools-dynamic-form',
  templateUrl: 'tools-dynamic-form.component.html',
  styleUrls: ['tools-dynamic-form.component.css']
})
export class ToolsDynamicFormComponent {
  @ViewChild('generatorForm') generatorForm: NgForm;
  @ViewChild('jsonImportForm') jsonImportForm: NgForm;

  @ViewChild('formFieldModal') formFieldModal: PoModalComponent;
  @ViewChild('importJsonModal') importJsonModal: PoModalComponent;
  @ViewChild('viewJsonModal') viewJsonModal: PoModalComponent;

  dynamicForm: NgForm;
  gridSystemForm: NgForm;
  validationForm: NgForm;

  field = <any>{};
  fields = [];

  fieldsJson = '';
  jsonImport = '';

  quickField = <any>{};
  editFieldId;

  readonly columns: Array<PoTableColumn> = [
    { property: 'property' },
    { property: 'type' },
    { property: 'label' },
    { property: 'help' },
    { property: 'required' },
    { property: 'disabled' },
    { property: 'visible' }
  ];

  readonly actions: Array<PoTableAction> = [
    { label: 'Editar', action: this.onEditField.bind(this) },
    { label: 'Excluir', separator: true, type: 'danger', action: this.removeField.bind(this) }
  ];

  readonly validationFields: Array<PoDynamicFormField> = [
    { property: 'mask', gridColumns: 6 },
    { property: 'pattern', gridColumns: 6 },
    { property: 'minLength', type: 'number', label: 'MinLength', gridColumns: 6 },
    { property: 'maxLength', type: 'number', label: 'MaxLength', gridColumns: 6 },
    { property: 'maxValue', label: 'MaxValue', gridSmColumns: 6, gridXlColumns: 4 },
    { property: 'minValue', label: 'MinValue', gridSmColumns: 6, gridXlColumns: 4 },
    { property: 'required', type: 'boolean', gridColumns: 4, booleanFalse: 'No', booleanTrue: 'Yes' }
  ];

  readonly columnsFields: Array<PoDynamicFormField> = [
    { property: 'gridColumns', type: 'number', label: 'Grid', gridXlColumns: 2, gridMdColumns: 4, gridSmColumns: 6 },
    { property: 'gridSmColumns', type: 'number', label: 'Sm', gridXlColumns: 2, gridMdColumns: 4, gridSmColumns: 6 },
    { property: 'gridMdColumns', type: 'number', label: 'Md', gridXlColumns: 2, gridMdColumns: 4, gridSmColumns: 6 },
    { property: 'gridLgColumns', type: 'number', label: 'Lg', gridXlColumns: 2, gridMdColumns: 6, gridSmColumns: 6 },
    { property: 'gridXlColumns', type: 'number', label: 'Xl', gridXlColumns: 2, gridMdColumns: 6, gridSmColumns: 6 }
  ];

  readonly booleanFields: Array<PoDynamicFormField> = [
    {
      property: 'optionsMulti',
      label: 'OptionsMulti',
      type: 'boolean',
      gridColumns: 3,
      gridSmColumns: 12,
      booleanFalse: 'No',
      booleanTrue: 'Yes'
    },
    { property: 'visible', type: 'boolean', gridColumns: 3, gridSmColumns: 12, booleanFalse: 'No', booleanTrue: 'Yes' },
    {
      property: 'disabled',
      type: 'boolean',
      gridColumns: 3,
      gridSmColumns: 12,
      booleanFalse: 'No',
      booleanTrue: 'Yes'
    },
    { property: 'secret', type: 'boolean', gridColumns: 3, gridSmColumns: 12, booleanFalse: 'No', booleanTrue: 'Yes' },
    { property: 'booleanTrue', label: 'BooleanTrue', gridColumns: 6 },
    { property: 'booleanFalse', label: 'BooleanFalse', gridColumns: 6 }
  ];

  readonly serviceFields: Array<PoDynamicFormField> = [
    {
      property: 'searchService',
      help: 'https://po-sample-api.herokuapp.com/v1/heroes',
      label: 'SearchService',
      gridColumns: 12,
      gridLgColumns: 6,
      gridXlColumns: 6
    },
    {
      property: 'optionsService',
      help: 'https://po-sample-api.herokuapp.com/v1/heroes',
      label: 'OptionsService',
      gridColumns: 12,
      gridLgColumns: 6,
      gridXlColumns: 6
    }
  ];

  defaultFields: Array<PoDynamicFormField> = [
    { property: 'property', required: true, gridColumns: 5 },
    {
      property: 'type',
      options: ['Boolean', 'Currency', 'Date', 'DateTime', 'Number', 'String', 'Time'],
      gridColumns: 5
    },
    { property: 'rows', gridColumns: 2 },
    { property: 'label', help: 'Hero', gridXlColumns: 4 },
    { property: 'help', help: 'Select your hero', gridXlColumns: 4 },
    { property: 'divider', help: 'Heroes', gridXlColumns: 4 },
    { property: 'columns', help: '[{ "property": "name", "label": "Name" }]', gridLgColumns: 6, gridXlColumns: 6 },
    { property: 'options', help: '["Option 1", "Option 2"]', gridColumns: 12, gridLgColumns: 6, gridXlColumns: 6 }
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

  readonly pageActions: Array<PoPageAction> = [
    { label: 'Importar JSON', icon: 'po-icon-upload', action: () => this.importJsonModal.open() },
    { label: 'Visualizar JSON', disabled: () => !this.fields.length, action: () => this.viewJsonModal.open() },
    { label: 'Dynamic View', url: '/tools/dynamic-view' }
  ];

  constructor(private poNotification: PoNotificationService) {}

  addField(field) {
    const newField = this.cleanField(field);
    const isEditField = this.editFieldId || this.editFieldId === 0;
    const existField = this.fields.find(f => f.property === newField.property);

    newField.columns = !!newField.columns ? this.convertToArray(newField.columns) : undefined;
    newField.options = !!newField.options ? this.convertToArray(newField.options) : undefined;

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

    // tslint:disable-next-line:no-self-assignment
    this.fields = [...this.fields];
    this.resetForm();
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
    this.fields = [];
  }

  getForm(form) {
    this.dynamicForm = form;

    this.dynamicForm.statusChanges.subscribe(status => {
      this.primaryAction.disabled = status === 'INVALID';
    });
  }

  private cleanField(field) {
    const newField = { ...field };

    Object.keys(newField).forEach(key => {
      if (newField[key] === null) {
        delete newField[key];
      }
    });

    return newField;
  }

  private convertToArray(property: string) {
    let convertedArray = [];

    if (Array.isArray(property)) {
      return property;
    }

    try {
      convertedArray = JSON.parse(property);
    } catch (e) {
      convertedArray = [];
      this.poNotification.error('Property "Options" typed wrong');
    }

    return convertedArray;
  }

  private removeField(removedField) {
    this.fields = this.fields.filter(field => field.property !== removedField.property);
  }

  private importJson() {
    try {
      const fieldsJson = JSON.parse(this.jsonImport);

      this.fields = fieldsJson;

      this.jsonImport = '';
      this.importJsonModal.close();
    } catch (e) {
      this.poNotification.error('Invalid JSON');
      console.error(e);
    }
  }

  private onEditField(field) {
    const jsonOptions = Array.isArray(field.options) ? JSON.stringify(field.options) : undefined;
    const jsonColumns = Array.isArray(field.columns) ? JSON.stringify(field.columns) : undefined;

    const editField = Object.assign({}, field, { options: jsonOptions, columns: jsonColumns });
    this.editFieldId = this.fields.findIndex(f => f.property === editField.property);

    this.field = editField;

    this.formFieldModal.open();
  }

  private resetForm() {
    this.field = {};

    this.generatorForm.reset();
    this.dynamicForm.reset();

    this.editFieldId = undefined;
  }
}
