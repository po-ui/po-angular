import { Pipe, PipeTransform } from '@angular/core';

import { isTypeof } from '../../utils/util';

/**
 * @docsPrivate
 *
 * @description
 *
 * Pipe responsável por apresentar um horário baseado no formato de entrada definido na API do PO UI.
 */
@Pipe({
  name: 'po_time'
})
export class PoTimePipe implements PipeTransform {
  transform(time: string, format?: string): string {
    const hourRegex = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9][\.]?([0-9]{1,6})?$/g;

    if (isTypeof(time, 'string') && hourRegex.test(time)) {
      const amountOfF = format ? format.lastIndexOf('f') - format.indexOf('f') + 1 : 0;

      const miliseconds = this.addDotMiliseconds(time.substring(9, 9 + amountOfF), amountOfF);
      const formatMiliseconds: string = this.getFormatMiliseconds(amountOfF);

      return this.formatValue(time, format, formatMiliseconds, miliseconds);
    }
    return null;
  }

  private addDotMiliseconds(miliseconds: string, amountOfF: number): string {
    if (miliseconds && amountOfF) {
      miliseconds = '.' + miliseconds;
    }
    return miliseconds;
  }

  private formatValue(time: string, format: string, formatMiliseconds: string, miliseconds: string): string {
    if (time && format) {
      const hour = time.substring(0, 2);
      const minutes = time.substring(3, 5);
      const seconds = time.substring(6, 8);

      format = format.replace('HH', hour);
      format = format.replace('mm', minutes);
      format = format.replace('ss', seconds);
      format = format.replace(`.${formatMiliseconds}`, miliseconds);

      return format;
    } else {
      return time;
    }
  }

  private getFormatMiliseconds(amountOfF: number): string {
    let formatMiliseconds: string = '';

    for (let i = 0; i < amountOfF; i++) {
      formatMiliseconds += 'f';
    }

    return formatMiliseconds;
  }
}
