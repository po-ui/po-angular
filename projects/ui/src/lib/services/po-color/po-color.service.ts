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
  overlayColors: Array<string> = [];
  private readonly colorBlack = '#000000';

  /**
   * Avalia a propriedade `color` na lista de items passada. Caso sim, trata se é decimal ou string `po-color`. Caso não haja, retorna a cor default.
   *
   * @param data
   */
  getColors<T extends PoColorArgs>(data: Array<T>, categoricalColors = false, overlayColors = false): Array<T> {
    this.verifyIfHasColorProperty<T>(data, categoricalColors, overlayColors);

    return data.map((dataItem, index) => {
      if (dataItem.color) {
        dataItem.color = this.verifyIfIsPoColorPalette(dataItem.color);
        if (overlayColors) {
          const overlayColor = this.verifyIfIsPoColorPalette(dataItem.color);
          return { ...dataItem, overlayColor, isNotTokenColor: true };
        }

        return dataItem;
      }

      const color = this.defaultColors[index] === undefined ? this.colorBlack : this.defaultColors[index];
      if (overlayColors) {
        const overlayColor = this.overlayColors[index];
        return { ...dataItem, color, overlayColor };
      }

      return { ...dataItem, color };
    });
  }

  private verifyIfHasColorProperty<T extends PoColorArgs>(
    data: Array<T>,
    categoricalColors = false,
    overlayColors = false
  ): void {
    const hasColorProperty = data.every(dataItem => dataItem.hasOwnProperty('color') && dataItem.color?.length > 0);
    if (!hasColorProperty) {
      this.defaultColors = categoricalColors
        ? this.getDefaultCategoricalColors(data.length)
        : this.getDefaultColors(data.length);
      if (overlayColors) {
        this.overlayColors = this.getDefaultCategoricalColors(data.length, true);
      }
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

  private getDefaultCategoricalColors(length: number, isOverlay = false): Array<string> {
    const maxTokens = 8;
    const colors: Array<string> = [];

    for (let i = 1; i <= Math.min(length, maxTokens); i++) {
      isOverlay
        ? colors.push(this.getCSSVariable(`--categorical-overlay-0${i}`))
        : colors.push(this.getCSSVariable(`--categorical-0${i}`));
    }

    while (colors.length < length) {
      isOverlay ? colors.push(this.defaultColors[length - 1]) : colors.push(this.getRandomColor());
    }

    return colors;
  }

  // Uso seguro de Math.random(): este número aleatório é utilizado apenas para gerar uma cor aleatória para fins visuais (UI).
  // Não está relacionado a lógica de autenticação, segurança ou qualquer processo sensível.
  private getRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  private getCSSVariable(variable: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }
}
