import { chain, Rule } from '@angular-devkit/schematics';

import { buildComponent, Schema as ComponentOptions } from '@po-ui/ng-schematics/build-component';

/** Scaffolds a new <name> component with <po-page-edit> */
export default function (options: ComponentOptions): Rule {
  return chain([createPageEditComponent(options)]);
}

function createPageEditComponent(options: ComponentOptions): Rule {
  return buildComponent(options);
}
