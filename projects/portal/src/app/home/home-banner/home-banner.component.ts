import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { HomeBannerService } from './home-banner.service';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeBannerComponent implements OnInit {
  public stargazers_count: number;

  constructor(private service: HomeBannerService) {}

  ngOnInit() {
    this.getStargazersCount();
  }

  getStargazersCount() {
    this.service
      .getRepoData()
      .pipe(pluck('stargazers_count'))
      .subscribe((result: number) => (this.stargazers_count = result));
  }

  openExternalLink(url) {
    window.open(url, '_blank');
  }
}
