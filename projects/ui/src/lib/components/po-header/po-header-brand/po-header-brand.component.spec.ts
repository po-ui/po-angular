import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PoUtils as util } from '../../../utils/util';
import { PoHeaderbrandComponent } from './po-header-brand.component';

describe('PoHeaderbrandComponent', () => {
  let router: Router;
  let component: PoHeaderbrandComponent;
  let fixture: ComponentFixture<PoHeaderbrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoHeaderbrandComponent],
      providers: [ChangeDetectorRef, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHeaderbrandComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set smallLogo to true if width is smaller than 960', fakeAsync(() => {
    component.ngAfterViewInit();

    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true, configurable: true });
    window.dispatchEvent(new Event('resize'));

    tick(200);
    expect(component.smallLogo).toBe(true);
  }));

  it('should set smallLogo to false if width is bigger than 960', fakeAsync(() => {
    component.ngAfterViewInit();

    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true, configurable: true });
    window.dispatchEvent(new Event('resize'));

    tick(200);
    expect(component.smallLogo).toBe(false);
  }));

  it('should recalculate showTitleTooltip in ngOnChanges when brand changes', () => {
    vi.spyOn(component['cd'] as any, 'detectChanges');

    component.ngOnChanges({
      brand: {
        currentValue: { logo: 'logo.png', title: 'Test Brand' },
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component['cd'].detectChanges).toHaveBeenCalled();
  });

  it('should open external link if brand link is external link', () => {
    component.brand = { link: 'http://external.com' };

    vi.spyOn(util as any, 'isExternalLink').mockReturnValue(true);
    const windowSpy = vi.spyOn(window as any, 'open');

    component.onClickLogo();

    expect(util.isExternalLink).toHaveBeenCalledWith(component.brand.link);
    expect(windowSpy).toHaveBeenCalledWith(component.brand.link, '_blank');
  });

  it('should open intenral link if brand link is internal link', () => {
    component.brand = { link: '/test' };

    vi.spyOn(util as any, 'isExternalLink').mockReturnValue(false);
    const routerSpy = vi.spyOn(router as any, 'navigateByUrl');

    component.onClickLogo();

    expect(util.isExternalLink).toHaveBeenCalledWith(component.brand.link);
    expect(routerSpy).toHaveBeenCalledWith(component.brand.link);
  });
});
