export interface ReplaceChanges {
  replace: string;
  replaceWith: string;
}

export const replaceChanges: Array<ReplaceChanges> = [
  {
    replace: 'p-focus',
    replaceWith: 'p-auto-focus'
  },
  {
    replace: 'X-Portinari',
    replaceWith: 'X-PO'
  }
];

export const changesComponents = [
  { component: 'po-page-edit', actions: ['cancel', 'save', 'saveNew'] },
  { component: 'po-page-detail', actions: ['edit', 'remove', 'back'] }
];

export const regexPackages = new RegExp(
  [
    '@portinari/(portinari-)?((ui)|', // @po-ui/ng-components
    '(storage)|', // @po-ui/ng-storage
    '(templates)|', // @po-ui/ng-templates
    '(sync)|', // @po-ui/ng-sync
    '(code-editor)|', // @po-ui/ng-code-editor
    '(style))' // @po-ui/style
  ].join(''),
  'g'
);

export const tsLint: ReplaceChanges = {
  replace: '@portinari/tslint',
  replaceWith: '@po-ui/ng-tslint'
};
