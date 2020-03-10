import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoAccordionItemBodyComponent } from './po-accordion-item-body.component';

describe('PoAccordionItemBodyComponent:', () => {
  let component: PoAccordionItemBodyComponent;
  let fixture: ComponentFixture<PoAccordionItemBodyComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoAccordionItemBodyComponent],
      imports: [BrowserAnimationsModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoAccordionItemBodyComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoAccordionItemBodyComponent).toBeTruthy();
  });

  describe('Templates:', () => {
    it('shouldn`t have `po-accordion-item-body` by default', () => {
      fixture.detectChanges();

      const body = nativeElement.querySelector('.po-accordion-item-body');
      expect(body).toBeFalsy();
    });

    it('should have `po-accordion-item-body` class if `expanded` is `true`', () => {
      component.expanded = true;

      fixture.detectChanges();

      const body = nativeElement.querySelector('.po-accordion-item-body');
      expect(body).toBeTruthy();
    });

    it('shouldn`t have `po-accordion-item-body` class if `expanded` is `false`', () => {
      component.expanded = false;

      fixture.detectChanges();

      const body = nativeElement.querySelector('.po-accordion-item-body');
      expect(body).toBeFalsy();
    });
  });
});
