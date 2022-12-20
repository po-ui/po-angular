import { UpdateDependencies } from '@po-ui/ng-schematics/package-config';
import { ReplaceChanges } from '@po-ui/ng-schematics/replace';

//regex para alterar o po-button de `p-type` para p-kind
export const regexPoButton = new RegExp('(<po-button\\b[^<>]* p-)type(="[^"]*"[^<>]*>)', 'gmi');
//regex para alterar o po-button de `p-type=default` para `p-kind=secondary`
export const regexPoSecondary = new RegExp('(<po-button\\b[^<>]* p-)type(="default")', 'gmi');
//regex para alterar o po-button de `p-type=link` para `p-kind=tertiary`
export const regexPoTertiary = new RegExp('(<po-button\\b[^<>]* p-)type(="link")', 'gmi');
//regex para alterar o po-button de `p-type=danger` para `p-danger=true`
export const regexPoDanger = new RegExp('(<po-button\\b[^<>]*)p-type="danger"', 'gmi');

export const updateDepedenciesVersion: UpdateDependencies = {
  dependencies: [
    '@po-ui/ng-components',
    '@po-ui/ng-code-editor',
    '@po-ui/ng-templates',
    '@po-ui/ng-storage',
    '@po-ui/ng-sync',
    '@totvs/po-theme',
    '@po-ui/style'
  ]
};

//altera a propriedade p-type do  button para p-kind utilizando o regex regexPoButton
export const poButtonReplaces: Array<ReplaceChanges> = [{ replace: regexPoButton, replaceWith: `$1kind$2` }];
//altera para o secondary utilizando o regex da constante regexPoSecondary
export const poButtonReplacesSecondary: Array<ReplaceChanges> = [
  { replace: regexPoSecondary, replaceWith: `$1kind="secondary"` }
];
//altera para o tertiary utilizando o regex da constante regexPoTertiary
export const poButtonReplacesTertiary: Array<ReplaceChanges> = [
  { replace: regexPoTertiary, replaceWith: `$1kind="tertiary"` }
];
//altera para [p-danger]=true utilizando o regex da constante regexPoDanger
export const poButtonReplacesDanger: Array<ReplaceChanges> = [
  { replace: regexPoDanger, replaceWith: `$1[p-danger]="true"` }
];
