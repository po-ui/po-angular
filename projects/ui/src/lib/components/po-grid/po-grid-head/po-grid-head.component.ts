import { Component, Input } from '@angular/core';

@Component({
  selector: 'po-grid-head',
  templateUrl: './po-grid-head.component.html'
})
export class PoGridHeadComponent {
  @Input('p-align') align?: string = 'left';

  @Input('p-freeze') boolean?: boolean = false;

  @Input('p-position') position?: string = '';

  @Input('p-tab-index') tabIndex?: number = -1;

  @Input('p-title') title?: string;

  private _width: string | number;

  @Input('p-width') set width(value: string | number) {
    this._width = value;
  }
  get width(): string | number {
    return this._width ? `${this._width}px` : '100%';
  }
}
