import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoRichTextService } from './po-rich-text.service';

describe('Service: PoRichText', () => {
  let richTextService: PoRichTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoRichTextService]
    });

    richTextService = TestBed.inject(PoRichTextService);
  });

  it('should ...', inject([PoRichTextService], (service: PoRichTextService) => {
    expect(service).toBeTruthy();
  }));

  describe('Methods:', () => {
    it('emitModel: should call model.next with value', () => {
      const value = 'test';
      spyOn(richTextService['model'], 'next');
      richTextService.emitModel('test');

      expect(richTextService['model'].next).toHaveBeenCalledWith(value);
    });

    it('getModel: should call model.asObservable', () => {
      spyOn(richTextService['model'], 'asObservable');
      richTextService.getModel();

      expect(richTextService['model'].asObservable).toHaveBeenCalled();
    });

    it('getModel: should return an instanceof Observable', () => {
      const result = richTextService.getModel();

      expect(result instanceof Observable).toBeTruthy();
    });
  });
});
