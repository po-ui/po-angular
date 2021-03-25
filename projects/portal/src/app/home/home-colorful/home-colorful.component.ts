import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { HomeColorfulService } from './home-colorful.service';

@Component({
  selector: 'app-home-colorful',
  templateUrl: './home-colorful.component.html',
  styleUrls: ['./home-colorful.component.css']
})
export class HomeColorfulComponent implements OnInit {
  public stargazers_count: number;

  constructor(private service: HomeColorfulService) {}

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
