import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PoHelperBaseComponent } from './po-helper-base.component';
import { PoThemeService } from '../../services';
import { getDefaultSize, validateSize } from '../../utils/util';
import { PoHelperSize } from './enums/po-helper-size.enum';
import { PoPopoverComponent } from '../po-popover/po-popover.component';

@Component({
  selector: 'po-helper',
  standalone: false,
  templateUrl: './po-helper.component.html',
  styleUrls: ['./po-helper.component.css']
})
export class PoHelperComponent extends PoHelperBaseComponent implements OnInit {
  @ViewChild('target', { read: ElementRef, static: true }) target: ElementRef;
  @ViewChild('popover', { static: false }) popover: PoPopoverComponent;

  ngOnInit() {
    console.log('this.helper', this.helper());
    console.log('Initial size:', this.size());
  }

  onSpace(event: KeyboardEvent) {
    event.preventDefault();
    this.popover?.[this.popover.isHidden ? 'open' : 'close']();
  }
}
