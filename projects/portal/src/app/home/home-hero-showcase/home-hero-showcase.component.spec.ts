import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  HOME_HERO_SHOWCASE_SAMPLE_NAMES,
  HomeHeroShowcaseSamplesComponent
} from './generated/home-hero-showcase-samples.component';
import { HomeHeroShowcaseComponent } from './home-hero-showcase.component';

describe('HomeHeroShowcaseComponent', () => {
  let fixture: ComponentFixture<HomeHeroShowcaseComponent>;
  let component: HomeHeroShowcaseComponent;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeroShowcaseSamplesComponent],
      declarations: [HomeHeroShowcaseComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeHeroShowcaseComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
  });

  afterEach(() => fixture.destroy());

  it('should be decorative: aria-hidden and inert', () => {
    fixture.detectChanges();
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.hasAttribute('inert')).toBeTrue();
  });

  it('should render the same cards three times for the endless loop, already filled in the first render', () => {
    fixture.detectChanges();
    const grids = host.querySelectorAll('.home-showcase-grid');
    const total = component.samples.length;
    expect(grids.length).toBe(3);
    grids.forEach(grid => {
      expect(grid.children.length).toBe(total);
      Array.from(grid.children).forEach(card => expect(card.querySelector('[class], [style]')).not.toBeNull());
    });
  });

  it('should keep the curated samples small', () => {
    expect(component.samples).toEqual(HOME_HERO_SHOWCASE_SAMPLE_NAMES);
    expect(component.samples.length).toBe(12);
    ['po-accordion', 'po-table', 'po-stepper', 'po-calendar', 'po-code-editor', 'po-chart'].forEach(heavy =>
      expect(component.samples).not.toContain(heavy)
    );
  });

  it('should not duplicate ids on the page', () => {
    fixture.detectChanges();
    expect(host.querySelectorAll('[id]').length).toBe(0);
  });

  it('should keep the checked radio of every copy', () => {
    fixture.detectChanges();
    const checked = Array.from(host.querySelectorAll<HTMLInputElement>('input[type="radio"]')).filter(
      radio => radio.checked
    );
    expect(checked.length).toBe(3);
  });

  it('should detach the view from change detection after the first render', () => {
    const detach = spyOn((component as any).cdr, 'detach').and.callThrough();
    fixture.detectChanges();
    expect(detach).toHaveBeenCalledTimes(1);
  });
});
