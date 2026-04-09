import { Injectable } from '@angular/core';

import { PoCaptionTagColorEnum } from '../../enums/po-caption-tag-color.enum';
import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';

@Injectable({
  providedIn: 'root'
})
export class PoColorPaletteService {
  getColor(value: { color?: string; type?: string }): string {
    if (
      (<any>Object).values(PoColorPaletteEnum).includes(value.color) ||
      (<any>Object).values(PoCaptionTagColorEnum).includes(value.color)
    ) {
      return value.color;
    }
    return this.getColorFromType(value.type || value.color);
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
