import { chain, Rule } from '@angular-devkit/schematics';

import { buildComponent } from '../build-component/build-component';
import { Schema as ComponentOptions } from './schema';

/** Scaffolds a new <name> component with <po-page-edit> */
export default function(options: ComponentOptions): Rule {
  return chain([createPageEditComponent(options)]);
}

function createPageEditComponent(options: ComponentOptions): Rule {
  return buildComponent(options);
}
