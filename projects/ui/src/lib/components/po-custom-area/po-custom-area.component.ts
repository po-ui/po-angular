import { Component, Input, OnInit } from '@angular/core';
import { PoCustomAreaService } from './services/po-custom-area.service';

@Component({
  selector: 'po-po-custom-area',
  templateUrl: './po-custom-area.component.html',
  styleUrls: ['./po-custom-area.component.css']
})
export class PoCustomAreaComponent implements OnInit {
  @Input('p-api-custom') apiCustom: string;
  @Input('p-component-name') componentName: string;
  @Input('p-props') props: { [key: string]: string };
  @Input('p-class-style') classStyle: string;
  @Input('p-events') events: { [key: string]: (event: any) => void };
  @Input('p-slot-text') slotText: string;

  constructor(private poCustomAreaService: PoCustomAreaService) {}

  ngOnInit(): void {
    this.poCustomAreaService.api = this.apiCustom;
    this.poCustomAreaService.add(
      this.componentName,
      'content',
      this.props,
      this.classStyle,
      this.events,
      this.slotText
    );
  }
}
