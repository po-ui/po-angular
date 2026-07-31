import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { vi } from 'vitest';

import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';
import { PoIconModule } from '../../po-icon/po-icon.module';
import { PoAvatarModule } from '../../po-avatar/po-avatar.module';

import { PoToolbarProfileComponent } from './po-toolbar-profile.component';

describe('PoToolbarProfileComponent:', () => {
  let component: PoToolbarProfileComponent;
  let fixture: ComponentFixture<PoToolbarProfileComponent>;
  let nativeElement;

  beforeEach(async () => {
    const elementRef = {};
    const renderer2 = {
      listen: () => ({})
    };
    const poControlPositionService = {
      setElements: () => ({}),
      setElementPosition: () => ({})
    };

    await TestBed.configureTestingModule({
      imports: [PoIconModule, PoAvatarModule],
      declarations: [PoToolbarProfileComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ElementRef, useValue: elementRef },
        { provide: Renderer2, useValue: renderer2 },
        { provide: PoControlPositionService, useValue: poControlPositionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoToolbarProfileComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
