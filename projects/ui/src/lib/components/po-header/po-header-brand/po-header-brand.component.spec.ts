import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoHeaderbrandComponent } from './po-header-brand.component';

describe('PoHeaderbrandComponent', () => {
  let component: PoHeaderbrandComponent;
  let fixture: ComponentFixture<PoHeaderbrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoHeaderbrandComponent],
      providers: [ChangeDetectorRef]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHeaderbrandComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should recalculate showTitleTooltip in ngOnChanges when brand changes', () => {
    spyOn(component['cd'], 'detectChanges');

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
});
