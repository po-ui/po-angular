import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoToolbarComponent } from './po-toolbar.component';
import { PoToolbarModule } from './po-toolbar.module';

describe('PoToolbarComponent:', () => {
  let component: PoToolbarComponent;
  let fixture: ComponentFixture<PoToolbarComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), PoToolbarModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoToolbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnInit: should call `setTitle` on ngOnInit', () => {
      component.title = 'Novo programa';

      spyOn(component, <any>'setTitle');

      component.ngOnInit();

      expect(component['setTitle']).toHaveBeenCalledWith('Novo programa');
    });

    it('setTitle: should set `title` of `document` browser', () => {
      component['setTitle']('po');

      expect(document.title).toBe('po');
    });
  });

  describe('Templates:', () => {
    it('should show po-toolbar-notification if showNotification is true and have notificationActions', () => {
      component.showNotification = true;
      component.notificationActions = [{ label: 'teste' }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-toolbar-notification')).toBeTruthy();
    });

    it('shouldn`t show po-toolbar-notification if showNotification is false', () => {
      component.showNotification = false;
      component.notificationActions = [{ label: 'teste' }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-toolbar-notification')).toBeFalsy();
    });

    it('shouldn`t show po-toolbar-notification if no have notificationActions', () => {
      component.showNotification = true;
      component.notificationActions = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-toolbar-notification')).toBeFalsy();
    });

    it('should show po-tollbar-profile if have a profile', () => {
      component.profile = { title: 'teste' };

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-toolbar-profile')).toBeTruthy();
    });

    it('should show actions with `default` icon if have an action', () => {
      component.actions = [{ label: 'teste' }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-toolbar-actions')).toBeTruthy();
      expect(nativeElement.querySelector('.po-icon-more')).toBeTruthy();
    });

    it('should show actions with `po-icon-cart` if has an action and `actionsIcon` is `po-icon-cart`', () => {
      component.actions = [{ label: 'teste' }];
      component.actionsIcon = 'po-icon-cart';

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-toolbar-actions')).toBeTruthy();
      expect(nativeElement.querySelector('.po-icon-cart')).toBeTruthy();
    });

    it('shouldn`t show `po-actions` and `icon` if doesn`t have an action', () => {
      component.actions = undefined;
      component.actionsIcon = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-toolbar-actions')).toBeNull();
      expect(nativeElement.querySelector('.po-icon-cart')).toBeNull();
    });
  });
});
