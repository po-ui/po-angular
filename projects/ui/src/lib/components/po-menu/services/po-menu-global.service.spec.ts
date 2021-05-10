import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoMenuModule } from '../po-menu.module';
import { PoMenuGlobalService } from './po-menu-global.service';

describe('PoMenuGlobalService', () => {
  let menuGlobalService: PoMenuGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoMenuModule]
    });

    menuGlobalService = TestBed.inject(PoMenuGlobalService);
  });

  it('sendApplicationMenu: should call applicationMenu.next with menu', () => {
    const menu = <any>{ id: '123', menus: [] };

    spyOn(menuGlobalService['applicationMenu'], 'next');

    menuGlobalService.sendApplicationMenu(menu);

    expect(menuGlobalService['applicationMenu'].next).toHaveBeenCalledWith(menu);
  });

  it('sendMenus: should call menus.next with menuItem', () => {
    const menus = [{ label: 'Item', link: '/item' }];

    spyOn(menuGlobalService['menus'], 'next');

    menuGlobalService.sendMenus(menus);

    expect(menuGlobalService['menus'].next).toHaveBeenCalledWith(menus);
  });

  it('sendRemovedApplicationMenu: should call removedApplicationMenu.next with ID param', () => {
    const id = '1234';

    spyOn(menuGlobalService['removedApplicationMenu'], 'next');

    menuGlobalService.sendRemovedApplicationMenu(id);

    expect(menuGlobalService['removedApplicationMenu'].next).toHaveBeenCalledWith(id);
  });
});
