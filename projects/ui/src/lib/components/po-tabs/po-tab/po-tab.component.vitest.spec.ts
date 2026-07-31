import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';

import { PoTabsService } from '../po-tabs.service';
import { PoTabComponent } from './po-tab.component';

describe('PoTabComponent:', () => {
  let component: PoTabComponent;
  let fixture: ComponentFixture<PoTabComponent>;
  let tabsService: PoTabsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoTabComponent],
      providers: [PoTabsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTabComponent);
    component = fixture.componentInstance;
    tabsService = TestBed.inject(PoTabsService);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngAfterContentInit: shoud call `setDisplayOnActive`', () => {
      vi.spyOn(component as any, 'setDisplayOnActive').mockImplementation(() => {});
      component.ngAfterContentInit();
      expect(component['setDisplayOnActive']).toHaveBeenCalled();
    });

    it('setDisplayOnActive: should set `elementRef` display none if `active` is false', () => {
      component.active = false;
      component['setDisplayOnActive']();

      expect(component['elementRef'].nativeElement.style.display).toBe('none');
    });

    it('setDisplayOnActive: should set `elementRef` display empty if `active` is true', () => {
      component.active = true;
      component['setDisplayOnActive']();

      expect(component['elementRef'].nativeElement.style.display).toBe('');
    });

    it('should trigger onChanges after 100ms delay', async () => {
      vi.spyOn(tabsService, 'triggerOnChanges');

      const changes: SimpleChanges = {
        active: new SimpleChange(null, true, true)
      };

      component.ngOnChanges(changes);
      await new Promise(r => setTimeout(r, 150));

      expect(tabsService.triggerOnChanges).toHaveBeenCalled();
    });
  });
});
