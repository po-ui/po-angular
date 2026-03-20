import { Component } from '@angular/core';

import {
  PoThemeA11yEnum,
  poThemeDefault,
  PoThemeService,
  PoThemeTypeEnum,
  PoTimerFormat
} from '../../../ui/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  timeValue = new Date();

  format24 = PoTimerFormat.Format24;
  format12 = PoTimerFormat.Format12;

  currentSize: string = '';
  currentA11y: string = '';

  sizeOptions = [
    { label: 'Default (medium)', value: '' },
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' }
  ];

  a11yOptions = [
    { label: 'AAA', value: 'AAA' },
    { label: 'AA', value: 'AA' }
  ];

  selectedTime24 = '';
  selectedTime12 = '';
  selectedTimeWithSeconds = '';
  selectedTimeMinMax = '';
  selectedTimeMinMaxDynamic = '';
  selectedTimeInterval = '';

  // exemplos com valor inicial
  presetTime24 = '08:30';
  presetTime12 = '02:15 PM';
  calendarDate: Date = new Date();

  isReloading = false;

  constructor(private poThemeService: PoThemeService) {}

  onSizeChange(value: string): void {
    this.currentSize = value;
  }

  onA11yChange(value: string): void {
    this.currentA11y = value;
    this.poThemeService.setTheme(poThemeDefault, PoThemeTypeEnum.light, value as PoThemeA11yEnum);
  }

  onTimeChange24(time: string): void {
    this.selectedTime24 = time;
  }

  onTimeChange12(time: string): void {
    this.selectedTime12 = time;
  }

  onTimeChangeWithSeconds(time: string): void {
    this.selectedTimeWithSeconds = time;
  }

  onTimeChangeMinMax(time: string): void {
    this.selectedTimeMinMax = time;
  }

  onTimeChangeMinMaxDynamic(time: string): void {
    this.selectedTimeMinMaxDynamic = time;
  }

  onTimeChangeInterval(time: string): void {
    this.selectedTimeInterval = time;
  }

  reload(): void {
    this.isReloading = true;
    setTimeout(() => {
      this.isReloading = false;
    }, 200);
  }
}
