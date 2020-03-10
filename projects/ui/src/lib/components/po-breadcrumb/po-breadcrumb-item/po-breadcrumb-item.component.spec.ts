import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { DocumentationComponent, GuidesComponent, routes } from './../po-breadcrumb.component.spec';
import { PoBreadcrumbItemComponent } from './po-breadcrumb-item.component';

describe('PoBreadcrumbItemComponent:', () => {
  let component: PoBreadcrumbItemComponent;
  let fixture: ComponentFixture<PoBreadcrumbItemComponent>;
  let nativeElement;

  const label = 'Documentation';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [PoBreadcrumbItemComponent, DocumentationComponent, GuidesComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBreadcrumbItemComponent);
    component = fixture.componentInstance;
    component.label = label;
    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Templates:', () => {
    it('should create a breadcrumb item with link', () => {
      component.link = 'test/';

      fixture.detectChanges();

      expect(nativeElement.querySelector('[href]')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-item')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-arrow')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-label')).toBeTruthy();
    });

    it('should create a breadcrumb item with link when link and action are defined', () => {
      component.link = 'test/';
      component.action = () => {};

      fixture.detectChanges();

      expect(nativeElement.querySelector('[href]')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-item')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-arrow')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-label')).toBeTruthy();
    });

    it('should create a breadcrumb item with action', () => {
      component.link = undefined;
      component.action = () => {};

      fixture.detectChanges();

      expect(nativeElement.querySelector('[href]')).toBeFalsy();
      expect(nativeElement.querySelector('.po-breadcrumb-item')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-arrow')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-label')).toBeTruthy();
    });

    it('should create a unclickable breadcrumb item and not active', () => {
      component.itemActive = false;
      component.link = undefined;
      component.action = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('[href]')).toBeFalsy();
      expect(nativeElement.querySelector('.po-breadcrumb-item')).toBeFalsy();
      expect(nativeElement.querySelector('.po-breadcrumb-item-unclickable')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-arrow')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-label')).toBeTruthy();
    });

    it('should create a unclickable breadcrumb item and active', () => {
      component.itemActive = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-breadcrumb-item')).toBeFalsy();
      expect(nativeElement.querySelector('.po-breadcrumb-item-unclickable')).toBeTruthy();
      expect(nativeElement.querySelector('.po-breadcrumb-arrow')).toBeFalsy();
      expect(nativeElement.querySelector('.po-breadcrumb-label')).toBeTruthy();
    });
  });
});
