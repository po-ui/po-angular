import { Component } from '@angular/core';
import { PoThemeService, PoSelectOption } from '../../../ui/src/lib';

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

  selectedValue: string = '';
  radioValue: string = '';
  inputValue: string = '';

  options = [
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' }
  ];

  accessibilityLevel: 'AA' | 'AAA' = 'AAA';

  // SELECT
  selectOptions: Array<PoSelectOption> = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ];

  constructor(private poThemeService: PoThemeService) {
    document.documentElement.className = this.accessibilityLevel;
  }

  toggleAccessibility(): void {
    this.accessibilityLevel = this.accessibilityLevel === 'AA' ? 'AAA' : 'AA';
    document.documentElement.className = this.accessibilityLevel;
  }
}
