import { Component, ElementRef, OnInit, ViewChild, input } from '@angular/core';
import { PoHelperBaseComponent } from './po-helper-base.component';

@Component({
  selector: 'po-helper',
  standalone: false,
  templateUrl: './po-helper.component.html',
  styleUrls: ['./po-helper.component.css']
})
export class PoHelperComponent extends PoHelperBaseComponent implements OnInit {
  @ViewChild('target', { read: ElementRef, static: true }) target: ElementRef;

  ngOnInit() {
    console.log('this.helper', this.helper());
  }
}
