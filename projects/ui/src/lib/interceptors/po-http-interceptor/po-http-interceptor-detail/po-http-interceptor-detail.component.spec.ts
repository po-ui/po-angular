import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoAccordionModule } from '../../../components/po-accordion/po-accordion.module';
import { PoHttpInterceptorDetail } from './po-http-interceptor-detail.interface';
import { PoHttpInterceptorDetailComponent } from './po-http-interceptor-detail.component';
import { poHttpInterceptorDetailLiteralsDefault } from './po-http-interceptor-detail-literals.interface';
import { PoModalModule } from '../../../components/po-modal/po-modal.module';
import { PoTagModule } from '../../../components/po-tag/po-tag.module';

describe('PoHttpInterceptorDetailComponent:', () => {
  let component: PoHttpInterceptorDetailComponent;
  let fixture: ComponentFixture<PoHttpInterceptorDetailComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoHttpInterceptorDetailComponent],
      imports: [PoAccordionModule, PoModalModule, PoTagModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHttpInterceptorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;

    component['literals'] = poHttpInterceptorDetailLiteralsDefault['en'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('details: should update title', () => {
      const details = [
        { code: '200', detailedMessage: 'test 1', message: 'message 1', type: 'success' },
        { code: '201', detailedMessage: 'test 2', message: 'message 2', type: 'success' },
        { code: '400', detailedMessage: 'test 3', message: 'message 3', type: 'error' }
      ];

      component.detail = details;

      expect(component.title).toBe('Details (3)');
    });

    it('details: shouldn`t add details if it is undefined', () => {
      const details = undefined;

      component.detail = details;

      expect(component.details).toEqual([]);
    });

    it('details: should add details in this.details', () => {
      const details = [
        { code: '200', detailedMessage: 'test 1', message: 'message 1', type: 'success' },
        { code: '201', detailedMessage: 'test 2', message: 'message 2', type: 'success' },
        { code: '400', detailedMessage: 'test 3', message: 'message 3', type: 'error' }
      ];

      component.detail = details;

      expect(component.details).toEqual(details);
    });

    it('detail: should add detail in details without detail list', () => {
      const detail = {
        code: '200',
        detailedMessage: 'detailed message',
        message: 'my message',
        type: 'success',
        details: [{ code: '200', detailedMessage: 'test 1', message: 'message 1', type: 'success' }]
      };

      const expectedDetails = [
        {
          code: '200',
          detailedMessage: 'detailed message',
          message: 'my message',
          type: 'success'
        }
      ];
      component.details = [];

      component.detail = [detail];

      expect(component.details).toEqual(expectedDetails);
    });

    it('primaryAction: should call `close` when call primaryAction.action', () => {
      spyOn(component, 'close');

      component.primaryAction.action();

      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('Methods', () => {
    it('close: should call modal.close and closed.emit', () => {
      spyOn(component.modal, 'close');
      spyOn(component['closed'], 'emit');

      component.close();

      expect(component.modal.close).toHaveBeenCalled();
      expect(component['closed'].emit).toHaveBeenCalled();
    });

    it('open: should call modal.open', () => {
      spyOn(component.modal, 'open');

      component.open();

      expect(component.modal.open).toHaveBeenCalled();
    });

    it('typeColor: should return color `color-11` if type is `success`', () => {
      const type = 'success';

      expect(component.typeColor(type)).toBe('color-11');
    });

    it('typeColor: should return color `color-08` if type is `warning`', () => {
      const type = 'warning';

      expect(component.typeColor(type)).toBe('color-08');
    });

    it('typeColor: should return color `color-07` if type is `error`', () => {
      const type = 'error';

      expect(component.typeColor(type)).toBe('color-07');
    });

    it('typeColor: should return empty string if type is `info`', () => {
      const type = 'info';

      expect(component.typeColor(type)).toBe('');
    });

    it('getValidDetailProperties: should return detail without invalid properties', () => {
      const detail = {
        code: '200',
        detailedMessage: 'test 1',
        message: 'message 1',
        type: 'success',
        details: [],
        _messages: []
      };

      const expectedDetail = {
        code: '200',
        detailedMessage: 'test 1',
        message: 'message 1',
        type: 'success'
      };

      expect(component['getValidDetailProperties'](detail)).toEqual(expectedDetail);
    });

    it('formatTitle: should return literals.detail if details length is 1', () => {
      const details = [{ code: '200', detailedMessage: 'test 1', message: 'message 1', type: 'success' }];

      component['literals'].detail = 'Detail';

      expect(component['formatTitle'](details)).toBe(component['literals'].detail);
    });

    it('formatTitle: should return literals.details and details legth if details length isn`t 1', () => {
      const details = [
        { code: '200', detailedMessage: 'test 1', message: 'message 1', type: 'success' },
        { code: '201', detailedMessage: 'test 2', message: 'message 2', type: 'success' },
        { code: '400', detailedMessage: 'test 3', message: 'message 3', type: 'error' }
      ];

      component['literals'].details = 'Details';

      const expectedTitle = 'Details (3)';

      expect(component['formatTitle'](details)).toBe(expectedTitle);
    });

    it('formatDetailItemTitle: should return detail message if code is undefined', () => {
      const detail: PoHttpInterceptorDetail = {
        message: 'message',
        code: undefined,
        detailedMessage: ''
      };

      expect(component['formatDetailItemTitle'](detail)).toBe('message');
    });

    it('formatDetailItemTitle: should return detail message and code if code is defined', () => {
      const detail: PoHttpInterceptorDetail = {
        message: 'message',
        code: '1000',
        detailedMessage: ''
      };

      expect(component['formatDetailItemTitle'](detail)).toBe('1000 - message');
    });

    it('typeValue: should return type if poHttpInterceptorDetailLiteralsDefault not contain type', () => {
      const type = 'test';

      expect(component.typeValue(type)).toBe('test');
    });
  });

  describe('Templates:', () => {
    it('should contain three details if the length of the details is three', () => {
      const details = [
        { code: '200', detailedMessage: 'test 1', message: 'message 1', type: 'success' },
        { code: '201', detailedMessage: 'test 2', message: 'message 2', type: 'success' },
        { code: '400', detailedMessage: 'test 3', message: 'message 3', type: 'error' }
      ];

      component.open();
      component.detail = details;

      fixture.detectChanges();

      const detailsElement = nativeElement.querySelectorAll('.po-accordion-item');

      expect(detailsElement.length).toBe(3);
    });

    it('shouldn`t show detail if message is undefined', () => {
      const details = [
        { code: '200', detailedMessage: 'test 1', message: 'message 1', type: 'success' },
        { code: '201', detailedMessage: 'test 2', message: undefined, type: 'success' },
        { code: '400', detailedMessage: 'test 3', message: 'message 3', type: 'error' }
      ];

      component.open();
      component.detail = details;

      fixture.detectChanges();

      const detailsElement = nativeElement.querySelectorAll('.po-accordion-item');

      expect(detailsElement.length).toBe(2);
    });

    it('shouldn`t contain `po-tag` if detail.type is undefined', () => {
      const details = [{ code: '200', detailedMessage: 'test 1', message: 'message 1' }];

      component.open();
      component.detail = details;

      fixture.detectChanges();

      const tag = nativeElement.querySelector('po-tag');

      expect(tag).toBeNull();
    });

    it('should contain `po-tag` if detail.type is defined', () => {
      const details = [{ code: '200', detailedMessage: 'test 1', message: 'message 1', type: 'success' }];

      component.open();
      component.detail = details;

      fixture.detectChanges();

      const tag = nativeElement.querySelector('po-tag');

      expect(tag).toBeDefined();
    });
  });
});
