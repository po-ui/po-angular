import { ReplaceChanges } from '@po-ui/ng-schematics/replace';

export const dependeciesChanges = {
  '@portinari/portinari-sync': '@po-ui/ng-sync',
  '@portinari/portinari-storage': '@po-ui/ng-storage'
};

export const replaceChanges: Array<ReplaceChanges> = [
  {
    replace: 'portinari_sync_date',
    replaceWith: 'po_sync_date'
  }
];

export const regexPackages = new RegExp('@portinari/portinari-((storage)|(sync))', 'g');

export const tsLintChanges: Array<ReplaceChanges> = [
  {
    replace: '@portinari/tslint',
    replaceWith: '@po-ui/ng-tslint'
  }
];
