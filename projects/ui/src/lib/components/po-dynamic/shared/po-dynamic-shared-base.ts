import { Directive } from '@angular/core';
import { PoDynamicFormField } from '../po-dynamic-form/po-dynamic-form-field.interface';
import { PoDynamicViewField } from '../po-dynamic-view/po-dynamic-view-field.interface';

/**
 * @usedBy PoDynamicViewComponent, PoDynamicFormComponent
 * @description
 * Componente para listar dados compartilhados entre o dynamic-view e o dynamic-form
 */
@Directive()
export class PoDynamicSharedBase {
  visibleFields: Array<any> = [];
  containerFields = [];
  hasContainers: boolean = false;

  ensureFieldHasContainer(fields: Array<PoDynamicViewField> | Array<PoDynamicFormField>) {
    if (fields && fields.some(field => field?.container)) {
      const firstFieldIndex = fields.findIndex(field => field.order === 1);

      if (firstFieldIndex !== -1 && !fields[firstFieldIndex].container) {
        fields[firstFieldIndex].container = '';
      }
    }
  }

  setContainerFields() {
    this.hasContainers = this.visibleFields && this.visibleFields.some(field => field.container);

    if (this.hasContainers) {
      this.containerFields = this.groupFieldsIntoContainers(this.visibleFields);
    }
  }

  private groupFieldsIntoContainers(fields: Array<PoDynamicViewField>): Array<Array<PoDynamicViewField>> {
    const groups: Array<Array<PoDynamicViewField>> = [[]];
    return fields.reduce((acc, field) => {
      if (field.container && acc[acc.length - 1].length > 0) acc.push([]);
      acc[acc.length - 1].push(field);
      return acc;
    }, groups);
  }
}
