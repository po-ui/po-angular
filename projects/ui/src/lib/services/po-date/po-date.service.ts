import { Injectable } from '@angular/core';

import { sortValues } from '../../utils/util';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço responsável por gerenciar o tratamento dos formatos de data e hora.
 */
@Injectable()
export class PoDateService {
  private readonly dateRegex = new RegExp(
    '^(?:[0-9])\\d{1}(?:[0-9])\\d{1}-' + '(?:0[1-9]|1[0-2])-' + '(?:0[1-9]|[12]\\d|3[01])$'
  );

  private readonly isoRegex = new RegExp(
    '^(?:[0-9])\\d{1}(?:[0-9])\\d{1}-' +
      '(?:0[1-9]|1[0-2])-' +
      '(?:0[1-9]|[12]\\d|3[01])' +
      'T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z|-0[1-9]|-1\\d|-2[0-3]|' +
      '-00:?(?:0[1-9]|[0-5]\\d)|\\+[01]\\d|\\+2[0-3])' +
      '(?:|:?[0-5]\\d)$'
  );

  /**
   * Método responsável por converter datas do formato `yyyy-mm-ddThh:mm:ss+|-hh:mm` para o formato `Date`.
   *
   * @param dateString Data no formato `yyyy-mm-ddThh:mm:ss+|-hh:mm`.
   * @param minDate Definir `true` caso seja `minDate`.
   * @param maxDate Definir `true` caso seja `maxDate`.
   */
  convertIsoToDate(dateString: string, minDate: boolean, maxDate: boolean): Date {
    if (dateString) {
      const { year, month, day } = this.getDateFromIso(dateString);

      if (minDate) {
        const date = new Date(year, month - 1, day, 0, 0, 0);
        this.setYearFrom0To100(date, year);
        return date;
      } else if (maxDate) {
        const date = new Date(year, month - 1, day, 23, 59, 59);
        this.setYearFrom0To100(date, year);
        return date;
      } else {
        const miliseconds = Date.parse(dateString);
        const timezone = new Date().getTimezoneOffset() * 60000;
        return new Date(miliseconds + timezone);
      }
    }
  }

  /**
   * Método responsável por converter data do formato `Date` para o formato `yyyy-mm-dd`.
   *
   * @param date Data no formato `Date`.
   */
  convertDateToISO(date: Date) {
    if (date) {
      const fullYear = date.getFullYear();
      const getMonth = date.getMonth() + 1;
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      const month = getMonth < 10 ? '0' + getMonth : getMonth;
      const year = this.formatYear(fullYear);
      return year + '-' + month + '-' + day;
    } else {
      return null;
    }
  }

  /**
   * Método responsável por adicionar zeros a esquerda do anos em formato string.
   *
   * @param year Ano a ser validado.
   */
  formatYear(year: number) {
    if (year > 999) {
      return year.toString();
    }

    if (year > 99 && year < 1000) {
      return `0${year}`;
    }

    if (year > 9 && year < 100) {
      return `00${year}`;
    }

    if (year >= 0 && year < 10) {
      return `000${year}`;
    }
  }

  /**
   * Método responsável por retornar o dia, mês e ano separados em formato de objeto.
   *
   * @param isoDate Ano em formato string.
   */
  getDateFromIso(isoDate: string): { year: number; month: number; day: number } {
    const day = parseInt(isoDate.substring(8, 10), 10);
    const month = parseInt(isoDate.substring(5, 7), 10);
    const year = parseInt(isoDate.substring(0, 4), 10);

    return { year, month, day };
  }

  /**
   * Método responsável por retornar a data com a hora definida para `00:00:00` caso `isMinDate` for igual a `true` ou `23:59:59`
   * caso `isMindate` seja igual a `false` .
   *
   * @param date Data no formato `Date` ou `yyyy-mm-ddThh:mm:ss+|-hh:mm`.
   * @param isMinDate Caso `true` aplica `00:00:00`, caso `false` aplica `23:59:59` a hora da data informada.
   */
  getDateForDateRange(date: any, isMinDate: boolean) {
    const lastHour = isMinDate ? [0, 0, 0] : [23, 59, 59];
    if (date instanceof Date) {
      const { year, month, day } = this.splitDate(date);
      const validDate = new Date(year, month, day, ...lastHour);
      this.setYearFrom0To100(validDate, year);
      return validDate;
    } else if (this.isValidIso(date)) {
      return this.convertIsoToDate(date, isMinDate, !isMinDate);
    }
  }

  /**
   * Retorna `true` caso o período seja válido, para isso a primeira data deve ser maior que a segunda data.
   * @param dateA primeira data
   * @param dateB segunda data
   */
  isDateRangeValid(dateA: string = '', dateB: string = ''): boolean {
    const dateASplitted = dateA.split('-').map(item => parseInt(item, 10));
    const dateBSplitted = dateB.split('-').map(item => parseInt(item, 10));

    for (let index = 0; index <= dateASplitted.length; index++) {
      if (dateASplitted[index] > dateBSplitted[index]) {
        return true;
      } else if (dateASplitted[index] < dateBSplitted[index]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Método responsável por validar se uma data está no formato `yyyy-mm-ddThh:mm:ss+|-hh:mm` ou `yyyy-mm-dd`.
   *
   * @param stringDate Data.
   */
  isValidIso(stringDate: string) {
    return this.dateRegex.test(stringDate) || this.isoRegex.test(stringDate);
  }

  /**
   * Método responsável por corrigir a data caso a mesma esteja entre os anos 0 e 99.
   *
   * @param date Data.
   * @param year .
   */
  setYearFrom0To100(date: Date, year: number) {
    if (year >= 0 && year < 100) {
      date.setFullYear(year);
    }
  }

  /**
   * Método responsável por retornar o dia , mês e ano de uma data informada.
   *
   * @param date Valor da data.
   */
  splitDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return { year, month, day };
  }

  /**
   * Método responsável por validar se uma data está entre a `minDate` e `maxDate`.
   *
   * @param date Data a ser validada.
   * @param minDate Data inicial.
   * @param maxDate Data final.
   */
  validateDateRange(date: Date, minDate: Date, maxDate: Date) {
    if (minDate && maxDate) {
      return date >= minDate && date <= maxDate;
    } else if (minDate && !maxDate) {
      return date >= minDate;
    } else if (!minDate && maxDate) {
      return date <= maxDate;
    } else {
      return true;
    }
  }

  /**
   * Método responsável por validar se a data foi informada nos padrões 'yyyy-mm-dd', 'yyyy-mm-ddThh:mm:ss+|-hh:mm' ou
   * 'Date' padrão do javascript.
   *
   * @param date Data que será validada.
   */
  private validateDate(date: string | Date) {
    const validDate = date instanceof Date ? this.convertDateToISO(date) : date;

    return this.isValidIso(validDate) ? validDate : undefined;
  }
}
