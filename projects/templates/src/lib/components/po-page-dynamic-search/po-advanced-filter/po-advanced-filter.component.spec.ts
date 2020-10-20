import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PoDynamicModule, PoFieldModule, PoModalModule } from '@po-ui/ng-components';

import { PoAdvancedFilterBaseComponent } from './po-advanced-filter-base.component';
import { PoAdvancedFilterComponent } from './po-advanced-filter.component';

describe('PoAdvancedFilterComponent', () => {
  let component: PoAdvancedFilterComponent;
  let fixture: ComponentFixture<PoAdvancedFilterComponent>;
  let filters: Array<any>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, PoDynamicModule, PoFieldModule, PoModalModule],
        declarations: [PoAdvancedFilterComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoAdvancedFilterComponent);
    component = fixture.componentInstance;

    filters = [
      { property: 'name', label: 'Name' },
      { property: 'birthdate', label: 'Birthdate' },
      { property: 'genre', label: 'Genre' },
      { property: undefined }
    ];

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoAdvancedFilterBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('open: should call `poModal.open` and set `filter` with {} if `this.keepFilters` is false', () => {
      component.filter = filters;
      component.keepFilters = false;

      spyOn(component.poModal, 'open');

      component.open();

      expect(component.poModal.open).toHaveBeenCalled();
      expect(component.filter).toEqual({});
    });

    it(`open: should call 'poModal.open', call 'getInitialValuesFromFilters' and set 'filter' with
    initial values if 'this.keepFilters' is true`, () => {
      const expectedFilters = [{ property: 'city', initValue: 'Ontario' }];
      const expectedFilter = { city: 'Ontario' };

      spyOn(component.poModal, 'open');
      spyOn(component, <any>'getInitialValuesFromFilter').and.returnValue(expectedFilter);

      component.filter = filters;
      component.filters = expectedFilters;
      component.keepFilters = true;

      component.open();

      expect(component.poModal.open).toHaveBeenCalled();
      expect(component['getInitialValuesFromFilter']).toHaveBeenCalledWith(expectedFilters);
      expect(component.filter).toEqual(expectedFilter);
    });

    it(`getInitialValuesFromFilters: should return initial values from filter`, () => {
      const expectedFilters = [{ property: 'city', initValue: 'Ontario' }];
      const expectedFilter = { city: 'Ontario' };

      component.filters = expectedFilters;
      component.keepFilters = true;

      const getInitialValues = component['getInitialValuesFromFilter'](component.filters);

      expect(getInitialValues).toEqual(expectedFilter);
    });

    it('ngOnInit: should call `optionsServiceSubscribe`', () => {
      const spyOptionsServiceSubscribe = spyOn(component, <any>'optionsServiceSubscribe');

      component.ngOnInit();

      expect(spyOptionsServiceSubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should call subscription.unsubscribe', () => {
      const spyUnsubscribe = spyOn(component['subscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(spyUnsubscribe).toHaveBeenCalled();
    });

    describe('optionsServiceSubscribe: ', () => {
      it(`should append the received value from dynamicForm into 'optionsServiceChosenOptions' 
        if it's different from undefined and if it does not already exist`, () => {
        const objectValue = { label: 'Vancouver', value: 12345 };
        component['optionsServiceChosenOptions'] = [{ label: 'Toronto', value: 12312 }];

        const expectedResult = [...component['optionsServiceChosenOptions'], objectValue];

        spyOn(component.poDynamicForm, 'getObjectValue').and.returnValue(of(objectValue));

        component['optionsServiceSubscribe']();

        expect(component['optionsServiceChosenOptions']).toEqual(expectedResult);
      });

      it(`shouldn't append the received value from dynamicForm into 'optionsServiceChosenOptions' 
        if it already exists`, () => {
        const objectValue = { label: 'Vancouver', value: 12345 };
        component['optionsServiceChosenOptions'] = [objectValue];

        spyOn(component.poDynamicForm, 'getObjectValue').and.returnValue(of(objectValue));

        component['optionsServiceSubscribe']();

        expect(component['optionsServiceChosenOptions']).toEqual([objectValue]);
      });

      it(`shouldn't append the received value from dynamicForm into 'optionsServiceChosenOptions' 
        if it is undefined`, () => {
        const objectValue = { label: 'Vancouver', value: 12345 };
        component['optionsServiceChosenOptions'] = [objectValue];

        spyOn(component.poDynamicForm, 'getObjectValue').and.returnValue(of(undefined));

        component['optionsServiceSubscribe']();

        expect(component['optionsServiceChosenOptions']).toEqual([objectValue]);
      });
    });
  });
});
