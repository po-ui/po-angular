import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoLogoComponent } from './po-logo.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PoLogoComponent', () => {
  let component: PoLogoComponent;
  let fixture: ComponentFixture<PoLogoComponent>;
  let nativeElement: any;
  let debugElement: DebugElement;

  const poLanguageService: any = {
    getShortLanguage: () => 'pt',
    getLanguageDefault: () => 'pt'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoLogoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLogoComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods', () => {
    it('maxLenght: should set value according to max allowed', () => {
      const largeValue =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit incidunt aliquam asperiores maxime, nulla fugit exercitationem. Abratione, quisquam.';
      const maxLenght = component['maxLength'](largeValue);
      const expectedValue =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit incidunt aliquam asperiores maxime, nulla fugit exercitationem. ';

      expect(maxLenght).toBe(expectedValue);
    });

    it('maxLenght: should set exact value if value is less than max allowed', () => {
      const smallValue =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit incidunt aliquam asperiores maxime, nulla fugit exercitationem.';
      const maxLenght = component['maxLength'](smallValue);

      expect(maxLenght).toBe(smallValue);
    });
  });

  describe('Properties', () => {
    it('logo: should set property with `undefined` if invalid values', () => {
      const invalidValues = ['', ' ', null, undefined, 0, false, true];
      const expectedValue = undefined;

      expectPropertiesValues(component, 'logo', invalidValues, expectedValue);
    });

    it('logo: should set property with valid values', () => {
      const validValues = ['https://po-ui.io/logo', 'https://other.com/images/logo'];

      expectPropertiesValues(component, 'logo', validValues, validValues);
    });

    it('logoAlt: should set property with `default value` if invalid value', () => {
      component = new PoLogoComponent(poLanguageService);
      const invalidValues = ['', ' ', null, undefined, 0, false, true];
      const expectedValue = 'Logomarca início';

      expectPropertiesValues(component, 'logoAlt', invalidValues, expectedValue);
    });

    it('logoAlt: should set property with valid value', () => {
      const validValues = ['Po-UI Logo', 'Other image logo'];

      expectPropertiesValues(component, 'logoAlt', validValues, validValues);
    });

    it('link: should render an anchor tag with the correct href, when link is a string', () => {
      const testLink = 'https://example.com';
      component.link = testLink;
      fixture.detectChanges();

      const anchorElement = debugElement.query(By.css('a'));
      expect(anchorElement).toBeTruthy();
      expect(anchorElement.nativeElement.getAttribute('href')).toBe(testLink);
    });

    it('link: should render an anchor tag with "./" as the href, when link is true', () => {
      component.link = true;
      fixture.detectChanges();

      const anchorElement = debugElement.query(By.css('a'));
      expect(anchorElement).toBeTruthy();
      expect(anchorElement.nativeElement.getAttribute('href')).toBe('./');
    });
  });

  describe('Templates:', () => {
    it(`link: should not render an anchor tag and should only render an img tag, when link is false`, () => {
      component.link = false;
      fixture.detectChanges();

      const anchorElement = debugElement.query(By.css('a'));
      const imgElement = debugElement.query(By.css('img'));

      expect(anchorElement).toBeFalsy();
      expect(imgElement).toBeTruthy();
    });
  });
});
