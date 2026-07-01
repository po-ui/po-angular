import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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
    httpMock.verify({ ignoreCancelled: true });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('sendQuery:', () => {
      it('should POST the query and columns and return the response', () => {
        const expected: PoSearchAiResponse = { filter: `name eq 'Ana'`, description: 'nome Ana', confidence: 0.9 };

        service.sendQuery(url, '<Ana>', columns).subscribe(response => {
          expect(response).toEqual(expected);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.query).toBe('<Ana>');
        expect(req.request.body.columns).toEqual(columns);
        expect(req.request.headers.get('X-PO-No-Message')).toBe('true');
        req.flush(expected);
      });

      it('should send the query as-is when it is an empty string', () => {
        service.sendQuery(url, '', columns).subscribe();

        const req = httpMock.expectOne(url);
        expect(req.request.body.query).toBe('');
        req.flush({});
      });

      it('should send the query as-is including quotes and special characters', () => {
        service.sendQuery(url, '"hello" and \'world\'', columns).subscribe();

        const req = httpMock.expectOne(url);
        expect(req.request.body.query).toBe('"hello" and \'world\'');
        req.flush({});
      });

      it('should emit a 408 error when the request times out', fakeAsync(() => {
        let errorResult: any;

        service.sendQuery(url, 'query', columns, 1).subscribe({
          error: error => {
            errorResult = error;
          }
        });

        tick(1);

        expect(errorResult?.statusCode).toBe(408);
        expect(errorResult?.message).toBe('AI search request timed out');
      }));

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

      it('should filter out columns without property, hidden or with searchAiIgnore set to true', () => {
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
