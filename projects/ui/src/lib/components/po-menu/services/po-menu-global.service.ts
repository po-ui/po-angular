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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  receiveApplicationMenu$ = this.applicationMenu.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  receiveMenus$ = this.menus.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
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
