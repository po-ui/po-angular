import { PoPageDynamicOptionsSchema } from './po-page-dynamic-options.interface';
import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { PoPageCustomizationService } from './po-page-customization.service';
import { PoPageDynamicSearchOptions } from '../../components/po-page-dynamic-search/po-page-dynamic-search-options.interface';

const originalPageOptions: PoPageDynamicSearchOptions = {
  title: 'Original Title',
  breadcrumb: {
    items: [{ label: 'Home' }, { label: 'Hiring processes' }]
  },
  actions: [
    { label: 'Feature 1', url: '/feature1' },
    { label: 'Feature 2', url: '/feature2' }
  ],
  filters: [{ property: 'filter1' }, { property: 'filter2' }]
};

const newPageOptions: PoPageDynamicSearchOptions = {
  title: 'New Title',
  breadcrumb: {
    items: [{ label: 'Test' }, { label: 'Test2' }],
    favorite: 'teste/teste'
  },
  actions: [
    { label: 'Feature 1', url: '/new-feature1' },
    { label: 'Feature 3', url: '/new-feature3' }
  ],
  filters: [{ property: 'filter1' }, { property: 'filter3' }]
};

const mergedPageOptions: PoPageDynamicSearchOptions = {
  title: 'New Title',
  breadcrumb: {
    items: [{ label: 'Test' }, { label: 'Test2' }],
    favorite: 'teste/teste'
  },
  actions: [
    { label: 'Feature 1', url: '/new-feature1' },
    { label: 'Feature 2', url: '/feature2' },
    { label: 'Feature 3', url: '/new-feature3' }
  ],
  filters: [{ property: 'filter1' }, { property: 'filter2' }, { property: 'filter3' }]
};

const pageOptionSchema: PoPageDynamicOptionsSchema<PoPageDynamicSearchOptions> = {
  schema: [
    {
      nameProp: 'filters',
      merge: true,
      keyForMerge: 'property'
    },
    {
      nameProp: 'actions',
      merge: true,
      keyForMerge: 'label'
    },
    {
      nameProp: 'breadcrumb',
      merge: true
    },
    {
      nameProp: 'title'
    }
  ]
};

function customOptionFunctionMock(): PoPageDynamicSearchOptions {
  return newPageOptions;
}

