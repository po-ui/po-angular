import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'po-poc',
  templateUrl: './poc.component.html',
  styles: []
})
export class PocComponent implements OnInit {
  url = 'http://localhost:3000/custom';
  whatis: boolean;

  constructor() {}

  ngOnInit(): void {}
}
