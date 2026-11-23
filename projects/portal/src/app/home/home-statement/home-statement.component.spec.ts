import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeIllustrationSlotComponent } from '../home-illustration-slot/home-illustration-slot.component';
import { HomeStatementComponent } from './home-statement.component';

describe('HomeStatementComponent', () => {
  let fixture: ComponentFixture<HomeStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeStatementComponent, HomeIllustrationSlotComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeStatementComponent);
    fixture.detectChanges();
  });

  it('should highlight PO-UI in the statement', () => {
    expect(fixture.nativeElement.querySelector('.home-statement-highlight').textContent).toBe('PO-UI');
  });

  it('should render the five illustration slots hidden from assistive technologies', () => {
    const slots = fixture.nativeElement.querySelectorAll('app-home-illustration-slot');
    expect(slots.length).toBe(5);
    slots.forEach((slot: HTMLElement) => expect(slot.getAttribute('aria-hidden')).toBe('true'));
  });
});
