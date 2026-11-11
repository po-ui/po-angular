import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-benefits',
  templateUrl: './home-benefits.component.html',
  styleUrls: ['./home-benefits.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeBenefitsComponent {}
