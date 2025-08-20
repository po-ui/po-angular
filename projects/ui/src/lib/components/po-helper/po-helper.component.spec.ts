import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoHelperComponent } from './po-helper.component';

describe('PoHelperComponent', () => {
  let component: PoHelperComponent;
  let fixture: ComponentFixture<PoHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoHelperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
