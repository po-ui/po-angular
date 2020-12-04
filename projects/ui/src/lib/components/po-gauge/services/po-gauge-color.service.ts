import { Injectable } from '@angular/core';

import { PoGaugeColors } from '../po-gauge-colors.constant';

import { PoColorPaletteEnum } from '../../../enums/po-color-palette.enum';
import { PoGaugeRanges } from '../interfaces/po-gauge-ranges.interface';

const poGaugeColors = (<any>Object).values(PoColorPaletteEnum);

@Injectable({
  providedIn: 'root'
})
export class PoGaugeColorService {
  defaultColors: Array<string> = [];

  /**
   * Avalia a propriedade `color` em `ranges`. Caso sim, trata se é decimal ou string `po-color`. Caso não haja, retorna a cor default.
   * @param ranges
   */
  getColors(ranges: Array<PoGaugeRanges>): Array<PoGaugeRanges> {
    this.verifyIfHasColorProperty(ranges);

    return ranges.map((range: PoGaugeRanges, index) => {
      if (range.color) {
        range.color = this.verifyIfIsPoColorPalette(range.color);

        return range;
      }

      const color = this.defaultColors[index];
      return { ...range, color };
    });
  }

  private getDefaultColors(length: number): Array<string> {
    if (length === 1) {
      return PoGaugeColors[0];
    }

    const colorsLength = PoGaugeColors.length;

    if (length > colorsLength) {
      const quantityDuplicates = length / colorsLength;
      let colors = PoGaugeColors[colorsLength - 1];

      for (let i = 0; i <= quantityDuplicates; i++) {
        colors = colors.concat(PoGaugeColors[colorsLength]);
      }

      return colors;
    }

    return PoGaugeColors[length - 1];
  }

  private verifyIfHasColorProperty(ranges: Array<PoGaugeRanges>): void {
    const hasColorProperty = ranges.every(range => range.hasOwnProperty('color'));

    if (!hasColorProperty) {
      this.defaultColors = this.getDefaultColors(ranges.length);
    }
  }

  private verifyIfIsPoColorPalette(color: PoGaugeRanges['color']) {
    if (poGaugeColors.includes(color)) {
      return `po-${color}`;
    }
    return color;
  }
}
