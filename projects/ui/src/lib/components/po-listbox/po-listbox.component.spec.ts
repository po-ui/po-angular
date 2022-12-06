import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoListBoxComponent } from './po-listbox.component';

describe('PoListBoxComponent', () => {
  let component: PoListBoxComponent;
  let fixture: ComponentFixture<PoListBoxComponent>;

  let nativeElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoListBoxComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('ngAfterViewInit:', () => {
      it('should have been called', () => {
        spyOn(component, <any>'setListBoxMaxHeight');

        component.ngAfterViewInit();

        expect(component['setListBoxMaxHeight']).toHaveBeenCalled();
      });
    });
    describe('ngOnChanges:', () => {
      it(`should call 'setListBoxMaxHeight' when has changes`, () => {
        spyOn(component, <any>'setListBoxMaxHeight');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 }
        ];

        component.ngOnChanges({
          items: new SimpleChange(null, component.items, true)
        });

        expect(component['setListBoxMaxHeight']).toHaveBeenCalled();
      });

      it(`should'n call 'setListBoxMaxHeight' when has changes`, () => {
        spyOn(component, <any>'setListBoxMaxHeight');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 }
        ];

        component.ngOnChanges();

        expect(component['setListBoxMaxHeight']).not.toHaveBeenCalled();
      });
    });
    describe('setListBoxMaxHeight', () => {
      it('should be call `renderer.setStyle` when has more than 6 items', () => {
        spyOn<any>(component['renderer'], 'setStyle');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 },
          { label: 'Item 4', value: 4 },
          { label: 'Item 5', value: 5 },
          { label: 'Item 6', value: 6 },
          { label: 'Item 7', value: 7 }
        ];

        component['setListBoxMaxHeight']();

        expect(component['renderer'].setStyle).toHaveBeenCalled();
      });

      it(`should'n be call 'renderer.setStyle' when has less then 6 items`, () => {
        spyOn<any>(component['renderer'], 'setStyle');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 }
        ];

        component['setListBoxMaxHeight']();

        expect(component['renderer'].setStyle).not.toHaveBeenCalled();
      });
    });
    describe('onSelectItem:', () => {
      it('should be emit selectItem', () => {
        spyOn(component.selectItem, 'emit');
        const item = { label: 'a', value: 'a' };

        component.onSelectItem(item);

        expect(component.selectItem.emit).toHaveBeenCalledWith(item);
      });
    });
  });

  describe('Templates:', () => {
    it('should be show listbox when has items', () => {
      const items = [
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' },
        { label: 'c', value: 'c' },
        { label: 'd', value: 'd' }
      ];
      component.items = items;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-listbox-item')).toBeTruthy();
    });
    it('should be show `no itens message` when has items', () => {
      const items = undefined;
      component.items = items;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-listbox-item')).toBeFalsy();
      expect(nativeElement.querySelector('.po-listbox-no-items')).toBeTruthy();
    });
  });
});
