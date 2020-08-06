import { chain, Rule } from '@angular-devkit/schematics';

import { buildComponent } from '@po-ui/ng-schematics/build-component';

import { Schema as ComponentOptions } from './schema';

/** Scaffolds a new <name> component with <po-page-change-password> */
export default function (options: ComponentOptions): Rule {
  return chain([createPageChangePasswordComponent(options)]);
}

function createPageChangePasswordComponent(options: ComponentOptions): Rule {
  return buildComponent(options);
}
