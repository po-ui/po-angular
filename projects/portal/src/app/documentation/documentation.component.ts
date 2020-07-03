import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MenuComponentsService } from './menu-components.service';

@Component({
  templateUrl: './documentation.component.html',
  providers: [MenuComponentsService]
})
export class DocumentationComponent implements OnInit {
  menus = [];

  constructor(private menuComponentsService: MenuComponentsService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get('./assets/json/api-list.json').subscribe(
      result => {
        this.menus = this.menuComponentsService.getMenus(result);
      },
      error => console.error(error)
    );
  }
}
