import { Component, OnInit, ViewChild } from '@angular/core';

import {
  PoCheckboxGroupOption,
  PoComboOption,
  PoMultiselectOption,
  PoRadioGroupOption,
  PoSelectOption,
  PoThemeA11yEnum,
  PoThemeService,
  PoThemeTypeEnum,
  poThemeDefault,
  PoTableColumn,
  PoTreeViewItem,
  PoBreadcrumb,
  PoPageAction,
  PoPageSlideComponent,
  PoModalComponent,
  PoModalAction,
  PoDynamicFormField,
  PoDynamicViewField,
  PoListViewAction,
  PoMenuItem
} from '../../../ui/src/lib';
import { PoDensityMode } from 'projects/ui/src/lib/enums/po-density-mode.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {
  @ViewChild('pageSlideRef') pageSlide: PoPageSlideComponent;
  @ViewChild('modalRef') modal: PoModalComponent;

  // Theme control
  currentA11y: PoThemeA11yEnum = PoThemeA11yEnum.AAA;
  currentThemeType: PoThemeTypeEnum = PoThemeTypeEnum.light;
  isSmallSize = false;

  // === p-size component models (already reactive from part 1) ===
  checkboxValue = false;
  checkboxGroupValue: Array<string> = [];
  comboValue = '';
  datepickerValue = '';
  datepickerRangeValue = { start: '', end: '' };
  decimalValue: number = 0;
  emailValue = '';
  inputValue = '';
  loginValue = '';
  lookupValue = '';
  multiselectValue: Array<string> = [];
  numberValue: number = 0;
  passwordValue = '';
  radioValue = '';
  radioGroupValue = '';
  richTextValue = '';
  selectValue = '';
  switchValue = false;
  textareaValue = '';
  urlValue = '';
  searchValue = '';
  uploadUrl = 'https://po-sample-api.onrender.com/v1/uploads/addFile';

  // === Newly reactive p-size component models ===
  calendarValue: Date;
  selectedTab = 'tab1';

  // === p-components-size container models ===
  tableItems = [
    { id: 1, name: 'Item 1', email: 'item1@test.com', status: 'Ativo' },
    { id: 2, name: 'Item 2', email: 'item2@test.com', status: 'Inativo' },
    { id: 3, name: 'Item 3', email: 'item3@test.com', status: 'Ativo' }
  ];

  tableColumns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', type: 'number' },
    { property: 'name', label: 'Nome' },
    { property: 'email', label: 'E-mail' },
    { property: 'status', label: 'Status' }
  ];

  treeViewItems: Array<PoTreeViewItem> = [
    {
      label: 'Categoria 1',
      value: 'cat1',
      subItems: [
        { label: 'Sub-item 1.1', value: 'sub11' },
        { label: 'Sub-item 1.2', value: 'sub12' }
      ]
    },
    {
      label: 'Categoria 2',
      value: 'cat2',
      subItems: [{ label: 'Sub-item 2.1', value: 'sub21' }]
    }
  ];

  breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'Componentes' }, { label: 'Simulacao' }]
  };

  pageActions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => {} },
    { label: 'Cancelar', action: () => {} }
  ];

  listViewItems = [
    { id: 1, title: 'Item de lista 1', detail: 'Detalhe do item 1' },
    { id: 2, title: 'Item de lista 2', detail: 'Detalhe do item 2' }
  ];

  listViewActions: Array<PoListViewAction> = [{ label: 'Editar', action: () => {} }];

  dynamicFormFields: Array<PoDynamicFormField> = [
    { property: 'name', label: 'Nome', gridColumns: 6 },
    { property: 'email', label: 'E-mail', gridColumns: 6 }
  ];

  dynamicFormValue: any = {};

  dynamicViewFields: Array<PoDynamicViewField> = [
    { property: 'name', label: 'Nome', gridColumns: 6 },
    { property: 'email', label: 'E-mail', gridColumns: 6 }
  ];

  dynamicViewValue: any = { name: 'Joao Silva', email: 'joao@email.com' };

  menuItems: Array<PoMenuItem> = [
    { label: 'Home', icon: 'an an-house-line', link: '/' },
    {
      label: 'Cadastros',
      icon: 'an an-user',
      subItems: [{ label: 'Usuarios', link: '/' }, { label: 'Produtos', link: '/' }]
    }
  ];

  modalPrimaryAction: PoModalAction = { label: 'Confirmar', action: () => this.modal.close() };
  modalSecondaryAction: PoModalAction = { label: 'Cancelar', action: () => this.modal.close() };

  // Options for selectable components
  checkboxGroupOptions: Array<PoCheckboxGroupOption> = [
    { value: 'opt1', label: 'Opcao 1' },
    { value: 'opt2', label: 'Opcao 2' },
    { value: 'opt3', label: 'Opcao 3' }
  ];

  radioGroupOptions: Array<PoRadioGroupOption> = [
    { value: 'radio1', label: 'Radio 1' },
    { value: 'radio2', label: 'Radio 2' },
    { value: 'radio3', label: 'Radio 3' }
  ];

  selectOptions: Array<PoSelectOption> = [
    { value: 'sel1', label: 'Select 1' },
    { value: 'sel2', label: 'Select 2' },
    { value: 'sel3', label: 'Select 3' }
  ];

  multiselectOptions: Array<PoMultiselectOption> = [
    { value: 'ms1', label: 'Multi 1' },
    { value: 'ms2', label: 'Multi 2' },
    { value: 'ms3', label: 'Multi 3' }
  ];

  comboOptions: Array<PoComboOption> = [
    { value: 'c1', label: 'Combo 1' },
    { value: 'c2', label: 'Combo 2' },
    { value: 'c3', label: 'Combo 3' }
  ];

  // Widget
  widgetTitle = 'Widget Exemplo';

  // Info
  infoLabel = 'Informacao';
  infoValue = 'Valor de exemplo';

  // Dropdown
  dropdownActions = [{ label: 'Acao 1', action: () => {} }, { label: 'Acao 2', action: () => {} }];

  // Listbox
  listboxItems = [
    { label: 'Item Listbox 1', value: '1' },
    { label: 'Item Listbox 2', value: '2' },
    { label: 'Item Listbox 3', value: '3' }
  ];

  constructor(private poThemeService: PoThemeService) {}

  ngOnInit(): void {
    this.poThemeService.setTheme(poThemeDefault, this.currentThemeType, this.currentA11y);
  }

  toggleA11y(): void {
    if (this.currentA11y === PoThemeA11yEnum.AAA) {
      this.currentA11y = PoThemeA11yEnum.AA;
      this.poThemeService.setTheme(poThemeDefault, this.currentThemeType, this.currentA11y);
      this.poThemeService.setA11yDefaultSizeSmall(true);
      this.poThemeService.setDensityMode(PoDensityMode.Small);
      this.isSmallSize = true;
    } else {
      this.currentA11y = PoThemeA11yEnum.AAA;
      this.poThemeService.setTheme(poThemeDefault, this.currentThemeType, this.currentA11y);
      this.poThemeService.setDensityMode(PoDensityMode.Medium);
      this.isSmallSize = false;
    }
  }

  toggleTheme(): void {
    this.currentThemeType =
      this.currentThemeType === PoThemeTypeEnum.light ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    this.poThemeService.setTheme(poThemeDefault, this.currentThemeType, this.currentA11y);
  }

  get a11yLabel(): string {
    return this.currentA11y === PoThemeA11yEnum.AAA ? 'AAA (medium)' : 'AA (small)';
  }

  get themeLabel(): string {
    return this.currentThemeType === PoThemeTypeEnum.light ? 'Light' : 'Dark';
  }

  openModal(): void {
    this.modal.open();
  }

  openPageSlide(): void {
    this.pageSlide.open();
  }
}
