import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoIconModule } from '../../po-icon';
import { PoSlideControlComponent } from './po-slide-control.component';

describe('PoSlideControlComponent:', () => {
  let component: PoSlideControlComponent;
  let fixture: ComponentFixture<PoSlideControlComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoSlideControlComponent],
      imports: [PoIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoSlideControlComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Template:', () => {
    it('should apply `po-slide-control-previous` and `ICON_ARROW_LEFT` if `control` is `previous`', () => {
      component.control = 'previous';

      fixture.detectChanges();

      const controlPrevious = nativeElement.querySelector('.po-slide-control-previous');
      const arrowPrevious = controlPrevious.querySelector('[ng-reflect-icon="ICON_ARROW_LEFT"]');

      expect(controlPrevious).toBeTruthy();
      expect(arrowPrevious).toBeTruthy();
    });

    it('should apply `po-slide-control-next` and `"ICON_ARROW_RIGHT` if `control` is `next`', () => {
      component.control = 'next';

      fixture.detectChanges();

      const controlNext = nativeElement.querySelector('.po-slide-control-next');
      const arrowNext = controlNext.querySelector('[ng-reflect-icon="ICON_ARROW_RIGHT"]');

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
