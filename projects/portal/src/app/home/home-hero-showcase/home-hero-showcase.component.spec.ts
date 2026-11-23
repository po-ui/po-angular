import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoModule } from '@po-ui/ng-components';

import { HomeHeroShowcaseComponent } from './home-hero-showcase.component';

describe('HomeHeroShowcaseComponent', () => {
  let fixture: ComponentFixture<HomeHeroShowcaseComponent>;
  let component: HomeHeroShowcaseComponent;
  let host: HTMLElement;

  const cardsWithSample = () =>
    Array.from(host.querySelectorAll('.home-showcase-card')).filter(card =>
      Array.from(card.children).some(child => child.tagName.toLowerCase().startsWith('app-preview'))
    ).length;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoModule],
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

  it('should render the same cards three times for the endless loop, each with a skeleton', () => {
    fixture.detectChanges();
    const grids = host.querySelectorAll('.home-showcase-grid');
    const total = component.samples.length;
    expect(grids.length).toBe(3);
    grids.forEach(grid => expect(grid.children.length).toBe(total));
    expect(host.querySelectorAll('.home-showcase-skeleton').length).toBe(total * 3);
  });

  it('should keep the curated samples small', () => {
    expect(component.samples.length).toBe(12);
    ['po-accordion', 'po-table', 'po-stepper', 'po-calendar', 'po-code-editor', 'po-chart'].forEach(heavy =>
      expect(component.samples).not.toContain(heavy)
    );
  });

  it('should detach the view from change detection after the first render', () => {
    const detach = spyOn((component as any).cdr, 'detach').and.callThrough();
    fixture.detectChanges();
    expect(detach).toHaveBeenCalledTimes(1);
  });

  describe('reveal', () => {
    const stage = () => {
      const staged = component.samples.map((name, index) => {
        const element = document.createElement(`app-preview-${name}`);
        element.innerHTML = `<label for="field-${index}">Field</label><input id="field-${index}" aria-describedby="field-${index}">`;
        return element;
      });
      fixture.detectChanges();
      return staged;
    };

    it('should put the elements in the first copy and clones in the others, all in one step', () => {
      const staged = stage();
      component.reveal(staged);

      expect(cardsWithSample()).toBe(component.samples.length * 3);
      const grids = host.querySelectorAll('.home-showcase-grid');
      expect(grids[0].children[0].querySelector(`app-preview-${component.samples[0]}`)).toBe(staged[0]);
      expect(grids[1].children[0].querySelector(`app-preview-${component.samples[0]}`)).not.toBe(staged[0]);
    });

    it('should not duplicate ids (nor id references) in the clones', () => {
      const staged = stage();
      component.reveal(staged);

      const ids = Array.from(host.querySelectorAll('[id]')).map(element => element.id);
      expect(ids.length).toBe(component.samples.length);
      expect(new Set(ids).size).toBe(ids.length);
      const grids = host.querySelectorAll('.home-showcase-grid');
      const clone = grids[2].children[0];
      expect(clone.querySelector('[for]')).toBeNull();
      expect(clone.querySelector('[aria-describedby]')).toBeNull();
    });

    it('should hide the skeleton of the cards that received the sample', () => {
      const staged = stage();
      component.reveal(staged);
      const skeletons = Array.from(host.querySelectorAll('.home-showcase-skeleton'));
      skeletons.forEach(skeleton => expect(getComputedStyle(skeleton).display).toBe('none'));
    });
  });

  describe('whenScrollQuiet', () => {
    it('should resolve at once when nothing is scrolling', async () => {
      const started = performance.now();
      await component.whenScrollQuiet(50);
      expect(performance.now() - started).toBeLessThan(40);
    });

    it('should wait while the page is being scrolled', async () => {
      (component as any).watchScroll();
      document.dispatchEvent(new Event('scroll'));
      const started = performance.now();
      await component.whenScrollQuiet(80);
      expect(performance.now() - started).toBeGreaterThanOrEqual(70);
      (component as any).stopWatchingScroll();
    });
  });

  it('should create the 12 samples one by one and reveal them in the three copies', async () => {
    fixture.detectChanges();

    const limit = Date.now() + 8000;
    while (cardsWithSample() < component.samples.length * 3 && Date.now() < limit) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    expect(cardsWithSample()).toBe(component.samples.length * 3);
    expect(host.querySelector('.home-showcase-staging').children.length).toBe(0);
  }, 12000);
});
