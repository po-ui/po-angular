import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { PoI18nModule } from './../../../../../../ui/src/lib/services/po-i18n/po-i18n.module';
import { PoI18nPipe } from './../../../../../../ui/src/lib/services/po-i18n/po-i18n.pipe';

import { PoPageBlockedUserReason } from '../enums/po-page-blocked-user-reason.enum';
import { PoPageBlockedUserReasonComponent } from './po-page-blocked-user-reason.component';

describe('PoPageBlockedUserReasonContactsComponent: ', () => {
  let component: PoPageBlockedUserReasonComponent;
  let fixture: ComponentFixture<PoPageBlockedUserReasonComponent>;

  const generalEn = {
    title: 'texto',
    firstPhrase: 'adicionar',
    secondPhrase: 'remover'
  };

  const generalPt = {
    title: 'texto',
    firstPhrase: 'adicionar',
    secondPhrase: 'remover'
  };

  const config = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: false
    },
    contexts: {
      general: {
        'pt': generalPt
      },
      another: {
        'en': generalEn
      }
    }
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PoI18nModule.config(config)],
        declarations: [PoI18nPipe, PoPageBlockedUserReasonComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageBlockedUserReasonComponent);
    component = fixture.componentInstance;
    component.reason = PoPageBlockedUserReason.None;
    component.params = { attempts: 5, days: 5, hours: 5 };

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('ngOnInit: should call `getLiterals` OnInit', () => {
      spyOn(component, <any>'getLiterals');

      component.ngOnInit();

      expect(component['getLiterals']).toHaveBeenCalled();
    });

    describe('ngOnChanges:', () => {
      it('should call `getLiterals` if `reason` changes', () => {
        component.reason = PoPageBlockedUserReason.ExceededAttempts;

        const spy = spyOn(component, <any>'getLiterals');

        component.ngOnChanges({
          reason: new SimpleChange(null, component.reason, true)
        });

        expect(spy).toHaveBeenCalled();
      });

      it('should call `getLiterals` if `params` changes', () => {
        component.params = { attempts: 5, days: 5, hours: 5 };

        const spy = spyOn(component, <any>'getLiterals');

        component.ngOnChanges({
          params: new SimpleChange(null, component.params, true)
        });

        expect(spy).toHaveBeenCalled();
      });

      it('should not call `getLiterals` if neither `params` or `reasons` changes', () => {
        const spy = spyOn(component, <any>'getLiterals');
        component.ngOnChanges({});
        expect(spy).not.toHaveBeenCalled();
      });
    });

    it('getImageByReasonType: should return `big-lock` if `reason` is `none`', () => {
      const expectedValue = './assets/images/big-lock.svg';

      component.getImageByReasonType();

      expect(component.getImageByReasonType()).toBe(expectedValue);
    });

    it('getImageByReasonType: should return `blocked-user` if `reason` is `exceededAttempts`', () => {
      const expectedValue = './assets/images/blocked-user.svg';
      component.reason = PoPageBlockedUserReason.ExceededAttempts;

      component.getImageByReasonType();

      expect(component.getImageByReasonType()).toBe(expectedValue);
    });

    it('getImageByReasonType: should return `expired` if `reason` is `exceededAttempts`', () => {
      const expectedValue = './assets/images/expired.svg';
      component.reason = PoPageBlockedUserReason.ExpiredPassword;

      component.getImageByReasonType();

      expect(component.getImageByReasonType()).toBe(expectedValue);
    });

    it('getParams: should return an array with params based on reason value', () => {
      const params = [component.params.attempts, component.params.hours];
      component.reason = PoPageBlockedUserReason.None;

      component.getParams();

      expect(component.literalParams).toEqual(params);
    });

    it('getParams: should return an array with params based on reason value', () => {
      const params = [component.params.days, component.params.days];
      component.reason = PoPageBlockedUserReason.ExpiredPassword;

      component.getParams();

      expect(component.literalParams).toEqual(params);
    });

    it('getLiterals: should call `getParams` and `changeDetector.detectChanges`', () => {
      spyOn(component, 'getParams');
      spyOn(component['changeDetector'], 'detectChanges');

      component['getLiterals']();

      expect(component.getParams).toHaveBeenCalled();
      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    });
  });
});
