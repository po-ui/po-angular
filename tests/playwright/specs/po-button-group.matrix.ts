/** Matriz do po-button-group, compartilhada pelo spec completo (1 teste por combinação) e pelo spec de grid. */
export type GroupToggle = 'none' | 'single' | 'multiple';
export type GroupItem = { label?: string; icon?: string; selected?: boolean; disabled?: boolean };
export type GroupContent = { name: string; items: GroupItem[] };
export type GroupState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'active'
  | 'item-disabled'
  | 'all-disabled'
  | 'selected'
  | 'selected-hover'
  | 'selected-focus';

export const SIZES = ['small', 'medium']; // PoFieldSize: o grupo não tem 'large'
export const TOGGLES: GroupToggle[] = ['none', 'single', 'multiple'];
export const CONTENTS: GroupContent[] = [
  { name: 'label', items: [{ label: 'Dia' }, { label: 'Semana' }, { label: 'Mês' }] },
  {
    name: 'icon-label',
    items: [
      { label: 'Lista', icon: 'an an-list' },
      { label: 'Grade', icon: 'an an-squares-four' },
      { label: 'Mapa', icon: 'an an-map-pin' }
    ]
  },
  { name: 'icon-only', items: [{ icon: 'an an-list' }, { icon: 'an an-squares-four' }, { icon: 'an an-map-pin' }] },
  {
    name: 'long-label',
    items: [
      { label: 'Um rótulo bem longo para testar' },
      { label: 'Curto' },
      { label: 'Outro rótulo razoavelmente longo' }
    ]
  }
];
const BASE_STATES: GroupState[] = ['default', 'hover', 'focus', 'active', 'item-disabled', 'all-disabled'];
// "selected*" só faz sentido quando há seleção (toggle != none).
export const STATES_BY_TOGGLE: Record<GroupToggle, GroupState[]> = {
  none: BASE_STATES,
  single: [...BASE_STATES, 'selected', 'selected-hover', 'selected-focus'],
  multiple: [...BASE_STATES, 'selected', 'selected-hover', 'selected-focus']
};

export function buildItems(c: GroupContent, toggle: GroupToggle, state: GroupState): GroupItem[] {
  const items = c.items.map(i => ({ ...i }));
  if (state === 'item-disabled') items[1].disabled = true;
  if (state === 'all-disabled') items.forEach(i => (i.disabled = true));
  if (state.startsWith('selected')) {
    items[0].selected = true;
    if (toggle === 'multiple') items[2].selected = true;
  }
  return items;
}

/**
 * Estado → ponteiro forçado e em QUAL item. hover/active/focus agem no 2º item; os "selected-*" no 1º (selecionado).
 * Usado pelo spec completo (hover/Tab reais) e pelo grid (CDP).
 */
export function pointerTarget(state: GroupState): { force: 'hover' | 'focus' | 'active'; item: number } | undefined {
  if (state === 'hover' || state === 'focus' || state === 'active') return { force: state, item: 1 };
  if (state === 'selected-hover') return { force: 'hover', item: 0 };
  if (state === 'selected-focus') return { force: 'focus', item: 0 };
  return undefined;
}
