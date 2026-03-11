import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-transition-demo',
  templateUrl: './skeleton-transition-demo.component.html',
  styleUrls: ['./skeleton-transition-demo.component.css'],
  standalone: false
})
export class SkeletonTransitionDemoComponent {
  currentType: string = 'normal';

  toggleType() {
    this.currentType = this.currentType === 'normal' ? 'primary' : 'normal';
  }
}
