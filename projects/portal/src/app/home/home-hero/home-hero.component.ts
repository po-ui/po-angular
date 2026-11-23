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

  stargazersCount: number;

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
