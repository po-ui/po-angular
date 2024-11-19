import { TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormFieldValidation } from '../po-dynamic-form-validation/po-dynamic-form-field-validation.interface';
import { PoDynamicFormValidationService } from '../po-dynamic-form-validation/po-dynamic-form-validation.service';
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
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  providers: [PoDynamicFormValidationService]
})
export class PoDynamicFormFieldsComponent extends PoDynamicFormFieldsBaseComponent implements OnChanges {
  @ViewChildren('component') components: QueryList<{ name: string; focus: () => void }>;

  private previousValue = {};

  constructor(
    titleCasePipe: TitleCasePipe,
    private validationService: PoDynamicFormValidationService,
    private changes: ChangeDetectorRef,
    private form: NgForm
  ) {
    super(titleCasePipe);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.visibleFields = this.getVisibleFields();

      if (changes.fields.previousValue && this.hasContainer()) {
        this.hasChangeContainer(changes.fields.previousValue, changes.fields.currentValue);
      }

      if (!changes.fields.previousValue || !changes.fields.currentValue) {
        this.setContainerFields();
      }
    }
  }

  focus(property: string) {
    const foundComponent = this.components.find(component => component.name === property);
    if (foundComponent) {
      foundComponent.focus();
    }
  }

  isDisabled(field: PoDynamicFormField): boolean {
    return field.disabled || this.disabledForm;
  }

  async onChangeField(visibleField: PoDynamicFormField, objectValue?: any) {
    const { property } = visibleField;
    const isBooleanType = visibleField.type === 'boolean';
    const isChangedValueField = this.previousValue[property] !== this.value[property];

    if (visibleField.optionsService) {
      this.objectValue.emit(objectValue);
    }

    // verifica se o formulario esta touched para não disparar o validate ao carregar a tela.
    if ((this.form.touched || isBooleanType) && isChangedValueField) {
      const { changedField, changedFieldIndex } = this.getField(property);

      if (changedField.validate) {
        await this.validateField(changedField, changedFieldIndex, visibleField);
      }

      this.triggerValidationOnForm(changedFieldIndex);
    }

    this.updatePreviousValue();
  }

  //emite o valor a cada caractere digitado no input
  onChangeFieldModel(visibleField: PoDynamicFormField) {
    if (this.validateOnInput) {
      const { property } = visibleField;
      const { changedFieldIndex } = this.getField(property);
      this.triggerValidationOnForm(changedFieldIndex);
    }
  }

  updatePreviousValue() {
    this.previousValue = JSON.parse(JSON.stringify(this.value));
  }

  trackBy(index) {
    return index;
  }

  private applyFieldValidation(index: number, validatedField: PoDynamicFormFieldValidation) {
    const field = this.fields[index];

    this.fields[index] = { ...field, ...validatedField.field };
    this.updateFields();

    if (validatedField.hasOwnProperty('value')) {
      this.value[field.property] = validatedField.value;
    }

    this.changes.detectChanges();

    if (validatedField.focus) {
      this.focus(field.property);
    }
  }

  private getField(property: string) {
    const changedFieldIndex = this.fields.findIndex(field => field.property === property);
    const changedField = this.fields[changedFieldIndex];

    return { changedField, changedFieldIndex };
  }

  private triggerValidationOnForm(changedFieldIndex: number) {
    const isValidatableField = this.validateFields?.length
      ? this.validateFieldsChecker(this.validateFields, this.fields[changedFieldIndex].property)
      : true;
    const hasValidationForm = this.validate && isValidatableField && this.formValidate.observers.length;

    if (hasValidationForm) {
      const updatedField = this.fields[changedFieldIndex];
      this.formValidate.emit(updatedField);
    }
  }

  private updateFields() {
    this.fieldsChange.emit(this.fields);
    this.visibleFields = this.getVisibleFields();
    this.setContainerFields();
  }

  private validateFieldsChecker(validateFields: Array<string>, propertyField: PoDynamicFormField['property']): boolean {
    return validateFields.some(validateFieldItem => validateFieldItem === propertyField);
  }

  private async validateField(field: PoDynamicFormField, fieldIndex: number, visibleField: PoDynamicFormField) {
    const value = this.value[field.property];

    const previousDisabled = visibleField.disabled;
    visibleField.disabled = true;
    this.changes.detectChanges();

    try {
      const validatedField = await this.validationService.sendFieldChange(field, value).toPromise();
      this.applyFieldValidation(fieldIndex, validatedField);
    } catch {
      visibleField.disabled = previousDisabled;
    }
  }

  private hasChangeContainer(previous: Array<PoDynamicFormField>, current: Array<PoDynamicFormField>): void {
    const prevArray = previous.map((item, index) => ({
      container: item.container || null,
      property: item.property,
      index,
      order: item.order,
      visible: item.visible ?? true
    }));

    const currArray = current.map((item, index) => ({
      container: item.container || null,
      property: item.property,
      index,
      order: item.order,
      visible: item.visible ?? true
    }));

    const prevContainers = prevArray.filter(item => item.container);
    const currContainers = currArray.filter(item => item.container);

    const prevOrder = prevArray.filter(item => item.order);
    const currOrder = currArray.filter(item => item.order);

    const prevVisibleTrue = prevArray.filter(item => item.visible === true);
    const currVisibleTrue = currArray.filter(item => item.visible === true);

    const prevVisibleFalse = prevArray.filter(item => !item.visible);
    const currVisibleFalse = currArray.filter(item => !item.visible);

    // Verifica mudança na quantidade de containers
    if (prevContainers.length !== currContainers.length) {
      this.setContainerFields();
      return;
    }

    // Verifica mudança na quantidade de order
    if (prevOrder.length !== currOrder.length) {
      this.setContainerFields();
      return;
    }

    // Verifica mudança na quantidade de visible
    if (prevVisibleTrue.length !== currVisibleTrue.length) {
      this.setContainerFields();
      return;
    }

    // Verifica mudança na quantidade de visible
    if (prevVisibleFalse.length !== currVisibleFalse.length) {
      this.setContainerFields();
      return;
    }

    if (currContainers.length) {
      this.handleChangesContainer(prevContainers, currContainers, 'container');
    }

    if (currOrder.length) {
      this.handleChangesContainer(prevOrder, currOrder, 'order');
    }

    if (currVisibleTrue.length) {
      this.handleChangesContainer(prevVisibleTrue, currVisibleTrue, 'visible');
    }

    if (currVisibleFalse.length) {
      this.handleChangesContainer(prevVisibleFalse, currVisibleFalse, 'visible');
    }

    //atualiza container sem mudança na estrutura da interface
    const result = this.diffObjectsArray(previous, this.getVisibleFields());
    this.containerFields = this.updateFieldContainer(result, this.containerFields);
  }

  private updateFieldContainer(changes, containerFields) {
    const mapchanges = new Map(changes.map(obj => [obj.property, obj]));

    containerFields.forEach(subArray => {
      subArray.forEach((subItem, index) => {
        const item: any = mapchanges.get(subItem.property);
        if (item) {
          subArray[index] = { ...subItem, ...item };
        }
      });
    });

    return containerFields;
  }

  private diffObjectsArray(oldArray, newArray) {
    const differences = [];

    newArray.forEach(newObj => {
      const oldObj = oldArray.find(o => o.property === newObj.property);

      if (!oldObj) {
        // Se o objeto é novo, adiciona todo o objeto com a propriedade "property"
        differences.push({ ...newObj });
      } else {
        // Verificar se há diferenças nas propriedades
        const diff = { property: newObj.property };
        let hasDifferences = false;

        for (const key in newObj) {
          if (newObj[key] !== oldObj[key]) {
            diff[key] = newObj[key];
            hasDifferences = true;
          }
        }

        if (hasDifferences) {
          differences.push(diff);
        }
      }
    });

    //retorna mudanças nos fields para atualização do containerFields
    return differences;
  }

  private hasContainer() {
    return this.visibleFields && this.visibleFields.some(field => field.container);
  }

  private handleChangesContainer(prevContainers, currContainers, key) {
    for (let i = 0; i < prevContainers.length; i++) {
      const prev = prevContainers[i];
      const curr = currContainers[i];

      //Verifica se container mudou de posição
      if (prev[key] === curr[key] && prev.index !== curr.index) {
        this.setContainerFields();
        return;
      }
      //Verifica se foi apenas mudança da string em caso do container ou valor no order
      if (prev[key] !== curr[key] && prev.index === curr.index) {
        if (key === 'order') {
          this.setContainerFields();
          return;
        }
        this.containerFields.forEach(subItem =>
          subItem.forEach(item => {
            if (item.property === curr.property) {
              item[key] = curr[key];
            }
          })
        );
      }
      //verifica se manteve o mesmo número de container, mas alterou property do container
      if (prev[key] !== curr[key] && prev.property !== curr.property) {
        this.setContainerFields();
        return;
      }
    }
  }
}
