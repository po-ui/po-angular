import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, of } from 'rxjs';

import { HomeBannerService } from '../home-banner/home-banner.service';

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeHeroComponent implements OnInit {
  /** FIGMA C4 / D12: the "Dev Library" badge is not confirmed yet, keep it hidden until it is. */
  showDevLibraryBadge = false;

  readonly repositoryUrl = 'https://github.com/po-ui/po-angular';

  /** Label of the main button. */
  readonly startLabel = 'Comece com o PO UI';

  /** Tag text when the GitHub API fails (no number). */
  readonly tagFallbackLabel = 'Star';

  stargazersCount: number;

  /** "Star 1017", as the old Star button of the banner showed it. */
  get tagLabel(): string {
    return this.stargazersCount === undefined ? this.tagFallbackLabel : `Star ${this.stargazersCount}`;
  }

  constructor(
    private router: Router,
    private service: HomeBannerService
  ) {}

  ngOnInit() {
    this.service
      .getRepoData()
      .pipe(catchError(() => of(undefined)))
      .subscribe(data => (this.stargazersCount = data?.stargazers_count));
  }

  openInternalLink(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
