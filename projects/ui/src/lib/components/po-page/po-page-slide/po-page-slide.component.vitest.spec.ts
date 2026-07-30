import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PoActiveOverlayService } from '../../../services/po-active-overlay';
import { PoPageSlideComponent } from './po-page-slide.component';

@Component({
  template: `
    <po-page-slide p-title="Po Page Slide Title" p-subtitle="Po Page Slide Subtitle">
      <form>
        <input name="username" placeholder="Username" />
        <input name="password" placeholder="Password" />
      </form>
    </po-page-slide>
  `,
  standalone: false
})
class TestComponent {
  @ViewChild(PoPageSlideComponent, { static: true }) poPage: PoPageSlideComponent;

  public username: string;
  public password: string;
}

describe('PoPageSlideComponent', () => {
  let component: PoPageSlideComponent;
  let fixture: ComponentFixture<PoPageSlideComponent>;
  let debugElement: DebugElement;
  let element: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [PoPageSlideComponent, TestComponent],
      providers: [PoActiveOverlayService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoPageSlideComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    component.duration = '70ms';
    component.timing = '700ms cubic-bezier(0.35, 0, 0.1, 1)';

    fixture.detectChanges();
  });

  afterEach(() => {
    try {
      document.body.removeChild(element);
      fixture.destroy();
    } catch (e) {}
    vi.restoreAllMocks();
  });

  it('should create component', () => {
    expect(component instanceof PoPageSlideComponent).toBe(true);
  });

  describe('Methods:', () => {
    it('focusEvent: should call `stopPropagation` if `activeOverlay` is equal to id', () => {
      const fakeEvent = {
        target: {
          closest: () => null
        },
        stopPropagation: vi.fn()
      };

      component['firstElement'] = { focus: vi.fn() } as any;
      Object.defineProperty(component, 'id', { value: '1', configurable: true });
      Object.defineProperty(component, 'poActiveOverlayService', {
        value: { activeOverlay: ['1'] },
        configurable: true
      });
      component['pageContent'] = { nativeElement: { contains: () => 0 } } as any;
      component.hideClose = true;

      component['initFocus']();
      fixture.detectChanges();
      component['focusEvent'](fakeEvent as any);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    });

    it('open: should append id value to `poActiveOverlayService.activeOverlay` list', () => {
      component.open();

      fixture.detectChanges();

      component['handleFocus']();

      expect(component['poActiveOverlayService'].activeOverlay).toEqual([component['id']]);
    });

    it('close: should remove id value from `poActiveOverlayService.activeOverlay` list', () => {
      component.open();
      fixture.detectChanges();

      component.close();

      expect(component['poActiveOverlayService'].activeOverlay).toEqual([]);
    });

    it('close: should remove id value from `poActiveOverlayService.activeOverlay` list when last element', () => {
      Object.defineProperty(component, 'id', { value: '2', configurable: true });
      component['poActiveOverlayService'].activeOverlay = ['1', '2'];

      component.open();
      fixture.detectChanges();

      component.close();
      fixture.detectChanges();

      expect(component['poActiveOverlayService'].activeOverlay).toEqual(['1']);
    });
  });

  it('should open() and close() methods includes and removes component on DOM', () => {
    expect(debugElement.query(By.css('.po-page-slide'))).toBeNull();

    component.open();
    fixture.detectChanges();
    expect(debugElement.query(By.css('.po-page-slide'))).toBeDefined();

    component.close();
    fixture.detectChanges();
    expect(debugElement.query(By.css('.po-page-slide'))).toBeNull();
  });

  it('should not hide the close button when hideClose property is true and clickOut property is false', () => {
    component.clickOut = false;
    component.hideClose = true;
    component.open();
    fixture.detectChanges();
    expect(debugElement.query(By.css('.po-page-slide-close-button'))).toBeDefined();
  });

  it('should hide the close button when hideClose property is true and clickOut property is true', () => {
    component.clickOut = true;
    component.hideClose = true;
    component.open();
    fixture.detectChanges();
    expect(debugElement.query(By.css('.po-page-slide-close-button'))).toBeNull();
  });

  it('should have the defined title', () => {
    component.title = 'Po Page Slide Title';
    component.open();
    fixture.detectChanges();
    expect(debugElement.query(By.css('.po-page-slide-title')).nativeElement.textContent).toBe(component.title);
  });

  it('should have the defined subtitle', () => {
    component.subtitle = 'Po Page Slide Subtitle';
    component.open();
    fixture.detectChanges();
    expect(debugElement.query(By.css('.po-page-slide-subtitle')).nativeElement.textContent).toBe(component.subtitle);
  });

  it('should call close() method when clicked out the content and clickOut property is true', () => {
    const mockEvent = { target: 0 };
    const mockComponent = {
      pageContent: { nativeElement: { contains: () => false } },
      clickOut: true,
      close: vi.fn()
    };

    component.onClickOut.call(mockComponent, mockEvent);
    fixture.detectChanges();

    expect(mockComponent.close).toHaveBeenCalled();
  });

  it('should not call close() method when clicked in the content and clickOut property is true', () => {
    const mockEvent = { target: 0 };
    const mockComponent = {
      pageContent: { nativeElement: { contains: () => true } },
      clickOut: true,
      close: vi.fn()
    };

    fixture.detectChanges();
    component.onClickOut.call(mockComponent, mockEvent);

    expect(mockComponent.close).not.toHaveBeenCalled();
  });

  it('should not call close() method when clickOut property is false', () => {
    const mockEvent = { target: 0 };
    const mockComponent = {
      pageContent: { nativeElement: { contains: () => false } },
      clickOut: false,
      close: vi.fn()
    };

    fixture.detectChanges();
    component.onClickOut.call(mockComponent, mockEvent);

    expect(mockComponent.close).not.toHaveBeenCalled();
  });

  it('should call focus on the page when opened', async () => {
    const spy = vi.spyOn(component as any, 'handleFocus');

    component.open();
    fixture.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(spy).toHaveBeenCalled();
  });

  it('should set source element as the current document.activeElement when opened', () => {
    component.open();
    expect(component['sourceElement']).toBe(document.activeElement);
  });

  it('should focus on source element when closed', () => {
    component.open();
    fixture.detectChanges();

    const spy = vi.spyOn(component['sourceElement'], 'focus');

    component.close();
    expect(spy).toHaveBeenCalled();
  });

  it('should have pageContent.nativeElement defined', () => {
    const div = document.createElement('div');
    div.setAttribute('tabindex', '-1');

    const mockElementRef = {
      nativeElement: div
    } as ElementRef;

    component.pageContent = mockElementRef;
    component['initFocus']();

    expect(component.pageContent.nativeElement).toBeDefined();
  });

  it('getTextDefault: should return `Fechar` if `getShortLanguage` returns `pt`', () => {
    const fakeThis = {
      languageService: {
        getShortLanguage: () => 'pt'
      }
    };

    expect(component['getTextDefault'].call(fakeThis)).toBe('Fechar');
  });
});
