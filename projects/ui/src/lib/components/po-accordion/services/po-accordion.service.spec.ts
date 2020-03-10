import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoAccordionService } from './po-accordion.service';

describe('PoAccordionService:', () => {
  let accordionService: PoAccordionService;

  const accordionItem = {
    label: 'Accordion 1'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoAccordionService]
    });

    accordionService = TestBed.inject(PoAccordionService);
  });

  describe('Methods:', () => {
    it('should call subjectChild.next with accordionItem in sendToParentAccordionItemClicked', () => {
      spyOn(accordionService['subjectChild'], 'next');
      accordionService.sendToParentAccordionItemClicked(accordionItem);

      expect(accordionService['subjectChild'].next).toHaveBeenCalledWith(accordionItem);
    });

    it('should call subjectChild.asObservable in receiveFromChildAccordionClicked', () => {
      spyOn(accordionService['subjectChild'], 'asObservable');
      accordionService.receiveFromChildAccordionClicked();

      expect(accordionService['subjectChild'].asObservable).toHaveBeenCalled();
    });

    it('should return an instanceof Observable receiveFromChildAccordionClicked', () => {
      const result = accordionService.receiveFromChildAccordionClicked();

      expect(result instanceof Observable).toBeTruthy();
    });
  });
});
