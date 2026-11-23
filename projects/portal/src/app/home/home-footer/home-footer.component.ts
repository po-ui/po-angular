import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeFooterComponent {
  readonly githubUrl = 'https://github.com/po-ui';

  // Owner request: the "Legal" group shows only "License" (replaces Terms of Service / Privacy Policy, D10)
  readonly licenseUrl = 'https://github.com/po-ui/po-angular/blob/master/LICENSE';

  constructor(private router: Router) {}

  openInternalLink(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
