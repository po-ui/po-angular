/** Matriz do po-checkbox-group (grid). Veja po-checkbox-group-grid.spec.ts. */
export type GroupState = 'default' | 'hover' | 'focus' | 'active' | 'disabled';
export type GroupContent = {
  name: string;
  label?: string;
  help?: string;
  helper?: string;
  required?: boolean;
  optional?: boolean;
};

export const SIZES = ['small', 'medium'];

export const OPTIONS = [
  { label: 'Angular', value: 'angular' },
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' }
];

/**
 * Valor do ngModel. Sem p-indeterminate o model é um array com os values marcados; com p-indeterminate é um objeto
 * {value: true|false|null} (null = indeterminado/mixed).
 */
export const VALUES: Record<string, { value: unknown; indeterminate?: boolean }> = {
  none: { value: [] },
  some: { value: ['angular', 'vue'] },
  mixed: { value: { angular: true, react: null, vue: false }, indeterminate: true }
};

export const STATES: GroupState[] = ['default', 'hover', 'focus', 'active', 'disabled'];

export const CONTENTS: GroupContent[] = [
  { name: 'label', label: 'Frameworks favoritos' },
  { name: 'no-label' },
  { name: 'required', label: 'Frameworks favoritos', required: true },
  { name: 'optional', label: 'Frameworks favoritos', optional: true, help: 'Escolha quantos quiser' },
  { name: 'help', label: 'Frameworks favoritos', help: 'Texto de ajuda do campo' },
  { name: 'helper', label: 'Frameworks favoritos', helper: 'Ajuda adicional sobre as opções' }
];

/**
 * Seletores (dentro da célula) que recebem o estado forçado, conforme o CSS do @po-ui/style. Só a PRIMEIRA opção
 * recebe o estado: as outras ficam em repouso e servem de comparação. Hover vale na caixa e no label; foco no
 * .po-checkbox-outline (div com tabindex) de cada po-checkbox interno.
 */
const FIRST = '.po-checkbox-group-item:first-child';
export const FORCE_SELECTOR: Record<'hover' | 'active' | 'focus', string> = {
  hover: `${FIRST} .po-checkbox, ${FIRST} .po-checkbox-label label`,
  active: `${FIRST} .po-checkbox, ${FIRST} .po-checkbox-label label`,
  focus: `${FIRST} .po-checkbox-outline`
};

/** Segundo snapshot por tema: colunas, quebra de texto, opção desabilitada e título compacto. */
export const LONG = 'Um texto de opção bem longo para testar a quebra de linha dentro da coluna do grupo';
export const LAYOUTS = [
  { name: 'columns-1', columns: 1 },
  { name: 'columns-2', columns: 2 },
  { name: 'columns-3', columns: 3 },
  { name: 'columns-4', columns: 4 },
  { name: 'columns-4-long-options', columns: 4, long: true },
  { name: 'columns-1-long-options', columns: 1, long: true },
  { name: 'option-disabled', columns: 2, disabledOption: true },
  { name: 'compact-label', columns: 2, compactLabel: true },
  { name: 'label-wrap', columns: 2, labelWrap: true, width: 300 }
];
