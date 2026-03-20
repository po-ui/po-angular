import { Component } from '@angular/core';

import {
  PoDynamicFormField,
  PoThemeA11yEnum,
  poThemeDefault,
  PoThemeService,
  PoThemeTypeEnum,
  PoTimerFormat,
  PoTimepickerIsoFormat
} from '../../../ui/src/public-api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  // --- Timepicker demo ---
  pickerTime1 = '';
  pickerTime2 = '';
  pickerTime3 = '';
  pickerTime4 = '';
  pickerTime5 = '';
  pickerTime6 = '';
  pickerTimeReactive = '';

  timepickerForm = new FormGroup({
    horario: new FormControl('', Validators.required)
  });

  isoFormatHourMinute = PoTimepickerIsoFormat.HourMinute;
  isoFormatHourMinuteSecond = PoTimepickerIsoFormat.HourMinuteSecond;

  // exemplos com valor inicial
  presetTime24 = '08:30';
  presetTime12 = '02:15 PM';
  calendarDate: Date = new Date();

  // --- Dynamic Form demo (Fase 3) ---
  dynamicFormValue: any = {
    horarioInicio: '08:12'
  };
  dynamicFormFields: Array<PoDynamicFormField> = [
    {
      property: 'horarioInicio',
      type: 'time',
      label: 'Horário de Início',
      placeholder: 'HH:mm',
      required: true,
      requiredFieldErrorMessage: true,
      errorMessage: 'Campo obrigatório',
      showRequired: true,
      clean: true,
      gridColumns: 4
    },
    {
      property: 'horarioFim',
      type: 'time',
      label: 'Horário de Término',
      placeholder: 'HH:mm',
      required: true,
      clean: true,
      gridColumns: 4
    },
    {
      property: 'horario12h',
      type: 'time',
      label: 'Horário (12h)',
      placeholder: 'hh:mm',
      format: '12',
      clean: true,
      gridColumns: 4
    },
    {
      property: 'horarioComSegundos',
      type: 'time',
      label: 'Horário com Segundos',
      placeholder: 'HH:mm:ss',
      showSeconds: true,
      clean: true,
      gridColumns: 4
    },
    {
      property: 'horarioComercial',
      type: 'time',
      label: 'Horário Comercial (08:00-18:00)',
      placeholder: 'HH:mm',
      minValue: '08:00',
      maxValue: '18:00',
      errorMessage: 'Horário fora do expediente',
      clean: true,
      gridColumns: 4
    },
    {
      property: 'horarioDisabled',
      type: 'time',
      label: 'Horário (disabled)',
      placeholder: 'HH:mm',
      disabled: true,
      gridColumns: 4
    },
    {
      property: 'horarioReadonly',
      type: 'time',
      label: 'Horário (readonly)',
      placeholder: 'HH:mm',
      readonly: true,
      gridColumns: 4
    },
    {
      property: 'horarioIntervalo',
      type: 'time',
      label: 'Intervalo 15min',
      placeholder: 'HH:mm',
      minuteInterval: 15,
      clean: true,
      gridColumns: 4
    }
  ];

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

  onPickerChange1(time: string): void {
    this.pickerTime1 = time;
  }

  onPickerChange2(time: string): void {
    this.pickerTime2 = time;
  }

  onPickerChange3(time: string): void {
    this.pickerTime3 = time;
  }

  onPickerChange4(time: string): void {
    this.pickerTime4 = time;
  }

  onPickerChange5(time: string): void {
    this.pickerTime5 = time;
  }

  onPickerChange6(time: string): void {
    this.pickerTime6 = time;
  }

  submitReactiveForm(): void {
    console.log('Reactive form value:', this.timepickerForm.value);
  }

  reload(): void {
    this.isReloading = true;
    setTimeout(() => {
      this.isReloading = false;
    }, 200);
  }
}
