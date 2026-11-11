import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

/** 1017 → "+1k", 2350 → "+2k"; below 1000 the number itself (e.g. "850"). */
export function formatStarCount(count: number): string {
  return count >= 1000 ? `+${Math.floor(count / 1000)}k` : `${count}`;
}

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeHeroComponent {
  /** FIGMA C4 / D12: the "Dev Library" badge is not confirmed yet, keep it hidden until it is. */
  showDevLibraryBadge = false;

  readonly repositoryUrl = 'https://github.com/po-ui/po-angular';

  /** Label of the main button. */
  readonly startLabel = 'Comece com o PO UI';

  /** Tag text when the GitHub API fails (no number). */
  readonly tagFallbackLabel = 'Star';

  stargazersCount: number = 1018;

  /** "Star +1k": the GitHub count rounded down to thousands (below 1000, the number itself). */
  get tagLabel(): string {
    return this.stargazersCount === undefined ? this.tagFallbackLabel : `Star ${formatStarCount(this.stargazersCount)}`;
  }

  constructor(private router: Router) {}

  openInternalLink(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
