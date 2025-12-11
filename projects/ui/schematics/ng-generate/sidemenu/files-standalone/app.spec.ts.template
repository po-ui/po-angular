import { TestBed } from '@angular/core/testing';

import { PoMenuModule, PoPageModule, PoToolbarModule } from '@po-ui/ng-components';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoToolbarModule, PoMenuModule, PoPageModule, App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
