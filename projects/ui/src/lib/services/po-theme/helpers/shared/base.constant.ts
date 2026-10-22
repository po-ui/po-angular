/**
 * Estilos `perComponent` compartilhados (base) do tema do PO-UI.
 *
 * Espelha o papel do `poThemeTotvsBase` do THF, porém definido dentro do próprio
 * po-angular. É espalhado ANTES dos overrides de cada nível de acessibilidade
 * (ex.: AAA) no `PoThemeService`, permitindo que os níveis sobrescrevam a base.
 */
export const poThemeSharedBase = {
  perComponent: {
    /* Field tem pill */
    /* Container tem 12px */
    /* Card tem 16px */
    'po-button, .po-header-nav-submenu-more:focus, .po-header-nav-customer-container:focus, .po-header-nav-submenu:focus, .po-header-nav-submenu-button-more:hover .po-header-nav-submenu-more-icon, .po-header-nav-submenu-button-more:hover, .po-header-nav-submenu-button:hover, .po-header-nav-submenu-button, .po-header-nav-submenu-button-more':
      {
        '--border-radius': 'var(--border-radius-pill)'
      },
    'po-button-group .po-button': {
      '--border-radius': 'var(--border-radius-pill)'
    },
    '.po-input, .po-combo-input, .po-lookup .po-lookup-input, .po-multiselect-input, .thf-lookup-input .thf-input, .po-select, .po-search .po-search-input, .po-dropdown-button':
      {
        'border-radius': 'var(--border-radius-pill)'
      },
    'po-combo, po-dropdown, po-lookup, po-search': {
      '--border-radius': 'var(--border-radius-pill)'
    },
    '.po-button-default.po-rich-text-toolbar-color-picker-button, po-datepicker po-clean.po-icon-input, po-datepicker-range po-clean.po-icon-input, po-datetimepicker po-clean.po-icon-input, po-timepicker po-clean.po-icon-input':
      {
        'border-radius': 'var(--border-radius-pill)'
      },
    '.po-header-selected-tool, .po-header-nav-customer-container': {
      'border-radius': 'var(--border-radius-pill)'
    },
    'po-menu-filter': {
      '--border-radius': 'var(--border-radius-pill)'
    },

    'po-textarea .po-textarea': {
      'border-radius': 'calc(var(--target-size-aaa) / 2)'
    },
    'po-textarea[p-size="small"] .po-textarea': {
      'border-radius': 'calc(var(--target-size-aa) / 2)'
    },

    'po-upload': {
      '--border-radius-content': 'var(--border-radius-xl)'
    },

    'po-list-view': {
      '--list-item-border-radius': 'var(--border-radius-xl)'
    },
    '.po-list-view-main-header': {
      'border-radius': 'var(--border-radius-xl)'
    },

    'po-tree-view .po-tree-view-item-content': {
      '--border-radius': 'var(--border-radius-xl)'
    },

    '.po-rich-text-body': {
      'border-radius': 'var(--border-radius-lg) var(--border-radius-lg) 0 0'
    },
    '.po-rich-text-toolbar': {
      'border-radius': '0 0 var(--border-radius-lg) var(--border-radius-lg)'
    },
    '.po-combo-clean:focus, .thf-field-icon:focus, .po-search:not([p-search-type=locate]) .po-search-button:last-child:focus, .po-search[p-search-type=locate] .po-search-locate-controls .po-search-button:last-of-type, .po-search .po-search-button:focus, .po-lookup .po-lookup-buttons .po-lookup-button.po-lookup-button-clean:is(:focus, :focus-visible), .po-lookup .po-lookup-buttons .po-lookup-button.po-lookup-button-trigger:is(:focus, :focus-visible), .po-lookup .po-lookup-input:is(:focus, :focus-visible)':
      {
        'border-radius': '0.625rem'
      },
    '.po-checkbox-outline:is(:focus), .po-checkbox-outline:is(:focus-visible), .po-radio-focus > label, .po-switch-container:focus-visible, .po-accordion-manager-button:focus, .po-accordion-manager-button:focus-visible, .po-accordion-item-header-button:focus, .po-accordion-item-header-button:focus-visible, .po-stepper-step:not(.po-stepper-step-disabled):focus-visible':
      {
        'border-radius': 'var(--border-radius-md)'
      },
    '.po-listbox, .thf-lookup-listbox, .thf-lookup-listbox-item, .thf-lookup-listbox-item_action': {
      'border-radius': 'var(--border-radius-xl)'
    },
    '.po-item-list, .po-listbox-dropdown .po-item-list, .cdk-option:focus-visible.po-listbox-group-header,.po-listbox-dropdown :active:is(.po-item-list__action, .po-item-list__option).po-item-list__dangers':
      {
        'border-radius': 'var(--border-radius-lg)'
      },
    '.po-popover:has(po-listbox), .po-popup:has(po-listbox)': {
      'border-radius': 'var(--border-radius-lg)'
    },
    'po-header .po-popover': {
      'border-radius': 'var(--border-radius-xl)'
    },
    '.po-chart-container-gauge': {
      'border-radius': 'var(--border-radius-xl)'
    },
    'po-container, po-modal, po-widget': {
      '--border-radius': 'var(--border-radius-xl)',
      'border-radius': 'var(--border-radius)'
    },
    '.po-disclaimer-group': {
      'border-radius': 'var(--border-radius-xl)'
    },
    '.po-breadcrumb-items po-link .po-link:focus-visible, .po-breadcrumb-items po-link .po-link:focus, .po-breadcrumb-item.po-clickable po-link .po-link:focus, .po-breadcrumb-item.po-clickable po-link .po-link:active, .po-breadcrumb-item.po-clickable po-link .po-link:focus-visible, .po-breadcrumb-favorite:focus, .po-breadcrumb-item-activate:focus, .po-breadcrumb-icon-more:focus, .po-breadcrumb-item-activate:focus-visible, .po-breadcrumb-icon-more:focus-visible':
      {
        'border-radius': 'var(--border-radius-md)'
      },
    'po-skeleton': {
      '--border-radius': 'var(--border-radius-lg)',
      '--border-radius-text': 'var(--border-radius-lg)',
      '--border-radius-primary': 'var(--border-radius-lg)'
    },
    '.po-user-guide-popover': {
      '--button-border-radius': 'var(--border-radius-lg)'
    },
  },
  onRoot: {
    '--color-page-background-color-page': 'var(--color-neutral-light-05)'
  }
};
