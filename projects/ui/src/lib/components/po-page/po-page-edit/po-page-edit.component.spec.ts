import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoBreadcrumbModule } from '../../po-breadcrumb/po-breadcrumb.module';
import { PoButtonModule } from '../../po-button';

import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { PoPageComponent } from '../po-page.component';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageEditComponent } from './po-page-edit.component';
import { poPageEditLiteralsDefault } from './po-page-edit-base.component';
import { PoPageHeaderComponent } from '../po-page-header/po-page-header.component';

@Component({
  template: `
    <po-page-edit p-title="Unit Test" (p-cancel)="cancel()" (p-save)="save()" (p-save-new)="saveNew()"> </po-page-edit>
  `
})
class ContainerComponent {
  cancel(): boolean {
    return true;
  }

  save(): boolean {
    return true;
  }

  saveNew(): boolean {
    return true;
  }
}
describe('PoPageEditComponent', () => {
  let component: PoPageEditComponent;
  let fixture: ComponentFixture<PoPageEditComponent>;

  let containerFixture: ComponentFixture<ContainerComponent>;
  let debugElement;
  const event = document.createEvent('Event');
  event.initEvent('p-click', false, true);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoBreadcrumbModule, PoButtonModule],
      declarations: [
        ContainerComponent,
        PoPageComponent,
        PoPageEditComponent,
        PoPageContentComponent,
        PoPageHeaderComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageEditComponent);
    component = fixture.componentInstance;

    debugElement = fixture.debugElement.nativeElement;

    containerFixture = TestBed.createComponent(ContainerComponent);

    containerFixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoPageEditComponent).toBeTruthy();
  });

  it('should click on button to call action', () => {
    const poButton = containerFixture.debugElement.nativeElement.querySelector('po-button > button');

    spyOn(poButton, 'dispatchEvent');
    poButton.dispatchEvent(event);
    expect(poButton.dispatchEvent).toHaveBeenCalled();
  });

  it('should return true if has the any function', () => {
    component.save.observers.push(<any>of({}));

    expect(component.hasAnyAction()).toBe(true);
  });

  describe('Methods:', () => {
    it('getIcon: should return "po-icon-close" if icon is "cancel" and "cancel" is primary action', () => {
      spyOn(component, <any>'isPrimaryAction').and.returnValue(true);

      expect(component.getIcon('cancel')).toBe('po-icon-close');
    });

    it('getIcon: should return "po-icon-ok" if icon is "saveNew" and "saveNew" is primary action', () => {
      spyOn(component, <any>'isPrimaryAction').and.returnValue(true);

      expect(component.getIcon('saveNew')).toBe('po-icon-ok');
    });

    it('getIcon: should return a empty string if icon isn`t "saveNew" or "cancel"', () => {
      expect(component.getIcon('test')).toBe('');
    });

    it('getType: should return "primary" if type is "cancel" and "cancel" is primary action', () => {
      spyOn(component, <any>'isPrimaryAction').and.returnValue(true);

      expect(component.getType('cancel')).toBe('primary');
    });

    it('getType: should return "primary" if type is "saveNew" and "saveNew" is primary action', () => {
      spyOn(component, <any>'isPrimaryAction').and.returnValue(true);

      expect(component.getType('saveNew')).toBe('primary');
    });

    it('getType: should return "default" if type isn`t "saveNew" or "cancel"', () => {
      expect(component.getType('test')).toBe('default');
    });

    it('getType: should return "default" if type is "saveNew" and isn`t primary action', () => {
      spyOn(component, <any>'isPrimaryAction').and.returnValue(false);

      expect(component.getType('saveNew')).toBe('default');
    });

    it('getType: should return "default" if type is "cancel" and isn`t primary action', () => {
      spyOn(component, <any>'isPrimaryAction').and.returnValue(false);

      expect(component.getType('cancel')).toBe('default');
    });

    it('hasPageHeader: should return true if has breadcrumb', () => {
      spyOn(component, 'hasAnyAction').and.returnValue(false);

      component.title = undefined;
      component.breadcrumb = { items: [{ label: 'Breadcrumb' }] };

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return true if has actions', () => {
      component.breadcrumb = undefined;
      component.title = undefined;

      spyOn(component, 'hasAnyAction').and.returnValue(true);

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

    it('isPrimaryAction: should return true if action is "saveNew" and save function is undefined', () => {
      const hasSaveEvent = false;
      const hasSaveNewEvent = false;

      spyOn(component, 'hasEvent').and.returnValues(hasSaveEvent, hasSaveNewEvent);

      expect(component['isPrimaryAction']('saveNew')).toBeTruthy();
    });

    it('isPrimaryAction: should return false if action is "saveNew" and save funtion is defined', () => {
      const hasSaveEvent = true;
      const hasSaveNewEvent = true;

      spyOn(component, 'hasEvent').and.returnValues(hasSaveEvent, hasSaveNewEvent);

      expect(component['isPrimaryAction']('saveNew')).toBeFalsy();
    });

    it('isPrimaryAction: should return true if action is "cancel", saveNew and save function are undefined', () => {
      expect(component['isPrimaryAction']('cancel')).toBeTruthy();
    });

    it('isPrimaryAction: should return false if action is "cancel" and saveNew funtion is defined', () => {
      component.cancel.observers.push(<any>of({}));
      component.saveNew.observers.push(<any>of({}));

      expect(component['isPrimaryAction']('cancel')).toBeFalsy();
    });

    it('isPrimaryAction: should return false if action is "cancel" and save funtion is defined', () => {
      component.save.observers.push(<any>of({}));
      component.cancel.observers.push(<any>of({}));

      expect(component['isPrimaryAction']('cancel')).toBeFalsy();
    });

    it('isPrimaryAction: should return false if action isn`t "cancel" or "saveNew"', () => {
      component.save.observers.push(<any>of({}));
      component.cancel.observers.push(<any>of({}));

      expect(component['isPrimaryAction']('test')).toBeFalsy();
    });
  });

  describe('Templates:', () => {
    it('should apply `p-primary` only in Save button', () => {
      const saveLabel = poPageEditLiteralsDefault[poLocaleDefault].save;

      component.literals = poPageEditLiteralsDefault[poLocaleDefault];

      component.save.observers.push(<any>of({}));
      component.saveNew.observers.push(<any>of({}));
      component.cancel.observers.push(<any>of({}));

      fixture.detectChanges();

      const primaryButtonLabel = debugElement.querySelector('po-button > button.po-button-primary > span');

      expect(primaryButtonLabel).toBeTruthy();
      expect(primaryButtonLabel.innerHTML).toBe(saveLabel);
    });

    it('should apply `p-primary` only in SaveNew button if save function is undefined', () => {
      const saveNewLabel = poPageEditLiteralsDefault[poLocaleDefault].saveNew;

      component.literals = poPageEditLiteralsDefault[poLocaleDefault];

      component.cancel.observers.push(<any>of({}));
      component.saveNew.observers.push(<any>of({}));

      fixture.detectChanges();

      const primaryButtonLabel = debugElement.querySelector('po-button > button.po-button-primary > span');

      expect(primaryButtonLabel).toBeTruthy();
      expect(primaryButtonLabel.innerHTML).toBe(saveNewLabel);
    });

    it('should apply `p-primary` only in Cancel button if save and saveNew functions are undefined', () => {
      const cancelLabel = poPageEditLiteralsDefault[poLocaleDefault].cancel;

      component.literals = poPageEditLiteralsDefault[poLocaleDefault];

      component.cancel.observers.push(<any>of({}));

      fixture.detectChanges();

      const primaryButtonLabel = debugElement.querySelector('po-button > button.po-button-primary > span');

      expect(primaryButtonLabel).toBeTruthy();
      expect(primaryButtonLabel.innerHTML).toBe(cancelLabel);
    });

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

    it('should only contain icon in "save" primary action if "save" function is defined.', () => {
      component.cancel.observers.push(<any>of({}));
      component.saveNew.observers.push(<any>of({}));
      component.save.observers.push(<any>of({}));

      fixture.detectChanges();

      const saveIcon = debugElement.querySelectorAll('po-button button po-icon i[class="po-icon po-icon-ok"]');
      const cancelIcon = debugElement.querySelectorAll('po-button button po-icon i[class="po-icon po-icon-close"]');

      expect(saveIcon.length).toBe(1);
      expect(cancelIcon.length).toBe(0);
    });

    it('should only contain icon in "saveNew" primary action if "save" function is undefined.', () => {
      component.saveNew.observers.push(<any>of({}));
      component.save.observers.push(<any>of({}));

      fixture.detectChanges();

      const saveIcon = debugElement.querySelectorAll('po-button button po-icon i[class="po-icon po-icon-ok"]');
      const cancelIcon = debugElement.querySelectorAll('po-button button po-icon i[class="po-icon po-icon-close"]');

      expect(saveIcon.length).toBe(1);
      expect(cancelIcon.length).toBe(0);
    });

    it('should only contain icon in "cancel" primary action if "saveNew" and "save" function is undefined.', () => {
      component.cancel.observers.push(<any>of({}));

      fixture.detectChanges();

      const saveIcon = debugElement.querySelectorAll('po-button button po-icon i[class="po-icon po-icon-ok"]');
      const cancelIcon = debugElement.querySelectorAll('po-button button po-icon i[class="po-icon po-icon-close"]');

      expect(saveIcon.length).toBe(0);
      expect(cancelIcon.length).toBe(1);
    });
  });
});
