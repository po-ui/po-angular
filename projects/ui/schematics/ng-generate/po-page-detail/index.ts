import { chain, Rule } from '@angular-devkit/schematics';

import { buildComponent, Schema as ComponentOptions } from '@po-ui/ng-schematics/build-component';

/** Scaffolds a new <name> component with <po-page-detail> */
export default function (options: ComponentOptions): Rule {
  return chain([createPageDetailComponent(options)]);
}

function createPageDetailComponent(options: ComponentOptions): Rule {
  return buildComponent(options);
}
