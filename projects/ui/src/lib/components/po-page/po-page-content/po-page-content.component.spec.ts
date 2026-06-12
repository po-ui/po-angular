import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { changeBrowserInnerWidth, configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoPageContentComponent } from './po-page-content.component';

describe('PoPageContentComponent:', () => {
  let component: PoPageContentComponent;
  let fixture: ComponentFixture<PoPageContentComponent>;

  const eventResize = document.createEvent('Event');
  eventResize.initEvent('resize', false, true);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoPageContentComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoPageContentComponent).toBeTruthy();
  });

  it('constructor: should call recalculateHeaderSize on resize', () => {
    component['initializeListeners']();
    vi.spyOn(component as any, 'recalculateHeaderSize');

    changeBrowserInnerWidth(450);
    window.dispatchEvent(eventResize);

    expect(component.recalculateHeaderSize).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it('recalculateHeaderSize: should set height and contentOpacity to 1', fakeAsync(() => {
      component.recalculateHeaderSize();
      tick(100);

      expect(component.contentOpacity).toBe(1);
      expect(component.height).toBeTruthy();
    }));

    it('ngAfterViewInit: should call recalculateHeaderSize', () => {
      vi.spyOn(component as any, 'recalculateHeaderSize');

      component.ngAfterViewInit();

      expect(component.recalculateHeaderSize).toHaveBeenCalled();
    });

    it('should calculate height based on viewport when no .po-page ancestor', fakeAsync(() => {
      component.recalculateHeaderSize();
      tick(100);

      expect(component.height).toMatch(/^\d+px$|^auto$|^90%$/);
    }));

    it('should set height to auto when inside nested po-page-content', fakeAsync(() => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('po-page-content');
      const poPage = document.createElement('div');
      poPage.classList.add('po-page');
      wrapper.appendChild(poPage);
      poPage.appendChild(fixture.nativeElement);
      document.body.appendChild(wrapper);

      component.recalculateHeaderSize();
      tick(100);

      expect(component.height).toBe('auto');

      document.body.removeChild(wrapper);
    }));

    it('should fallback to 90% when calculated height is zero or negative without .po-page', fakeAsync(() => {
      vi.spyOn(fixture.nativeElement as any, 'getBoundingClientRect').mockReturnValue({
        top: window.innerHeight + 100,
        bottom: window.innerHeight + 200,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      });

      component.recalculateHeaderSize();
      tick(100);

      expect(component.height).toBe('90%');
    }));
  });
});
