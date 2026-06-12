import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoAccordionItemBodyComponent } from './po-accordion-item-body.component';

describe('PoAccordionItemBodyComponent:', () => {
  let component: PoAccordionItemBodyComponent;
  let fixture: ComponentFixture<PoAccordionItemBodyComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoAccordionItemBodyComponent]
    }).compileComponents();

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

  describe('Methods:', () => {
    it('animateEnter: should animate height from 0 to scrollHeight and call animationComplete', () => {
      const animationComplete = jasmine.createSpy('animationComplete');
      const animation: any = {};
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 120 });
      spyOn(element, 'animate').and.returnValue(animation);

      component.animateEnter(<any>{ target: element, animationComplete });

      expect(element.animate).toHaveBeenCalledWith([{ height: '0px' }, { height: '120px' }], {
        duration: 200,
        easing: 'linear'
      });

      animation.onfinish();
      expect(animationComplete).toHaveBeenCalled();
    });

    it('animateLeave: should animate height from scrollHeight to 0 and call animationComplete', () => {
      const animationComplete = jasmine.createSpy('animationComplete');
      const animation: any = {};
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 80 });
      spyOn(element, 'animate').and.returnValue(animation);

      component.animateLeave(<any>{ target: element, animationComplete });

      expect(element.animate).toHaveBeenCalledWith([{ height: '80px' }, { height: '0px' }], {
        duration: 200,
        easing: 'linear'
      });

      animation.onfinish();
      expect(animationComplete).toHaveBeenCalled();
    });
  });
});
