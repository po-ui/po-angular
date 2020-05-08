import { chain, Rule } from '@angular-devkit/schematics';

import { buildComponent, Schema as ComponentOptions } from '@po-ui/ng-schematics/build-component';

/**
 * Scaffolds a new <name> component with <po-page-list>
 * - The property dataView set which component will be used to display data.
 */
export default function (options: ComponentOptions): Rule {
  return chain([createPageListComponent(options)]);
}

function createPageListComponent(options: ComponentOptions): Rule {
  return buildComponent(options);
}
