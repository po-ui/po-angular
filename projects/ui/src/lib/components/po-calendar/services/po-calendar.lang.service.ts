import { Injectable } from '@angular/core';

@Injectable()
export class PoCalendarLangService {
  private language = 'pt';

  private months = [
    {
      pt: 'Janeiro',
      en: 'January',
      es: 'Enero'
    },
    {
      pt: 'Fevereiro',
      en: 'February',
      es: 'Febrero'
    },
    {
      pt: 'Março',
      en: 'March',
      es: 'Marzo'
    },
    {
      pt: 'Abril',
      en: 'April',
      es: 'Abril'
    },
    {
      pt: 'Maio',
      en: 'May',
      es: 'Mayo'
    },
    {
      pt: 'Junho',
      en: 'June',
      es: 'Junio'
    },
    {
      pt: 'Julho',
      en: 'July',
      es: 'Julio'
    },
    {
      pt: 'Agosto',
      en: 'August',
      es: 'Agosto'
    },
    {
      pt: 'Setembro',
      en: 'September',
      es: 'Setiembre'
    },
    {
      pt: 'Outubro',
      en: 'October',
      es: 'Octubre'
    },
    {
      pt: 'Novembro',
      en: 'November',
      es: 'Noviembre'
    },
    {
      pt: 'Dezembro',
      en: 'December',
      es: 'Diciembre'
    }
  ];

  private shortWeekDays = [
    {
      pt: 'Dom',
      en: 'Sun',
      es: 'Dom'
    },
    {
      pt: 'Seg',
      en: 'Mon',
      es: 'Lun'
    },
    {
      pt: 'Ter',
      en: 'Tue',
      es: 'Mar'
    },
    {
      pt: 'Qua',
      en: 'Wed',
      es: 'Mié'
    },
    {
      pt: 'Qui',
      en: 'Thu',
      es: 'Jue'
    },
    {
      pt: 'Sex',
      en: 'Fri',
      es: 'Vie'
    },
    {
      pt: 'Sáb',
      en: 'Sat',
      es: 'Sáb'
    }
  ];

  private monthLabel = {
    pt: 'Mês',
    en: 'Month',
    es: 'Mes'
  };

  private yearLabel = {
    pt: 'Ano',
    en: 'Year',
    es: 'Año'
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
      arrWeekDays.push(this.shortWeekDays[i][this.language]);
    }
    return arrWeekDays;
  }

  getYearLabel() {
    return this.yearLabel[this.language];
  }

  setLanguage(language: string) {
    if (language && language.length >= 2) {
      language = language.toLowerCase().slice(0, 2);
      this.language = language === 'pt' || language === 'en' || language === 'es' ? language : 'pt';
    }
  }
}
