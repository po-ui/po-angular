import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoImageComponent } from './po-image.component';

describe('PoImageComponent', () => {
  let component: PoImageComponent;
  let fixture: ComponentFixture<PoImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoImageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
