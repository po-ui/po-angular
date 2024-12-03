import { Component } from '@angular/core';
import { PoMessageHourLiterals } from './literals/po-message-hour-literals';
import { PoMessageHourBaseComponent } from './po-message-hour-base.component';

export const poMessageHourDefault = {
  en: <PoMessageHourLiterals>{
    salutation: 'Welcome',
    dawn: 'Good dawn',
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    night: 'Good night'
  },
  es: <PoMessageHourLiterals>{
    salutation: 'Bienvenido',
    dawn: 'Buen amanecer',
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    night: 'Buenas noches'
  },
  pt: <PoMessageHourLiterals>{
    salutation: 'Bem vindo',
    dawn: 'Boa madrugada',
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    night: 'Boa noite'
  },
  ru: <PoMessageHourLiterals>{
    salutation: 'добро пожаловать',
    dawn: 'Доброй ночи',
    morning: 'Доброе утро',
    afternoon: 'Добрый день',
    night: 'Добрый вечер'
  }
};

/**
 * @docsExtends PoMessageHourBaseComponent
 *
 * @example
 *
 * <example name="po-message-hour-basic" title="PO Message Hour Basic">
 *  <file name="sample-po-message-hour-basic/sample-po-message-hour-basic.component.html"> </file>
 *  <file name="sample-po-message-hour-basic/sample-po-message-hour-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-message-hour-menu" title="PO Message Hour - Human Resources">
 *  <file name="sample-po-message-hour-menu/sample-po-message-hour-menu.component.html"> </file>
 *  <file name="sample-po-message-hour-menu/sample-po-message-hour-menu.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-message-hour',
  templateUrl: './po-message-hour.component.html'
})
export class PoMessageHourComponent extends PoMessageHourBaseComponent {
  public literals?: any;

  message: string;

  ngOnInit() {
    const browserLanguage = navigator.language.split('-')[0];
    this.literals = poMessageHourDefault[browserLanguage];

    this.setMessage();
  }

  getCurrentHour() {
    return new Date().getHours();
  }

  setMessage() {
    const hour = this.getCurrentHour();
    let timeOfDay = '';

    if (hour <= 5) {
      timeOfDay = this.literals.dawn;
    } else if (hour < 12) {
      timeOfDay = this.literals.morning;
    } else if (hour < 18) {
      timeOfDay = this.literals.afternoon;
    } else {
      timeOfDay = this.literals.night;
    }

    this.message = `${this.literals.salutation} ${timeOfDay}`;
    this.messageHour.emit(this.message);
  }
}
