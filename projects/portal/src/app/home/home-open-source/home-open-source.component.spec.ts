import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoModule } from '@po-ui/ng-components';

import { HomeOpenSourceComponent } from './home-open-source.component';

describe('HomeOpenSourceComponent', () => {
  let fixture: ComponentFixture<HomeOpenSourceComponent>;
  let component: HomeOpenSourceComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoModule],
      declarations: [HomeOpenSourceComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeOpenSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a single h2 with the three words', () => {
    const titles = fixture.nativeElement.querySelectorAll('h2');
    expect(titles.length).toBe(1);
    expect(titles[0].textContent.replace(/\s+/g, ' ').trim()).toBe('100% Código Aberto');
  });

  it('should hide the decorative logos from assistive technologies', () => {
    const logos = fixture.nativeElement.querySelectorAll('.home-open-source-logo');
    expect(logos.length).toBe(2);
    logos.forEach((logo: HTMLElement) => expect(logo.getAttribute('aria-hidden')).toBe('true'));
  });

  it('should render the contribute button as glow', () => {
    const button: HTMLElement = fixture.nativeElement.querySelector('.home-open-source-button button');
    expect(button.getAttribute('p-kind')).toBe('glow');
  });

  it('should open the GitHub organization in a new tab', () => {
    spyOn(window, 'open');
    component.openExternalLink('https://github.com/po-ui');
    expect(window.open).toHaveBeenCalledWith('https://github.com/po-ui', '_blank', 'noopener,noreferrer');
  });
});
