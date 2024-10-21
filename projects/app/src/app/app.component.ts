import { Component } from '@angular/core';
import { PoThemeService, PoSelectOption, PoMultiselectOption, PoRadioGroupOption } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  inputValueAA: string = '';
  inputValueAAA: string = '';

  passwordValueAA: string = '';
  passwordValueAAA: string = '';

  // Senhas para o nível AA

  passwordValueAADisabled: string = 'SenhaDesabilitada';
  passwordValueAAReadonly: string = 'SenhaSomenteLeitura';

  // Senhas para o nível AAA

  passwordValueAAADisabled: string = 'SenhaDesabilitada';
  passwordValueAAAReadonly: string = 'SenhaSomenteLeitura';

  decimalValueAA: number | null = null;
  decimalValueAAA: number | null = null;

  // Valores decimais para o nível AA

  decimalValueAADisabled: number = 123.45;
  decimalValueAAReadonly: number = 678.9;

  // Valores decimais para o nível AAA

  decimalValueAAADisabled: number = 1234567890.12;
  decimalValueAAAReadonly: number = 9876543210.34;

  emailValueAA: string = '';
  emailValueAAA: string = '';

  numberValueAA: number | null = null;
  numberValueAAA: number | null = null;

  // Valores numéricos para o nível AA

  numberValueAADisabled: number = 42;
  numberValueAAReadonly: number = 58;

  // Valores numéricos para o nível AAA

  numberValueAAADisabled: number = 123;
  numberValueAAAReadonly: number = 987;

  linkLabelAA: string = 'Clique aqui para saber mais (abre em nova aba)';
  linkLabelAAA: string = 'Clique aqui para saber mais (abre em nova aba)';
  linkUrlAA: string = 'https://example.com';
  linkUrlAAA: string = 'https://example.com';

  loginValueAA: string = '';
  loginValueAAA: string = '';
  loginValueDisabledAA: string = '';
  loginValueDisabledAAA: string = '';
  loginValueReadonlyAA: string = '';
  loginValueReadonlyAAA: string = '';

  // Propriedades para o po-radio
  radioValueAAOption1: boolean = false;
  radioValueAAOption2: boolean = false;

  radioValueAAAOption1: boolean = false;
  radioValueAAAOption2: boolean = false;

  urlValueAA: string = '';
  urlValueAAA: string = '';
  urlValueAADisabled: string = '';
  urlValueAAReadonly: string = '';
  urlValueAAADisabled: string = '';
  urlValueAAAReadonly: string = '';

  // Emails para o nível AA

  emailValueAADisabled: string = 'email.desabilitado@example.com';
  emailValueAAReadonly: string = 'email.readonly@example.com';

  // Emails para o nível AAA

  emailValueAAADisabled: string = 'email.desabilitado@example.com';
  emailValueAAAReadonly: string = 'email.readonly@example.com';

  accessibilityLevel: 'AA' | 'AAA' = 'AAA';

  // radio
  radioSelect = '1';

  // SELECT
  selectOptions: Array<PoSelectOption> = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ];
  multiOptions: Array<PoMultiselectOption> = [
    { value: 'poMultiselect1', label: 'PO Multiselect 1' },
    { value: 'poMultiselect2', label: 'PO Multiselect 2' }
  ];

  constructor(private poThemeService: PoThemeService) {
    document.documentElement.className = this.accessibilityLevel;
  }

  toggleAccessibility(): void {
    this.accessibilityLevel = this.accessibilityLevel === 'AA' ? 'AAA' : 'AA';
    document.documentElement.className = this.accessibilityLevel;
  }

  // Função para gerenciar a seleção dos rádios (apenas uma opção pode ser selecionada)
  onRadioChangeAA(option: string) {
    this.radioValueAAOption1 = option === '1';
    this.radioValueAAOption2 = option === '2';
  }

  onRadioChangeAAA(option: string) {
    this.radioValueAAAOption1 = option === '1';
    this.radioValueAAAOption2 = option === '2';
  }
}
