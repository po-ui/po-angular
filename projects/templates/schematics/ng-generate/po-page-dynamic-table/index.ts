import { chain, Rule } from '@angular-devkit/schematics';

import { buildComponent } from '../build-component/build-component';
import { Schema as ComponentOptions } from './schema';

/** Scaffolds a new <name> component with <po-page-dynamic-table> */
export default function (options: ComponentOptions): Rule {
  return chain([createPageDynamicTableComponent(options)]);
}

function createPageDynamicTableComponent(options: ComponentOptions): Rule {
  return buildComponent(options);
}
