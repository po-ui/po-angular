import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PoHeaderBrand } from '../interfaces/po-header-brand.interface';

@Component({
  selector: 'po-header-brand',
  templateUrl: './po-header-brand.component.html',
  standalone: false
})
export class PoHeaderbrandComponent {
  @ViewChild('target', { read: ElementRef, static: true }) targetRef: ElementRef;

  @Input('p-brand') brand: PoHeaderBrand;

  @Input('p-actions-menu') actionsMenu = [];

  @Output('p-click-menu') clickMenu = new EventEmitter<any>();
}
