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
    it('should return false when window.LanguageModel is not available', async () => {
      const result = await service.isAvailable();
      expect(result).toBeFalse();
    });

    it('should return true when window.LanguageModel is available and ready', async () => {
      (window as any).LanguageModel = {
        capabilities: () => Promise.resolve({ available: 'readily' })
      };

      const result = await service.isAvailable();
      expect(result).toBeTrue();

      delete (window as any).LanguageModel;
    });

    it('should return true when window.LanguageModel is available after download', async () => {
      (window as any).LanguageModel = {
        capabilities: () => Promise.resolve({ available: 'after-download' })
      };

      const result = await service.isAvailable();
      expect(result).toBeTrue();

      delete (window as any).LanguageModel;
    });

    it('should return false when capabilities check throws an error', async () => {
      (window as any).LanguageModel = {
        capabilities: () => Promise.reject(new Error('Not supported'))
      };

      const result = await service.isAvailable();
      expect(result).toBeFalse();

      delete (window as any).LanguageModel;
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

      (window as any).LanguageModel = {
        create: () =>
          Promise.resolve({
            prompt: () => Promise.resolve(mockResponse),
            destroy: () => {}
          })
      };

      service.sendQuery('idade maior que 30', mockColumns).subscribe({
        next: result => {
          expect(result.filter).toBe('age gt 30');
          expect(result.description).toBe('Idade maior que 30');
          expect(result.confidence).toBe(0.95);
          delete (window as any).LanguageModel;
          done();
        },
        error: () => {
          delete (window as any).LanguageModel;
          done.fail('Should not have errored');
        }
      });
    });

    it('should handle malformed JSON response gracefully', done => {
      (window as any).LanguageModel = {
        create: () =>
          Promise.resolve({
            prompt: () => Promise.resolve('This is not valid JSON'),
            destroy: () => {}
          })
      };

      service.sendQuery('test query', mockColumns).subscribe({
        next: result => {
          expect(result.filter).toBe('');
          expect(result.confidence).toBeLessThan(0.5);
          delete (window as any).LanguageModel;
          done();
        },
        error: () => {
          delete (window as any).LanguageModel;
          done.fail('Should not have errored');
        }
      });
    });

    it('should extract JSON from text with extra content', done => {
      const mockResponse = 'Here is the result: {"filter": "name eq \'Ana\'", "description": "Nome igual a Ana", "confidence": 0.9} some extra text';

      (window as any).LanguageModel = {
        create: () =>
          Promise.resolve({
            prompt: () => Promise.resolve(mockResponse),
            destroy: () => {}
          })
      };

      service.sendQuery('nome Ana', mockColumns).subscribe({
        next: result => {
          expect(result.filter).toBe("name eq 'Ana'");
          expect(result.confidence).toBe(0.9);
          delete (window as any).LanguageModel;
          done();
        },
        error: () => {
          delete (window as any).LanguageModel;
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

      (window as any).LanguageModel = {
        create: () =>
          Promise.resolve({
            prompt: () => Promise.resolve(mockResponse),
            destroy: () => {}
          })
      };

      service.sendQuery('test', mockColumns).subscribe({
        next: result => {
          expect(result.confidence).toBeLessThanOrEqual(1);
          delete (window as any).LanguageModel;
          done();
        },
        error: () => {
          delete (window as any).LanguageModel;
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

  describe('checkAvailability', () => {
    it('should return unsupported when window.LanguageModel does not exist', async () => {
      const result = await service.checkAvailability();
      expect(result).toBe('unsupported');
    });

    it('should return unsupported when check throws an error', async () => {
      (window as any).LanguageModel = {
        availability: () => Promise.reject(new Error('Not supported'))
      };

      const result = await service.checkAvailability();
      expect(result).toBe('unsupported');

      delete (window as any).LanguageModel;
    });

    describe('availability() API (nova)', () => {
      afterEach(() => {
        delete (window as any).LanguageModel;
      });

      it('should return readily when availability() returns available', async () => {
        (window as any).LanguageModel = {
          availability: () => Promise.resolve('available')
        };

        const result = await service.checkAvailability();
        expect(result).toBe('readily');
      });

      it('should return readily when availability() returns readily', async () => {
        (window as any).LanguageModel = {
          availability: () => Promise.resolve('readily')
        };

        const result = await service.checkAvailability();
        expect(result).toBe('readily');
      });

      it('should return after-download when availability() returns downloadable', async () => {
        (window as any).LanguageModel = {
          availability: () => Promise.resolve('downloadable')
        };

        const result = await service.checkAvailability();
        expect(result).toBe('after-download');
      });

      it('should return after-download when availability() returns downloading', async () => {
        (window as any).LanguageModel = {
          availability: () => Promise.resolve('downloading')
        };

        const result = await service.checkAvailability();
        expect(result).toBe('after-download');
      });

      it('should return unavailable when availability() returns unavailable', async () => {
        (window as any).LanguageModel = {
          availability: () => Promise.resolve('unavailable')
        };

        const result = await service.checkAvailability();
        expect(result).toBe('unavailable');
      });

      it('should prefer availability() over capabilities() when both exist', async () => {
        (window as any).LanguageModel = {
          availability: () => Promise.resolve('available'),
          capabilities: () => Promise.resolve({ available: 'no' })
        };

        const result = await service.checkAvailability();
        expect(result).toBe('readily');
      });
    });

    describe('capabilities() API (legada)', () => {
      afterEach(() => {
        delete (window as any).LanguageModel;
      });

      it('should return readily when capabilities.available is readily', async () => {
        (window as any).LanguageModel = {
          capabilities: () => Promise.resolve({ available: 'readily' })
        };

        const result = await service.checkAvailability();
        expect(result).toBe('readily');
      });

      it('should return after-download when capabilities.available is after-download', async () => {
        (window as any).LanguageModel = {
          capabilities: () => Promise.resolve({ available: 'after-download' })
        };

        const result = await service.checkAvailability();
        expect(result).toBe('after-download');
      });

      it('should return unavailable when capabilities.available is no', async () => {
        (window as any).LanguageModel = {
          capabilities: () => Promise.resolve({ available: 'no' })
        };

        const result = await service.checkAvailability();
        expect(result).toBe('unavailable');
      });
    });

    it('should return unavailable when LanguageModel has no availability or capabilities', async () => {
      (window as any).LanguageModel = {};

      const result = await service.checkAvailability();
      expect(result).toBe('unavailable');

      delete (window as any).LanguageModel;
    });
  });

  describe('getConfigurationSteps', () => {
    it('should return an array of configuration steps', () => {
      const steps = service.getConfigurationSteps();

      expect(steps.length).toBe(5);
      expect(steps[0].step).toBe(1);
      expect(steps[0].title).toContain('Chrome');
      expect(steps[1].url).toContain('chrome://flags');
      expect(steps[2].url).toContain('chrome://flags');
      expect(steps[4].url).toContain('chrome://components');
    });

    it('should have sequential step numbers', () => {
      const steps = service.getConfigurationSteps();

      steps.forEach((step, index) => {
        expect(step.step).toBe(index + 1);
      });
    });
  });

  describe('onDownloadProgress', () => {
    it('should emit download progress events', done => {
      const progressValues: Array<any> = [];

      service.onDownloadProgress.subscribe(progress => {
        progressValues.push(progress);
        if (progressValues.length === 2) {
          expect(progressValues[0].percent).toBe(50);
          expect(progressValues[1].percent).toBe(100);
          done();
        }
      });

      service['downloadProgress$'].next({ loaded: 500, total: 1000, percent: 50 });
      service['downloadProgress$'].next({ loaded: 1000, total: 1000, percent: 100 });
    });
  });

  describe('onPhaseChange', () => {
    it('should emit phase changes during query processing', done => {
      const phases: Array<string> = [];

      service.onPhaseChange.subscribe(phase => {
        phases.push(phase);
        if (phase === 'done') {
          expect(phases).toContain('initializing');
          expect(phases).toContain('generating');
          expect(phases).toContain('analyzing');
          expect(phases).toContain('done');
          delete (window as any).LanguageModel;
          done();
        }
      });

      const mockResponse = JSON.stringify({
        filter: "age gt 30",
        description: 'Idade maior que 30',
        confidence: 0.95
      });

      (window as any).LanguageModel = {
        create: () =>
          Promise.resolve({
            prompt: () => Promise.resolve(mockResponse),
            destroy: () => {}
          })
      };

      service.sendQuery('idade maior que 30', mockColumns).subscribe();
    });

    it('should emit error phase when query fails', done => {
      service.onPhaseChange.subscribe(phase => {
        if (phase === 'error') {
          expect(phase).toBe('error');
          done();
        }
      });

      service.sendQuery('test query', mockColumns).subscribe({
        error: () => {}
      });
    });
  });

  describe('onStreamChunk', () => {
    it('should emit stream chunks when promptStreaming is available', done => {
      const chunks: Array<string> = [];
      let chunkCount = 0;

      service.onStreamChunk.subscribe(text => {
        chunks.push(text);
        chunkCount++;
        if (chunkCount >= 2) {
          expect(chunks.length).toBeGreaterThanOrEqual(2);
          delete (window as any).LanguageModel;
          done();
        }
      });

      const mockResponse = JSON.stringify({
        filter: "age gt 30",
        description: 'test',
        confidence: 0.9
      });

      const mockStream = {
        getReader: () => {
          let callCount = 0;
          return {
            read: () => {
              callCount++;
              if (callCount === 1) {
                return Promise.resolve({ done: false, value: '{"filter":' });
              }
              if (callCount === 2) {
                return Promise.resolve({ done: false, value: mockResponse });
              }
              return Promise.resolve({ done: true, value: undefined });
            },
            releaseLock: () => {}
          };
        }
      };

      (window as any).LanguageModel = {
        create: () =>
          Promise.resolve({
            promptStreaming: () => mockStream,
            destroy: () => {}
          })
      };

      service.sendQuery('idade maior que 30', mockColumns).subscribe();
    });

    it('should fall back to prompt() when promptStreaming is not available', done => {
      const mockResponse = JSON.stringify({
        filter: "age gt 30",
        description: 'test',
        confidence: 0.9
      });

      (window as any).LanguageModel = {
        create: () =>
          Promise.resolve({
            prompt: () => Promise.resolve(mockResponse),
            destroy: () => {}
          })
      };

      service.sendQuery('test', mockColumns).subscribe({
        next: result => {
          expect(result.filter).toBe('age gt 30');
          delete (window as any).LanguageModel;
          done();
        },
        error: () => {
          delete (window as any).LanguageModel;
          done.fail('Should not have errored');
        }
      });
    });
  });

  describe('timeout configuration', () => {
    it('should use default timeout of 120000ms', () => {
      spyOn(service as any, 'executePromptWithStreaming').and.returnValue(
        new Promise(() => {})
      );

      const subscription = service.sendQuery('test', mockColumns).subscribe({
        error: () => {}
      });

      subscription.unsubscribe();
    });

    it('should accept custom timeout parameter', () => {
      spyOn(service as any, 'executePromptWithStreaming').and.returnValue(
        new Promise(() => {})
      );

      const subscription = service.sendQuery('test', mockColumns, 60000).subscribe({
        error: () => {}
      });

      subscription.unsubscribe();
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
