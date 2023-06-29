/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PoSearchListComponent } from './po-search-list.component';

describe('PoSearchListComponent', () => {
  let component: PoSearchListComponent;
  let fixture: ComponentFixture<PoSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoSearchListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
