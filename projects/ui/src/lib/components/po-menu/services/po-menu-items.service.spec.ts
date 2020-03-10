import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoMenuItem } from '../po-menu-item.interface';
import { PoMenuItemsService } from './po-menu-items.service';

describe('PoMenuItemsService', () => {
  let menuItemsService: PoMenuItemsService;

  const menuItem: PoMenuItem = {
    label: 'Documentation',
    link: 'documentation/'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoMenuItemsService]
    });

    menuItemsService = TestBed.inject(PoMenuItemsService);
  });

  it('should call subjectChild.next with menuItem in sendToParentMenuClicked', () => {
    spyOn(menuItemsService['subjectChild'], 'next');
    menuItemsService.sendToParentMenuClicked(menuItem);

    expect(menuItemsService['subjectChild'].next).toHaveBeenCalledWith(menuItem);
  });

  it('should call sendToChildMenuClicked with menuItem', () => {
    spyOn(menuItemsService['subjectParent'], 'next');
    menuItemsService.sendToChildMenuClicked(menuItem);

    expect(menuItemsService['subjectParent'].next).toHaveBeenCalledWith(menuItem);
  });

  it('should call subjectChild.asObservable in receiveFromChildMenuClicked', () => {
    spyOn(menuItemsService['subjectChild'], 'asObservable');
    menuItemsService.receiveFromChildMenuClicked();

    expect(menuItemsService['subjectChild'].asObservable).toHaveBeenCalled();
  });

  it('should return an instanceof Observable receiveFromChildMenuClicked', () => {
    const result = menuItemsService.receiveFromChildMenuClicked();

    expect(result instanceof Observable).toBeTruthy();
  });

  it('should call subjectParent.asObservable in receiveFromParentMenuClicked', () => {
    spyOn(menuItemsService['subjectParent'], 'asObservable');
    menuItemsService.receiveFromParentMenuClicked();

    expect(menuItemsService['subjectParent'].asObservable).toHaveBeenCalled();
  });

  it('should return an instanceof Observable in receiveFromParentMenuClicked', () => {
    const result = menuItemsService.receiveFromParentMenuClicked();

    expect(result instanceof Observable).toBeTruthy();
  });
});
