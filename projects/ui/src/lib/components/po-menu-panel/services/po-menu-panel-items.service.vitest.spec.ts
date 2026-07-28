import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { PoMenuPanelItem } from '../po-menu-panel-item/po-menu-panel-item.interface';
import { PoMenuPanelItemsService } from './po-menu-panel-items.service';

describe('PoMenuPanelItemsService', () => {
  let menuItemsService: PoMenuPanelItemsService;

  const menuItem: PoMenuPanelItem = {
    label: 'Documentation',
    link: 'documentation/',
    icon: 'home'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoMenuPanelItemsService]
    });

    menuItemsService = TestBed.inject(PoMenuPanelItemsService);
  });

  describe('Methods:', () => {
    it('sendToParentMenuClicked: should call subjectChild.next with menuItem', () => {
      const spy = vi.spyOn(menuItemsService['subjectChild'], 'next');

      menuItemsService.sendToParentMenuClicked(menuItem);

      expect(spy).toHaveBeenCalledWith(menuItem);
    });

    it('sendToChildMenuClicked: should call subjectParent with menuItem', () => {
      const spy = vi.spyOn(menuItemsService['subjectParent'], 'next');

      menuItemsService.sendToChildMenuClicked(menuItem);

      expect(spy).toHaveBeenCalledWith(menuItem);
    });

    it('receiveFromChildMenuClicked: should call subjectChild.asObservable', () => {
      const spy = vi.spyOn(menuItemsService['subjectChild'], 'asObservable');

      menuItemsService.receiveFromChildMenuClicked();

      expect(spy).toHaveBeenCalled();
    });

    it('receiveFromChildMenuClicked: should return an instanceof Observable', () => {
      const result = menuItemsService.receiveFromChildMenuClicked();

      expect(result instanceof Observable).toBe(true);
    });

    it('receiveFromParentMenuClicked: should call subjectParent.asObservable', () => {
      const spy = vi.spyOn(menuItemsService['subjectParent'], 'asObservable');

      menuItemsService.receiveFromParentMenuClicked();

      expect(spy).toHaveBeenCalled();
    });

    it('receiveFromParentMenuClicked: should return an instanceof Observable in receiveFromParentMenuClicked', () => {
      const result = menuItemsService.receiveFromParentMenuClicked();

      expect(result instanceof Observable).toBe(true);
    });
  });
});
