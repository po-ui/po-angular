import { UpdateDependencies } from '@po-ui/ng-schematics/package-config';

export const updateDepedenciesVersion: UpdateDependencies = {
  dependencies: [
    '@po-ui/ng-components',
    '@po-ui/ng-code-editor',
    '@po-ui/ng-templates',
    '@po-ui/ng-storage',
    '@po-ui/ng-sync',
    '@po-ui/style'
  ]
};

export const httpClientModuleName = 'HttpClientModule';
export const httpClientModuleSourcePath = '@angular/common/http';
