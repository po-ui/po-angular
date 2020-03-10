import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoSlideCirclesComponent } from './po-slide-circles.component';
import { PoSlideModule } from './../po-slide.module';

describe('PoSlideCirclesComponent:', () => {
  let component: PoSlideCirclesComponent;
  let fixture: ComponentFixture<PoSlideCirclesComponent>;
  let nativeElement;

  const eventClick = document.createEvent('MouseEvents');
  eventClick.initEvent('click', false, true);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoSlideModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSlideCirclesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created.', () => {
    expect(component instanceof PoSlideCirclesComponent).toBeTruthy();
  });

  describe('Templates:', () => {
    it('shouldn`t find circles if `items` is undefined.', () => {
      component.items = undefined;
      fixture.detectChanges();

      const slideCircle = nativeElement.querySelector('.po-slide-circle');

      expect(slideCircle).toBeFalsy();
    });

    it('should apply `po-slide-active-circle` class in third element.', () => {
      component.items = ['item1', 'item2', 'item3'];
      component.currentSlideIndex = 2;
      fixture.detectChanges();

      const slideCircles = nativeElement.querySelectorAll('.po-slide-circle');
      const activedCircleElement = nativeElement.querySelector('.po-slide-active-circle');

      expect(slideCircles[2]).toBe(activedCircleElement);
    });

    it('should have three slide circles.', () => {
      component.items = ['item1', 'item2', 'item3'];
      fixture.detectChanges();

      const slideCircles = nativeElement.querySelectorAll('.po-slide-circle');

      expect(slideCircles.length).toBe(3);
    });

    it('should call `EventEmitter` if `po-slide-circle` was clicked.', () => {
      component.items = ['item'];
      fixture.detectChanges();

      const slideCircle = nativeElement.querySelector('.po-slide-circle');
      spyOn(component.click, 'emit');
      slideCircle.dispatchEvent(eventClick);

      expect(component.click.emit).toHaveBeenCalled();
    });
  });
});
