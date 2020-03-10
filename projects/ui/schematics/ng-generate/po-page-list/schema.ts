import { Schema as ComponentSchema } from '../build-component/schema';

export interface Schema extends ComponentSchema {
  /** Which component will be used to display the data. */
  dataView?: 'table' | 'list';
}
