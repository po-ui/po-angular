/** Matriz do po-button, compartilhada pelo spec completo (1 teste por combinação) e pelo spec de grid. */
export type ButtonVariant = { name: string; kind: string; danger: boolean };
export type ButtonContent = { name: string; icon?: string; label?: string; aria?: string };
export type ButtonState = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading';

// p-danger é ignorado em tertiary/glow (ver PoButtonBaseComponent), por isso não entram com danger.
export const VARIANTS: ButtonVariant[] = [
  { name: 'primary', kind: 'primary', danger: false },
  { name: 'primary-danger', kind: 'primary', danger: true },
  { name: 'secondary', kind: 'secondary', danger: false },
  { name: 'secondary-danger', kind: 'secondary', danger: true },
  { name: 'tertiary', kind: 'tertiary', danger: false },
  { name: 'glow', kind: 'glow', danger: false }
];
export const SIZES = ['small', 'medium', 'large'];
export const CONTENTS: ButtonContent[] = [
  { name: 'label', label: 'Salvar' },
  { name: 'icon-label', icon: 'an an-plus', label: 'Adicionar' },
  { name: 'icon-only', icon: 'an an-plus', aria: 'Adicionar' },
  { name: 'long-label', icon: 'an an-plus', label: 'Um rótulo bem longo para testar quebra e truncamento do botão' }
];
export const STATES: ButtonState[] = ['default', 'hover', 'focus', 'active', 'disabled', 'loading'];

/** Estado → props do harness. hover/focus/active são forçados pelo teste via CDP (`force`). */
export function stateProps(state: ButtonState): { force?: string; disabled?: boolean; loading?: boolean } {
  if (state === 'disabled') return { disabled: true };
  if (state === 'loading') return { loading: true };
  return state === 'default' ? {} : { force: state };
}