describe('PoPageCustomizationService:', () => {
  let poPageCustomizationService: PoPageCustomizationService;
  let httpMock: HttpTestingController;
  const statusOptions = [
    { value: '1', label: 'Hired' },
    { value: '2', label: 'Progress' },
    { value: '3', label: 'Canceled' }
  ];

  const jobDescriptionOptions = [
    { value: 'abc', label: 'Systems Analyst' },
    { value: 'def', label: 'Trainee' },
    { value: 'ghi', label: 'Programmer' },
    { value: 'jkl', label: 'Web developer' },
    { value: 'mno', label: 'Recruiter' },
    { value: 'pqr', label: 'Consultant' },
    { value: 'stu', label: 'DBA' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageCustomizationService]
    });

    poPageCustomizationService = TestBed.inject(PoPageCustomizationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poPageCustomizationService instanceof PoPageCustomizationService).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('changeOriginalOptionsToNewOptions:should change a object props based on new option', () => {
      const objectToChange = {
        stringTest: 'Original Title',
        numberTest: 2,
        objectTest: { prop3: 'Test' },
        arrayTest: [1, 2, 3],
        noChangeTest: 'No Change!',
        nullObj: 'test'
      };

      const newOption = {
        stringTest: 'New Title',
        numberTest: 5,
        objectTest: { prop3: 'new' },
        arrayTest: [7, 8, 9],
        noDiference: 'it will not go to original object!',
        nullObj: undefined
      };

      const result = {
        stringTest: 'New Title',
        numberTest: 5,
        objectTest: { prop3: 'new' },
        arrayTest: [7, 8, 9],
        noChangeTest: 'No Change!',
        nullObj: 'test'
      };

      poPageCustomizationService.changeOriginalOptionsToNewOptions(objectToChange, newOption);
      expect(objectToChange).toEqual(result);
    });

    describe('getCustomOptions:', () => {
      it(
        'should get customized option from a function',
        waitForAsync(() => {
          poPageCustomizationService
            .getCustomOptions(customOptionFunctionMock, originalPageOptions, pageOptionSchema)
            .subscribe(optionResult => {
              expect(optionResult).toEqual(mergedPageOptions);
            });
        })
      );

      it('should get customized option from a url', fakeAsync(() => {
        testUrl(originalPageOptions, newPageOptions, mergedPageOptions);
      }));

      it('should keep the original title and breadcrumb if url do not return it', fakeAsync(() => {
        const originalOption: PoPageDynamicSearchOptions = {
          title: 'Original Title',
          breadcrumb: {
            items: [{ label: 'Home' }, { label: 'Hiring processes' }]
          }
        };
        const newOption: PoPageDynamicSearchOptions = {
          filters: [{ property: 'filter1' }, { property: 'filter3' }]
        };
        const mergedOptions: PoPageDynamicSearchOptions = {
          title: 'Original Title',
          breadcrumb: {
            items: [{ label: 'Home' }, { label: 'Hiring processes' }]
          },
          filters: [{ property: 'filter1' }, { property: 'filter3' }]
        };

        testUrl(originalOption, newOption, mergedOptions);
      }));

      it('should keep the original action if url do not return it', fakeAsync(() => {
        const originalOption: PoPageDynamicSearchOptions = {
          actions: [
            { label: 'Feature 1', url: '/feature1' },
            { label: 'Feature 2', url: '/feature2' }
          ]
        };
        const newOption: PoPageDynamicSearchOptions = {};
        const mergedOptions: PoPageDynamicSearchOptions = {
          actions: [
            { label: 'Feature 1', url: '/feature1' },
            { label: 'Feature 2', url: '/feature2' }
          ]
        };

        testUrl(originalOption, newOption, mergedOptions);
      }));

      it('should keep the original filter if url do not return it', fakeAsync(() => {
        const originalOption: PoPageDynamicSearchOptions = {
          filters: [{ property: 'filter1' }, { property: 'filter3' }]
        };
        const newOption: PoPageDynamicSearchOptions = {};
        const mergedOptions: PoPageDynamicSearchOptions = {
          filters: [{ property: 'filter1' }, { property: 'filter3' }]
        };

        testUrl(originalOption, newOption, mergedOptions);
      }));

      it('should deep merge the objects inside arrays.', fakeAsync(() => {
        const originalOption: PoPageDynamicSearchOptions = {
          filters: [
            { property: 'hireStatus', label: 'Hire Status', options: statusOptions, gridColumns: 6 },
            { property: 'name', gridColumns: 6 },
            { property: 'city', gridColumns: 6 },
            { property: 'job', label: 'Job Description', options: jobDescriptionOptions, gridColumns: 6 }
          ]
        };
        const newOption: PoPageDynamicSearchOptions = {
          filters: [{ property: 'hireStatus', gridColumns: 12 }]
        };
        const mergedOptions: PoPageDynamicSearchOptions = {
          filters: [
            { property: 'hireStatus', label: 'Hire Status', options: statusOptions, gridColumns: 12 },
            { property: 'name', gridColumns: 6 },
            { property: 'city', gridColumns: 6 },
            { property: 'job', label: 'Job Description', options: jobDescriptionOptions, gridColumns: 6 }
          ]
        };

        testUrl(originalOption, newOption, mergedOptions);
      }));

      function testUrl(
        originalOption: PoPageDynamicSearchOptions,
        newOption: PoPageDynamicSearchOptions,
        mergedOptions: PoPageDynamicSearchOptions
      ) {
        const url = '/test/api';
        poPageCustomizationService.getCustomOptions(url, originalOption, pageOptionSchema).subscribe(optionResult => {
          expect(optionResult).toEqual(mergedOptions);
        });

        const req = httpMock.expectOne(request => request.method === 'POST' && request.url === url);
        expect(req.request.method).toBe('POST');

        req.flush(newOption);

        tick();
      }
    });
  });
});
