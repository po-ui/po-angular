import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Observable } from 'rxjs';

import { PoBreadcrumbFavoriteComponent } from './po-breadcrumb-favorite.component';
import { PoBreadcrumbFavoriteService } from './po-breadcrumb-favorite.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PoBreadcrumbFavoriteComponent', () => {
  let component: PoBreadcrumbFavoriteComponent;
  let fixture: ComponentFixture<PoBreadcrumbFavoriteComponent>;
  let nativeElement: any;

  const itemActive = { label: 'Active Route', link: 'route/active' };
  const favoriteService = 'http://fakeUrlPo.com.br';
  const paramsService = {};

  const eventClick = document.createEvent('MouseEvents');
  eventClick.initEvent('click', false, true);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoBreadcrumbFavoriteComponent],
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoBreadcrumbFavoriteComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    component.itemActive = itemActive;
    component.paramsService = paramsService;
    component.favoriteService = favoriteService;

    fixture.detectChanges();

    Object.defineProperty(component, 'service', {
      value: fakeService({ isFavorite: true, url: 'test/123' })
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call configService and getFavorite in ngInit', () => {
    const configServiceSpy = vi.spyOn(component['service'], 'configService');
    const getStatusSpy = vi.spyOn(component as any, 'getStatusFavorite');

    component.ngOnInit();

    expect(configServiceSpy).toHaveBeenCalledWith(favoriteService, paramsService, itemActive);
    expect(getStatusSpy).toHaveBeenCalled();
  });

  it('should get the status favorite', () => {
    component['getStatusFavorite']();

    expect(component.favorite).toBeTruthy();
  });

  it('should set the status favorite with true', () => {
    component['setStatusFavorite'](true);

    expect(component.favorite).toBeTruthy();
  });

  it('should call toggleFavoriteAction when click on po-breadcrumb-favorite', () => {
    const breadcrumbFavorite = nativeElement.querySelector('.po-breadcrumb-favorite');

    const toggleSpy = vi.spyOn(component, 'toggleFavoriteAction');
    breadcrumbFavorite.dispatchEvent(eventClick);

    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should call setStatusFavorite with false', () => {
    component.favorite = true;

    const setStatusSpy = vi.spyOn(component as any, 'setStatusFavorite');
    component.toggleFavoriteAction();

    expect(setStatusSpy).toHaveBeenCalledWith(false);
  });

  it('should call setStatusFavorite with true', () => {
    component.favorite = false;

    const setStatusSpy = vi.spyOn(component as any, 'setStatusFavorite');
    component.toggleFavoriteAction();

    expect(setStatusSpy).toHaveBeenCalledWith(true);
  });

  it('should show the star and label with status favorite', () => {
    component.favorite = true;

    fixture.detectChanges();

    const starActive = nativeElement.querySelector('.po-breadcrumb-favorite-star-active');
    const labelActive = nativeElement.querySelector('.po-breadcrumb-favorite-label');

    expect(starActive).toBeTruthy();
    expect(labelActive.innerHTML).toContain(component.literals.unfavorite);
  });

  it('should show the star and label with status unfavorite', () => {
    component.favorite = false;
    const starActive = nativeElement.querySelector('.po-breadcrumb-favorite-star-active');
    const label = nativeElement.querySelector('.po-breadcrumb-favorite-label');

    fixture.detectChanges();

    expect(starActive).toBeFalsy();
    expect(label.innerHTML).toContain(component.literals.favorite);
  });

  describe('Methods: ', () => {
    it('ngOnDestroy: should unsubscribe getSubscription.', () => {
      const fakeSubscription = { unsubscribe: vi.fn() };
      component['getSubscription'] = fakeSubscription as any;

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if getSubscription is falsy.', () => {
      const fakeSubscription = { unsubscribe: vi.fn() };
      component['getSubscription'] = undefined;

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('ngOnDestroy: should unsubscribe setSubscription.', () => {
      const fakeSubscription = { unsubscribe: vi.fn() };
      component['setSubscription'] = fakeSubscription as any;

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if setSubscription is falsy.', () => {
      const fakeSubscription = { unsubscribe: vi.fn() };
      component['setSubscription'] = undefined;

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });
  });
});

function fakeService(item: any) {
  const observer = new Observable(obs => {
    obs.next(item);
    obs.complete();
  });

  return {
    getFavorite: (param?: any) => observer,
    sendStatusFavorite: (param?: any) => observer,
    configService: (a: any, b: any, c: any) => {}
  };
}
