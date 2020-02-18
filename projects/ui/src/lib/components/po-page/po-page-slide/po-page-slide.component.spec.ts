import { Component, DebugElement, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PoFieldModule } from '../../po-field';
import { PoPageSlideComponent } from './po-page-slide.component';
import { PoPageSlideService } from './po-page-slide.service';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NoopAnimationsModule, PoFieldModule],
      declarations: [PoPageSlideComponent, TestComponent],
      providers: [PoPageSlideService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageSlideComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create component', () => {
    expect(component instanceof PoPageSlideComponent).toBeTruthy();
  });

  it('should call open and close methods', () => {
    expect(debugElement.query(By.css('.po-page-slide'))).toBeNull();

    component.open();
    fixture.detectChanges();
    expect(debugElement.query(By.css('.po-page-slide'))).toBeDefined();

    component.close();
    fixture.detectChanges();
    expect(debugElement.query(By.css('.po-page-slide'))).toBeNull();
  });

  it('should hide the close button when hideClose is true', () => {
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

  it('should not be possible to open more than one simultaneously', () => {
    component.open();
    fixture.detectChanges();
    expect(() => TestBed.createComponent(TestComponent).componentInstance.poPage.open()).toThrow();
  });

  it('should focus on the page when opened', fakeAsync(() => {
    component.open();
    fixture.detectChanges();

    tick(0);

    const pageSlideContent = debugElement.query(By.css('.po-page-slide-content'));
    expect(document.activeElement).toEqual(pageSlideContent.nativeElement);
  }));

  it('should focus on first input of the page when opened', fakeAsync(() => {
    const fixtureTest = TestBed.createComponent(TestComponent);
    const componentTest = fixtureTest.componentInstance;

    componentTest.poPage.open();
    fixtureTest.detectChanges();

    tick(0);

    const input = fixtureTest.debugElement.query(By.css('input[name="username"]'));
    expect(document.activeElement).toEqual(input.nativeElement);
  }));
});
