import { Component } from '@angular/core';
import { PoThemeService } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  selectedValue: string = '';
  radioValue: string = '';
  inputValue: string = '';

  options = [
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' }
  ];

  accessibilityLevel: 'AA' | 'AAA' = 'AAA';

  constructor(private poThemeService: PoThemeService) {
    document.documentElement.className = this.accessibilityLevel;
  }

  toggleAccessibility(): void {
    this.accessibilityLevel = this.accessibilityLevel === 'AA' ? 'AAA' : 'AA';
    document.documentElement.className = this.accessibilityLevel;
  }
}
