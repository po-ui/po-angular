import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PoTabsService } from '../po-tabs.service';
import { PoTabComponent } from './po-tab.component';

describe('PoTabComponent:', () => {
  let component: PoTabComponent;
  let fixture: ComponentFixture<PoTabComponent>;
  let tabsService: PoTabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoTabComponent],
      providers: [PoTabsService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTabComponent);
    component = fixture.componentInstance;
    tabsService = TestBed.inject(PoTabsService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngAfterContentInit: shoud call `setDisplayOnActive`', () => {
      spyOn(component, <any>'setDisplayOnActive');
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

    it('should trigger onChanges after 100ms delay', fakeAsync(() => {
      spyOn(tabsService, 'triggerOnChanges');

      component.ngOnChanges();
      tick(101);

      expect(tabsService.triggerOnChanges).toHaveBeenCalled();
    }));
  });
});
