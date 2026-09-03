import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PoActiveOverlayService } from '../../../services/po-active-overlay';
import { PoFieldModule } from '../../po-field';
import { PoPageSlideFooterComponent } from './po-page-slide-footer/po-page-slide-footer.component';
import { PoPageSlideComponent } from './po-page-slide.component';

@Component({
  template: `
    <po-page-slide p-title="Po Page Slide Title" p-subtitle="Po Page Slide Subtitle">
      <form #f="ngForm">
        <po-input name="username" [(ngModel)]="username" p-label="Username"></po-input>
        <po-input name="password" [(ngModel)]="password" p-label="Password"></po-input>
      </form>
    </po-page-slide>
  `,
  standalone: false
})
class TestComponent {
  @ViewChild(PoPageSlideComponent, { static: true }) poPage: PoPageSlideComponent;

  public username: string;
  public password: string;

  constructor() {
    this.poPage.duration = '70ms';
    this.poPage.timing = '700ms cubic-bezier(0.35, 0, 0.1, 1)';
  }
}

describe('PoPageSlideComponent', () => {
  let component: PoPageSlideComponent;
  let fixture: ComponentFixture<PoPageSlideComponent>;
  let debugElement: DebugElement;
  let element: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NoopAnimationsModule, PoFieldModule],
      declarations: [PoPageSlideComponent, TestComponent],
      providers: [PoActiveOverlayService]
    }).compileComponents();
  }));

  beforeEach(() => {
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
  });

  it('should create component', () => {
    expect(component instanceof PoPageSlideComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('focusEvent: should call `stopPropagation` if `activeOverlay` is equal to id', () => {
      const fakeEvent = {
        target: {
          closest: () => null
        },
        stopPropagation: () => {}
      };

      component['firstElement'] = <any>{ focus: () => {} };
      Object.defineProperty(component, 'id', { value: '1', configurable: true });
      Object.defineProperty(component, 'poActiveOverlayService', {
        value: { activeOverlay: ['1'] },
        configurable: true
      });
      component['pageContent'] = { nativeElement: { contains: () => 0 } };
      component.hideClose = true;

      const spyEvent = spyOn(fakeEvent, 'stopPropagation');

      component['initFocus']();
      fixture.detectChanges();
      component['focusEvent'](<any>fakeEvent);

      expect(spyEvent).toHaveBeenCalled();
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
      close: () => {}
    };

    spyOn(mockComponent, 'close');
    component.onClickOut.call(mockComponent, mockEvent);
    fixture.detectChanges();

    expect(mockComponent.close).toHaveBeenCalled();
  });

  it('should not call close() method when clicked in the content and clickOut property is true', () => {
    const mockEvent = { target: 0 };
    const mockComponent = { pageContent: { nativeElement: { contains: () => true } }, clickOut: true, close: () => {} };

    spyOn(mockComponent, 'close');
    fixture.detectChanges();
    component.onClickOut.call(mockComponent, mockEvent);

    expect(mockComponent.close).not.toHaveBeenCalled();
  });

  it('should not call close() method when clickOut property is false', () => {
    const mockEvent = { target: 0 };
    const mockComponent = {
      pageContent: { nativeElement: { contains: () => false } },
      clickOut: false,
      close: () => {}
    };

    spyOn(mockComponent, 'close');
    fixture.detectChanges();
    component.onClickOut.call(mockComponent, mockEvent);

    expect(mockComponent.close).not.toHaveBeenCalled();
  });

  it('should call focus on the page when opened', fakeAsync(() => {
    spyOn(component, <any>'handleFocus');

    component.open();
    fixture.detectChanges();

    tick(100);

    expect(component['handleFocus']).toHaveBeenCalled();

    flush();
  }));

  it('should set source element as the current document.activeElement when opened', () => {
    component.open();
    expect(component['sourceElement']).toBe(document.activeElement);
  });

  it('should focus on source element when closed', () => {
    component.open();
    fixture.detectChanges();

    spyOn(component['sourceElement'], 'focus');

    component.close();
    expect(component['sourceElement'].focus).toHaveBeenCalled();
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

  describe('full size:', () => {
    it('should not render the overlay when size is `full`', () => {
      component.size = 'full';
      component.open();
      fixture.detectChanges();

      expect(debugElement.query(By.css('.po-page-slide-overlay'))).toBeNull();
    });

    it('should render the overlay when size is different from `full`', () => {
      component.size = 'md';
      component.open();
      fixture.detectChanges();

      expect(debugElement.query(By.css('.po-page-slide-overlay'))).not.toBeNull();
    });

    it('should apply the `po-page-slide-full` class to the container when size is `full`', () => {
      component.size = 'full';
      component.open();
      fixture.detectChanges();

      expect(debugElement.query(By.css('.po-page-slide-full'))).not.toBeNull();
    });

    it('should close by close() method when size is `full`', () => {
      component.size = 'full';
      component.open();
      fixture.detectChanges();

      component.close();
      fixture.detectChanges();

      expect(component.hidden).toBe(true);
    });

    describe('hasAlternativeCloseAction:', () => {
      it('should return true when size is `full` and a footer is present', () => {
        component.size = 'full';
        component.pageSlideFooter = new PoPageSlideFooterComponent();

        expect(component['hasAlternativeCloseAction']()).toBe(true);
      });

      it('should return false when size is `full` and there is no footer', () => {
        component.size = 'full';
        component.pageSlideFooter = undefined;

        expect(component['hasAlternativeCloseAction']()).toBe(false);
      });

      it('should delegate to the base behavior when size is different from `full`', () => {
        component.size = 'md';
        component.clickOut = true;

        expect(component['hasAlternativeCloseAction']()).toBe(true);

        component.clickOut = false;
        expect(component['hasAlternativeCloseAction']()).toBe(false);
      });
    });
  });

  describe('ARIA:', () => {
    it('should set role `dialog` and aria-modal `true` on the container', () => {
      component.title = 'My title';
      component.open();
      fixture.detectChanges();

      const container = debugElement.query(By.css('.po-page-slide-container')).nativeElement;

      expect(container.getAttribute('role')).toBe('dialog');
      expect(container.getAttribute('aria-modal')).toBe('true');
      expect(container.getAttribute('aria-label')).toBe('My title');
    });
  });

  describe('animation params:', () => {
    it('fadeParams: should use the fallback duration when `duration` is empty', () => {
      component.duration = '';

      expect(component.fadeParams.params.duration).toBe('70ms');
    });

    it('slideParams: should use the fallback timing when `timing` is empty', () => {
      component.timing = '';

      expect(component.slideParams.params.timing).toBe('700ms cubic-bezier(0.35, 0, 0.1, 1)');
    });
  });
});
