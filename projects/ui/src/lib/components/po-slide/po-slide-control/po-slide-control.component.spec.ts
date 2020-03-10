import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoSlideControlComponent } from './po-slide-control.component';

describe('PoSlideControlComponent:', () => {
  let component: PoSlideControlComponent;
  let fixture: ComponentFixture<PoSlideControlComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoSlideControlComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSlideControlComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Template:', () => {
    it('should apply `po-slide-control-previous` and `po-slide-arrow-previous` if `control` is `previous`', () => {
      component.control = 'previous';

      fixture.detectChanges();

      const controlPrevious = nativeElement.querySelector('.po-slide-control-previous');
      const arrowPrevious = nativeElement.querySelector('.po-slide-arrow-previous');

      expect(controlPrevious).toBeTruthy();
      expect(arrowPrevious).toBeTruthy();
    });

    it('should apply `po-slide-control-next` and `po-slide-arrow-next` if `control` is `next`', () => {
      component.control = 'next';

      fixture.detectChanges();

      const controlNext = nativeElement.querySelector('.po-slide-control-next');
      const arrowNext = nativeElement.querySelector('.po-slide-arrow-next');

      expect(controlNext).toBeTruthy();
      expect(arrowNext).toBeTruthy();
    });

    it('should call `click.emit` if `po-slide-arrow-circle` was clicked', () => {
      const arrowCircle = nativeElement.querySelector('.po-slide-arrow-circle');

      spyOn(component.click, 'emit');

      const eventClick = document.createEvent('MouseEvents');
      eventClick.initEvent('click', false, true);

      arrowCircle.dispatchEvent(eventClick);

      expect(component.click.emit).toHaveBeenCalled();
    });
  });
});
