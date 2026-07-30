import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoPageContentComponent } from './po-page-content.component';

describe('PoPageContentComponent:', () => {
  let component: PoPageContentComponent;
  let fixture: ComponentFixture<PoPageContentComponent>;

  const eventResize = document.createEvent('Event');
  eventResize.initEvent('resize', false, true);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoPageContentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(component instanceof PoPageContentComponent).toBe(true);
  });

  it('constructor: should call recalculateHeaderSize on resize', () => {
    component['initializeListeners']();
    const spy = vi.spyOn(component, 'recalculateHeaderSize').mockImplementation(() => {});

    Object.defineProperty(window, 'innerWidth', { value: 450, writable: true, configurable: true });
    window.dispatchEvent(eventResize);

    expect(spy).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it('recalculateHeaderSize: should set height and contentOpacity to 1', async () => {
      component.recalculateHeaderSize();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(component.contentOpacity).toBe(1);
      expect(component.height).toBeTruthy();
    });

    it('ngAfterViewInit: should call recalculateHeaderSize', () => {
      const spy = vi.spyOn(component, 'recalculateHeaderSize').mockImplementation(() => {});

      component.ngAfterViewInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should calculate height based on viewport when no .po-page ancestor', async () => {
      component.recalculateHeaderSize();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(component.height).toMatch(/^\d+px$|^auto$|^90%$/);
    });

    it('should set height to auto when inside nested po-page-content', async () => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('po-page-content');
      const poPage = document.createElement('div');
      poPage.classList.add('po-page');
      wrapper.appendChild(poPage);
      poPage.appendChild(fixture.nativeElement);
      document.body.appendChild(wrapper);

      component.recalculateHeaderSize();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(component.height).toBe('auto');

      document.body.removeChild(wrapper);
    });

    it('should fallback to 90% when calculated height is zero or negative without .po-page', async () => {
      vi.spyOn(fixture.nativeElement, 'getBoundingClientRect').mockReturnValue({
        top: window.innerHeight + 100,
        bottom: window.innerHeight + 200,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      });

      component.recalculateHeaderSize();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(component.height).toBe('90%');
    });
  });
});
