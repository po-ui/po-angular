import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-statement',
  templateUrl: './home-statement.component.html',
  styleUrls: ['./home-statement.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeStatementComponent {}
