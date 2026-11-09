import { askReturnToDeprecatedTheme, isInteractiveTerminal, LineReader, PromptDeps } from './prompt';

describe('v22 theme-deprecated prompt (isInteractiveTerminal):', () => {
  it('should be interactive only when stdin and stdout are TTY outside CI', () => {
    expect(isInteractiveTerminal({ isTTY: true }, { isTTY: true }, {})).toBe(true);
  });

  it('should not be interactive when stdout is redirected (e.g. "> result.txt")', () => {
    expect(isInteractiveTerminal({ isTTY: true }, { isTTY: false }, {})).toBe(false);
    expect(isInteractiveTerminal({ isTTY: true }, {}, {})).toBe(false);
  });

  it('should not be interactive when stdin is not a TTY', () => {
    expect(isInteractiveTerminal({ isTTY: false }, { isTTY: true }, {})).toBe(false);
    expect(isInteractiveTerminal({}, { isTTY: true }, {})).toBe(false);
  });

  it('should not be interactive in CI', () => {
    expect(isInteractiveTerminal({ isTTY: true }, { isTTY: true }, { CI: 'true' })).toBe(false);
    expect(isInteractiveTerminal({ isTTY: true }, { isTTY: true }, { CI: '1' })).toBe(false);
  });

  it('should ignore CI when it is explicitly false', () => {
    expect(isInteractiveTerminal({ isTTY: true }, { isTTY: true }, { CI: 'false' })).toBe(true);
    expect(isInteractiveTerminal({ isTTY: true }, { isTTY: true }, { CI: '0' })).toBe(true);
  });
});

describe('v22 theme-deprecated prompt (askReturnToDeprecatedTheme):', () => {
  /** Monta deps de teste com TTY ligado/desligado e uma resposta pré-definida. */
  function deps(options: { isTTY: boolean; answer?: string; onCreate?: () => void }): {
    deps: PromptDeps;
    close: jasmine.Spy;
    createReader: jasmine.Spy;
  } {
    const close = jasmine.createSpy('close');
    const question = jasmine.createSpy('question').and.callFake((_q: string, cb: (a: string) => void) => {
      cb(options.answer ?? '');
    });
    const reader: LineReader = { question, close };
    const createReader = jasmine.createSpy('createReader').and.callFake(() => {
      options.onCreate?.();
      return reader;
    });

    return { deps: { isTTY: () => options.isTTY, createReader }, close, createReader };
  }

  describe('without TTY (batch/CI):', () => {
    it('should resolve false and never create the line reader', async () => {
      const { deps: d, createReader } = deps({ isTTY: false });

      const result = await askReturnToDeprecatedTheme(d);

      expect(result).toBe(false);
      expect(createReader).not.toHaveBeenCalled();
    });
  });

  describe('with TTY:', () => {
    it('should resolve true for "s"', async () => {
      const { deps: d } = deps({ isTTY: true, answer: 's' });
      expect(await askReturnToDeprecatedTheme(d)).toBe(true);
    });

    it('should resolve true for "sim" (case/space insensitive)', async () => {
      const { deps: d } = deps({ isTTY: true, answer: '  SIM ' });
      expect(await askReturnToDeprecatedTheme(d)).toBe(true);
    });

    it('should resolve true for "yes"', async () => {
      const { deps: d } = deps({ isTTY: true, answer: 'yes' });
      expect(await askReturnToDeprecatedTheme(d)).toBe(true);
    });

    it('should resolve false for an empty answer (default is No)', async () => {
      const { deps: d } = deps({ isTTY: true, answer: '' });
      expect(await askReturnToDeprecatedTheme(d)).toBe(false);
    });

    it('should resolve false for "não"', async () => {
      const { deps: d } = deps({ isTTY: true, answer: 'não' });
      expect(await askReturnToDeprecatedTheme(d)).toBe(false);
    });

    it('should resolve false for any unrelated text', async () => {
      const { deps: d } = deps({ isTTY: true, answer: 'talvez' });
      expect(await askReturnToDeprecatedTheme(d)).toBe(false);
    });

    it('should close the reader after answering', async () => {
      const { deps: d, close } = deps({ isTTY: true, answer: 's' });

      await askReturnToDeprecatedTheme(d);

      expect(close).toHaveBeenCalled();
    });
  });
});
