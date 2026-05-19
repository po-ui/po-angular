import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PoBreadcrumbModule } from '../../po-breadcrumb/po-breadcrumb.module';
import { PoHelperModule } from '../../po-helper/po-helper.module';
import { PoPageHeaderComponent } from './po-page-header.component';

@Component({
  template: 'Guides',
  standalone: false
})
export class GuidesComponent {}

export const routes: Routes = [{ path: 'guides', component: GuidesComponent }];

describe('PoPageHeaderComponent:', () => {
  let component: PoPageHeaderComponent;
  let fixture: ComponentFixture<PoPageHeaderComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoBreadcrumbModule, PoHelperModule, RouterTestingModule.withRoutes(routes)],
      declarations: [PoPageHeaderComponent, GuidesComponent],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(PoPageHeaderComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set a title to page header', () => {
    component.title = 'Título';

    fixture.detectChanges();

    const divTitle = nativeElement.querySelector('.po-page-header-title');

    expect(divTitle.innerHTML.trim()).toBe('Título');
  });

  describe('Templates:', () => {
    it('should set a breadcrumb to page header.', () => {
      component['breadcrumb'] = { items: [{ label: 'Breadcrumb', link: 'breadcrumb' }] };

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-page-header-breadcrumb')).toBeTruthy();
    });

    it('shouldn`t set a breadcrumb to page header.', () => {
      component['breadcrumb'] = { items: [] };

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-page-header-breadcrumb')).toBeFalsy();
    });
  });

  describe('Helper rendering:', () => {
    it('should not render po-helper when helper is not provided', () => {
      component.title = 'Title';
      component.subtitle = 'Subtitle';

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-helper')).toBeFalsy();
    });

    it('should render po-helper next to subtitle when both subtitle and helper are provided', () => {
      component.title = 'Title';
      component.subtitle = 'Subtitle';
      fixture.componentRef.setInput('p-helper', { content: 'Help text', type: 'info' });

      fixture.detectChanges();

      expect(component.subtitle).toBe('Subtitle');
      expect(nativeElement.querySelector('po-helper')).toBeTruthy();
    });

    it('should render po-helper below title when helper is provided but subtitle is not', () => {
      component.title = 'Title';
      component.subtitle = undefined;
      fixture.componentRef.setInput('p-helper', { content: 'Help text', type: 'info' });

      fixture.detectChanges();

      expect(component.subtitle).toBeUndefined();
      expect(nativeElement.querySelector('po-helper')).toBeTruthy();
      expect(nativeElement.textContent).not.toContain('Subtitle');
    });

    it('should not render po-helper when title is not provided', () => {
      component.title = undefined;
      component.subtitle = undefined;
      fixture.componentRef.setInput('p-helper', { content: 'Help text', type: 'info' });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-helper')).toBeFalsy();
    });

    it('should render po-helper when helper is a string value', () => {
      component.title = 'Title';
      component.subtitle = 'Subtitle';
      fixture.componentRef.setInput('p-helper', 'Simple help text');

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-helper')).toBeTruthy();
    });
  });
});
