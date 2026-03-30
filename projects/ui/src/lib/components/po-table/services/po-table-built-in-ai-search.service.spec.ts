import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';

import { PoTableBuiltInAiSearchService } from './po-table-built-in-ai-search.service';
import { PoTableAiSearchColumn } from '../interfaces/po-table-ai-search.interface';

describe('PoTableBuiltInAiSearchService', () => {
  let service: PoTableBuiltInAiSearchService;

  const mockColumns: Array<PoTableAiSearchColumn> = [
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' },
    { property: 'status', label: 'Status', type: 'string' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoTableBuiltInAiSearchService]
    });
    service = TestBed.inject(PoTableBuiltInAiSearchService);
  });

  afterEach(() => {
    service.destroySession();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAvailable', () => {
    it('should return false when window.ai is not available', async () => {
      const result = await service.isAvailable();
      expect(result).toBeFalse();
    });

    it('should return true when window.ai.languageModel is available and ready', async () => {
      (window as any).ai = {
        languageModel: {
          capabilities: () => Promise.resolve({ available: 'readily' })
        }
      };

      const result = await service.isAvailable();
      expect(result).toBeTrue();

      delete (window as any).ai;
    });

    it('should return true when window.ai.languageModel is available after download', async () => {
      (window as any).ai = {
        languageModel: {
          capabilities: () => Promise.resolve({ available: 'after-download' })
        }
      };

      const result = await service.isAvailable();
      expect(result).toBeTrue();

      delete (window as any).ai;
    });

    it('should return false when capabilities check throws an error', async () => {
      (window as any).ai = {
        languageModel: {
          capabilities: () => Promise.reject(new Error('Not supported'))
        }
      };

      const result = await service.isAvailable();
      expect(result).toBeFalse();

      delete (window as any).ai;
    });
  });

  describe('extractColumnsMetadata', () => {
    it('should extract metadata from visible columns', () => {
      const columns = [
        { property: 'name', label: 'Nome', type: 'string', visible: true },
        { property: 'age', label: 'Idade', type: 'number' },
        { property: 'city', label: 'Cidade', type: 'string', visible: false }
      ];

      const result = service.extractColumnsMetadata(columns);

      expect(result.length).toBe(2);
      expect(result[0]).toEqual({ property: 'name', label: 'Nome', type: 'string' });
      expect(result[1]).toEqual({ property: 'age', label: 'Idade', type: 'number' });
    });

    it('should exclude columns with aiSearchIgnore set to true', () => {
      const columns = [
        { property: 'name', label: 'Nome', type: 'string' },
        { property: 'id', label: 'ID', type: 'number', aiSearchIgnore: true }
      ];

      const result = service.extractColumnsMetadata(columns);

      expect(result.length).toBe(1);
      expect(result[0].property).toBe('name');
    });

    it('should use property as label when label is not provided', () => {
      const columns = [{ property: 'name', type: 'string' }];

      const result = service.extractColumnsMetadata(columns);

      expect(result[0].label).toBe('name');
    });

    it('should default type to string when not provided', () => {
      const columns = [{ property: 'name', label: 'Nome' }];

      const result = service.extractColumnsMetadata(columns);

      expect(result[0].type).toBe('string');
    });

    it('should exclude columns without property', () => {
      const columns = [{ label: 'Ações' }, { property: 'name', label: 'Nome', type: 'string' }];

      const result = service.extractColumnsMetadata(columns);

      expect(result.length).toBe(1);
      expect(result[0].property).toBe('name');
    });
  });

  describe('sendQuery', () => {
    it('should emit error when Built-in AI is not available', done => {
      service.sendQuery('test query', mockColumns).subscribe({
        error: error => {
          expect(error.statusCode).toBe(500);
          expect(error.message).toContain('Built-in AI is not available');
          done();
        }
      });
    });

    it('should send query and parse valid JSON response', done => {
      const mockResponse = JSON.stringify({
        filter: "age gt 30",
        description: 'Idade maior que 30',
        confidence: 0.95
      });

      (window as any).ai = {
        languageModel: {
          create: () =>
            Promise.resolve({
              prompt: () => Promise.resolve(mockResponse),
              destroy: () => {}
            })
        }
      };

      service.sendQuery('idade maior que 30', mockColumns).subscribe({
        next: result => {
          expect(result.filter).toBe('age gt 30');
          expect(result.description).toBe('Idade maior que 30');
          expect(result.confidence).toBe(0.95);
          delete (window as any).ai;
          done();
        },
        error: () => {
          delete (window as any).ai;
          done.fail('Should not have errored');
        }
      });
    });

    it('should handle malformed JSON response gracefully', done => {
      (window as any).ai = {
        languageModel: {
          create: () =>
            Promise.resolve({
              prompt: () => Promise.resolve('This is not valid JSON'),
              destroy: () => {}
            })
        }
      };

      service.sendQuery('test query', mockColumns).subscribe({
        next: result => {
          expect(result.filter).toBe('');
          expect(result.confidence).toBeLessThan(0.5);
          delete (window as any).ai;
          done();
        },
        error: () => {
          delete (window as any).ai;
          done.fail('Should not have errored');
        }
      });
    });

    it('should extract JSON from text with extra content', done => {
      const mockResponse = 'Here is the result: {"filter": "name eq \'Ana\'", "description": "Nome igual a Ana", "confidence": 0.9} some extra text';

      (window as any).ai = {
        languageModel: {
          create: () =>
            Promise.resolve({
              prompt: () => Promise.resolve(mockResponse),
              destroy: () => {}
            })
        }
      };

      service.sendQuery('nome Ana', mockColumns).subscribe({
        next: result => {
          expect(result.filter).toBe("name eq 'Ana'");
          expect(result.confidence).toBe(0.9);
          delete (window as any).ai;
          done();
        },
        error: () => {
          delete (window as any).ai;
          done.fail('Should not have errored');
        }
      });
    });

    it('should clamp confidence between 0 and 1', done => {
      const mockResponse = JSON.stringify({
        filter: 'age gt 30',
        description: 'test',
        confidence: 1.5
      });

      (window as any).ai = {
        languageModel: {
          create: () =>
            Promise.resolve({
              prompt: () => Promise.resolve(mockResponse),
              destroy: () => {}
            })
        }
      };

      service.sendQuery('test', mockColumns).subscribe({
        next: result => {
          expect(result.confidence).toBeLessThanOrEqual(1);
          delete (window as any).ai;
          done();
        },
        error: () => {
          delete (window as any).ai;
          done.fail('Should not have errored');
        }
      });
    });
  });

  describe('destroySession', () => {
    it('should destroy the session if it exists', () => {
      const mockDestroy = jasmine.createSpy('destroy');
      service['session'] = { destroy: mockDestroy };

      service.destroySession();

      expect(mockDestroy).toHaveBeenCalled();
      expect(service['session']).toBeNull();
    });

    it('should handle destroy gracefully if session is null', () => {
      service['session'] = null;
      expect(() => service.destroySession()).not.toThrow();
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML special characters', () => {
      const result = service['sanitizeInput']('<script>alert("xss")</script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('"');
    });

    it('should trim whitespace', () => {
      const result = service['sanitizeInput']('  test query  ');
      expect(result).toBe('test query');
    });
  });
});
