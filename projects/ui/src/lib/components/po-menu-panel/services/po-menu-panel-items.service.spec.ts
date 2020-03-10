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
      spyOn(menuItemsService['subjectChild'], 'next');

      menuItemsService.sendToParentMenuClicked(menuItem);

      expect(menuItemsService['subjectChild'].next).toHaveBeenCalledWith(menuItem);
    });

    it('sendToChildMenuClicked: should call subjectParent with menuItem', () => {
      spyOn(menuItemsService['subjectParent'], 'next');

      menuItemsService.sendToChildMenuClicked(menuItem);

      expect(menuItemsService['subjectParent'].next).toHaveBeenCalledWith(menuItem);
    });

    it('receiveFromChildMenuClicked: should call subjectChild.asObservable', () => {
      spyOn(menuItemsService['subjectChild'], 'asObservable');

      menuItemsService.receiveFromChildMenuClicked();

      expect(menuItemsService['subjectChild'].asObservable).toHaveBeenCalled();
    });

    it('receiveFromChildMenuClicked: should return an instanceof Observable', () => {
      const result = menuItemsService.receiveFromChildMenuClicked();

      expect(result instanceof Observable).toBeTruthy();
    });

    it('receiveFromParentMenuClicked: should call subjectParent.asObservable', () => {
      spyOn(menuItemsService['subjectParent'], 'asObservable');

      menuItemsService.receiveFromParentMenuClicked();

      expect(menuItemsService['subjectParent'].asObservable).toHaveBeenCalled();
    });

    it('receiveFromParentMenuClicked: should return an instanceof Observable in receiveFromParentMenuClicked', () => {
      const result = menuItemsService.receiveFromParentMenuClicked();

      expect(result instanceof Observable).toBeTruthy();
    });
  });
});
