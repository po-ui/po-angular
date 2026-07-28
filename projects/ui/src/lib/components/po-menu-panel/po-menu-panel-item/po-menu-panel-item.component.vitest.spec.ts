import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), PoTooltipModule],
      declarations: [PoMenuPanelItemComponent],
      providers: [PoMenuPanelItemsService]
    }).compileComponents();

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
      const spy = vi.spyOn(component as any, 'subscribeMenuClickedFromParent');

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('clickMenuItem: should call `preventDefault` and emit `sendToParentMenuClicked` if ctrl is false', () => {
      const event = {
        ctrlKey: false,
        preventDefault: vi.fn()
      };
      const serviceSpy = vi.spyOn(component['menuItemsService'], 'sendToParentMenuClicked');

      component.clickMenuItem(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(serviceSpy).toHaveBeenCalled();
    });

    it('clickMenuItem: should call `preventDefault` and emit `sendToParentMenuClicked` if metaKey is false', () => {
      const event = {
        metaKey: false,
        preventDefault: vi.fn()
      };
      const serviceSpy = vi.spyOn(component['menuItemsService'], 'sendToParentMenuClicked');

      component.clickMenuItem(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(serviceSpy).toHaveBeenCalled();
    });

    it('processMenuItem: should call `activateMenu` when type is `internalLink`', () => {
      const spy = vi.spyOn(component as any, 'activateMenu').mockReturnValue(null);
      const menu = { active: false, grouped: false };

      component.menuItemInternal.type = 'internalLink';
      component['processMenuItem'](menu);

      expect(spy).toHaveBeenCalled();
    });

    it('processMenuItem: shouldn`t call `activateMenu` when type is `externalLink`', () => {
      const spy = vi.spyOn(component as any, 'activateMenu').mockReturnValue(null);
      const menu = { active: false, grouped: false };

      component.menuItemInternal.type = 'externalLink';
      component['processMenuItem'](menu);

      expect(spy).not.toHaveBeenCalled();
    });

    it('subscribeMenuClickedFromParent: should call `processMenuItem` when subscribe', () => {
      const spy = vi.spyOn(component as any, 'processMenuItem');
      menuItemInternal.type = 'externalLink';

      Object.defineProperty(component, 'menuItemsService', {
        value: fakeMenuService(menuItemInternal) as any,
        configurable: true
      });
      component['subscribeMenuClickedFromParent']();

      expect(spy).toHaveBeenCalled();
    });

    it('activateMenu: should assign true to isSelected of menuItemInternal object', () => {
      component['activateMenu']({ id: '11' } as any);

      expect(component.menuItemInternal.isSelected).toBe(true);
    });
  });

  describe('Templates: ', () => {
    it('shouldn`t call `preventDefault` and `menuItemsService` when dispatch event ctrl + click', () => {
      const preventSpy = vi.spyOn(eventClick, 'preventDefault');
      const serviceSpy = vi.spyOn(component['menuItemsService'], 'sendToParentMenuClicked');

      const menuItem = nativeElement.querySelector('.po-menu-panel-item');
      menuItem.dispatchEvent(eventClick);

      expect(preventSpy).not.toHaveBeenCalled();
      expect(serviceSpy).not.toHaveBeenCalled();
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
