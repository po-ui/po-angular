import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { PoMenuGlobalService } from './po-menu-global.service';

describe('PoMenuGlobalService', () => {
  let menuGlobalService: PoMenuGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoMenuGlobalService]
    });

    menuGlobalService = TestBed.inject(PoMenuGlobalService);
  });

  it('sendApplicationMenu: should call applicationMenu.next with menu', () => {
    const menu = { id: '123', menus: [] } as any;

    vi.spyOn(menuGlobalService['applicationMenu'], 'next');

    menuGlobalService.sendApplicationMenu(menu);

    expect(menuGlobalService['applicationMenu'].next).toHaveBeenCalledWith(menu);
  });

  it('sendChanges: should call menuChanges.next ', () => {
    const menus = [{ label: 'Item', link: '/item' }];

    vi.spyOn(menuGlobalService['menuChanges'], 'next');

    menuGlobalService.sendChanges(menus);

    expect(menuGlobalService['menuChanges'].next).toHaveBeenCalledWith(menus);
  });

  it('sendMenus: should call menus.next with menuItem', () => {
    const menus = [{ label: 'Item', link: '/item' }];

    vi.spyOn(menuGlobalService['menus'], 'next');

    menuGlobalService.sendMenus(menus);

    expect(menuGlobalService['menus'].next).toHaveBeenCalledWith(menus);
  });

  it('sendRemovedApplicationMenu: should call removedApplicationMenu.next with ID param', () => {
    const id = '1234';

    vi.spyOn(menuGlobalService['removedApplicationMenu'], 'next');

    menuGlobalService.sendRemovedApplicationMenu(id);

    expect(menuGlobalService['removedApplicationMenu'].next).toHaveBeenCalledWith(id);
  });
});
