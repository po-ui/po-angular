import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';

import { expectSettersMethod } from './../../../../util-test/util-expect.spec';

import { PoServicesModule } from './../../../../services/services.module';
import { PoLanguageService } from './../../../../services/po-language/po-language.service';
import { poLocaleDefault } from './../../../../services/po-language/po-language.constant';

import { PoUploadFileRestrictionsComponent } from './po-upload-file-restrictions.component';
import { poUploadLiteralsDefault } from '../po-upload-base.component';

describe('PoUploadFileRestrictionsComponent:', () => {
  let changeDetector: any;
  let component: PoUploadFileRestrictionsComponent;
  let fixture: ComponentFixture<PoUploadFileRestrictionsComponent>;
  let nativeElement: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoUploadFileRestrictionsComponent],
      imports: [PoServicesModule],
      providers: [PoLanguageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUploadFileRestrictionsComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);

    component['language'] = 'en';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('allowedExtensions: should set `allowedExtensions` with `png and jpg`', () => {
      const extensions = ['png', 'jpg'];
      const expected = 'PNG and JPG';

      expectSettersMethod(component, 'allowedExtensions', extensions, 'allowedExtensions', expected);
    });

    it('maxFileSize: should set `maxFileSize` with `30 MB`', () => {
      expectSettersMethod(component, 'maxFileSize', 31457280, 'maxFileSize', '30 MB');
    });

    it('minFileSize: should set `minFileSize` with `30 MB`', () => {
      expectSettersMethod(component, 'minFileSize', 31457280, 'minFileSize', '30 MB');
    });
  });

  describe('Methods:', () => {
    it('ngOnInit: should call `setLiterals`', () => {
      spyOn(component, <any>'setLiterals');

      component.ngOnInit();

      expect(component['setLiterals']).toHaveBeenCalled();
    });

    it('formatAllowedExtensions: should return undefined if `allowedExtensions` is undefined', () => {
      const allowedExtensions = undefined;

      expect(component['formatAllowedExtensions'](allowedExtensions)).toBeUndefined();
    });

    it('formatAllowedExtensions: should return `PNG, JPG and SVG` if allowedExtensions is `png,jpg and svg`', () => {
      const allowedExtensions = ['png', 'jpg', 'svg'];

      component['language'] = 'en';

      expect(component['formatAllowedExtensions'](allowedExtensions)).toBe('PNG, JPG and SVG');
    });

    it('formatAllowedExtensions: should return `PNG and JPG` if allowedExtensions is `png and jpg`', () => {
      const allowedExtensions = ['png', 'jpg'];

      component['language'] = 'en';

      expect(component['formatAllowedExtensions'](allowedExtensions)).toBe('PNG and JPG');
    });

    it('formatAllowedExtensions: should return `PNG e JPG` if allowedExtensions is `png and jpg` and `language` is `pt`', () => {
      const allowedExtensions = ['png', 'jpg'];

      component['language'] = 'pt';

      expect(component['formatAllowedExtensions'](allowedExtensions)).toBe('PNG e JPG');
    });

    it('formatAllowedExtensions: should return `PNG y JPG` if allowedExtensions is `png and jpg` and `language` is `es`', () => {
      const allowedExtensions = ['png', 'jpg'];

      component['language'] = 'es';

      expect(component['formatAllowedExtensions'](allowedExtensions)).toBe('PNG y JPG');
    });

    it('formatAllowedExtensions: should return `PNG` if allowedExtensions is `png`', () => {
      const allowedExtensions = ['png'];

      expect(component['formatAllowedExtensions'](allowedExtensions)).toBe('PNG');
    });

    it('formatAllowedExtensions: should return empty string if allowedExtensions is empty array', () => {
      const allowedExtensions = [];

      expect(component['formatAllowedExtensions'](allowedExtensions)).toBe('');
    });

    it('setLiterals: should set `literals` with `poUploadLiteralsDefault`', () => {
      component.literals = undefined;

      component['language'] = 'en';

      component['setLiterals']();

      expect(component.literals).toEqual(poUploadLiteralsDefault['en']);
    });

    it('setLiterals: should set `literals` with `poUploadLiteralsDefault` and `poLocaleDefault`', () => {
      component.literals = undefined;

      component['language'] = '';

      component['setLiterals']();

      expect(component.literals).toEqual(poUploadLiteralsDefault[poLocaleDefault]);
    });

    it('setLiterals: should call `detectChanges`', () => {
      spyOn(component['changeDetector'], 'detectChanges');

      component['setLiterals']();

      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('shouldn`t contain a text if `maxFiles` is 1', () => {
      component.maxFiles = 1;

      component['setLiterals']();

      changeDetector.detectChanges();

      const text = nativeElement.querySelector('.po-font-text-small');

      expect(text).toBeFalsy();
    });

    it('shouldn`t contain text if allowedExtensions is undefined', () => {
      component.allowedExtensions = undefined;

      component['setLiterals']();

      changeDetector.detectChanges();

      const text = nativeElement.querySelector('.po-font-text-small');

      expect(text).toBeFalsy();
    });
  });
});
