import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MenuGuidesService } from './menu-guides.service';

@Component({
  templateUrl: './guides.component.html',
  providers: [MenuGuidesService]
})
export class GuidesComponent implements OnInit {
  menus = [];

  constructor(private menuGuidesService: MenuGuidesService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get('./assets/json/api-list.json').subscribe(
      result => {
        this.menus = this.menuGuidesService.getMenus(result).map(menu => {
          menu.link = menu.link.replace('guides/', '');

          return menu;
        });
      },
      error => console.error(error)
    );
  }
}
