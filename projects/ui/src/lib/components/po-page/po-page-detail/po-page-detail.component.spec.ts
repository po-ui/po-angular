import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoBreadcrumbModule } from '../../po-breadcrumb/po-breadcrumb.module';
import { PoButtonModule } from '../../po-button';

import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { PoPageComponent } from '../po-page.component';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageDetailComponent } from './po-page-detail.component';
import { poPageDetailLiteralsDefault } from './po-page-detail-base.component';
import { PoPageHeaderComponent } from '../po-page-header/po-page-header.component';

@Component({
  template: `
    <po-page-detail p-title="Unit Test" (p-back)="back()" (p-edit)="edit()" (p-remove)="remove()"> </po-page-detail>
  `
})
class ContainerComponent {
  back(): boolean {
    return true;
  }

  edit(): boolean {
    return true;
  }

  remove(): boolean {
    return true;
  }
}

describe('PoPageDetailComponent:', () => {
  let component: PoPageDetailComponent;
  let containerFixture: ComponentFixture<ContainerComponent>;
  let debugElement;
  let fixture: ComponentFixture<PoPageDetailComponent>;

  const event = document.createEvent('Event');

  event.initEvent('p-click', false, true);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoBreadcrumbModule, PoButtonModule],
      declarations: [
        ContainerComponent,
        PoPageComponent,
        PoPageContentComponent,
        PoPageDetailComponent,
        PoPageHeaderComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoPageDetailComponent);
    component = fixture.componentInstance;

    debugElement = fixture.debugElement.nativeElement;
    containerFixture = TestBed.createComponent(ContainerComponent);

    fixture.detectChanges();
    containerFixture.detectChanges();
  });

  it('should be created.', () => {
    expect(component).toBeTruthy();
  });

  it('should be execute method of parent.', fakeAsync(() => {
    const poButton = containerFixture.debugElement.nativeElement.querySelector('po-button > button');

    spyOn(poButton, 'dispatchEvent');

    poButton.click();
    poButton.dispatchEvent(event);

    containerFixture.detectChanges();

    expect(poButton.dispatchEvent).toHaveBeenCalled();
  }));

  describe('Methods:', () => {
    it(`hasEditFn: should return '' if have a edit action and property is 'icon'`, () => {
      component.edit.observers.push(<any>of({}));

      expect(component.hasEditFn('icon')).toBe('');
    });

    it(`hasEditFn: should return 'po-icon-delete' if does't have a edit action and property is 'icon'`, () => {
      component.edit.observers.length = 0;

      expect(component.hasEditFn('icon')).toBe('po-icon-delete');
    });

    it(`hasEditFn: should return 'secondary' if have a edit action and property is 'type'`, () => {
      component.edit.observers.push(<any>of({}));

      expect(component.hasEditFn('type')).toBe('secondary');
    });

    it(`hasEditFn: should return 'primary' if does't have a edit action and property is 'type'`, () => {
      component.edit.observers.length = 0;

      expect(component.hasEditFn('type')).toBe('primary');
    });

    it(`hasEditFn: should return '' if property doesn't 'icon' or 'type'`, () => {
      expect(component.hasEditFn('invalid')).toBe('');
    });

    it(`hasEditFn: should return '' if property doesn't 'icon' or 'type'`, () => {
      expect(component.hasEditFn('invalid')).toBe('');
      expect(component.hasEditFn(undefined)).toBe('');
      expect(component.hasEditFn(null)).toBe('');
    });

    it(`hasEditOrRemoveFn: should return '' if have a edit action, doesn't have remove action
    and property is 'icon'`, () => {
      component.edit.observers.push(<any>of({}));
      component.remove.observers.length = 0;

      expect(component.hasEditOrRemoveFn('icon')).toBe('');
    });

    it(`hasEditOrRemoveFn: should return '' if doesn't have a edit action, have remove action
    and property is 'icon'`, () => {
      component.edit.observers.length = 0;
      component.remove.observers.push(<any>of({}));

      expect(component.hasEditOrRemoveFn('icon')).toBe('');
    });

    it(`hasEditOrRemoveFn: should return 'po-icon-arrow-left' if doesn't have a edit action and remove action
    and property is 'icon'`, () => {
      component.remove.observers.length = 0;
      component.edit.observers.length = 0;

      expect(component.hasEditOrRemoveFn('icon')).toBe('po-icon-arrow-left');
    });

    it(`hasEditOrRemoveFn: should return 'secondary' if have a edit action, doesn't have remove action
    and property is 'type'`, () => {
      component.edit.observers.push(<any>of({}));
      component.remove.observers.length = 0;

      expect(component.hasEditOrRemoveFn('type')).toBe('secondary');
    });

    it(`hasEditOrRemoveFn: should return 'secondary' if doesn't have a edit action, have remove action
    and property is 'type'`, () => {
      component.remove.observers.push(<any>of({}));
      component.edit.observers.length = 0;

      expect(component.hasEditOrRemoveFn('type')).toBe('secondary');
    });

    it(`hasEditOrRemoveFn: should return 'primary' if doesn't have a edit action and remove action
    and property is 'type'`, () => {
      component.remove.observers.length = 0;
      component.edit.observers.length = 0;

      expect(component.hasEditOrRemoveFn('type')).toBe('primary');
    });

    it(`hasEditOrRemoveFn: should return '' if property doesn't 'icon' or 'type'`, () => {
      expect(component.hasEditOrRemoveFn('invalid')).toBe('');
      expect(component.hasEditOrRemoveFn(undefined)).toBe('');
      expect(component.hasEditOrRemoveFn(null)).toBe('');
    });

    it('hasPageHeader: should return true if has breadcrumb', () => {
      spyOn(component, 'hasAnyAction').and.returnValue(false);

      component.title = undefined;
      component.breadcrumb = { items: [{ label: 'Breadcrumb' }] };

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return true if has actions', () => {
      spyOn(component, 'hasAnyAction').and.returnValue(true);

      component.breadcrumb = undefined;
      component.title = undefined;

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return true if has title', () => {
      spyOn(component, 'hasAnyAction').and.returnValue(false);

      component.breadcrumb = undefined;
      component.title = 'Title';

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return false if doesn`t have actions, breadcrumb and title', () => {
      spyOn(component, 'hasAnyAction').and.returnValue(false);

      component.breadcrumb = undefined;
      component.title = undefined;

      expect(component.hasPageHeader()).toBe(false);
    });
  });

  describe('Templates:', () => {
    it('should show page header if `hasPageHeader` return true', () => {
      spyOn(component, 'hasPageHeader').and.returnValue(true);
      fixture.detectChanges();
      expect(debugElement.querySelector('po-page-header')).toBeTruthy();
    });

    it('should hide page header if `hasPageHeader` return false', () => {
      spyOn(component, 'hasPageHeader').and.returnValue(false);
      fixture.detectChanges();
      expect(debugElement.querySelector('po-page-header')).toBeFalsy();
    });

    it('should apply only `po-icon-edit` if have a back, remove and edit functions.', () => {
      component.back.observers.push(<any>of({}));
      component.remove.observers.push(<any>of({}));
      component.edit.observers.push(<any>of({}));

      fixture.detectChanges();

      const editIcon = debugElement.querySelector('.po-icon-edit');
      const removeIcon = debugElement.querySelector('.po-icon-delete');
      const backIcon = debugElement.querySelector('.po-icon-arrow-left');

      expect(editIcon).toBeTruthy();
      expect(removeIcon).toBeNull();
      expect(backIcon).toBeNull();
    });

    it('should apply only `po-icon-delete` if have back and remove functions and doesn`t have a edit function.', () => {
      component.back.observers.push(<any>of({}));
      component.remove.observers.push(<any>of({}));

      fixture.detectChanges();

      const editIcon = debugElement.querySelector('.po-icon-edit');
      const removeIcon = debugElement.querySelector('.po-icon-delete');
      const backIcon = debugElement.querySelector('.po-icon-arrow-left');

      expect(editIcon).toBeNull();
      expect(removeIcon).toBeTruthy();
      expect(backIcon).toBeNull();
    });

    it('should apply only `po-icon-arrow-left` if have only back function and doesn`t have a edit and remove functions.', () => {
      component.back.observers.push(<any>of({}));

      fixture.detectChanges();

      const editIcon = debugElement.querySelector('.po-icon-edit');
      const removeIcon = debugElement.querySelector('.po-icon-delete');
      const backIcon = debugElement.querySelector('.po-icon-arrow-left');

      expect(editIcon).toBeNull();
      expect(removeIcon).toBeNull();
      expect(backIcon).toBeTruthy();
    });
  });
});
