import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoAccordionItemComponent } from './po-accordion-item.component';
import { PoAccordionService } from '../services/po-accordion.service';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

describe('PoAccordionItemComponent:', () => {
  let component: PoAccordionItemComponent;
  let fixture: ComponentFixture<PoAccordionItemComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoAccordionItemComponent],
      providers: [PoAccordionService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoAccordionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('collapse: should set `expanded` to `false` and call `accordionService.sendToParentAccordionItemClicked`', () => {
      spyOn(component['accordionService'], 'sendToParentAccordionItemClicked');

      component.collapse();

      expect(component.expanded).toBe(false);
      expect(component['accordionService'].sendToParentAccordionItemClicked).toHaveBeenCalled();
    });

    it('expand: should set `expanded` to `true` and call `accordionService.sendToParentAccordionItemClicked`', () => {
      spyOn(component['accordionService'], 'sendToParentAccordionItemClicked');

      component.expand();

      expect(component.expanded).toBe(true);
      expect(component['accordionService'].sendToParentAccordionItemClicked).toHaveBeenCalled();
    });
  });
});
