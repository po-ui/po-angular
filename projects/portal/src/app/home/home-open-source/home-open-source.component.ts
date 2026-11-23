import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-open-source',
  templateUrl: './home-open-source.component.html',
  styleUrls: ['./home-open-source.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeOpenSourceComponent {
  openExternalLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
