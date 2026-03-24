import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PoDynamicFormField, PoModalComponent, PoPageAction, PoSearchLiterals } from 'projects/ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  showHelper: boolean = false;
  showLabel: boolean = true;
  showHelpText: boolean = false;
  compactLabel: boolean = false;
  isLoading: boolean = true;
  // tabs
  tabsCadastro = [
    'Dados cadastrais',
    'Impostos',
    'MRP/Suprimentos',
    'C.Q',
    'Atendimento',
    'Direitos autorais',
    'Garantia estendida',
    'Receita Anual'
  ];

  tabsForm3 = [
    'Dados cadastrais',
    'Imposto',
    'MRP/Suprimentos',
    'C.Q',
    'Atendimento',
    'Direitos autorais',
    'Garantia estendida',
    'Receita Anual'
  ];

  // header
  pageActions: Array<PoPageAction> = [
    { label: 'Preferências', icon: 'an an-gear', action: this.openMyModal.bind(this) },
    { label: 'Salvar e continuar' },
    { label: 'Voltar' }
  ];
  searchLiterals: PoSearchLiterals = { search: 'Localizar campo' };
  switchSearch = '';
  switchSearchLabel: string = 'Visualizar apenas campos obrigatórios';

  // formControl
  code = '3899486546';
  warehouse = 'Robert Bruce Banner';
  defaultTs = 'TS 83459';
  type = 1;
  time = undefined;
  createdAt = undefined;
  currencyType = undefined;
  currency = undefined;
  trackingCode = '34536645447547';
  appropriation = undefined;
  opCosting = undefined;

  // reactive form
  form = new FormGroup({
    name: new FormControl<string>('Power Stand'),
    barcode: new FormControl<string>(''),
    trackingType: new FormControl<string>(''),
    inclusionDate: new FormControl<Date | null>(null),
    expirationDate: new FormControl<Date | null>(null),
    time: new FormControl<string>(''),
    supplierSpecification: new FormControl<string>(''),
    productDescription: new FormControl<string>(''),
    productImage: new FormControl<string | null>(null),
    stockControl: new FormControl<boolean>(false)
  });

  // dynamic form
  fields3: Array<PoDynamicFormField> = [
    {
      property: 'unitPrice',
      label: 'Preço unitário',
      type: 'currency',
      gridColumns: 6,
      placeholder: '0,00'
    },
    {
      property: 'salePrice',
      label: 'Preço venda',
      type: 'currency',
      gridColumns: 6,
      placeholder: '0,00'
    },
    {
      property: 'standardCost',
      label: 'Custo stand',
      type: 'currency',
      gridLgColumns: 4,
      gridMdColumns: 6,
      decimalsLength: 2,
      placeholder: '0,00'
    },
    {
      property: 'netWeight',
      label: 'Peso líquido',
      type: 'decimal',
      gridLgColumns: 4,
      gridMdColumns: 6,
      decimalsLength: 4,
      placeholder: '0,0000'
    },
    {
      property: 'commission',
      label: '% Comissão',
      type: 'decimal',
      minLength: 0,
      maxLength: 100,
      gridLgColumns: 4,
      gridMdColumns: 6,
      decimalsLength: 2,
      placeholder: '0,00'
    },
    {
      property: 'bank',
      label: 'Banco',
      type: 'string',
      container: ' ',
      gridLgColumns: 4,
      gridMdColumns: 6,
      options: [
        { label: 'Itaú', code: 1 },
        { label: 'Bradesco', code: 2 },
        { label: 'Santander', code: 3 },
        { label: 'Caixa', code: 4 },
        { label: 'Banco do Brasil', code: 5 },
        { label: 'Outros', code: 6 }
      ],
      fieldLabel: 'label',
      fieldValue: 'code',
      placeholder: 'Selecione o banco'
    },
    {
      property: 'accountType',
      label: 'Tipo de conta',
      type: 'string',
      gridLgColumns: 4,
      gridMdColumns: 6,
      options: [
        { label: 'Conta Corrente', code: 1 },
        { label: 'Conta Poupança', code: 2 },
        { label: 'Conta Salário', code: 3 },
        { label: 'Conta Digital', code: 4 },
        { label: 'Conta Empresarial(PJ)', code: 5 },
        { label: 'Outros', code: 6 }
      ],
      fieldLabel: 'label',
      fieldValue: 'code',
      placeholder: 'Selecione um tipo'
    },
    {
      property: 'responsible',
      label: 'Responsável',
      type: 'string',
      gridLgColumns: 4,
      gridMdColumns: 6,
      placeholder: 'Informe o nome do responsável'
    }
  ];

  ngOnInit() {
    this.simulateLoading();
  }

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  openMyModal() {
    this.poModal.open();
  }
}
