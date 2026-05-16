import * as fc from 'fast-check';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoUserGuideBaseService } from './po-user-guide-base.service';
import { PoUserGuideOptions, PoUserGuideStep } from './interfaces';

class PoUserGuideTestService extends PoUserGuideBaseService {
  constructor(languageService: PoLanguageService) {
    super(languageService);
  }

  start(): Promise<void> {
    return Promise.resolve();
  }
  close(): void {}
  next(): void {}
  previous(): void {}
  goTo(): void {}

  setSteps(steps: Array<PoUserGuideStep>): this {
    this.validateSteps(steps);
    this.steps = [...steps];
    return this;
  }

  getCurrentStep(): PoUserGuideStep | null {
    return this.currentIndex >= 0 ? this.steps[this.currentIndex] : null;
  }

  setIndexForTest(index: number): void {
    this.currentIndex = index;
  }
}

const mockLanguageService = { getShortLanguage: () => 'pt' } as PoLanguageService;

describe('PoUserGuideBaseService:', () => {
  let service: PoUserGuideBaseService;

  beforeEach(() => {
    service = new PoUserGuideTestService(mockLanguageService);
  });

  it('should be an instance of PoUserGuideBaseService', () => {
    expect(service instanceof PoUserGuideBaseService).toBeTruthy();
  });

  describe('validateSteps:', () => {
    it('should throw when steps is null', () => {
      expect(() => service['validateSteps'](null as any)).toThrowError(/obrigatória/);
    });

    it('should throw when steps is undefined', () => {
      expect(() => service['validateSteps'](undefined as any)).toThrowError(/obrigatória/);
    });

    it('should throw when steps is an empty array', () => {
      expect(() => service['validateSteps']([])).toThrowError(/vazia/);
    });

    it('should throw when steps is not an array', () => {
      expect(() => service['validateSteps']('not-an-array' as any)).toThrowError(/array/);
    });

    it('should throw when a step entry is null', () => {
      expect(() => service['validateSteps']([null] as any)).toThrowError(/índice 0 é inválido/);
    });

    it('should throw when a step is missing the content property', () => {
      expect(() => service['validateSteps']([{}] as any)).toThrowError(/content/);
    });

    it('should throw when a step has empty content', () => {
      expect(() => service['validateSteps']([{ content: '' }])).toThrowError(/content/);
    });

    it('should throw when a step has content composed only of whitespace', () => {
      expect(() => service['validateSteps']([{ content: '   ' }])).toThrowError(/content/);
    });

    it('should throw when a step has an invalid CSS selector', () => {
      const steps: Array<PoUserGuideStep> = [{ content: 'ok', element: 'invalid<<<' }];

      expect(() => service['validateSteps'](steps)).toThrowError(/seletor CSS inválido/);
    });

    it('should not throw when the selector is syntactically valid even if the element does not exist', () => {
      const steps: Array<PoUserGuideStep> = [{ content: 'ok', element: '#non-existing' }];

      expect(() => service['validateSteps'](steps)).not.toThrow();
    });

    it('should not throw when the selector targets a class', () => {
      const steps: Array<PoUserGuideStep> = [{ content: 'ok', element: '.valid-class' }];

      expect(() => service['validateSteps'](steps)).not.toThrow();
    });

    it('should not throw for a happy path with multiple valid steps', () => {
      const steps: Array<PoUserGuideStep> = [{ content: 'ok' }, { content: 'ok2' }];

      expect(() => service['validateSteps'](steps)).not.toThrow();
    });
  });

  describe('resolveOptions:', () => {
    it('should apply all PO UI defaults when called with an empty options object', () => {
      const result = service['resolveOptions']({});

      expect(result.allowClose).toBe(true);
      expect(result.showProgress).toBe(true);
      expect(result.keyboardControl).toBe(true);
      expect(result.overlayOpacity).toBe(0.7);
      expect(result.nextLabel).toBe('Próximo');
      expect(result.previousLabel).toBe('Anterior');
      expect(result.doneLabel).toBe('Finalizar');
      expect(result.closeLabel).toBe('Fechar');
      expect(result.progressTemplate).toBe('{{current}} de {{total}}');
    });

    it('should apply all PO UI defaults when called without arguments', () => {
      const result = service['resolveOptions'](undefined);

      expect(result.allowClose).toBe(true);
      expect(result.showProgress).toBe(true);
      expect(result.keyboardControl).toBe(true);
      expect(result.overlayOpacity).toBe(0.7);
      expect(result.nextLabel).toBe('Próximo');
      expect(result.previousLabel).toBe('Anterior');
      expect(result.doneLabel).toBe('Finalizar');
      expect(result.closeLabel).toBe('Fechar');
      expect(result.progressTemplate).toBe('{{current}} de {{total}}');
    });

    it('should override every default when all options are provided', () => {
      const opts: PoUserGuideOptions = {
        allowClose: false,
        showProgress: false,
        keyboardControl: false,
        overlayOpacity: 0.5,
        nextLabel: 'A',
        previousLabel: 'B',
        doneLabel: 'C',
        closeLabel: 'D',
        progressTemplate: '{{current}}/{{total}}',
        popoverClass: 'custom-class'
      };

      const result = service['resolveOptions'](opts);

      expect(result.allowClose).toBe(false);
      expect(result.showProgress).toBe(false);
      expect(result.keyboardControl).toBe(false);
      expect(result.overlayOpacity).toBe(0.5);
      expect(result.nextLabel).toBe('A');
      expect(result.previousLabel).toBe('B');
      expect(result.doneLabel).toBe('C');
      expect(result.closeLabel).toBe('D');
      expect(result.progressTemplate).toBe('{{current}}/{{total}}');
      expect(result.popoverClass).toBe('custom-class');
    });

    it('should warn when progressTemplate has no placeholders', () => {
      const warnSpy = spyOn(console, 'warn');

      service['resolveOptions']({ progressTemplate: 'sem placeholder' });

      expect(warnSpy).toHaveBeenCalledTimes(1);
      const message = warnSpy.calls.mostRecent().args[0] as string;
      expect(message).toContain('sem placeholder');
    });

    it('should not warn when progressTemplate contains only the {{current}} placeholder', () => {
      const warnSpy = spyOn(console, 'warn');

      service['resolveOptions']({ progressTemplate: '{{current}}' });

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should not warn when progressTemplate contains only the {{total}} placeholder', () => {
      const warnSpy = spyOn(console, 'warn');

      service['resolveOptions']({ progressTemplate: '{{total}}' });

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should not warn when called with an empty options object (default template has placeholders)', () => {
      const warnSpy = spyOn(console, 'warn');

      service['resolveOptions']({});

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should not warn when called without arguments', () => {
      const warnSpy = spyOn(console, 'warn');

      service['resolveOptions']();

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should return a new object reference instead of the input', () => {
      const input: PoUserGuideOptions = {};

      const result = service['resolveOptions'](input);

      expect(result).not.toBe(input);
      expect(result).not.toBe(PoUserGuideBaseService['DEFAULT_OPTIONS']);
    });
  });

  describe('setSteps - PBT:', () => {
    const arbStep = fc.record({
      content: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      title: fc.option(fc.string({ maxLength: 50 }), { nil: undefined })
    });

    it('should be immutable with respect to mutations on the input array', () => {
      expect(() =>
        fc.assert(
          fc.property(fc.array(arbStep, { minLength: 1, maxLength: 10 }), origSteps => {
            const localService = new PoUserGuideTestService(mockLanguageService);
            const inputArray: Array<PoUserGuideStep> = [...origSteps];
            const initialLength = inputArray.length;

            localService.setSteps(inputArray);
            localService.setIndexForTest(0);

            const beforeCurrent = localService.getCurrentStep();
            const internalLengthBefore = (localService as any).steps.length;

            inputArray.push({ content: 'NEW_STEP_SENTINEL' });

            const afterCurrent = localService.getCurrentStep();
            const internalLengthAfter = (localService as any).steps.length;

            return (
              afterCurrent === beforeCurrent &&
              internalLengthBefore === internalLengthAfter &&
              internalLengthAfter === initialLength
            );
          }),
          { numRuns: 50 }
        )
      ).not.toThrow();
    });
  });

  describe('literals:', () => {
    it('should return pt literals by default when language is pt', () => {
      expect(service.literals.next).toBe('Próximo');
      expect(service.literals.previous).toBe('Anterior');
      expect(service.literals.done).toBe('Finalizar');
      expect(service.literals.close).toBe('Fechar');
      expect(service.literals.progressTemplate).toBe('{{current}} de {{total}}');
    });

    it('should return en literals when language is en', () => {
      const enService = new PoUserGuideTestService({ getShortLanguage: () => 'en' } as PoLanguageService);

      expect(enService.literals.next).toBe('Next');
      expect(enService.literals.previous).toBe('Previous');
      expect(enService.literals.done).toBe('Done');
      expect(enService.literals.close).toBe('Close');
      expect(enService.literals.progressTemplate).toBe('{{current}} of {{total}}');
    });

    it('should return es literals when language is es', () => {
      const esService = new PoUserGuideTestService({ getShortLanguage: () => 'es' } as PoLanguageService);

      expect(esService.literals.next).toBe('Siguiente');
      expect(esService.literals.done).toBe('Finalizar');
      expect(esService.literals.close).toBe('Cerrar');
    });

    it('should return ru literals when language is ru', () => {
      const ruService = new PoUserGuideTestService({ getShortLanguage: () => 'ru' } as PoLanguageService);

      expect(ruService.literals.next).toBe('Следующий');
      expect(ruService.literals.close).toBe('Закрыть');
      expect(ruService.literals.progressTemplate).toBe('{{current}} из {{total}}');
    });

    it('should merge custom literals over the language defaults', () => {
      service.literals = { next: 'Avançar' };

      expect(service.literals.next).toBe('Avançar');
      expect(service.literals.previous).toBe('Anterior');
      expect(service.literals.done).toBe('Finalizar');
    });

    it('should fall back to language defaults when set with a non-object value', () => {
      service.literals = 'invalid' as any;

      expect(service.literals.next).toBe('Próximo');
    });

    it('should apply literals from setOptions without mutating the instance literals', () => {
      const result = service['resolveOptions']({ literals: { next: 'Go' } });

      expect(result.nextLabel).toBe('Go');
      expect(result.previousLabel).toBe('Anterior');
      // Instance literals remain unchanged
      expect(service.literals.next).toBe('Próximo');
    });

    it('should use translated labels in defaultOptions', () => {
      const opts = service['defaultOptions'];

      expect(opts.nextLabel).toBe('Próximo');
      expect(opts.previousLabel).toBe('Anterior');
      expect(opts.doneLabel).toBe('Finalizar');
      expect(opts.closeLabel).toBe('Fechar');
      expect(opts.progressTemplate).toBe('{{current}} de {{total}}');
    });
  });

  describe('resolveOptions - PBT:', () => {
    it('should always clamp overlayOpacity to the [0, 1] interval for any double input', () => {
      expect(() =>
        fc.assert(
          fc.property(fc.double({ noNaN: false, noDefaultInfinity: false }), x => {
            const result = service['resolveOptions']({ overlayOpacity: x });
            const opacity = result.overlayOpacity;
            return Number.isFinite(opacity) && opacity >= 0 && opacity <= 1;
          }),
          { numRuns: 100 }
        )
      ).not.toThrow();
    });

    it('should fall back to the default 0.7 when overlayOpacity is non-finite', () => {
      expect(() =>
        fc.assert(
          fc.property(
            fc.oneof(
              fc.constant(Number.NaN),
              fc.constant(Number.POSITIVE_INFINITY),
              fc.constant(Number.NEGATIVE_INFINITY)
            ),
            x => {
              const localService = new PoUserGuideTestService(mockLanguageService);
              const result = localService['resolveOptions']({ overlayOpacity: x });
              return result.overlayOpacity === 0.7;
            }
          ),
          { numRuns: 30 }
        )
      ).not.toThrow();
    });
  });
});
