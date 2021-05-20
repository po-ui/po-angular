import { Injectable } from '@angular/core';

import { poLocales, poLocaleDefault } from '../../../services/po-language/po-language.constant';

@Injectable({
  providedIn: 'root'
})
export class PoCalendarLangService {
  private language = poLocaleDefault;

  private months = [
    {
      pt: 'Janeiro',
      en: 'January',
      es: 'Enero',
      ru: 'Январь'
    },
    {
      pt: 'Fevereiro',
      en: 'February',
      es: 'Febrero',
      ru: 'Февраль'
    },
    {
      pt: 'Março',
      en: 'March',
      es: 'Marzo',
      ru: 'Март'
    },
    {
      pt: 'Abril',
      en: 'April',
      es: 'Abril',
      ru: 'Апрель'
    },
    {
      pt: 'Maio',
      en: 'May',
      es: 'Mayo',
      ru: 'Май'
    },
    {
      pt: 'Junho',
      en: 'June',
      es: 'Junio',
      ru: 'Июнь'
    },
    {
      pt: 'Julho',
      en: 'July',
      es: 'Julio',
      ru: 'Июль'
    },
    {
      pt: 'Agosto',
      en: 'August',
      es: 'Agosto',
      ru: 'Август'
    },
    {
      pt: 'Setembro',
      en: 'September',
      es: 'Setiembre',
      ru: 'Сентябрь'
    },
    {
      pt: 'Outubro',
      en: 'October',
      es: 'Octubre',
      ru: 'Октябрь'
    },
    {
      pt: 'Novembro',
      en: 'November',
      es: 'Noviembre',
      ru: 'Ноябрь'
    },
    {
      pt: 'Dezembro',
      en: 'December',
      es: 'Diciembre',
      ru: 'Декабрь'
    }
  ];

  private shortWeekDays = [
    {
      pt: 'Dom',
      en: 'Sun',
      es: 'Dom',
      ru: 'Вс'
    },
    {
      pt: 'Seg',
      en: 'Mon',
      es: 'Lun',
      ru: 'Пн'
    },
    {
      pt: 'Ter',
      en: 'Tue',
      es: 'Mar',
      ru: 'Вт'
    },
    {
      pt: 'Qua',
      en: 'Wed',
      es: 'Mié',
      ru: 'Ср'
    },
    {
      pt: 'Qui',
      en: 'Thu',
      es: 'Jue',
      ru: 'Чт'
    },
    {
      pt: 'Sex',
      en: 'Fri',
      es: 'Vie',
      ru: 'Пт'
    },
    {
      pt: 'Sáb',
      en: 'Sat',
      es: 'Sáb',
      ru: 'Сб'
    }
  ];

  private monthLabel = {
    pt: 'Mês',
    en: 'Month',
    es: 'Mes',
    ru: 'Месяц'
  };

  private yearLabel = {
    pt: 'Ano',
    en: 'Year',
    es: 'Año',
    ru: 'Год'
  };

  getMonth(month: number) {
    return this.months[month][this.language];
  }

  getMonthLabel() {
    return this.monthLabel[this.language];
  }

  getMonthsArray() {
    const arrMonths = Array();
    for (let i = 0; i < this.months.length; i++) {
      arrMonths.push(this.months[i][this.language]);
    }
    return arrMonths;
  }

  getWeekDays(day: number) {
    return this.shortWeekDays[day][this.language];
  }

  getWeekDaysArray() {
    const arrWeekDays = Array();
    for (let i = 0; i < this.shortWeekDays.length; i++) {
      const weekDay = this.shortWeekDays[i][this.language];
      arrWeekDays.push(weekDay.toLowerCase());
    }
    return arrWeekDays;
  }

  getYearLabel() {
    return this.yearLabel[this.language];
  }

  setLanguage(language: string) {
    if (language && language.length >= 2) {
      language = language.toLowerCase().slice(0, 2);
      this.language = poLocales.includes(language) ? language : poLocaleDefault;
    }
  }
}
