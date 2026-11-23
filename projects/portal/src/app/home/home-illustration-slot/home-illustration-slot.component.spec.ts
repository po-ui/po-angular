import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeIllustrationSlotComponent } from './home-illustration-slot.component';

describe('HomeIllustrationSlotComponent', () => {
  let fixture: ComponentFixture<HomeIllustrationSlotComponent>;
  let component: HomeIllustrationSlotComponent;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [HomeIllustrationSlotComponent] }).compileComponents();
    fixture = TestBed.createComponent(HomeIllustrationSlotComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
  });

  it('should be hidden from assistive technologies by default', () => {
    fixture.detectChanges();
    expect(host.getAttribute('aria-hidden')).toBe('true');
  });

  it('should not set aria-hidden when decorative is false', () => {
    component.decorative = false;
    fixture.detectChanges();
    expect(host.hasAttribute('aria-hidden')).toBeFalse();
  });

  it('should expose the label as data-illustration', () => {
    component.label = 'hero-preview';
    fixture.detectChanges();
    expect(host.getAttribute('data-illustration')).toBe('hero-preview');
  });

  it('should convert numbers to px and keep strings as they are', () => {
    component.width = 1243;
    component.height = '50%';
    component.radius = 16;
    fixture.detectChanges();
    expect(host.style.width).toBe('1243px');
    expect(host.style.height).toBe('50%');
    expect(host.style.borderRadius).toBe('16px');
  });
});
