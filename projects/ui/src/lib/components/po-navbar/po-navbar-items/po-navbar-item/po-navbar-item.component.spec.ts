import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { configureTestSuite } from 'projects/ui/src/lib/util-test/util-expect.spec';

import { PoNavbarItemComponent } from './po-navbar-item.component';

describe('PoNavbarItemComponent:', () => {
  let component: PoNavbarItemComponent;
  let fixture: ComponentFixture<PoNavbarItemComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoNavbarItemComponent],
      imports: [RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNavbarItemComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarItemComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('type: should return `externalLink` if link is external link', () => {
      component.link = 'http://fakeUrlPo.com';

      expect(component.type).toBe('externalLink');
    });

    it('type: should return `internalLink` if link is internal link', () => {
      component.link = 'test/';

      expect(component.type).toBe('internalLink');
    });
  });

  describe('Methods:', () => {
    it('itemClick: should call `action` with `link` and `label` if `action` is defined', () => {
      component.action = () => {};

      const label = 'label test';
      const link = 'test/';

      spyOn(component, 'action');

      component.itemClick(label, link);

      expect(component.action).toHaveBeenCalledWith({ label, link });
    });

    it('itemClick: should call `click.emit`', () => {
      spyOn(component.click, 'emit');

      component.itemClick();

      expect(component.click.emit).toHaveBeenCalled();
    });
  });

  describe('Templates: ', () => {
    it('should contain `a` element with href if `type` is `externalLink`', () => {
      component.link = 'http://fakeUrlPo.com';

      fixture.detectChanges();

      const anchor = nativeElement.querySelector('a');

      expect(anchor.attributes.getNamedItem('href').name).toEqual('href');
    });

    it('should call `itemClick` without parameters if `type` is `externalLink`', () => {
      component.link = 'http://fakeUrlPo.com';

      fixture.detectChanges();

      spyOn(component, 'itemClick');

      const eventClick = document.createEvent('MouseEvents');
      eventClick.initEvent('click', false, true);

      const anchor = nativeElement.querySelector('a');
      anchor.dispatchEvent(eventClick);

      expect(component.itemClick).toHaveBeenCalledWith();
    });

    it('should contain `a` element with `ng-reflect-router-link` if `type` is `internalLink`', () => {
      component.link = 'test/';

      fixture.detectChanges();

      const anchor = nativeElement.querySelector('a');

      expect(anchor.attributes.getNamedItem('ng-reflect-router-link').name).toEqual('ng-reflect-router-link');
    });

    it('should call `itemClick` with label and link if `type` is `internalLink`', () => {
      component.link = 'test/';
      component.label = 'label test';

      fixture.detectChanges();

      spyOn(component, 'itemClick');

      const eventClick = document.createEvent('MouseEvents');
      eventClick.initEvent('click', false, true);

      const anchor = nativeElement.querySelector('a');
      anchor.dispatchEvent(eventClick);

      expect(component.itemClick).toHaveBeenCalledWith(component.label, component.link);
    });
  });
});
