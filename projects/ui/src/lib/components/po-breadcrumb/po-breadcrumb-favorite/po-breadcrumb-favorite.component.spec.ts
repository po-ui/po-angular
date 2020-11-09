import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Observable } from 'rxjs';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoBreadcrumbFavoriteComponent } from './po-breadcrumb-favorite.component';
import { PoBreadcrumbFavoriteService } from './po-breadcrumb-favorite.service';

describe('PoBreadcrumbFavoriteComponent', () => {
  let component: PoBreadcrumbFavoriteComponent;
  let fixture: ComponentFixture<PoBreadcrumbFavoriteComponent>;
  let nativeElement;

  const itemActive = { label: 'Active Route', link: 'route/active' };
  const favoriteService = 'http://fakeUrlPo.com.br';
  const paramsService = {};

  const eventClick = document.createEvent('MouseEvents');
  eventClick.initEvent('click', false, true);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PoBreadcrumbFavoriteComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBreadcrumbFavoriteComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    component.itemActive = itemActive;
    component.paramsService = paramsService;
    component.favoriteService = favoriteService;

    fixture.detectChanges();

    component['service'] = fakeService({ isFavorite: true, url: 'test/123' }) as PoBreadcrumbFavoriteService;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call configService and getFavorite in ngInit', () => {
    const getStatus = 'getStatusFavorite';

    spyOn(component['service'], 'configService');
    spyOn(component, <any>getStatus);

    component.ngOnInit();

    expect(component['service'].configService).toHaveBeenCalledWith(favoriteService, paramsService, itemActive);
    expect(component[getStatus]).toHaveBeenCalled();
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

    spyOn(component, 'toggleFavoriteAction');
    breadcrumbFavorite.dispatchEvent(eventClick);

    expect(component.toggleFavoriteAction).toHaveBeenCalled();
  });

  it('should call setStatusFavorite with false', () => {
    component.favorite = true;
    const setStatus = 'setStatusFavorite';

    spyOn(component, <any>setStatus);
    component.toggleFavoriteAction();

    expect(component[setStatus]).toHaveBeenCalledWith(false);
  });

  it('should call setStatusFavorite with true', () => {
    component.favorite = false;
    const setStatus = 'setStatusFavorite';

    spyOn(component, <any>setStatus);
    component.toggleFavoriteAction();

    expect(component[setStatus]).toHaveBeenCalledWith(true);
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
    const fakeSubscription = <any>{ unsubscribe: () => {} };

    it('ngOnDestroy: should unsubscribe getSubscription.', () => {
      component['getSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if getSubscription is falsy.', () => {
      component['getSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['getSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('ngOnDestroy: should unsubscribe setSubscription.', () => {
      component['setSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if setSubscription is falsy.', () => {
      component['setSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['setSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });
  });
});

function fakeService(item) {
  const observer = new Observable(obs => {
    obs.next(item);
    obs.complete();
  });

  return {
    getFavorite: param => observer,
    sendStatusFavorite: param => observer,
    configService: (a, b, c) => {}
  };
}
