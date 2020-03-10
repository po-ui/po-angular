import { Injectable } from '@angular/core';

import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';

@Injectable()
export class PoColorPaletteService {
  getColor(value: { color?: string; type?: string }): string {
    return (<any>Object).values(PoColorPaletteEnum).includes(value.color)
      ? value.color
      : this.getColorFromType(value.type || value.color);
  }

  private getColorFromType(type: string): PoColorPaletteEnum {
    switch (type) {
      case 'danger':
        return PoColorPaletteEnum.Color07;
      case 'success':
        return PoColorPaletteEnum.Color11;
      case 'warning':
        return PoColorPaletteEnum.Color08;
      default:
        return PoColorPaletteEnum.Color01;
    }
  }
}
