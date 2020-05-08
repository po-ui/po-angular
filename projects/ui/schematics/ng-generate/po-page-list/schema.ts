import { Schema as ComponentSchema } from '@po-ui/ng-schematics/build-component';

export interface Schema extends ComponentSchema {
  /** Which component will be used to display the data. */
  dataView?: 'table' | 'list';
}
