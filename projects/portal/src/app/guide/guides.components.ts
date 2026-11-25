import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GuideMenuCategory, MenuGuidesService } from './menu-guides.service';
import { MenuShortcutFilter } from '../shared/menu-shortcut-filter';

@Component({
  templateUrl: './guides.component.html',
  providers: [MenuGuidesService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class GuidesComponent implements OnInit {
  menus = [];
  /** Busca do menu sem os atalhos (só o guia na categoria de origem aparece). */
  readonly menuFilter = new MenuShortcutFilter(() => this.menus);

  constructor(
    private menuGuidesService: MenuGuidesService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get<Array<GuideMenuCategory>>('./assets/json/guides-menu.json').subscribe(
      result => (this.menus = this.menuGuidesService.getMenus(result)),
      error => console.error(error)
    );
  }
}
