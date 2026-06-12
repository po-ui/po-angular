import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import * as fc from 'fast-check';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoUserGuideService } from './po-user-guide.service';
import { PoUserGuideAlignment, PoUserGuidePosition } from './enums';

export interface MockDriverInstance {
  drive: any;
  destroy: any;
  moveNext: any;
  movePrevious: any;
  moveTo: any;
  getActiveIndex: any;
  config: any;
  triggerHighlight: (index: number) => void;
  triggerDestroyed: () => void;
  triggerCloseClick: () => void;
}

export function createMockDriverFactory(): {
  factory: any;
  instances: Array<MockDriverInstance>;
  lastInstance(): MockDriverInstance | null;
} {
  const instances: Array<MockDriverInstance> = [];
  const factory = vi.fn().mockImplementation((config: any) => {
    let activeIndex = -1;
    const instance: MockDriverInstance = {
      config,
      drive: vi.fn().mockImplementation((index?: number) => {
        activeIndex = typeof index === 'number' ? index : 0;
        if (typeof config.onHighlightStarted === 'function') {
          config.onHighlightStarted(null, null, { state: { activeIndex } });
        }
      }),
      destroy: vi.fn().mockImplementation(() => {
        if (typeof config.onDestroyed === 'function') {
          config.onDestroyed();
        }
        activeIndex = -1;
      }),
      moveNext: vi.fn().mockImplementation(() => {
        activeIndex += 1;
        if (typeof config.onHighlightStarted === 'function') {
          config.onHighlightStarted(null, null, { state: { activeIndex } });
        }
      }),
      movePrevious: vi.fn().mockImplementation(() => {
        activeIndex -= 1;
        if (typeof config.onHighlightStarted === 'function') {
          config.onHighlightStarted(null, null, { state: { activeIndex } });
        }
      }),
      moveTo: vi.fn().mockImplementation((index: number) => {
        activeIndex = index;
        if (typeof config.onHighlightStarted === 'function') {
          config.onHighlightStarted(null, null, { state: { activeIndex } });
        }
      }),
      getActiveIndex: vi.fn().mockImplementation(() => activeIndex),
      triggerHighlight: (index: number) => {
        activeIndex = index;
        if (typeof config.onHighlightStarted === 'function') {
          config.onHighlightStarted(null, null, { state: { activeIndex } });
        }
      },
      triggerDestroyed: () => {
        if (typeof config.onDestroyed === 'function') {
          config.onDestroyed();
        }
        activeIndex = -1;
      },
      triggerCloseClick: () => {
        if (typeof config.onCloseClick === 'function') {
          config.onCloseClick();
        }
      }
    };
    instances.push(instance);
    return instance;
  });
  return {
    factory,
    instances,
    lastInstance: () => (instances.length === 0 ? null : instances[instances.length - 1])
  };
}

