import { Component, DebugElement, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { PoActiveOverlayService } from '../../../services/po-active-overlay';
import { PoFieldModule } from '../../po-field';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
      imports: [FormsModule, PoFieldModule],
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

  describe('Animation methods:', () => {
    it('animateEnter: should animate overlay opacity and container translateX', () => {
      const rootElement = document.createElement('div');
      const container = document.createElement('div');
      container.classList.add('po-page-slide-container');
      rootElement.appendChild(container);

      const animationComplete = jasmine.createSpy('animationComplete');
      const rootAnimateSpy = spyOn(rootElement, 'animate').and.returnValue({} as any);
      const containerAnimation: any = {};
      const containerAnimateSpy = spyOn(container, 'animate').and.returnValue(containerAnimation);

      component.animateEnter(<any>{ target: rootElement, animationComplete });

      expect(rootAnimateSpy).toHaveBeenCalledWith(
        [{ opacity: 0 }, { opacity: 1 }],
        jasmine.objectContaining({ easing: 'linear', fill: 'forwards' })
      );
      expect(containerAnimateSpy).toHaveBeenCalledWith(
        [{ transform: 'translateX(50px)' }, { transform: 'none' }],
        jasmine.objectContaining({ fill: 'forwards' })
      );

      containerAnimation.onfinish();
      expect(animationComplete).toHaveBeenCalled();
    });

    it('animateLeave: should animate overlay opacity to 0 and container translateX out', () => {
      const rootElement = document.createElement('div');
      const container = document.createElement('div');
      container.classList.add('po-page-slide-container');
      rootElement.appendChild(container);

      const animationComplete = jasmine.createSpy('animationComplete');
      spyOn(rootElement, 'animate').and.returnValue({} as any);
      const containerAnimation: any = {};
      spyOn(container, 'animate').and.returnValue(containerAnimation);

      component.animateLeave(<any>{ target: rootElement, animationComplete });

      containerAnimation.onfinish();
      expect(animationComplete).toHaveBeenCalled();
    });

    it('animateEnter: should call animationComplete immediately if container not found', () => {
      const rootElement = document.createElement('div');
      const animationComplete = jasmine.createSpy('animationComplete');
      spyOn(rootElement, 'animate').and.returnValue({} as any);

      component.animateEnter(<any>{ target: rootElement, animationComplete });

      expect(animationComplete).toHaveBeenCalled();
    });

    it('parseDuration: should parse ms value', () => {
      expect(component['parseDuration']('200ms')).toBe(200);
    });

    it('parseDuration: should parse s value', () => {
      expect(component['parseDuration']('1.5s')).toBe(1500);
    });

    it('parseDuration: should return default for invalid value', () => {
      expect(component['parseDuration']('')).toBe(70);
      expect(component['parseDuration']('invalid')).toBe(70);
    });

    it('parseTiming: should parse duration and easing', () => {
      const result = component['parseTiming']('700ms cubic-bezier(0.35, 0, 0.1, 1)');
      expect(result.duration).toBe(700);
      expect(result.easing).toBe('cubic-bezier(0.35, 0, 0.1, 1)');
    });

    it('parseTiming: should return default for empty value', () => {
      const result = component['parseTiming']('');
      expect(result.duration).toBe(700);
      expect(result.easing).toBe('cubic-bezier(0.35, 0, 0.1, 1)');
    });
  });
});
