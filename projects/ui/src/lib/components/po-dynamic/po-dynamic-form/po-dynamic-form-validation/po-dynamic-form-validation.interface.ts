import { PoDynamicFormField } from '../po-dynamic-form-field.interface';

export interface PoDynamicFormValidation {

  fields?: Array<PoDynamicFormField>;

  focus?: string;

  value?: any;

}
