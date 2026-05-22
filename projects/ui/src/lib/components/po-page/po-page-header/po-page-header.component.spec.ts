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

  describe('Subtitle formatting:', () => {
    it('should render subtitle with bold formatting when <b> tag is used', () => {
      component.title = 'Title';
      component.subtitle = 'Texto <b>negrito</b> normal';

      fixture.detectChanges();

      const boldSpan = nativeElement.querySelector('.po-page-header-subtitle .po-text-bold');
      expect(boldSpan).toBeTruthy();
      expect(boldSpan.textContent).toBe('negrito');
    });

    it('should render subtitle with italic formatting when <i> tag is used', () => {
      component.title = 'Title';
      component.subtitle = 'Texto <i>itálico</i> normal';

      fixture.detectChanges();

      const italicSpan = nativeElement.querySelector('.po-page-header-subtitle .po-text-italic');
      expect(italicSpan).toBeTruthy();
      expect(italicSpan.textContent).toBe('itálico');
    });

    it('should render subtitle with underline formatting when <u> tag is used', () => {
      component.title = 'Title';
      component.subtitle = 'Texto <u>sublinhado</u> normal';

      fixture.detectChanges();

      const underlineSpan = nativeElement.querySelector('.po-page-header-subtitle .po-text-underline');
      expect(underlineSpan).toBeTruthy();
      expect(underlineSpan.textContent).toBe('sublinhado');
    });

    it('should render subtitle plain text without formatting classes', () => {
      component.title = 'Title';
      component.subtitle = 'Texto simples';

      fixture.detectChanges();

      const subtitleText = nativeElement.querySelector('.po-page-header-subtitle-text');
      expect(subtitleText).toBeTruthy();
      expect(subtitleText.textContent).toBe('Texto simples');
      expect(nativeElement.querySelector('.po-text-bold')).toBeFalsy();
      expect(nativeElement.querySelector('.po-text-italic')).toBeFalsy();
      expect(nativeElement.querySelector('.po-text-underline')).toBeFalsy();
    });

    it('should sanitize script tags in subtitle', () => {
      component.title = 'Title';
      component.subtitle = '<script>alert("xss")</script>seguro';

      fixture.detectChanges();

      const subtitleText = nativeElement.querySelector('.po-page-header-subtitle-text');
      expect(subtitleText.textContent).toBe('alert("xss")seguro');
    });

    it('should render subtitle with combined formatting', () => {
      component.title = 'Title';
      component.subtitle = '<b>negrito</b> e <i>itálico</i>';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-text-bold').textContent).toBe('negrito');
      expect(nativeElement.querySelector('.po-text-italic').textContent).toBe('itálico');
    });
  });
});
