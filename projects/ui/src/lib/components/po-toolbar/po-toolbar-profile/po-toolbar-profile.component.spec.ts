import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';
import { PoPopupComponent } from '../../po-popup//po-popup.component';

import { PoToolbarProfileComponent } from './po-toolbar-profile.component';

describe('PoToolbarProfileComponent:', () => {
  let component: PoToolbarProfileComponent;
  let fixture: ComponentFixture<PoToolbarProfileComponent>;
  let nativeElement;

  configureTestSuite(() => {
    const elementRef = {};
    const renderer2 = {
      listen: () => ({})
    };
    const poControlPositionService = {
      setElements: () => ({}),
      setElementPosition: () => ({})
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PoToolbarProfileComponent, PoPopupComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ElementRef, useValue: elementRef },
        { provide: Renderer2, useValue: renderer2 },
        { provide: PoControlPositionService, useValue: poControlPositionService }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoToolbarProfileComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Templates:', () => {
    it('should display avatar if have profile.', () => {
      component.profile = { title: 'teste', avatar: 'teste2' };

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-avatar')).toBeTruthy();
    });
  });

  describe('Methods:', () => {
    describe('isShowProfile: ', () => {
      it('should return `true` if have a profile.', () => {
        component.profile = { title: 'Jhony', avatar: 'link' };

        expect(component.profileAvatar).toBeTruthy();
      });

      it('should return `undefined` if not have a profile.', () => {
        component.profile = undefined;

        expect(component.profileAvatar).toBeUndefined();
      });
    });
  });
});
