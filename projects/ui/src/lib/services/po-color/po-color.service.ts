import { Injectable } from '@angular/core';

import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';
import { PoDefaultColors } from './po-colors.constant';

const poColorPalette = (<any>Object).values(PoColorPaletteEnum);

interface PoColorArgs {
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoColorService {
  defaultColors: Array<string> = [];

  /**
   * Avalia a propriedade `color` na lista de items passada. Caso sim, trata se é decimal ou string `po-color`. Caso não haja, retorna a cor default.
   * @param data
   */
  getColors<T extends PoColorArgs>(data: Array<T>): Array<T> {
    this.verifyIfHasColorProperty<T>(data);

    return data.map((dataItem, index) => {
      if (dataItem.color) {
        dataItem.color = this.verifyIfIsPoColorPalette(dataItem.color);

        return dataItem;
      }

      const color = this.defaultColors[index];
      return { ...dataItem, color };
    });
  }

  private verifyIfHasColorProperty<T extends PoColorArgs>(data: Array<T>): void {
    const hasColorProperty = data.every(dataItem => dataItem.hasOwnProperty('color') && dataItem.color?.length > 0);
    if (!hasColorProperty) {
      this.defaultColors = this.getDefaultColors(data.length);
    }
  }

  private verifyIfIsPoColorPalette(color: string): string {
    if (poColorPalette.includes(color)) {
      return `po-${color}`;
    }
    return color;
  }

  private getDefaultColors(length: number): Array<string> {
    if (length === 1) {
      return PoDefaultColors[0];
    }

    const colorsLength = PoDefaultColors.length;

    if (length > colorsLength) {
      const quantityDuplicates = length / colorsLength;
      let colors = PoDefaultColors[colorsLength - 1];

      for (let i = 0; i <= quantityDuplicates; i++) {
        colors = colors.concat(PoDefaultColors[colorsLength]);
      }

      return colors;
    }

    return PoDefaultColors[length - 1];
  }
}
