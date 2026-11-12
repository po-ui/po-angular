/** Matriz do po-checkbox (grid). Veja po-checkbox-grid.spec.ts. */
export type CheckboxValue = 'unchecked' | 'checked' | 'indeterminate';
export type CheckboxState = 'default' | 'hover' | 'focus' | 'active' | 'disabled';
export type CheckboxContent = {
  name: string;
  label?: string;
  labelWrap?: boolean;
  width?: number;
  help?: string;
  helper?: string;
  required?: boolean;
};

export const SIZES = ['small', 'medium', 'large'];

/** [ngModel]: true = marcado, false = desmarcado, null = indeterminado (mixed). */
export const VALUES: Record<CheckboxValue, boolean | null> = { unchecked: false, checked: true, indeterminate: null };

export const STATES: CheckboxState[] = ['default', 'hover', 'focus', 'active', 'disabled'];

export const CONTENTS: CheckboxContent[] = [
  { name: 'label', label: 'Aceito os termos de uso' },
  // p-label-text-wrap + largura fixa: o texto precisa quebrar linha
  {
    name: 'long-label-wrap',
    label: 'Aceito os termos de uso, a política de privacidade e o tratamento dos meus dados pessoais',
    labelWrap: true,
    width: 260
  },
  { name: 'no-label' },
  { name: 'required', label: 'Aceito os termos de uso', required: true },
  { name: 'help', label: 'Aceito os termos de uso', help: 'Texto de ajuda do campo' },
  { name: 'helper', label: 'Aceito os termos de uso', helper: 'Ajuda adicional sobre os termos' }
];

/**
 * Seletores (dentro da célula) que recebem o estado forçado, conforme o CSS do @po-ui/style:
 * hover vale na caixa (.po-checkbox) e no label; foco no .po-checkbox-outline (div com tabindex).
 */
export const FORCE_SELECTOR: Record<'hover' | 'active' | 'focus', string> = {
  hover: '.po-checkbox, .po-checkbox-label label',
  active: '.po-checkbox, .po-checkbox-label label',
  focus: '.po-checkbox-outline'
};
