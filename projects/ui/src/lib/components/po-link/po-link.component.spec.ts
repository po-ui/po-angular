import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoLinkComponent } from './po-link.component';

describe('PoLinkComponent', () => {
  let component: PoLinkComponent;
  let fixture: ComponentFixture<PoLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoLinkComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action', () => {
    spyOn(component.action, 'emit');

    component.onClick();
    expect(component.action.emit).toHaveBeenCalled();
  });

  it('should`t emit action if exists `url`', () => {
    component.url = 'https://po-ui.io/';
    spyOn(component.action, 'emit');

    component.onClick();
    expect(component.action.emit).not.toHaveBeenCalled();
  });
});
