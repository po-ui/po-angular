import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoLinkComponent } from './po-link.component';

describe('PoLinkComponent', () => {
  let component: PoLinkComponent;
  let fixture: ComponentFixture<PoLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoLinkComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action', () => {
    const emitSpy = vi.spyOn(component.action, 'emit');

    component.onClick();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should`t emit action if exists `url`', () => {
    component.url = 'https://po-ui.io/';
    const emitSpy = vi.spyOn(component.action, 'emit');

    component.onClick();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
