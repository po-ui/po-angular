import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoDisclaimer } from '../po-disclaimer/po-disclaimer.interface';
import { PoDisclaimerComponent } from '../po-disclaimer/po-disclaimer.component';
import { PoDisclaimerGroupComponent } from './po-disclaimer-group.component';
import { PoDisclaimerRemoveComponent } from './po-disclaimer-remove/po-disclaimer-remove.component';
import { PoTagModule } from '../po-tag/po-tag.module';
import { PoDisclaimerModule } from '../po-disclaimer/po-disclaimer.module';

describe('PoDisclaimerGroupComponent:', () => {
  let component: PoDisclaimerGroupComponent;
  let fixture: ComponentFixture<PoDisclaimerGroupComponent>;
  let nativeElement: any;

  const disclaimers: Array<PoDisclaimer> = [
    { value: 'hotel', label: 'Hotel', property: 'hotel' },
    { value: '500', label: 'Price', property: 'Preço' },
    { value: 'north', label: 'Region', property: 'region' }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoDisclaimerComponent, PoDisclaimerRemoveComponent, PoDisclaimerGroupComponent],
      imports: [PoTagModule, PoDisclaimerModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDisclaimerGroupComponent);
    component = fixture.componentInstance;
    component.disclaimers = [].concat(disclaimers);

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be created with title', () => {
    fakeAsync(() => {
      component.title = 'Filtros';
      fixture.detectChanges();
      tick();
      expect(nativeElement.querySelector('div.po-disclaimer-group-title').innerHTML).toContain('Filtros');
    });
  });

  it('should be created with 3 tags plus tag default removeAll', () => {
    expect(nativeElement.querySelectorAll('po-tag').length).toBe(4);
  });

  it('should hide disclaimer-group if there are no disclaimers', () => {
    component.disclaimers = [];
    fixture.detectChanges();
    expect(nativeElement.querySelector('po-disclaimer-group')).toBeFalsy();
  });

  it('should hide disclaimer-remove if there are less than 1 disclaimers', () => {
    component.hideRemoveAll = false;
    component.disclaimers = [disclaimers[1]];
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-danger')).toBeFalsy();
  });

  it('should remove/close one disclaimers', () => {
    component.hideRemoveAll = true;

    component.onCloseAction(disclaimers[0]);
    fixture.detectChanges();

    expect(nativeElement.querySelectorAll('po-tag').length).toBe(2);
  });

  it('should remove all disclaimers', () => {
    component.removeAllItems();
    fixture.detectChanges();

    expect(nativeElement.querySelectorAll('po-disclaimer').length).toBe(0);
  });

  it('should call handleKeyboardNavigationTag after changes', fakeAsync(() => {
    const changes: any = {
      disclaimers: ['test']
    };
    spyOn(component, 'handleKeyboardNavigationTag');

    component.ngOnChanges(changes);
    tick();

    expect(component.handleKeyboardNavigationTag).toHaveBeenCalled();
  }));

  it('onCloseAction: should remove disclaimer and emit current disclaimers', fakeAsync(() => {
    spyOn(component.change, <any>'emit');
    spyOn(component, <any>'focusOnNextTag');

    const disclaimerToRemove = { value: 'north', label: 'Region', property: 'region', hideClose: false };
    const currentDisclaimers = [component.disclaimers[0], component.disclaimers[1]];

    component.onCloseAction(disclaimerToRemove);

    tick();

    expect(component.disclaimers).toEqual(currentDisclaimers);
    expect(component.change.emit).toHaveBeenCalledWith(component.disclaimers);

    tick(301);

    expect(component.focusOnNextTag).toHaveBeenCalled();
  }));

  it('onCloseAction: should emit removedDisclaimer and currentDisclaimers in remove action', () => {
    spyOn(component.remove, <any>'emit');

    const removedDisclaimer = { value: 'north', label: 'Region', property: 'region', hideClose: false };
    const currentDisclaimers = [component.disclaimers[0], component.disclaimers[1]];

    component.onCloseAction(removedDisclaimer);

    expect(component.disclaimers).toEqual(currentDisclaimers);
    expect(component.remove.emit).toHaveBeenCalledWith({ currentDisclaimers, removedDisclaimer });
  });

  it('should handleKeyDown correctly for Space key', () => {
    const event = new KeyboardEvent('keydown', { code: 'Space' });

    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');

    component['handleKeyDown'](event, [], 0);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should handleKeyDown correctly for ArrowLeft key', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    spyOn(component as any, 'handleArrowLeft');

    component['handleKeyDown'](event, [], 0);

    expect(component['handleArrowLeft']).toHaveBeenCalled();
  });

  it('should handleKeyDown correctly for ArrowRight key', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    spyOn(component as any, 'handleArrowRight');

    component['handleKeyDown'](event, [], 0);

    expect(component['handleArrowRight']).toHaveBeenCalled();
  });

  it('should call setTabIndex in next tag if index is 1', () => {
    const tagRemoveElements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ];

    const indexArrow = 1;

    spyOn(component, 'setTabIndex' as any);
    spyOn(tagRemoveElements[indexArrow + 1], 'focus');

    component['handleArrowRight'](tagRemoveElements, indexArrow);

    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[indexArrow], -1);
    expect(tagRemoveElements[indexArrow + 1].focus).toHaveBeenCalled();
    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[indexArrow + 1], 0);
  });

  it('should call setTabIndex in previous tag if index is 1', () => {
    const tagRemoveElements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ];

    const indexArrow = 1;

    spyOn(component, 'setTabIndex' as any);
    spyOn(tagRemoveElements[indexArrow - 1], 'focus');

    component['handleArrowLeft'](tagRemoveElements, indexArrow);

    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[indexArrow], -1);
    expect(tagRemoveElements[indexArrow - 1].focus).toHaveBeenCalled();
    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[indexArrow - 1], 0);
  });

  it('should focus on the previous element if the tag length is equal to the closed index', () => {
    const tagRemoveElements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ];
    const indexClosed = 3;
    spyOn(tagRemoveElements[indexClosed - 1], 'focus');

    component['focusOnRemoveTag'](tagRemoveElements, indexClosed);

    expect(tagRemoveElements[indexClosed - 1].focus).toHaveBeenCalled();
  });

  it('should focus on the current element if the tag length is not equal to the closed index', () => {
    const tagRemoveElements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ];
    const indexClosed = 1;
    spyOn(tagRemoveElements[indexClosed], 'focus');

    component['focusOnRemoveTag'](tagRemoveElements, indexClosed);

    expect(tagRemoveElements[indexClosed].focus).toHaveBeenCalled();
  });

  it('should focus in previous tag if remove next tag ', () => {
    const tagRemoveElements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ];

    const initialIndex = 3;

    spyOn(component, 'setTabIndex' as any);

    component['initializeTagRemoveElements'](tagRemoveElements, initialIndex);

    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[initialIndex - 1], 0);
  });

  it('should add keydown event listeners', () => {
    const tagRemoveElements = [document.createElement('div')];
    const initialIndex = 0;
    const fakeKeyboardEvent = new KeyboardEvent('keydown');

    spyOn(component as any, 'setTabIndex');
    spyOn(component as any, 'handleKeyDown');

    component['initializeTagRemoveElements'](tagRemoveElements, initialIndex);

    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[0], 0);

    tagRemoveElements[0].dispatchEvent(fakeKeyboardEvent);

    expect(component['handleKeyDown']).toHaveBeenCalled();
  });

  it('should add blur event listeners and call setTabIndex', () => {
    const tagRemoveElements = [document.createElement('div'), document.createElement('div')];
    const initialIndex = 0;

    spyOn(component as any, 'setTabIndex');

    component['initializeTagRemoveElements'](tagRemoveElements, initialIndex);

    tagRemoveElements[0].focus();
    tagRemoveElements[0].dispatchEvent(new Event('blur'));

    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[0], -1);
    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[1], 0);
  });

  it('should set tab index to 0 for the previous element when initialIndex is not 0', () => {
    const tagRemoveElements = [document.createElement('div'), document.createElement('div')];
    const initialIndex = 1;

    spyOn(component as any, 'setTabIndex');

    component['initializeTagRemoveElements'](tagRemoveElements, initialIndex);

    expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[0], 0);
  });

  it('focusOnNextTag: should select attribute unselected with index 0', () => {
    const tagsFake = document.createElement('div');
    tagsFake.innerHTML = `
      <div class="po-tag-remove"></div>
      <div class="po-tag-remove"></div>
      <div class="po-tag-remove"></div>
    `;

    spyOn(component, <any>'focusOnRemoveTag');

    component['focusOnNextTag'](0, 'enter');

    expect(component['focusOnRemoveTag']).toHaveBeenCalled();
  });

  it('focusOnNextTag: should select attribute unselected whitout index', () => {
    const tagsFake = document.createElement('div');
    tagsFake.innerHTML = `
      <div class="po-tag-remove"></div>
      <div class="po-tag-remove"></div>
      <div class="po-tag-remove"></div>
    `;

    spyOn(component, <any>'focusOnRemoveTag');

    component['focusOnNextTag'](null, 'enter');

    expect(component['focusOnRemoveTag']).toHaveBeenCalled();
  });

  describe('Templates:', () => {
    it(`should set tabindex to 0 if have a disclaimer with 'hideClose'.`, () => {
      component.disclaimers = [{ value: 'po', hideClose: false }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-remove[tabindex="0"]')).toBeTruthy();
    });

    it(`shouldn't set tabindex if disclaimer doesn't have 'hideClose'.`, () => {
      component.disclaimers = [{ value: 'po', hideClose: true }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag[tabindex="0"]')).toBeNull();
    });

    it(`shouldn't set tabindex if doesn't have disclaimer.`, () => {
      component.disclaimers = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-disclaimer-remove[tabindex="0"]')).toBeNull();
    });

    it('should set disclaimer remove all with `literals.removeAll`.', () => {
      component.disclaimers = disclaimers;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-value span').innerHTML).toBe(component.literals.removeAll);
    });
  });
});
