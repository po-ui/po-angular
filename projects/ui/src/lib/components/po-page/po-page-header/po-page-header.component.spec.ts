import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoBreadcrumbModule } from '../../po-breadcrumb/po-breadcrumb.module';
import { PoPageHeaderComponent } from './po-page-header.component';

@Component({ template: 'Guides' })
export class GuidesComponent {}

export const routes: Routes = [{ path: 'guides', component: GuidesComponent }];

describe('PoPageHeaderComponent:', () => {
  let component: PoPageHeaderComponent;
  let fixture: ComponentFixture<PoPageHeaderComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoBreadcrumbModule, RouterTestingModule.withRoutes(routes)],
      declarations: [PoPageHeaderComponent, GuidesComponent],
      providers: [HttpClient, HttpHandler]
    });
  });

  beforeEach(() => {
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
});
