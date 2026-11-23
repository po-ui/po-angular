import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoModule } from '@po-ui/ng-components';

import { HomeIllustrationSlotComponent } from '../home-illustration-slot/home-illustration-slot.component';
import { HomeFeaturesComponent } from './home-features.component';

describe('HomeFeaturesComponent', () => {
  let fixture: ComponentFixture<HomeFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoModule],
      declarations: [HomeFeaturesComponent, HomeIllustrationSlotComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeFeaturesComponent);
    fixture.detectChanges();
  });

  it('should render two columns with their illustration slots', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.home-features-column').length).toBe(2);
    expect(el.querySelector('[data-illustration="features-illustration-left"]')).not.toBeNull();
    expect(el.querySelector('[data-illustration="features-illustration-right"]')).not.toBeNull();
  });

  it('should render the section title', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('tudo permanece conectado');
  });
});
