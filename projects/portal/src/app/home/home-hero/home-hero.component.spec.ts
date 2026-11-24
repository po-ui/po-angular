import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { PoModule } from '@po-ui/ng-components';

import { HomeBannerService } from '../home-banner/home-banner.service';
import { HomeHeroShowcaseSamplesComponent } from '../home-hero-showcase/generated/home-hero-showcase-samples.component';
import { HomeHeroShowcaseComponent } from '../home-hero-showcase/home-hero-showcase.component';
import { HomeHeroComponent } from './home-hero.component';

describe('HomeHeroComponent', () => {
  let fixture: ComponentFixture<HomeHeroComponent>;
  let component: HomeHeroComponent;
  let service: jasmine.SpyObj<HomeBannerService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    service = jasmine.createSpyObj('HomeBannerService', ['getRepoData']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    service.getRepoData.and.returnValue(of({ stargazers_count: 1234 }));

    await TestBed.configureTestingModule({
      imports: [PoModule, HomeHeroShowcaseSamplesComponent],
      declarations: [HomeHeroComponent, HomeHeroShowcaseComponent],
      providers: [
        { provide: HomeBannerService, useValue: service },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeHeroComponent);
    component = fixture.componentInstance;
  });

  it('should render the stargazers count from the service', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.home-hero-tag-link').textContent).toContain('Star 1234');
  });

  it('should keep the tag as a link with the fallback text when the request fails', () => {
    service.getRepoData.and.returnValue(throwError(() => new Error('offline')));
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.home-hero-tag-link');
    expect(link.textContent.trim()).toBe('Star');
    expect(link.getAttribute('href')).toBe('https://github.com/po-ui/po-angular');
  });

  it('should open the repository in a new tab with noopener', () => {
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.home-hero-tag-link');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render the explore button as secondary', () => {
    fixture.detectChanges();
    const button: HTMLElement = fixture.nativeElement.querySelector('.home-hero-explore');
    expect(button.querySelector('button').getAttribute('p-kind')).toBe('secondary');
  });

  it('should render the main button as glow with the configured label', () => {
    fixture.detectChanges();
    const button: HTMLElement = fixture.nativeElement.querySelector('.home-hero-primary');
    expect(button.querySelector('button').getAttribute('p-kind')).toBe('glow');
    expect(button.textContent).toContain('Comece com o PO UI');
  });

  it('should keep the Google badge hidden by default and show it when the flag is on', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.home-hero-badge')).toBeNull();

    component.showDevLibraryBadge = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.home-hero-badge img').getAttribute('alt')).toBe('Google');
  });

  it('should render the hero showcase instead of the illustration slot', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-home-hero-showcase.home-hero-preview')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-illustration="hero-preview"]')).toBeNull();
  });

  it('should navigate to the given route', () => {
    component.openInternalLink('documentation');
    expect(router.navigate).toHaveBeenCalledWith(['/documentation']);
  });
});
