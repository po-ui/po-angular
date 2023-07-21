import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'po-calendar-header',
  templateUrl: './po-calendar-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoCalendarHeaderComponent {
  years = this.addYearsFrom1999ToCurrent();

  monthSelected = 6;
  yearSelected = 2023;
  _mouths: any[] = [];

  @Input('p-hide-previous') hidePrevious = false;

  @Input('p-hide-next') hideNext = false;

  @Input('p-mouths') set mouths(items: any[]) {
    this._mouths = [];
    this.updateDate(items);
  }
  get mouths() {
    return this._mouths;
  }

  @Output('p-previous') previous = new EventEmitter<void>();

  @Output('p-next') next = new EventEmitter<void>();

  @Output('p-mouth') mouth = new EventEmitter<any>();

  constructor() {}

  updateDate(items: any[]) {
    items.forEach((item: any, index: number) => {
      this._mouths.push({
        value: index,
        label: item
      });
    });
  }

  addYearsFrom1999ToCurrent() {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let year = currentYear; year >= 1999; year--) {
      years.push({
        label: year,
        value: year
      });
    }

    return years;
  }
}
