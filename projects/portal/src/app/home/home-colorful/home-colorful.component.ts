import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-colorful',
  templateUrl: './home-colorful.component.html',
  styleUrls: ['./home-colorful.component.css']
})
export class HomeColorfulComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  openExternalLink(url) {
    window.open(url, '_blank');
  }
}
