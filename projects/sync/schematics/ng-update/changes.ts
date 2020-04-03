export interface ReplaceChanges {
  replace: string;
  replaceWith: string;
}

export const replaceChanges: Array<ReplaceChanges> = [
  {
    replace: 'portinari_sync_date',
    replaceWith: 'po_sync_date'
  }
];

export const regexPackages = new RegExp('@portinari/portinari-((storage)|(sync))', 'g');

export const tsLint: ReplaceChanges = {
  replace: '@portinari/tslint',
  replaceWith: '@po-ui/ng-tslint'
};
