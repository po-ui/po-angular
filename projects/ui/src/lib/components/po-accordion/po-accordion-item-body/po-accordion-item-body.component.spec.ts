import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoAccordionItemBodyComponent } from './po-accordion-item-body.component';

describe('PoAccordionItemBodyComponent:', () => {
  let component: PoAccordionItemBodyComponent;
  let fixture: ComponentFixture<PoAccordionItemBodyComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoAccordionItemBodyComponent],
      imports: [BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoAccordionItemBodyComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoAccordionItemBodyComponent).toBeTruthy();
  });
  describe('handleKeydown', () => {
    it('should call preventDefault when "Enter" key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');

      component.handleKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not call preventDefault for keys other than "Enter"', () => {
      const event = new KeyboardEvent('keydown', { key: 'Space' });
      spyOn(event, 'preventDefault');

      component.handleKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
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
