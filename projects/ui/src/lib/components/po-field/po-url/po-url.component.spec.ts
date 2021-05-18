import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoUrlComponent } from './po-url.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoIconModule } from '../../po-icon';

describe('PoUrlComponent:', () => {
  let component: PoUrlComponent;
  let fixture: ComponentFixture<PoUrlComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoIconModule],
      declarations: [PoUrlComponent, PoFieldContainerComponent, PoCleanComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUrlComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.clean = true;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return null in extraValidation()', () => {
    expect(component.extraValidation(null)).toBeNull();
  });

  describe('Methods:', () => {
    describe('ngAfterViewInit:', () => {
      let inputFocus: jasmine.Spy;

      beforeEach(() => {
        inputFocus = spyOn(component, 'focus');
      });

      it('should call `focus` if autoFocus is true.', () => {
        component.autoFocus = true;
        component.ngAfterViewInit();
        expect(inputFocus).toHaveBeenCalled();
      });

      it('should not call `focus` if autoFocus is false.', () => {
        component.autoFocus = false;
        component.ngAfterViewInit();
        expect(inputFocus).not.toHaveBeenCalled();
      });

      it('should add keyup eventListener if `onChangePropagate` is null', fakeAsync(() => {
        component.onChangePropagate = null;

        spyOn(component.inputEl.nativeElement, 'addEventListener');

        component.ngAfterViewInit();
        tick();

        expect(component.inputEl.nativeElement.addEventListener).toHaveBeenCalledWith('keyup', component['listener']);
      }));

      it('shouldn`t add keyup eventListener if `onChangePropagate` is not null', fakeAsync(() => {
        component.onChangePropagate = () => {};

        spyOn(component.inputEl.nativeElement, 'addEventListener');

        component.ngAfterViewInit();
        tick();

        expect(component.inputEl.nativeElement.addEventListener).not.toHaveBeenCalled();
      }));
    });

    it('ngOnDestroy: should remove keyup event listener if `onChangePropagate` is null', () => {
      component.onChangePropagate = null;

      spyOn(component.inputEl.nativeElement, 'removeEventListener');

      component.ngOnDestroy();

      expect(component.inputEl.nativeElement.removeEventListener).toHaveBeenCalledWith('keyup', component['listener']);
    });

    it('ngOnDestroy: shouldn`t remove keyup eventListener if `onChangePropagate` is not null', () => {
      component.onChangePropagate = () => {};

      spyOn(component.inputEl.nativeElement, 'removeEventListener');

      component.ngOnDestroy();

      expect(component.inputEl.nativeElement.removeEventListener).not.toHaveBeenCalled();
    });

    it('url: should be valid with the values', fakeAsync(() => {
      const urls = [
        `http://foo.com/blah_blah/`,
        `http://foo.com/blah_blah?ah5SF0-Hgr`,
        `http://foo.com/blah_blah?ah5SF0Hgr`,
        `http://foo.com/blah_blah/`,
        `http://www.example.com/wpstyle/?p=364`,
        `https://www.example.com/foo/?bar=baz&inga=42&quux`,
        `http://142.42.1.1/`,
        `http://142.42.1.1:8080/`,
        `http://j.mp`,
        `http://foo.bar/?q=Test%20URL-encoded%20stuff`,
        `http://1337.net`,
        `http://a.b-c.de`,
        `http://223.255.255.254`,
        `http://0.0.0.0`,
        `http://a.b--c.de/`,
        `foo.com`
      ];

      const regExpUrl = new RegExp(component.pattern);

      urls.forEach(url => {
        expect(regExpUrl.test(url)).toBeTruthy(`URL ${url} is not a valid URL.`);
      });
    }));

    it('url: shouldn`t be valid with the values', fakeAsync(() => {
      const urls = [
        `http://`,
        `http://.`,
        `http://.. `,
        `http://../`,
        `http://?`,
        `http://?? `,
        `http://??/`,
        `http://#`,
        `http://## `,
        `http://##/`,
        `http://foo.bar?q=Spaces should be encoded `,
        `//`,
        `//a `,
        `///a`,
        `/// `,
        `http:///a `,
        `rdar://1234 `,
        `h://test`,
        `http:// shouldfail.com  `,
        `:// should fail `,
        `http://foo.bar/foo(bar)baz quux `,
        `ftps://foo.bar/ `,
        `http://-error-.invalid/ `,
        `http://-a.b.co`,
        `http://a.b-.co`,
        `http://1.1.1.1.1`,
        `http://123.123.123`,
        `http://3628126748 `,
        `http://.www.foo.bar/`,
        `http://www.foo.bar./`,
        `http://.www.foo.bar./ `,
        `http://foo.com/blah_blah_(wikipedia)`,
        `http://foo.com/blah_blah_(wikipedia)_(again)`,
        `http://✪df.ws/123 `,
        `http://userid:password@example.com:8080 `,
        `http://userid:password@example.com:8080/`,
        `http://userid@example.com `,
        `http://userid:password@example.com`,
        `http://⌘.ws `,
        `http://foo.com/blah_(wikipedia)#cite-1`,
        `http://foo.com/unicode_(✪)_in_parens`,
        `http://foo.com/(something)?after=parens `,
        `http://☺.damowmow.com/`,
        `http://code.fakeUrlPo.com/events/#&product=browser `,
        `ftp://foo.bar/baz `,
        `http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com`,
        `https://foo_bar.example.com/`
      ];

      const regExpUrl = new RegExp(component.pattern);

      urls.forEach(url => {
        expect(regExpUrl.test(url)).toBeFalsy(`URL ${url} is a valid URL.`);
      });
    }));
  });

  describe('Templates:', () => {
    const eventKeyup = new KeyboardEvent('keyup', { 'key': 'a' });

    it('should have `world` icon', () => {
      expect(fixture.debugElement.nativeElement.querySelector('.po-icon-world')).toBeTruthy();
    });

    it('should call `getScreenValue` and `verifyPattern` on input keyup', fakeAsync(() => {
      spyOn(component, 'getScreenValue').and.returnValue('test');
      spyOn(component, 'verifyPattern');

      component.onChangePropagate = null;
      component.ngAfterViewInit();
      tick(200);

      const input = component.inputEl.nativeElement;
      input.dispatchEvent(eventKeyup);

      fixture.detectChanges();

      expect(component.getScreenValue).toHaveBeenCalled();
      expect(component.verifyPattern).toHaveBeenCalled();
    }));

    it(`should show optional if the field isn't 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = false;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeTruthy();
    });

    it(`shouldn't show optional if the field is 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = true;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it(`shouldn't show optional if the field isn't 'required', has 'label' but 'p-optional' is false.`, () => {
      component.required = true;
      component.optional = false;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it('url: should be valid and have `ng-valid`', fakeAsync(() => {
      component.ngAfterViewInit();
      tick(200);

      const input = component.inputEl.nativeElement;
      const fakeURL = 'http://foo.com/blah_blah/';
      input.value = fakeURL;
      input.dispatchEvent(eventKeyup);

      fixture.detectChanges();

      expect(input.value).toContain(fakeURL);
      expect(fixture.debugElement.nativeElement.querySelectorAll('po-url.ng-dirty.ng-valid')).toBeTruthy();
    }));

    it('url: should be invalid and have `ng-invalid`', fakeAsync(() => {
      component.ngAfterViewInit();
      tick(200);

      const input = component.inputEl.nativeElement;
      const fakeURL = 'http://';
      input.value = fakeURL;
      input.dispatchEvent(eventKeyup);

      fixture.detectChanges();

      expect(input.value).toContain(fakeURL);
      expect(fixture.debugElement.nativeElement.querySelectorAll('po-url.ng-dirty.ng-invalid')).toBeTruthy();
    }));
  });
});
