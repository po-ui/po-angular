import { TestBed } from '@angular/core/testing';

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

    vi.spyOn(menuGlobalService['applicationMenu'] as any, 'next');

    menuGlobalService.sendApplicationMenu(menu);

    expect(menuGlobalService['applicationMenu'].next).toHaveBeenCalledWith(menu);
  });

  it('sendChanges: should call menuChanges.next ', () => {
    const menus = [{ label: 'Item', link: '/item' }];

    vi.spyOn(menuGlobalService['menuChanges'] as any, 'next');

    menuGlobalService.sendChanges(menus);

    expect(menuGlobalService['menuChanges'].next).toHaveBeenCalledWith(menus);
  });

  it('sendMenus: should call menus.next with menuItem', () => {
    const menus = [{ label: 'Item', link: '/item' }];

    vi.spyOn(menuGlobalService['menus'] as any, 'next');

    menuGlobalService.sendMenus(menus);

    expect(menuGlobalService['menus'].next).toHaveBeenCalledWith(menus);
  });

  it('sendRemovedApplicationMenu: should call removedApplicationMenu.next with ID param', () => {
    const id = '1234';

    vi.spyOn(menuGlobalService['removedApplicationMenu'] as any, 'next');

    menuGlobalService.sendRemovedApplicationMenu(id);

    expect(menuGlobalService['removedApplicationMenu'].next).toHaveBeenCalledWith(id);
  });
});
