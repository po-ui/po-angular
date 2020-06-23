import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoAvatarBaseComponent } from './po-avatar-base.component';
import { PoAvatarComponent } from './po-avatar.component';

describe('PoAvatarComponent:', () => {
  let component: PoAvatarComponent;
  let fixture: ComponentFixture<PoAvatarComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoAvatarComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoAvatarComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoAvatarBaseComponent).toBeTruthy();
    expect(component instanceof PoAvatarComponent).toBeTruthy();
  });

  it('should keep `p-src` to equal `undefined` image when `p-src` isn`t updated', () => {
    component.ngOnInit();

    expect(component.src).toBe(undefined);
  });

  it('should update `p-src`', () => {
    component.src = 'image_path';

    component.ngOnInit();

    expect(component.src).toBe('image_path');
    expect(component.src).not.toBe(undefined);
  });

  it('when call `onError`, `p-src` should be equal to `undefined`.', () => {
    component.onError();

    expect(component.src).toBe(undefined);
  });

  describe('Templates:', () => {
    it(`should display template 'sourceImage' if 'src' is true.`, () => {
      component.src = 'image_path';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-avatar-image')).toBeTruthy();
      expect(nativeElement.querySelector('.po-avatar-default-icon')).toBeNull();
    });

    it(`should display template 'defaultIcon' if 'src' is false.`, () => {
      component.src = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-avatar-image')).toBeNull();
      expect(nativeElement.querySelector('.po-avatar-default-icon')).toBeTruthy();
    });

    it(`should add 'po-clickable' class if hasEventClick is true`, () => {
      component.click.observers = [<any>of()];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-avatar.po-clickable')).toBeTruthy();
    });

    it(`shouldn't add 'po-clickable' class if hasEventClick is false`, () => {
      component.click.observers = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-avatar.po-clickable')).toBeNull();
    });
  });
});
