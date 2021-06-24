import { Input, Directive } from '@angular/core';

@Directive()
export class PoGridCellBaseComponent {
  @Input('p-align') align?: string = 'left';

  @Input('p-freeze') freeze?: boolean = false;

  @Input('p-tab-index') tabIndex?: number = -1;

  @Input('p-position') position?: string = '';

  @Input('p-readonly') readonly?: boolean = false;

  @Input('p-value') value?: string;

  private _width: number | string = 0;

  @Input('p-width') set width(value: number | string) {
    this._width = value;
  }
  get width(): number | string {
    return this._width ? `${this._width}px` : '';
  }
}
