import { Injectable } from '@angular/core';

@Injectable()
export class PoCalendarLangService {
  months = [
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

  shortWeekDays = [
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

  wordMonth = {
    pt: 'Mês',
    en: 'Month',
    es: 'Mes'
  };

  wordYear = {
    pt: 'Ano',
    en: 'Year',
    es: 'Año'
  };

  lang = 'pt';

  constructor() {}

  setLanguage(lang: string) {
    if (lang && lang.length >= 2) {
      lang = lang.toLowerCase().slice(0, 2);
      this.lang = lang === 'pt' || lang === 'en' || lang === 'es' ? lang : 'pt';
    }
  }

  getWordMonth() {
    return this.wordMonth[this.lang];
  }

  getWordYear() {
    return this.wordYear[this.lang];
  }

  getMonth(month: number) {
    return this.months[month][this.lang];
  }

  getArrayMonths() {
    const arrMonths = Array();
    for (let i = 0; i < this.months.length; i++) {
      arrMonths.push(this.months[i][this.lang]);
    }
    return arrMonths;
  }

  getWeedDays(day: number) {
    return this.shortWeekDays[day][this.lang];
  }

  getArrayWeekDays() {
    const arrWeekDays = Array();
    for (let i = 0; i < this.shortWeekDays.length; i++) {
      arrWeekDays.push(this.shortWeekDays[i][this.lang]);
    }
    return arrWeekDays;
  }
}
