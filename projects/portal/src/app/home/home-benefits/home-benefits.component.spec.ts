import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoModule } from '@po-ui/ng-components';

import { HomeBenefitsComponent } from './home-benefits.component';

describe('HomeBenefitsComponent', () => {
  let fixture: ComponentFixture<HomeBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoModule],
      declarations: [HomeBenefitsComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeBenefitsComponent);
    fixture.detectChanges();
  });

  it('should render the title and the three benefit cards', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2').textContent).toContain('Sua equipe não precisa começar do zero');
    expect(el.querySelectorAll('.home-benefits-card').length).toBe(3);
  });
});
