import { Component } from '@angular/core';
import { PoThemeService, PoSelectOption, PoMultiselectOption } from '../../../ui/src/lib';

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

  decimalValueAA: number | null = null;
  decimalValueAAA: number | null = null;

  emailValueAA: string = '';
  emailValueAAA: string = '';

  numberValueAA: number | null = null;
  numberValueAAA: number | null = null;

  linkLabelAA: string = 'Clique aqui para saber mais (abre em nova aba)';
  linkLabelAAA: string = 'Clique aqui para saber mais (abre em nova aba)';
  linkUrlAA: string = 'https://example.com';
  linkUrlAAA: string = 'https://example.com';

  // Propriedades para o po-radio
  radioValueAAOption1: boolean = false;
  radioValueAAOption2: boolean = false;

  radioValueAAAOption1: boolean = false;
  radioValueAAAOption2: boolean = false;

  accessibilityLevel: 'AA' | 'AAA' = 'AAA';

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
