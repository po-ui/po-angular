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
  private menuId = new Subject<string>();
  private menuChanges = new Subject<Array<PoMenuItem>>();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  receiveApplicationMenu$ = this.applicationMenu.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  receiveMenus$ = this.menus.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  receiveId$ = this.menuId.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  receiveOnChange$ = this.menuChanges.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  receiveRemovedApplicationMenu$ = this.removedApplicationMenu.asObservable();

  sendApplicationMenu(menu: PoMenuComponent) {
    this.applicationMenu.next(menu);
  }

  sendMenus(menus: Array<PoMenuItem>) {
    this.menus.next(menus);
  }

  sendId(id: string) {
    this.menuId.next(id);
  }

  sendChanges(menus: Array<PoMenuItem>) {
    this.menuChanges.next(menus);
  }

  sendRemovedApplicationMenu(id: string) {
    this.removedApplicationMenu.next(id);
  }
}
