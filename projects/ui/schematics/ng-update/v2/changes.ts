import { ReplaceChanges } from '@po-ui/ng-schematics/replace';

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

export const dependeciesChanges = {
  '@portinari/portinari-ui': '@po-ui/ng-components',
  '@portinari/portinari-sync': '@po-ui/ng-sync',
  '@portinari/portinari-storage': '@po-ui/ng-storage',
  '@portinari/portinari-style': '@po-ui/style',
  '@portinari/portinari-templates': '@po-ui/ng-templates',
  '@portinari/portinari-code-editor': '@po-ui/ng-code-editor',

  '@totvs/portinari-theme': '@totvs/po-theme'
};

export const tsLintReplaces: Array<ReplaceChanges> = [
  {
    replace: '@portinari/tslint',
    replaceWith: '@po-ui/ng-tslint'
  }
];

export const angularJsonReplaces: Array<ReplaceChanges> = [
  { replace: regexPackages, replaceWith: replacePackages },
  { replace: /portinari\-theme/g, replaceWith: 'po-theme' }
];

export function replacePackages(foundString: string, _, pkg: string) {
  const org = '@po-ui';

  if (pkg === 'ui') {
    return `${org}/ng-components`;
  } else if (pkg === 'style') {
    return `${org}/style`;
  } else if (pkg) {
    return `${org}/ng-${pkg}`;
  }

  return foundString;
}
