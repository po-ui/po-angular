import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PoSearchAiColumn } from './interfaces/po-search-ai-column.interface';
import { PoSearchAiResponse } from './interfaces/po-search-ai.interface';
import { PoSearchAiService } from './po-search-ai.service';

describe('PoSearchAiService:', () => {
  let service: PoSearchAiService;
  let httpMock: HttpTestingController;

  const url = '/api/ai-search';
  const columns: Array<PoSearchAiColumn> = [{ property: 'name', label: 'Nome', type: 'string' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoSearchAiService]
    });

    service = TestBed.inject(PoSearchAiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('sendQuery:', () => {
      it('should POST the sanitized query and columns and return the response', () => {
        const expected: PoSearchAiResponse = { filter: `name eq 'Ana'`, description: 'nome Ana', confidence: 0.9 };

        service.sendQuery(url, '  <Ana>  ', columns).subscribe(response => {
          expect(response).toEqual(expected);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.query).toBe('&lt;Ana&gt;');
        expect(req.request.body.columns).toEqual(columns);
        expect(req.request.headers.get('X-PO-No-Message')).toBe('true');
        req.flush(expected);
      });

      it('should emit a 408 error when the request times out', done => {
        service.sendQuery(url, 'query', columns, 1).subscribe({
          error: error => {
            expect(error.statusCode).toBe(408);
            expect(error.message).toBe('AI search request timed out');
            done();
          }
        });

        // Não dá flush para forçar o timeout de 1ms.
        setTimeout(() => {
          const req = httpMock.expectOne(url);
          req.flush({});
        }, 10);
      });

      it('should emit a normalized error when the request fails with an HTTP status', done => {
        service.sendQuery(url, 'query', columns).subscribe({
          error: error => {
            expect(error.statusCode).toBe(500);
            expect(error.message).toBeDefined();
            done();
          }
        });

        const req = httpMock.expectOne(url);
        req.flush('error', { status: 500, statusText: 'Server Error' });
      });

      it('should default to statusCode 500 and a generic message when error has no status', done => {
        service.sendQuery(url, 'query', columns).subscribe({
          error: error => {
            expect(error.statusCode).toBe(500);
            expect(error.message).toBe('AI search request failed');
            done();
          }
        });

        const req = httpMock.expectOne(url);
        req.error(new ProgressEvent('error'), { status: 0, statusText: '' });
      });
    });

    describe('extractColumnsMetadata:', () => {
      it('should return an empty array when columns is undefined', () => {
        expect(service.extractColumnsMetadata(undefined)).toEqual([]);
      });

      it('should filter out columns without property, hidden or marked as searchAiIgnore', () => {
        const result = service.extractColumnsMetadata([
          { property: 'name', label: 'Nome', type: 'string' },
          { property: 'age', label: 'Idade' },
          { property: 'secret', label: 'Secret', searchAiIgnore: true },
          { property: 'hidden', label: 'Hidden', visible: false },
          { label: 'No property' }
        ]);

        expect(result).toEqual([
          { property: 'name', label: 'Nome', type: 'string' },
          { property: 'age', label: 'Idade', type: 'string' }
        ]);
      });

      it('should fallback label to property when label is not provided', () => {
        const result = service.extractColumnsMetadata([{ property: 'city' }]);

        expect(result).toEqual([{ property: 'city', label: 'city', type: 'string' }]);
      });
    });
  });
});
