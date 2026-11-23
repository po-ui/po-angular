import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule, provideRouter } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

import { HomeFooterComponent } from './home-footer.component';

describe('HomeFooterComponent', () => {
  let fixture: ComponentFixture<HomeFooterComponent>;
  let component: HomeFooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoModule, RouterModule],
      declarations: [HomeFooterComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should use the solid logo published in assets', () => {
    expect(fixture.nativeElement.querySelector('.home-footer-logo').getAttribute('src')).toBe(
      './assets/po-logos/po_color_solid.svg'
    );
  });

  it('should point the legal links to the project license in a new tab', () => {
    const links: Array<HTMLAnchorElement> = Array.from(fixture.nativeElement.querySelectorAll('a[href*="LICENSE"]'));
    expect(links.length).toBe(2);
    links.forEach(link => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('should navigate to the given route', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    component.openInternalLink('documentation');
    expect(navigate).toHaveBeenCalledWith(['/documentation']);
  });

  it('should link the internal items with routerLink', () => {
    const hrefs = Array.from(fixture.nativeElement.querySelectorAll('a.home-footer-link')).map((a: HTMLAnchorElement) =>
      a.getAttribute('href')
    );
    expect(hrefs).toContain('/guides/getting-started');
    expect(hrefs).toContain('/documentation');
  });
});
