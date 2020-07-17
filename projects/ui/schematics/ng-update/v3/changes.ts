import { ReplaceChanges } from '@po-ui/ng-schematics/replace';
import { UpdateDependencies } from '@po-ui/ng-schematics/package-config';

export const replaceChanges: Array<ReplaceChanges> = [
  {
    replace: 'p-checkbox',
    replaceWith: 'p-selectable'
  }
];

export const updateDepedenciesVersion: UpdateDependencies = {
  dependencies: [
    '@po-ui/ng-components',
    '@po-ui/ng-code-editor',
    '@po-ui/ng-templates',
    '@po-ui/ng-storage',
    '@po-ui/ng-sync',
    '@po-ui/style'
  ],
  devDependencies: ['@po-ui/ng-tslint']
};
