import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  HOME_HERO_SHOWCASE_SAMPLE_NAMES,
  HomeHeroShowcaseSamplesComponent
} from './generated/home-hero-showcase-samples.component';

describe('HomeHeroShowcaseSamplesComponent (generated)', () => {
  let fixture: ComponentFixture<HomeHeroShowcaseSamplesComponent>;
  let host: HTMLElement;

  const render = (name: string) => {
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();
    return host;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HomeHeroShowcaseSamplesComponent] }).compileComponents();
    fixture = TestBed.createComponent(HomeHeroShowcaseSamplesComponent);
    host = fixture.nativeElement;
  });

  it('should render only the sample of the given name', () => {
    render('po-tag');
    expect(host.querySelector('app-preview-po-tag')).not.toBeNull();
    expect(host.querySelector('app-preview-po-button')).toBeNull();
  });

  it('should render nothing for an unknown name', () => {
    render('po-unknown');
    expect(host.children.length).toBe(0);
  });

  it('should keep the po-* elements as plain elements (no PO UI component is created)', () => {
    render('po-button');
    const button = host.querySelector('po-button');
    expect(button).not.toBeNull();
    expect(button.constructor).toBe(HTMLElement);
    expect(button.querySelector('button.po-button')).not.toBeNull();
  });

  it('should keep the inline styles and the spaces between inline elements', () => {
    render('po-button');
    expect(host.querySelector('app-preview-po-button > div').getAttribute('style')).toContain('display: flex');
  });

  describe('safety of the generated template', () => {
    const renderAll = () =>
      HOME_HERO_SHOWCASE_SAMPLE_NAMES.map(name => {
        const element = document.createElement('div');
        fixture.componentRef.setInput('name', name);
        fixture.detectChanges();
        element.innerHTML = host.innerHTML;
        return element;
      });

    it('should have no script, iframe, object or embed', () => {
      renderAll().forEach(element => expect(element.querySelector('script, iframe, object, embed')).toBeNull());
    });

    it('should have no event attribute (on*)', () => {
      renderAll().forEach(element =>
        Array.from(element.querySelectorAll('*')).forEach(node =>
          Array.from(node.attributes).forEach(attribute =>
            expect(attribute.name).withContext(`${node.tagName} ${attribute.name}`).not.toMatch(/^on/i)
          )
        )
      );
    });

    it('should have no javascript: URL', () => {
      renderAll().forEach(element =>
        Array.from(element.querySelectorAll('*')).forEach(node =>
          Array.from(node.attributes).forEach(attribute =>
            expect(attribute.value)
              .withContext(`${node.tagName} ${attribute.name}`)
              .not.toMatch(/javascript\s*:/i)
          )
        )
      );
    });

    it('should have no ids, Angular attributes or field names', () => {
      renderAll().forEach(element => {
        expect(element.querySelectorAll('[id], [for], input[name], select[name], textarea[name]').length).toBe(0);
        expect(element.innerHTML).not.toMatch(/_ngcontent|_nghost|ng-reflect|<!--bindings/);
      });
    });
  });
});
