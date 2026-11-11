import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });

  it('should render the six sections in order inside the po-page-default', () => {
    const page: Element = fixture.nativeElement.querySelector('po-page-default');
    const tags = Array.from(page.children).map((el: Element) => el.tagName.toLowerCase());
    expect(tags).toEqual([
      'app-home-hero',
      'app-home-benefits',
      'app-home-statement',
      'app-home-features',
      'app-home-open-source',
      'app-home-footer'
    ]);
  });
});
