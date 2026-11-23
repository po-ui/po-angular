import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { PoModule } from '@po-ui/ng-components';

import { HomeBannerService } from '../home-banner/home-banner.service';
import { HomeIllustrationSlotComponent } from '../home-illustration-slot/home-illustration-slot.component';
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
      imports: [PoModule],
      declarations: [HomeHeroComponent, HomeIllustrationSlotComponent],
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
    expect(fixture.nativeElement.querySelector('.home-hero-stars').textContent).toContain('1234');
  });

  it('should hide the stars block when the request fails', () => {
    service.getRepoData.and.returnValue(throwError(() => new Error('offline')));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.home-hero-stars')).toBeNull();
  });

  it('should keep the Google badge hidden by default and show it when the flag is on', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.home-hero-badge')).toBeNull();

    component.showDevLibraryBadge = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.home-hero-badge img').getAttribute('alt')).toBe('Google');
  });

  it('should render the hero preview slot', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-illustration="hero-preview"]')).not.toBeNull();
  });

  it('should navigate to the given route', () => {
    component.openInternalLink('documentation');
    expect(router.navigate).toHaveBeenCalledWith(['/documentation']);
  });
});
