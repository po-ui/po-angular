import { Component, Input } from '@angular/core';
import { PoHeaderBrand } from '../interfaces/po-header-brand.interface';

@Component({
  selector: 'po-header-brand',
  templateUrl: './po-header-brand.component.html',
  standalone: false
})
export class PoHeaderbrandComponent {
  @Input('p-brand') brand: PoHeaderBrand;
}
