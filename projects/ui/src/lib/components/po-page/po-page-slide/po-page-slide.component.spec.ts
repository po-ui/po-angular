import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
  `
})
class TestComponent {
  public username: string;
  public password: string;

  @ViewChild(PoPageSlideComponent, { static: true }) poPage: PoPageSlideComponent;
}

describe('PoPageSlideComponent', () => {
  let component: PoPageSlideComponent;
  let fixture: ComponentFixture<PoPageSlideComponent>;
  let debugElement: DebugElement;
  let element: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NoopAnimationsModule, PoFieldModule],
        declarations: [PoPageSlideComponent, TestComponent],
        providers: [PoActiveOverlayService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageSlideComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
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
      const fakeEvent = { target: 'click', stopPropagation: () => {} };

      component['firstElement'] = <any>{ focus: () => {} };
      component['id'] = '1';
      component['poActiveOverlayService'] = { activeOverlay: ['1'] };
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

  it('should focus on the page when opened', fakeAsync(() => {
    component.open();
    fixture.detectChanges();

    tick(100);

    const pageSlideContent = debugElement.query(By.css('.po-page-slide-content'));
    expect(document.activeElement).toEqual(pageSlideContent.nativeElement);

    flush();
  }));

  it('should focus on first input of the page when opened', fakeAsync(() => {
    const fixtureTest = TestBed.createComponent(TestComponent);
    const componentTest = fixtureTest.componentInstance;

    componentTest.poPage.open();
    fixtureTest.detectChanges();

    tick(100);

    const input = fixtureTest.debugElement.query(By.css('input[name="username"]'));
    expect(document.activeElement).toEqual(input.nativeElement);

    flush();
  }));

  it("should maintain focus on the element if it's on the page", fakeAsync(() => {
    const fixtureTest = TestBed.createComponent(TestComponent);
    const componentTest = fixtureTest.componentInstance;

    componentTest.poPage.open();
    fixtureTest.detectChanges();

    tick(100);

    const password = fixtureTest.debugElement.query(By.css('input[name="password"]'));
    password.nativeElement.focus();

    tick(100);
    expect(document.activeElement).toEqual(password.nativeElement);

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
});
