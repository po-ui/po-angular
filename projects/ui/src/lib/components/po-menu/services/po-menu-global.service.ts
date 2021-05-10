import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { PoMenuComponent } from '../po-menu.component';
import { PoMenuItem } from '../po-menu-item.interface';

@Injectable({
  providedIn: 'root'
})
export class PoMenuGlobalService {
  private applicationMenu = new Subject<PoMenuComponent>();
  private menus = new Subject<Array<PoMenuItem>>();
  private removedApplicationMenu = new Subject<string>();

  receiveApplicationMenu$ = this.applicationMenu.asObservable();
  receiveMenus$ = this.menus.asObservable();
  receiveRemovedApplicationMenu$ = this.removedApplicationMenu.asObservable();

  sendApplicationMenu(menu: PoMenuComponent) {
    this.applicationMenu.next(menu);
  }

  sendMenus(menus: Array<PoMenuItem>) {
    this.menus.next(menus);
  }

  sendRemovedApplicationMenu(id: string) {
    this.removedApplicationMenu.next(id);
  }
}