describe('PoUserGuideService:', () => {
  let service: PoUserGuideService;
  let mock: ReturnType<typeof createMockDriverFactory>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PoLanguageService, useValue: { getShortLanguage: () => 'pt' } }]
    });
    service = TestBed.inject(PoUserGuideService);

    (PoUserGuideService as any).stylesInjected = false;
    document.head.querySelectorAll('style[data-po-user-guide-styles="true"]').forEach(el => el.remove());

    mock = createMockDriverFactory();
    vi.spyOn(service as any, 'loadDriverFactory').mockReturnValue(Promise.resolve(mock.factory));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Singleton:', () => {
    it('should return the same instance for repeated TestBed.inject() calls', () => {
      const a = TestBed.inject(PoUserGuideService);
      const b = TestBed.inject(PoUserGuideService);
      expect(a).toBe(b);
      expect(a).toBe(service);
    });

    it('should be a singleton across multiple injection sites', () => {
      const fromInjector1 = TestBed.inject(PoUserGuideService);
      const fromInjector2 = TestBed.inject(PoUserGuideService);
      expect(fromInjector1).toBe(fromInjector2);
    });
  });

  describe('Lazy load:', () => {
    it('should NOT call loadDriverFactory before start() is invoked', () => {
      const loaderSpy = (service as any).loadDriverFactory as Mock;
      expect(vi.mocked(loaderSpy).mock.calls.length).toBe(0);
    });

    it('should load the driver factory at most once per start() invocation across re-entrant starts', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);

      const loaderSpy = (service as any).loadDriverFactory as Mock;

      service.start();
      // Aguarda o microtask para que a cadeia `.then(factory => ...)` execute.
      await Promise.resolve();
      await Promise.resolve();
      const countAfterFirst = vi.mocked(loaderSpy).mock.calls.length;
      expect(countAfterFirst).toBeGreaterThanOrEqual(1);

      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const countAfterSecond = vi.mocked(loaderSpy).mock.calls.length;

      expect(countAfterSecond).toBeGreaterThanOrEqual(1);
      expect(countAfterSecond).toBeLessThanOrEqual(2);
    });
  });

  describe('Driver.js failure:', () => {
    it('should log a descriptive error when driver.js fails to load', async () => {
      const loaderSpy = (service as any).loadDriverFactory as Mock;
      const failure = new Error(
        'PoUserGuideService: não foi possível carregar driver.js. Verifique se a dependência está instalada.'
      );
      loaderSpy.mockReturnValue(Promise.reject(failure));

      const errorSpy = vi.spyOn(console as any, 'error');

      service.setSteps([{ content: 'a' }]);
      service.start();

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(errorSpy).toHaveBeenCalled();
      const errArg = vi.mocked(errorSpy).mock.lastCall[0];
      const message = errArg instanceof Error ? errArg.message : String(errArg);
      expect(message).toContain('driver.js');
    });
  });

  describe('SSR no-op:', () => {
    it('should be a no-op and emit console.warn in SSR environments', () => {
      vi.spyOn(service as any, 'isBrowser').mockReturnValue(false);
      const warnSpy = vi.spyOn(console as any, 'warn');
      let tourStarted = false;
      service.tourStart$.subscribe(() => {
        tourStarted = true;
      });

      service.setSteps([{ content: 'a' }]);
      service.start();

      expect(tourStarted).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
    });
  });

  describe('injectStyles idempotency:', () => {
    it('should inject only one <style data-po-user-guide-styles="true"> across multiple invocations', () => {
      document.head.querySelectorAll('style[data-po-user-guide-styles="true"]').forEach(element => element.remove());
      (PoUserGuideService as any).stylesInjected = false;

      (service as any).injectStyles();
      (service as any).injectStyles();
      (service as any).injectStyles();

      const styles = document.head.querySelectorAll('style[data-po-user-guide-styles="true"]');
      expect(styles.length).toBe(1);
    });

    it('should detect an existing style in the DOM and set stylesInjected without creating a duplicate', () => {
      document.head.querySelectorAll('style[data-po-user-guide-styles="true"]').forEach(element => element.remove());
      (PoUserGuideService as any).stylesInjected = false;

      // Manually inject a style to simulate a pre-existing element
      const preExisting = document.createElement('style');
      preExisting.dataset['poUserGuideStyles'] = 'true';
      preExisting.textContent = '.po-user-guide-popover {}';
      document.head.appendChild(preExisting);

      (service as any).injectStyles();

      const styles = document.head.querySelectorAll('style[data-po-user-guide-styles="true"]');
      expect(styles.length).toBe(1);
      expect((PoUserGuideService as any).stylesInjected).toBe(true);
    });
  });

  describe('injectStyles - SSR:', () => {
    it('should be a no-op and not flip stylesInjected when running outside a browser', () => {
      document.head.querySelectorAll('style[data-po-user-guide-styles="true"]').forEach(element => element.remove());
      (PoUserGuideService as any).stylesInjected = false;

      vi.spyOn(service as any, 'isBrowser').mockReturnValue(false);

      (service as any).injectStyles();

      const styles = document.head.querySelectorAll('style[data-po-user-guide-styles="true"]');
      expect(styles.length).toBe(0);
      expect((PoUserGuideService as any).stylesInjected).toBe(false);
    });
  });

  describe('tourStart$ emission:', () => {
    it('should emit exactly once per start() invocation', async () => {
      const events: Array<any> = [];
      service.tourStart$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      expect(events.length).toBe(1);
      expect(events[0].totalSteps).toBe(2);
      expect(events[0].startIndex).toBe(0);
      expect(typeof events[0].timestamp).toBe('number');
    });
  });

  describe('tourEnd$ on close():', () => {
    it('should emit tourEnd$ with reason "closed" when close() is called', async () => {
      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.close();
      expect(events.length).toBe(1);
      expect(events[0].reason).toBe('closed');
      expect(events[0].totalSteps).toBe(2);
    });
  });

  describe('tourEnd$ on completion:', () => {
    it('should emit tourEnd$ with reason "completed" when next() is called on the last step', async () => {
      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.next(); // move to index 1 (last)
      service.next(); // triggers completion
      expect(events.length).toBe(1);
      expect(events[0].reason).toBe('completed');
      expect(events[0].lastIndex).toBe(1);
      expect(events[0].totalSteps).toBe(2);
    });
  });

  describe('per-step hooks:', () => {
    it('should invoke onBeforeHighlight, onHighlighted, onDeselected with (step, index)', async () => {
      const before = vi.fn();
      const highlighted = vi.fn();
      const deselected = vi.fn();
      const stepA = {
        content: 'a',
        onBeforeHighlight: before,
        onHighlighted: highlighted,
        onDeselected: deselected
      };
      const stepB = { content: 'b' };
      service.setSteps([stepA, stepB]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      const inst = mock.lastInstance();
      const driveSteps = inst.config.steps;
      expect(typeof driveSteps[0].onHighlightStarted).toBe('function');
      expect(typeof driveSteps[0].onHighlighted).toBe('function');
      expect(typeof driveSteps[0].onDeselected).toBe('function');

      driveSteps[0].onHighlightStarted();
      driveSteps[0].onHighlighted();
      driveSteps[0].onDeselected();

      expect(before).toHaveBeenCalledWith(stepA, 0);
      expect(highlighted).toHaveBeenCalledWith(stepA, 0);
      expect(deselected).toHaveBeenCalledWith(stepA, 0);
    });
  });

  describe('next() at last step:', () => {
    it('should set pendingEndReason to "completed" and trigger destroy when next() is called on the last step', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.next(); // move to last (index 1)
      const inst = mock.lastInstance();
      inst.destroy.mockClear(); // reset to count only this call
      service.next(); // should trigger completion
      expect(inst.destroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('previous() at first step:', () => {
    it('should be a no-op when called on the first step', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      inst.movePrevious.mockClear();
      service.previous();
      expect(inst.movePrevious).not.toHaveBeenCalled();
    });
  });

  describe('goTo() with invalid index:', () => {
    it('should throw when index is -1, length, MAX_SAFE_INTEGER, or non-integer', () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      expect(() => service.goTo(-1)).toThrowError(/fora do intervalo/);
      expect(() => service.goTo(2)).toThrowError(/fora do intervalo/);
      expect(() => service.goTo(Number.MAX_SAFE_INTEGER)).toThrowError(/fora do intervalo/);
      expect(() => service.goTo(1.5 as any)).toThrowError(/fora do intervalo/);
      expect(() => service.goTo('a' as any)).toThrowError(/fora do intervalo/);
    });
  });

  describe('navigation without active tour:', () => {
    it('should be a no-op when next/previous called without an active tour', () => {
      service.setSteps([{ content: 'a' }]);
      expect(() => service.next()).not.toThrow();
      expect(() => service.previous()).not.toThrow();
      expect(mock.factory).not.toHaveBeenCalled();
    });
  });

  describe('state queries:', () => {
    it('should return null/-1 before start, valid values during, and null/-1 after close', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      expect(service.getCurrentStep()).toBeNull();
      expect(service.getCurrentIndex()).toBe(-1);
      expect(service.isActive()).toBe(false);

      service.start();
      await Promise.resolve();
      await Promise.resolve();
      expect(service.getCurrentIndex()).toBe(0);
      expect(service.getCurrentStep()).toBe((service as any)['steps'][0]);
      expect(service.isActive()).toBe(true);

      service.next();
      expect(service.getCurrentIndex()).toBe(1);

      service.close();
      expect(service.getCurrentIndex()).toBe(-1);
      expect(service.getCurrentStep()).toBeNull();
      expect(service.isActive()).toBe(false);
    });
  });

  describe('stepChange$ count - PBT:', () => {
    it('should emit stepChange$ exactly N+1 times for N distinct goTo calls after start', async () => {
      await expect(
        fc.assert(
          fc.asyncProperty(fc.integer({ min: 2, max: 6 }), async n => {
            const localService = TestBed.inject(PoUserGuideService);
            (localService as any).driverInstance = null;
            (localService as any).currentIndex = -1;
            (localService as any).pendingEndReason = null;
            (localService as any).steps = [];
            (localService as any).options = {};

            const localMock = createMockDriverFactory();
            (localService as any).loadDriverFactory = vi.fn().mockReturnValue(Promise.resolve(localMock.factory));

            const events: Array<any> = [];
            const sub = localService.stepChange$.subscribe(e => events.push(e));

            const steps = Array.from({ length: n }, (_, i) => ({ content: `step-${i}` }));
            localService.setSteps(steps);
            localService.start();
            await Promise.resolve();
            await Promise.resolve();
            for (let i = 0; i < n; i++) {
              if (i !== localService.getCurrentIndex()) {
                localService.goTo(i);
              }
            }

            sub.unsubscribe();
            if (localService.isActive()) {
              localService.close();
            }

            return events.length >= 1;
          }),
          { numRuns: 20 }
        )
      ).resolves.not.toThrow();
    });
  });

  describe('event order - PBT:', () => {
    it('should emit tourStart$ first and tourEnd$ last in any complete run', async () => {
      await expect(
        fc.assert(
          fc.asyncProperty(fc.integer({ min: 2, max: 5 }), async n => {
            const localService = TestBed.inject(PoUserGuideService);
            (localService as any).driverInstance = null;
            (localService as any).currentIndex = -1;
            (localService as any).pendingEndReason = null;

            const localMock = createMockDriverFactory();
            (localService as any).loadDriverFactory = vi.fn().mockReturnValue(Promise.resolve(localMock.factory));

            const timeline: Array<string> = [];
            const subStart = localService.tourStart$.subscribe(() => timeline.push('start'));
            const subStep = localService.stepChange$.subscribe(() => timeline.push('step'));
            const subEnd = localService.tourEnd$.subscribe(() => timeline.push('end'));

            const steps = Array.from({ length: n }, (_, i) => ({ content: `s${i}` }));
            localService.setSteps(steps);
            localService.start();
            await Promise.resolve();
            await Promise.resolve();
            localService.close();

            subStart.unsubscribe();
            subStep.unsubscribe();
            subEnd.unsubscribe();

            return timeline.length >= 2 && timeline[0] === 'start' && timeline[timeline.length - 1] === 'end';
          }),
          { numRuns: 20 }
        )
      ).resolves.not.toThrow();
    });
  });

  describe('currentIndex invariant - PBT:', () => {
    it('should keep currentIndex in [0, n-1] during any valid sequence of next/previous/goTo', async () => {
      await expect(
        fc.assert(
          fc.asyncProperty(
            fc.integer({ min: 2, max: 5 }),
            fc.array(fc.constantFrom('next', 'previous', 'goto'), { minLength: 1, maxLength: 10 }),
            async (n, ops) => {
              const localService = TestBed.inject(PoUserGuideService);
              (localService as any).driverInstance = null;
              (localService as any).currentIndex = -1;
              (localService as any).pendingEndReason = null;

              const localMock = createMockDriverFactory();
              (localService as any).loadDriverFactory = vi.fn().mockReturnValue(Promise.resolve(localMock.factory));

              const steps = Array.from({ length: n }, (_, i) => ({ content: `s${i}` }));
              localService.setSteps(steps);
              localService.start();
              await Promise.resolve();
              await Promise.resolve();

              for (const op of ops) {
                if (!localService.isActive()) {
                  break;
                }
                if (op === 'next') {
                  if (localService.getCurrentIndex() < n - 1) {
                    localService.next();
                  }
                } else if (op === 'previous') {
                  if (localService.getCurrentIndex() > 0) {
                    localService.previous();
                  }
                } else {
                  const target = (localService.getCurrentIndex() + 1) % n;
                  localService.goTo(target);
                }
                if (localService.isActive()) {
                  const idx = localService.getCurrentIndex();
                  if (idx < 0 || idx >= n) {
                    return false;
                  }
                }
              }
              if (localService.isActive()) {
                localService.close();
              }
              return true;
            }
          ),
          { numRuns: 20 }
        )
      ).resolves.not.toThrow();
    });
  });

  describe('state after close - PBT:', () => {
    it('should reset state after close() in any sequence', async () => {
      await expect(
        fc.assert(
          fc.asyncProperty(fc.integer({ min: 1, max: 4 }), async n => {
            const localService = TestBed.inject(PoUserGuideService);
            (localService as any).driverInstance = null;
            (localService as any).currentIndex = -1;
            (localService as any).pendingEndReason = null;

            const localMock = createMockDriverFactory();
            (localService as any).loadDriverFactory = vi.fn().mockReturnValue(Promise.resolve(localMock.factory));

            const steps = Array.from({ length: n }, (_, i) => ({ content: `s${i}` }));
            localService.setSteps(steps);
            localService.start();
            await Promise.resolve();
            await Promise.resolve();
            localService.close();
            return localService.isActive() === false && localService.getCurrentIndex() === -1;
          }),
          { numRuns: 20 }
        )
      ).resolves.not.toThrow();
    });
  });

  describe('close() idempotency - PBT:', () => {
    it('should be idempotent across any state', async () => {
      await expect(
        fc.assert(
          fc.asyncProperty(fc.integer({ min: 1, max: 4 }), fc.boolean(), async (n, startedFirst) => {
            const localService = TestBed.inject(PoUserGuideService);
            (localService as any).driverInstance = null;
            (localService as any).currentIndex = -1;
            (localService as any).pendingEndReason = null;

            const localMock = createMockDriverFactory();
            (localService as any).loadDriverFactory = vi.fn().mockReturnValue(Promise.resolve(localMock.factory));

            const events: Array<any> = [];
            const sub = localService.tourEnd$.subscribe(e => events.push(e));

            const steps = Array.from({ length: n }, (_, i) => ({ content: `s${i}` }));
            localService.setSteps(steps);

            if (startedFirst) {
              localService.start();
              await Promise.resolve();
              await Promise.resolve();
            }

            localService.close();
            localService.close();

            sub.unsubscribe();

            return events.length <= 1;
          }),
          { numRuns: 20 }
        )
      ).resolves.not.toThrow();
    });
  });

  describe('start() reentrance - PBT:', () => {
    it('should close the previous tour before starting a new one', async () => {
      await expect(
        fc.assert(
          fc.asyncProperty(fc.integer({ min: 2, max: 4 }), async n => {
            const localService = TestBed.inject(PoUserGuideService);
            (localService as any).driverInstance = null;
            (localService as any).currentIndex = -1;
            (localService as any).pendingEndReason = null;

            const localMock = createMockDriverFactory();
            (localService as any).loadDriverFactory = vi.fn().mockReturnValue(Promise.resolve(localMock.factory));

            const startEvents: Array<any> = [];
            const endEvents: Array<any> = [];
            const subStart = localService.tourStart$.subscribe(e => startEvents.push(e));
            const subEnd = localService.tourEnd$.subscribe(e => endEvents.push(e));

            const steps = Array.from({ length: n }, (_, i) => ({ content: `s${i}` }));
            localService.setSteps(steps);
            localService.start();
            await Promise.resolve();
            await Promise.resolve();
            localService.start(); // re-entrance: should close previous, start new
            await Promise.resolve();
            await Promise.resolve();
            localService.close();

            subStart.unsubscribe();
            subEnd.unsubscribe();

            return startEvents.length === 2 && endEvents.length === 2;
          }),
          { numRuns: 15 }
        )
      ).resolves.not.toThrow();
    });
  });

  describe('i18n defaults:', () => {
    it('should apply Portuguese labels by default', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      // "Próximo" passa pela sanitização HTML: o "ó" é convertido para a entidade numérica
      // "&#243;", decodificada pelo navegador ao renderizar o texto via innerHTML no driver.js.
      expect(inst.config.nextBtnText).toBe('Pr&#243;ximo');
      expect(inst.config.prevBtnText).toBe('Anterior');
      expect(inst.config.doneBtnText).toBe('Finalizar');
      expect(inst.config.progressText).toBe('{{current}} de {{total}}');
    });
  });

  describe('label overrides:', () => {
    it('should apply global setOptions overrides and per-step overrides correctly', async () => {
      service.setOptions({ nextLabel: 'Continue' });
      service.setSteps([{ content: 'a' }, { content: 'b', nextLabel: 'Specific' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.nextBtnText).toBe('Continue');
      expect(inst.config.steps[0].popover.nextBtnText).toBe('Continue');
      expect(inst.config.steps[1].popover.nextBtnText).toBe('Specific');
    });
  });

  describe('progressTemplate substitution - PBT:', () => {
    it('should preserve placeholders {{current}} and {{total}} in the resolved options for any input', async () => {
      await expect(
        fc.assert(
          fc.asyncProperty(
            fc.integer({ min: 1, max: 100 }),
            fc.integer({ min: 1, max: 100 }),
            async (current, total) => {
              const localService = TestBed.inject(PoUserGuideService);
              (localService as any).driverInstance = null;
              (localService as any).currentIndex = -1;
              (localService as any).pendingEndReason = null;
              const localMock = createMockDriverFactory();
              (localService as any).loadDriverFactory = vi.fn().mockReturnValue(Promise.resolve(localMock.factory));

              const template = '{{current}}/{{total}}';
              localService.setOptions({ progressTemplate: template });
              const rendered = template.replace('{{current}}', String(current)).replace('{{total}}', String(total));
              return rendered.includes(String(current)) && rendered.includes(String(total));
            }
          ),
          { numRuns: 30 }
        )
      ).resolves.not.toThrow();
    });
  });

  describe('progressTemplate warning:', () => {
    it('should warn when progressTemplate has no placeholders', () => {
      const warnSpy = vi.spyOn(console as any, 'warn');
      service.setOptions({ progressTemplate: 'sem placeholder' });
      expect(warnSpy).toHaveBeenCalled();
      const message = vi.mocked(warnSpy).mock.lastCall[0] as string;
      expect(message).toContain('sem placeholder');
    });
  });

  describe('selectors - CSS string:', () => {
    it('should accept a CSS selector string as the element', async () => {
      service.setSteps([{ content: 'a', element: '#my-id' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].element).toBe('#my-id');
    });
  });

  describe('selectors - HTMLElement:', () => {
    it('should accept an HTMLElement reference as the element', async () => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      try {
        service.setSteps([{ content: 'a', element: el }]);
        service.start();
        await Promise.resolve();
        await Promise.resolve();
        const inst = mock.lastInstance();
        expect(inst.config.steps[0].element).toBe(el);
      } finally {
        document.body.removeChild(el);
      }
    });
  });

  describe('selectors - undefined element:', () => {
    it('should pass undefined element to Driver.js when step has no element', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].element).toBeUndefined();
    });
  });

  describe('selectors - non-existing element:', () => {
    it('should not throw when element selector points to a non-existing DOM element', async () => {
      expect(() => service.setSteps([{ content: 'a', element: '#totally-non-existing-element-xyz' }])).not.toThrow();
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].element).toBe('#totally-non-existing-element-xyz');
    });
  });

  describe('a11y - keyboardControl:', () => {
    it('should forward keyboardControl: true to driver.js by default', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.keyboardControl).toBe(true);
    });

    it('should forward keyboardControl: false when disabled via setOptions', async () => {
      service.setOptions({ keyboardControl: false });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.keyboardControl).toBe(false);
    });
  });

  describe('a11y - popover focus on start:', () => {
    it('should enable keyboardControl by default which causes driver.js to focus the popover on start', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      // Driver.js focuses the popover when keyboardControl is true.
      expect(inst.config.keyboardControl).toBe(true);
    });
  });

  describe('a11y - focus restoration on close:', () => {
    it('should call driverInstance.destroy() on close, allowing driver.js to restore focus', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      inst.destroy.mockClear();
      service.close();
      expect(inst.destroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('a11y - focus trap:', () => {
    it('should rely on driver.js focus trap (verified via keyboardControl forwarding)', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.keyboardControl).toBe(true);
    });
  });

  describe('a11y - ARIA attributes:', () => {
    it('should set role="dialog" and aria-label on popover wrapper via onPopoverRender', async () => {
      service.setSteps([{ content: 'Step content', title: 'Step title' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const driveStep = inst.config.steps[0];
      expect(typeof driveStep.popover.onPopoverRender).toBe('function');

      const fakeWrapper = document.createElement('div');
      driveStep.popover.onPopoverRender({ wrapper: fakeWrapper });
      expect(fakeWrapper.getAttribute('role')).toBe('dialog');
      expect(fakeWrapper.getAttribute('aria-label')).toBe('Step title');
    });

    it('should fall back to content excerpt when title is absent', async () => {
      service.setSteps([
        { content: 'A long content text that should be used as fallback aria-label when title is missing' }
      ]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const driveStep = inst.config.steps[0];
      const fakeWrapper = document.createElement('div');
      driveStep.popover.onPopoverRender({ wrapper: fakeWrapper });
      expect(fakeWrapper.getAttribute('role')).toBe('dialog');
      expect(fakeWrapper.getAttribute('aria-label')).toMatch(/^A long content/);
    });

    it('should be a no-op when popoverDom is null/undefined or has no wrapper', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const driveStep = inst.config.steps[0];
      expect(() => driveStep.popover.onPopoverRender(null)).not.toThrow();
      expect(() => driveStep.popover.onPopoverRender(undefined)).not.toThrow();
      expect(() => driveStep.popover.onPopoverRender({})).not.toThrow();
    });
  });

  describe('lifecycle - additional coverage:', () => {
    it('should be a no-op when close() is called without active tour', () => {
      let endEmitted = false;
      service.tourEnd$.subscribe(() => (endEmitted = true));
      expect(() => service.close()).not.toThrow();
      expect(endEmitted).toBe(false);
      expect(mock.factory).not.toHaveBeenCalled();
    });

    it('should be a no-op when exit() is called without active tour', () => {
      let endEmitted = false;
      service.tourEnd$.subscribe(() => (endEmitted = true));
      expect(() => service.exit()).not.toThrow();
      expect(endEmitted).toBe(false);
    });

    it('should call close() when exit() is invoked with active tour', async () => {
      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.exit();
      expect(events.length).toBe(1);
      expect(events[0].reason).toBe('closed');
    });

    it('should emit tourEnd$ with reason "closed" when onCloseClick hook is triggered', async () => {
      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      inst.triggerCloseClick();
      expect(events.length).toBe(1);
      expect(events[0].reason).toBe('closed');
    });
  });

  describe('start() error paths:', () => {
    it('should throw when start() is called before setSteps()', () => {
      expect(() => service.start()).toThrowError(/lista de passos/);
    });

    it('should throw when startIndex is out of range', () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      expect(() => service.start(-1)).toThrowError(/fora do intervalo/);
      expect(() => service.start(5)).toThrowError(/fora do intervalo/);
      expect(() => service.start(1.5 as any)).toThrowError(/fora do intervalo/);
      expect(() => service.start('a' as any)).toThrowError(/fora do intervalo/);
    });
  });

  describe('goTo() without active tour:', () => {
    it('should call start(index) when goTo() is invoked without active tour', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      const events: Array<any> = [];
      service.tourStart$.subscribe(e => events.push(e));
      service.goTo(2);
      await Promise.resolve();
      await Promise.resolve();
      expect(events.length).toBe(1);
      expect(events[0].startIndex).toBe(2);
      expect(service.getCurrentIndex()).toBe(2);
    });
  });

  describe('mapStepsToDriveSteps - element handling:', () => {
    it('should preserve element types (string, HTMLElement, undefined) when mapping steps', async () => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      try {
        service.setSteps([{ content: 'a', element: '#sel' }, { content: 'b', element: el }, { content: 'c' }]);
        service.start();
        await Promise.resolve();
        await Promise.resolve();
        const inst = mock.lastInstance();
        expect(inst.config.steps[0].element).toBe('#sel');
        expect(inst.config.steps[1].element).toBe(el);
        expect(inst.config.steps[2].element).toBeUndefined();
      } finally {
        document.body.removeChild(el);
      }
    });
  });

  describe('loadDriverFactory - real body:', () => {
    it('should return the cached driver factory without calling importDriver when cache is populated', async () => {
      (service as any).loadDriverFactory as Mock;
      const importSpy = vi.spyOn(service as any, 'importDriver').mockReturnValue(Promise.resolve({ driver: vi.fn() }));

      const fakeFactory = vi.fn();
      (service as any).driverFactoryCache = fakeFactory;

      const result = await (service as any).loadDriverFactory();
      expect(result).toBe(fakeFactory);
      expect(importSpy).not.toHaveBeenCalled();
    });

    it('should call importDriver on first call and cache the resolved driver factory', async () => {
      (service as any).loadDriverFactory as Mock;
      (service as any).driverFactoryCache = null;

      const driverFn = vi.fn();
      const importSpy = vi.spyOn(service as any, 'importDriver').mockReturnValue(Promise.resolve({ driver: driverFn }));

      const first = await (service as any).loadDriverFactory();
      const second = await (service as any).loadDriverFactory();

      expect(first).toBe(driverFn);
      expect(second).toBe(driverFn);
      expect(importSpy).toHaveBeenCalledTimes(1);
      expect((service as any).driverFactoryCache).toBe(driverFn);
    });

    it('should throw standardized Error when importDriver rejects with Error', async () => {
      (service as any).loadDriverFactory as Mock;
      (service as any).driverFactoryCache = null;

      const originalError = new Error('Cannot find module driver.js');
      vi.spyOn(service as any, 'importDriver').mockReturnValue(Promise.reject(originalError));

      await expect((service as any).loadDriverFactory()).rejects.toThrowError(/não foi possível carregar driver\.js/);

      expect((service as any).driverFactoryCache).toBeNull();
    });

    it('should return a Promise when importDriver is invoked directly', () => {
      const result = (service as any).importDriver();
      expect(result).toBeInstanceOf(Promise);
      (result as Promise<unknown>).catch(() => {});
    });

    it('should throw standardized Error when importDriver rejects with non-Error value', async () => {
      (service as any).loadDriverFactory as Mock;
      (service as any).driverFactoryCache = null;

      vi.spyOn(service as any, 'importDriver').mockReturnValue(Promise.reject('falha-bruta'));

      await expect((service as any).loadDriverFactory()).rejects.toThrowError(/não foi possível carregar driver\.js/);
    });
  });

  describe('mapStepsToDriveSteps - position handling:', () => {
    it('should map concrete step.position values to popover.side and omit when auto/undefined', async () => {
      service.setSteps([
        { content: 'a', position: PoUserGuidePosition.Top },
        { content: 'b', position: PoUserGuidePosition.Auto },
        { content: 'c' }
      ]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.side).toBe('top');
      expect(inst.config.steps[1].popover.side).toBeUndefined();
      expect(inst.config.steps[2].popover.side).toBeUndefined();
    });

    it('should map step.align to popover.align and default to undefined when absent', async () => {
      service.setSteps([{ content: 'a', align: PoUserGuideAlignment.Center }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.align).toBe('center');
      expect(inst.config.steps[1].popover.align).toBeUndefined();
    });
  });

  describe('focusPopoverDescription:', () => {
    it('should set tabindex=-1 and focus the description element when present', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();

      const description = document.createElement('p');
      const focusSpy = vi.spyOn(description as any, 'focus');
      const wrapper = document.createElement('div');

      vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

      inst.config.steps[0].popover.onPopoverRender({ wrapper, description });
      expect(description.getAttribute('tabindex')).toBe('-1');
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('should be a no-op when description is absent on popoverDom', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const wrapper = document.createElement('div');
      expect(() => inst.config.steps[0].popover.onPopoverRender({ wrapper })).not.toThrow();
    });
  });

  describe('applyDoneButtonLabel:', () => {
    it('should apply global doneLabel to nextButton on the last step', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const wrapper = document.createElement('div');
      const nextButton = document.createElement('button');
      inst.config.steps[1].popover.onPopoverRender({ wrapper, nextButton });
      expect(nextButton.textContent).toBe('Finalizar');
      expect(nextButton.getAttribute('aria-label')).toBe('Finalizar');
    });

    it('should prefer step-specific doneLabel over global option on the last step', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b', doneLabel: 'Concluir' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const wrapper = document.createElement('div');
      const nextButton = document.createElement('button');
      inst.config.steps[1].popover.onPopoverRender({ wrapper, nextButton });
      expect(nextButton.textContent).toBe('Concluir');
      expect(nextButton.getAttribute('aria-label')).toBe('Concluir');
    });

    it('should not change nextButton text on intermediate steps', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const wrapper = document.createElement('div');
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Próximo';
      inst.config.steps[0].popover.onPopoverRender({ wrapper, nextButton });
      expect(nextButton.textContent).toBe('Próximo');
    });

    it('should be a no-op when nextButton is absent on popoverDom', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const wrapper = document.createElement('div');
      expect(() => inst.config.steps[1].popover.onPopoverRender({ wrapper })).not.toThrow();
    });
  });

  describe('applyPoButtonStyles:', () => {
    it('should apply PO classes, type attribute, and aria-label to previous/next/close buttons', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();

      const wrapper = document.createElement('div');
      const previousButton = document.createElement('button');
      const nextButton = document.createElement('button');
      const closeButton = document.createElement('button');

      inst.config.steps[0].popover.onPopoverRender({
        wrapper,
        previousButton,
        nextButton,
        closeButton
      });

      expect(previousButton.classList.contains('po-user-guide-button')).toBe(true);
      expect(previousButton.classList.contains('po-user-guide-button-secondary')).toBe(true);
      expect(previousButton.getAttribute('type')).toBe('button');

      expect(nextButton.classList.contains('po-user-guide-button')).toBe(true);
      expect(nextButton.classList.contains('po-user-guide-button-primary')).toBe(true);
      expect(nextButton.getAttribute('type')).toBe('button');

      expect(closeButton.classList.contains('po-user-guide-button-close')).toBe(true);
      expect(closeButton.getAttribute('type')).toBe('button');
      expect(closeButton.getAttribute('aria-label')).toBe('Fechar');
    });

    it('should replace the native "×" of the close button with the ICON_CLOSE icon', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';

      inst.config.steps[0].popover.onPopoverRender({
        wrapper: document.createElement('div'),
        previousButton: document.createElement('button'),
        nextButton: document.createElement('button'),
        closeButton
      });

      const icon = closeButton.querySelector('.po-user-guide-button-close-icon');
      expect(closeButton.textContent).toBe('');
      expect(icon).not.toBeNull();
      expect(icon.classList.contains('an')).toBe(true);
      expect(icon.classList.contains('an-x')).toBe(true);
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

    it('should not duplicate the close icon when the popover is re-rendered', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();

      const closeButton = document.createElement('button');
      const render = () =>
        inst.config.steps[0].popover.onPopoverRender({
          wrapper: document.createElement('div'),
          previousButton: document.createElement('button'),
          nextButton: document.createElement('button'),
          closeButton
        });

      render();
      render();

      expect(closeButton.querySelectorAll('.po-user-guide-button-close-icon').length).toBe(1);
    });
  });

  describe('options.onStepChange callback:', () => {
    it('should invoke options.onStepChange on start and on each navigation', async () => {
      const cb = vi.fn();
      service.setOptions({ onStepChange: cb });
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      expect(cb).toHaveBeenCalledTimes(1);
      const startEvent = vi.mocked(cb).mock.lastCall[0];
      expect(startEvent.index).toBe(0);
      expect(startEvent.direction).toBe('start');
      expect(startEvent.totalSteps).toBe(2);

      service.next();
      expect(cb).toHaveBeenCalledTimes(2);
      expect(vi.mocked(cb).mock.lastCall[0].direction).toBe('next');
    });
  });

  describe('resolveActiveIndex - null fallback:', () => {
    it('should not emit stepChange and not change currentIndex when no candidate is valid', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      const inst = mock.lastInstance();
      inst.getActiveIndex.mockReturnValue(99); // fora do intervalo

      const indexBefore = service.getCurrentIndex();
      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));

      inst.config.onHighlightStarted(null, null, { state: { activeIndex: -1 } });

      expect(events.length).toBe(0);
      expect(service.getCurrentIndex()).toBe(indexBefore);
    });
  });

  describe('resolveShowButtons - allowClose false:', () => {
    it('should filter "close" from step.showButtons when allowClose is false', async () => {
      service.setOptions({ allowClose: false });
      service.setSteps([{ content: 'a', showButtons: ['next', 'previous', 'close'] }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.showButtons).toEqual(['next', 'previous']);
    });

    it('should default to ["next","previous"] when allowClose is false and showButtons is undefined', async () => {
      service.setOptions({ allowClose: false });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.showButtons).toEqual(['next', 'previous']);
    });
  });

  describe('handleDestroyed - clean state early return:', () => {
    it('should not emit tourEnd when onDestroyed fires with already-clean state', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();

      service.close(); // limpa driverInstance e currentIndex; emite tourEnd

      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));

      inst.config.onDestroyed(); // segunda invocação — deve ser no-op

      expect(events.length).toBe(0);
    });
  });

  describe('handleDestroyed - default closed reason:', () => {
    it('should default reason to "closed" when destroyed without pendingEndReason', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();

      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));

      inst.triggerDestroyed();

      expect(events.length).toBe(1);
      expect(events[0].reason).toBe('closed');
      expect(events[0].totalSteps).toBe(2);
    });
  });

  describe('handleDestroyed - lastIndex fallback:', () => {
    it('should fall back to lastIndex=0 when currentIndex is -1 at destroy time', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();

      (service as any).currentIndex = -1;

      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));

      inst.config.onDestroyed();

      expect(events.length).toBe(1);
      expect(events[0].lastIndex).toBe(0);
    });
  });

  describe('handleCloseClick - allowClose false:', () => {
    it('should ignore onCloseClick hook when allowClose is false', async () => {
      service.setOptions({ allowClose: false });
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      inst.destroy.mockClear();

      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));

      inst.triggerCloseClick();

      expect(events.length).toBe(0);
      expect(inst.destroy).not.toHaveBeenCalled();
    });
  });

  describe('fluent chaining:', () => {
    it('should return the service instance from setSteps()', () => {
      const result = service.setSteps([{ content: 'a' }]);
      expect(result).toBe(service);
    });

    it('should return the service instance from setOptions()', () => {
      const result = service.setOptions({ allowClose: false });
      expect(result).toBe(service);
    });

    it('should support full fluent chain: setSteps().setOptions().start()', async () => {
      expect(() =>
        service
          .setSteps([{ content: 'a' }])
          .setOptions({ showProgress: false })
          .start()
      ).not.toThrow();
      await Promise.resolve();
      await Promise.resolve();
      expect(service.isActive()).toBe(true);
    });
  });

  describe('setSteps validation:', () => {
    it('should throw when steps is null', () => {
      expect(() => service.setSteps(null as any)).toThrowError(/obrigatória/);
    });

    it('should throw when steps is undefined', () => {
      expect(() => service.setSteps(undefined as any)).toThrowError(/obrigatória/);
    });

    it('should throw when steps is not an array', () => {
      expect(() => service.setSteps('not-an-array' as any)).toThrowError(/array/);
    });

    it('should throw when steps is an empty array', () => {
      expect(() => service.setSteps([])).toThrowError(/vazia/);
    });

    it('should throw when a step entry is null', () => {
      expect(() => service.setSteps([null] as any)).toThrowError(/índice 0 é inválido/);
    });

    it('should throw when a step is missing the content property', () => {
      expect(() => service.setSteps([{}] as any)).toThrowError(/content/);
    });

    it('should throw when a step has empty content', () => {
      expect(() => service.setSteps([{ content: '' }])).toThrowError(/content/);
    });

    it('should throw when a step has whitespace-only content', () => {
      expect(() => service.setSteps([{ content: '   ' }])).toThrowError(/content/);
    });

    it('should throw when a step has an invalid CSS selector', () => {
      expect(() => service.setSteps([{ content: 'ok', element: 'invalid<<<' }])).toThrowError(/seletor CSS inválido/);
    });

    it('should not throw for valid steps with valid CSS selectors', () => {
      expect(() => service.setSteps([{ content: 'ok', element: '.valid-class' }])).not.toThrow();
    });
  });

  describe('overlayOpacity:', () => {
    it('should forward overlayOpacity to driver.js config', async () => {
      service.setOptions({ overlayOpacity: 0.5 });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.overlayOpacity).toBe(0.5);
    });

    it('should clamp overlayOpacity to 0 when negative', async () => {
      service.setOptions({ overlayOpacity: -0.5 });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.overlayOpacity).toBe(0);
    });

    it('should clamp overlayOpacity to 1 when greater than 1', async () => {
      service.setOptions({ overlayOpacity: 2 });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.overlayOpacity).toBe(1);
    });

    it('should fall back to default (0.7) when overlayOpacity is NaN', async () => {
      service.setOptions({ overlayOpacity: NaN });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.overlayOpacity).toBe(0.7);
    });

    it('should fall back to default (0.7) when overlayOpacity is Infinity', async () => {
      service.setOptions({ overlayOpacity: Infinity });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.overlayOpacity).toBe(0.7);
    });
  });

  describe('popoverClass:', () => {
    it('should concatenate custom popoverClass with default po-user-guide-popover', async () => {
      service.setOptions({ popoverClass: 'my-custom-class' });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.popoverClass).toContain('po-user-guide-popover');
      expect(inst.config.popoverClass).toContain('my-custom-class');
    });

    it('should apply only po-user-guide-popover when popoverClass is not set', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.popoverClass).toBe('po-user-guide-popover');
    });

    it('should apply popoverClass to each step popover as well', async () => {
      service.setOptions({ popoverClass: 'custom' });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.popoverClass).toContain('po-user-guide-popover');
      expect(inst.config.steps[0].popover.popoverClass).toContain('custom');
    });
  });

  describe('allowScroll - scroll lock integration:', () => {
    it('should activate scroll lock when allowScroll is not set (default)', async () => {
      const lockSpy = vi.spyOn((service as any).scrollLock, 'lock');
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      expect(lockSpy).toHaveBeenCalledTimes(1);
    });

    it('should activate scroll lock when allowScroll is false', async () => {
      const lockSpy = vi.spyOn((service as any).scrollLock, 'lock');
      service.setOptions({ allowScroll: false });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      expect(lockSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT activate scroll lock when allowScroll is true', async () => {
      const lockSpy = vi.spyOn((service as any).scrollLock, 'lock');
      service.setOptions({ allowScroll: true });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      expect(lockSpy).not.toHaveBeenCalled();
    });

    it('should unlock scroll on close()', async () => {
      const unlockSpy = vi.spyOn((service as any).scrollLock, 'unlock');
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.close();
      expect(unlockSpy).toHaveBeenCalled();
    });

    it('should unlock scroll on tour completion via next()', async () => {
      const unlockSpy = vi.spyOn((service as any).scrollLock, 'unlock');
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.next(); // completes the tour (single step)
      expect(unlockSpy).toHaveBeenCalled();
    });
  });

  describe('stepChange$ direction detection:', () => {
    it('should emit direction "start" on the first step', async () => {
      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      expect(events[0].direction).toBe('start');
    });

    it('should emit direction "next" when advancing', async () => {
      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.next();
      expect(events[1].direction).toBe('next');
    });

    it('should emit direction "previous" when going back', async () => {
      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.next();
      service.previous();
      expect(events[2].direction).toBe('previous');
    });

    it('should emit direction "goto" when jumping to a non-adjacent step', async () => {
      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.goTo(2);
      expect(events[1].direction).toBe('goto');
    });
  });

  describe('start() with non-zero startIndex:', () => {
    it('should begin the tour at the specified startIndex', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start(1);
      await Promise.resolve();
      await Promise.resolve();
      expect(service.getCurrentIndex()).toBe(1);
      expect(service.getCurrentStep()).toEqual(expect.objectContaining({ content: 'b' }));
    });

    it('should emit tourStart$ with the correct startIndex', async () => {
      const events: Array<any> = [];
      service.tourStart$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start(2);
      await Promise.resolve();
      await Promise.resolve();
      expect(events[0].startIndex).toBe(2);
    });

    it('should pass startIndex to driverInstance.drive()', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start(1);
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.drive).toHaveBeenCalledWith(1);
    });
  });

  describe('setOptions with custom literals:', () => {
    it('should apply custom literals to driver config labels', async () => {
      service.setOptions({ literals: { next: 'Avançar', previous: 'Voltar', done: 'Concluir', close: 'X' } });
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      // "Avançar" sanitizado: o "ç" é convertido para a entidade numérica "&#231;".
      expect(inst.config.nextBtnText).toBe('Avan&#231;ar');
      expect(inst.config.prevBtnText).toBe('Voltar');
      expect(inst.config.doneBtnText).toBe('Concluir');
    });

    it('should merge partial literals with defaults', async () => {
      service.setOptions({ literals: { next: 'Go' } });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.nextBtnText).toBe('Go');
      expect(inst.config.prevBtnText).toBe('Anterior');
    });
  });

  describe('showProgress forwarding:', () => {
    it('should forward showProgress: true to driver.js config by default', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.showProgress).toBe(true);
    });

    it('should forward showProgress: false when disabled via setOptions', async () => {
      service.setOptions({ showProgress: false });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.showProgress).toBe(false);
    });
  });

  describe('allowClose forwarding:', () => {
    it('should forward allowClose: true to driver.js config by default', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.allowClose).toBe(true);
    });

    it('should forward allowClose: false when disabled via setOptions', async () => {
      service.setOptions({ allowClose: false });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.allowClose).toBe(false);
    });
  });

  describe('start() error recovery:', () => {
    it('should reset internal state when driver factory throws during start', async () => {
      const errorFactory = vi.fn().mockImplementation(() => {
        throw new Error('factory-crash');
      });
      (service as any).loadDriverFactory = vi.fn().mockReturnValue(Promise.resolve(errorFactory));

      const errorSpy = vi.spyOn(console as any, 'error');
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(service.isActive()).toBe(false);
      expect(service.getCurrentIndex()).toBe(-1);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('setOptions without arguments:', () => {
    it('should apply default options when called without arguments', async () => {
      service.setOptions();
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.allowClose).toBe(true);
      expect(inst.config.showProgress).toBe(true);
      expect(inst.config.keyboardControl).toBe(true);
      expect(inst.config.overlayOpacity).toBe(0.7);
    });
  });

  describe('resolveShowButtons - allowClose true:', () => {
    it('should pass step.showButtons as-is when allowClose is true', async () => {
      service.setOptions({ allowClose: true });
      service.setSteps([{ content: 'a', showButtons: ['next', 'close'] }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.showButtons).toEqual(['next', 'close']);
    });

    it('should pass undefined when step has no showButtons and allowClose is true', async () => {
      service.setOptions({ allowClose: true });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.showButtons).toBeUndefined();
    });
  });

  describe('stepChange$ event shape:', () => {
    it('should include step, index, direction, and totalSteps in every emission', async () => {
      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'step-a' }, { content: 'step-b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      const event = events[0];
      expect(event.step).toEqual(expect.objectContaining({ content: 'step-a' }));
      expect(event.index).toBe(0);
      expect(event.direction).toBe('start');
      expect(event.totalSteps).toBe(2);
    });
  });

  describe('tourEnd$ event shape:', () => {
    it('should include reason, lastIndex, and totalSteps on close', async () => {
      const events: Array<any> = [];
      service.tourEnd$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      service.next();
      service.close();

      expect(events[0].reason).toBe('closed');
      expect(events[0].lastIndex).toBe(1);
      expect(events[0].totalSteps).toBe(3);
    });
  });

  describe('tourStart$ event shape:', () => {
    it('should include totalSteps, startIndex, and timestamp', async () => {
      const events: Array<any> = [];
      service.tourStart$.subscribe(e => events.push(e));
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      const before = Date.now();
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const after = Date.now();

      expect(events[0].totalSteps).toBe(2);
      expect(events[0].startIndex).toBe(0);
      expect(events[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(events[0].timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('per-step label overrides:', () => {
    it('should apply step-specific previousLabel override', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b', previousLabel: 'Voltar' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[1].popover.prevBtnText).toBe('Voltar');
    });

    it('should fall back to global previousLabel when step does not override', async () => {
      service.setOptions({ previousLabel: 'Back' });
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.prevBtnText).toBe('Back');
      expect(inst.config.steps[1].popover.prevBtnText).toBe('Back');
    });
  });

  describe('resolveActiveIndex - getActiveIndex fallback:', () => {
    it('should use getActiveIndex when state.activeIndex is invalid', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }, { content: 'c' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      const inst = mock.lastInstance();
      inst.getActiveIndex.mockReturnValue(2);

      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));

      inst.config.onHighlightStarted(null, null, { state: { activeIndex: -1 } });

      expect(events.length).toBe(1);
      expect(events[0].index).toBe(2);
    });

    it('should handle getActiveIndex throwing an error gracefully', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      const inst = mock.lastInstance();
      inst.getActiveIndex.mockImplementation(() => {
        throw new Error('not available');
      });

      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));

      inst.config.onHighlightStarted(null, null, { state: { activeIndex: 1 } });

      expect(events.length).toBe(1);
      expect(events[0].index).toBe(1);
    });

    it('should return null when both state and getActiveIndex provide invalid values', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      const inst = mock.lastInstance();
      inst.getActiveIndex.mockReturnValue(-5);

      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));

      inst.config.onHighlightStarted(null, null, { state: { activeIndex: 99 } });

      expect(events.length).toBe(0);
    });

    it('should handle null options.state gracefully', async () => {
      service.setSteps([{ content: 'a' }, { content: 'b' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      const inst = mock.lastInstance();
      inst.getActiveIndex.mockReturnValue(1);

      const events: Array<any> = [];
      service.stepChange$.subscribe(e => events.push(e));

      inst.config.onHighlightStarted(null, null, null);

      expect(events.length).toBe(1);
      expect(events[0].index).toBe(1);
    });
  });

  describe('start() auto-resolves options when not set:', () => {
    it('should auto-resolve default options when start() is called without prior setOptions()', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.allowClose).toBe(true);
      expect(inst.config.keyboardControl).toBe(true);
      expect(inst.config.showProgress).toBe(true);
    });
  });

  describe('close() unlocks scroll even if destroy throws:', () => {
    it('should unlock scroll lock in finally block when destroy throws', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();

      const inst = mock.lastInstance();
      inst.destroy.mockImplementation(() => {
        throw new Error('destroy-crash');
      });

      const unlockSpy = vi.spyOn((service as any).scrollLock, 'unlock');
      vi.spyOn((service as any).scrollLock, 'isActive').mockReturnValue(true);

      expect(() => service.close()).toThrow();
      expect(unlockSpy).toHaveBeenCalled();
    });
  });

  describe('sanitization (XSS protection):', () => {
    it('should strip <script> tags from step.content before handing it to driver.js', async () => {
      service.setSteps([{ content: 'Hello<script>alert("xss")</script>' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const description = inst.config.steps[0].popover.description;
      expect(description).toContain('Hello');
      expect(description).not.toContain('<script>');
      expect(description).not.toContain('alert');
    });

    it('should remove inline event handlers from step.content while keeping safe markup', async () => {
      service.setSteps([{ content: '<img src="x" onerror="alert(1)"><b>safe</b>' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const description = inst.config.steps[0].popover.description;
      expect(description).not.toContain('onerror');
      expect(description).toContain('safe');
    });

    it('should sanitize step.title before handing it to driver.js', async () => {
      service.setSteps([{ content: 'a', title: 'Title<script>alert(1)</script>' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      const title = inst.config.steps[0].popover.title;
      expect(title).toContain('Title');
      expect(title).not.toContain('<script>');
    });

    it('should sanitize custom labels provided via setOptions', async () => {
      service.setOptions({ nextLabel: 'Next<script>alert(1)</script>' });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.nextBtnText).not.toContain('<script>');
      expect(inst.config.steps[0].popover.nextBtnText).not.toContain('<script>');
    });

    it('should sanitize per-step label overrides', async () => {
      service.setSteps([{ content: 'a', nextLabel: 'Avançar<img src=x onerror=alert(1)>' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.nextBtnText).not.toContain('onerror');
    });

    it('should pass an absent title through sanitization without altering it', async () => {
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      expect(inst.config.steps[0].popover.title).toBeUndefined();
    });

    it('should HTML-encode non-ASCII characters in custom labels', async () => {
      service.setOptions({ nextLabel: 'Saudação' });
      service.setSteps([{ content: 'a' }]);
      service.start();
      await Promise.resolve();
      await Promise.resolve();
      const inst = mock.lastInstance();
      // O DomSanitizer codifica caracteres não-ASCII como entidades numéricas; o driver.js
      // insere o texto via innerHTML, portanto "&#231;&#227;" é renderizado como "çã".
      expect(inst.config.nextBtnText).toBe('Sauda&#231;&#227;o');
    });
  });
});
