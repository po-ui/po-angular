import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoCustomAreaService } from './services/po-custom-area.service';

@Component({
  selector: 'po-custom-area',
  templateUrl: './po-custom-area.component.html',
  styleUrls: ['./po-custom-area.component.css']
})
export class PoCustomAreaComponent implements OnInit, OnDestroy {
  @Input('p-api-custom') apiCustom: string;
  @Input('p-component-name') componentName: string;
  @Input('p-props') props: { [key: string]: string };
  @Input('p-class-style') classStyle: string;
  @Input('p-events') events: { [key: string]: (event: any) => void };
  @Input('p-slot-text') slotText: string;

  private sub = new Subscription();

  constructor(private poCustomAreaService: PoCustomAreaService) {}

  ngOnInit(): void {
    console.log('Custom 1');
    this.poCustomAreaService.api = this.apiCustom;
    this.sub = this.poCustomAreaService
      .add(this.componentName, 'content', this.props, this.classStyle, this.events, this.slotText)
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
