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
    it('collapse: should set `expanded` to `false` and emits `p-collapse` event', () => {
      spyOn(component.collapseEvent, 'emit');

      component.collapse();

      expect(component.expanded).toBe(false);
      expect(component.collapseEvent.emit).toHaveBeenCalled();
    });

    it('expand: should set `expanded` to `true` and emits `p-expand` event', () => {
      spyOn(component.expandEvent, 'emit');

      component.expand();

      expect(component.expanded).toBe(true);
      expect(component.expandEvent.emit).toHaveBeenCalled();
    });
  });
});
