import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../../../util-test/util-expect.spec';

import { PoUploadDragDropAreaComponent } from '../po-upload-drag-drop-area/po-upload-drag-drop-area.component';
import { PoUploadDragDropAreaOverlayComponent } from './po-upload-drag-drop-area-overlay.component';

describe('PoUploadDragDropAreaOverlayComponent:', () => {
  let changeDetector: any;
  let component: PoUploadDragDropAreaOverlayComponent;
  let fixture: ComponentFixture<PoUploadDragDropAreaOverlayComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoUploadDragDropAreaComponent, PoUploadDragDropAreaOverlayComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUploadDragDropAreaOverlayComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);

    changeDetector.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoUploadDragDropAreaOverlayComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it(`ngAfterViewInit: should call 'setPosition' with target if have target.`, () => {
      const fakeTarget = {
        nativeElement: '<div></div>'
      };

      component.target = fakeTarget;

      spyOn(component, <any>'setPosition');

      component.ngAfterViewInit();

      expect(component['setPosition']).toHaveBeenCalledWith(fakeTarget);
    });

    it(`ngAfterViewInit: shouldn't call 'setPosition' if doesn't have target.`, () => {
      component.target = undefined;

      spyOn(component, <any>'setPosition');

      component.ngAfterViewInit();

      expect(component['setPosition']).not.toHaveBeenCalled();
    });

    it(`ngAfterViewInit: should call 'areaElement.emit' with 'DragDropAreaFixed.nativeElement'.`, () => {
      spyOn(component.areaElement, 'emit');

      component.ngAfterViewInit();

      expect(component.areaElement.emit).toHaveBeenCalledWith(component.DragDropAreaFixed.nativeElement);
    });

    it(`setPosition: should call 'renderer.setStyle' six times, call 'getBoundingClientRect' and set
    'DragDropAreaFixed.nativeElement' values with 'targetElement.nativeElement.getBoundingClientRect' values in pixels.`, () => {
      const DragDropAreaFixedStyle = component.DragDropAreaFixed.nativeElement.style;
      const targetElement = {
        nativeElement: {
          getBoundingClientRect: () => ({
            bottom: 10,
            left: 15,
            height: 20,
            right: 25,
            top: 30,
            width: 35
          })
        }
      };

      spyOn(component['renderer'], 'setStyle').and.callThrough();
      spyOn(targetElement.nativeElement, 'getBoundingClientRect').and.callThrough();

      component['setPosition'](targetElement);

      changeDetector.detectChanges();

      expect(targetElement.nativeElement.getBoundingClientRect).toHaveBeenCalled();
      expect(component['renderer'].setStyle).toHaveBeenCalledTimes(6);
      expect(DragDropAreaFixedStyle.bottom).toBe('10px');
      expect(DragDropAreaFixedStyle.left).toBe('15px');
      expect(DragDropAreaFixedStyle.height).toBe('20px');
      expect(DragDropAreaFixedStyle.right).toBe('25px');
      expect(DragDropAreaFixedStyle.top).toBe('30px');
      expect(DragDropAreaFixedStyle.width).toBe('35px');
    });
  });

  describe('Templates:', () => {
    it(`should contain 'po-overlay-fixed' and 'po-upload-drag-drop-area-overlay' classes.`, () => {
      expect(nativeElement.querySelector('.po-overlay-fixed')).toBeTruthy();
      expect(nativeElement.querySelector('.po-upload-drag-drop-area-overlay')).toBeTruthy();
    });
  });
});
