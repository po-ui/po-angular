import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoMenuPanelItemComponent } from './po-menu-panel-item.component';
import { PoMenuPanelItemsService } from '../services/po-menu-panel-items.service';
import { PoTooltipModule } from '../../../directives/po-tooltip';

describe('PoMenuPanelItemComponent', () => {
  let component: PoMenuPanelItemComponent;
  let fixture: ComponentFixture<PoMenuPanelItemComponent>;
  let nativeElement: any;

  const eventClick = document.createEvent('MouseEvents');
  eventClick.initMouseEvent('click', false, true, window, 0, 0, 0, 0, 0, false, false, false, true, 0, null);

  const menuItemInternal = { icon: 'user', label: 'Menu item test', type: 'internalLink', id: '11' };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), PoTooltipModule],
      declarations: [PoMenuPanelItemComponent],
      providers: [PoMenuPanelItemsService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMenuPanelItemComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    component.menuItemInternal = menuItemInternal;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('ngOnInit: should call `subscribeMenuClickedFromParent`', () => {
      const fnSpy: any = 'subscribeMenuClickedFromParent';
      spyOn(component, fnSpy);

      component.ngOnInit();

      expect(component[fnSpy]).toHaveBeenCalled();
    });

    it('clickMenuItem: should call `preventDefault` and emit `sendToParentMenuClicked` if ctrl is false', () => {
      const method = 'sendToParentMenuClicked';
      const event = {
        ctrlKey: false,
        preventDefault: () => {}
      };
      spyOn(event, 'preventDefault');
      spyOn(component['menuItemsService'], method);

      component.clickMenuItem(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component['menuItemsService'][method]).toHaveBeenCalled();
    });

    it('clickMenuItem: should call `preventDefault` and emit `sendToParentMenuClicked` if metaKey is false', () => {
      const fnSpy: any = 'sendToParentMenuClicked';
      const event = {
        metaKey: false,
        preventDefault: () => {}
      };
      spyOn(event, 'preventDefault');
      spyOn(component['menuItemsService'], fnSpy);

      component.clickMenuItem(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component['menuItemsService'][fnSpy]).toHaveBeenCalled();
    });

    it('processMenuItem: should call `activateMenu` when type is `internalLink`', () => {
      const fnSpy: any = 'activateMenu';
      const menu = { active: false, grouped: false };

      spyOn(component, fnSpy).and.returnValue(null);

      component.menuItemInternal.type = 'internalLink';
      component['processMenuItem'](menu);

      expect(component[fnSpy]).toHaveBeenCalled();
    });

    it('processMenuItem: shouldn`t call `activateMenu` when type is `externalLink`', () => {
      const fnSpy: any = 'activateMenu';
      const menu = { active: false, grouped: false };

      spyOn(component, fnSpy).and.returnValue(null);

      component.menuItemInternal.type = 'externalLink';
      component['processMenuItem'](menu);

      expect(component[fnSpy]).not.toHaveBeenCalled();
    });

    it('subscribeMenuClickedFromParent: should call `processMenuItem` when subscribe', () => {
      const fnSpy: any = 'processMenuItem';
      menuItemInternal.type = 'externalLink';

      spyOn(component, fnSpy);

      component['menuItemsService'] = <any>fakeMenuService(menuItemInternal);
      component['subscribeMenuClickedFromParent']();

      expect(component[fnSpy]).toHaveBeenCalled();
    });

    it('activateMenu: should assign true to isSelected of menuItemInternal object', () => {
      component['activateMenu'](<any>{ id: '11' });

      expect(component.menuItemInternal.isSelected).toBeTruthy();
    });
  });

  describe('Templates: ', () => {
    it('shouldn`t call `preventDefault` and `menuItemsService` when dispatch event ctrl + click', () => {
      const method = 'sendToParentMenuClicked';

      spyOn(eventClick, 'preventDefault');
      spyOn(component['menuItemsService'], method);

      const menuItem = nativeElement.querySelector('.po-menu-panel-item');
      menuItem.dispatchEvent(eventClick);

      expect(eventClick.preventDefault).not.toHaveBeenCalled();
      expect(component['menuItemsService'][method]).not.toHaveBeenCalled();
    });
  });
});

function fakeMenuService(item) {
  const observer = new Observable(obs => {
    obs.next(item);
    obs.complete();
  });

  return {
    receiveFromParentMenuClicked: () => observer
  };
}
