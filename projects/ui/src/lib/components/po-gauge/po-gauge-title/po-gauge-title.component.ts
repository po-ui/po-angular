import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'po-gauge-title',
  templateUrl: './po-gauge-title.component.html'
})
export class PoGaugeTitleComponent {
  @Input('p-title') title?: string;
}
