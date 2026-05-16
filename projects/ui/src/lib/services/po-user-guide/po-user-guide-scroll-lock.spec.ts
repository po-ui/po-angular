import {
  PoUserGuideScrollLock,
  ScrollLockSnapshot,
  SCROLL_KEYS,
  resolveScrollLockMode
} from './po-user-guide-scroll-lock';

const buildSnapshot = (overrides: Partial<ScrollLockSnapshot> = {}): ScrollLockSnapshot => ({
  scrollX: 0,
  scrollY: 0,
  scrollbarWidth: 0,
  documentElement: {
    overflow: '',
    overflowX: '',
    overflowY: '',
    position: '',
    top: '',
    left: '',
    width: '',
    paddingRight: ''
  },
  body: {
    overflow: '',
    overflowX: '',
    overflowY: '',
    position: '',
    top: '',
    left: '',
    width: '',
    paddingRight: ''
  },
  ...overrides
});

const findListener = (spy: jasmine.Spy, eventName: string): ((event: any) => void) | undefined => {
  const call = spy.calls.allArgs().find(args => args[0] === eventName);
  return call ? (call[1] as (event: any) => void) : undefined;
};

describe('PoUserGuideScrollLock:', () => {
  let scrollLock: PoUserGuideScrollLock;
  let originalHtmlStyle: string | null;
  let originalBodyStyle: string | null;

  beforeEach(() => {
    originalHtmlStyle = document.documentElement.getAttribute('style');
    originalBodyStyle = document.body.getAttribute('style');

    scrollLock = new PoUserGuideScrollLock();
  });

  afterEach(() => {
    if (scrollLock.isActive()) {
      scrollLock.unlock();
    }

    if (originalHtmlStyle === null) {
      document.documentElement.removeAttribute('style');
    } else {
      document.documentElement.setAttribute('style', originalHtmlStyle);
    }

    if (originalBodyStyle === null) {
      document.body.removeAttribute('style');
    } else {
      document.body.setAttribute('style', originalBodyStyle);
    }

    document.querySelectorAll('.driver-popover').forEach(element => element.remove());
    document.querySelectorAll('[data-po-user-guide-scroll-lock-test]').forEach(element => element.remove());
  });

  it('should be an instance of PoUserGuideScrollLock', () => {
    expect(scrollLock instanceof PoUserGuideScrollLock).toBeTrue();
  });

  describe('SCROLL_KEYS:', () => {
    it('should expose all expected scroll keys', () => {
      expect(SCROLL_KEYS.has('ArrowUp')).toBeTrue();
      expect(SCROLL_KEYS.has('ArrowDown')).toBeTrue();
      expect(SCROLL_KEYS.has('ArrowLeft')).toBeTrue();
      expect(SCROLL_KEYS.has('ArrowRight')).toBeTrue();
      expect(SCROLL_KEYS.has('PageUp')).toBeTrue();
      expect(SCROLL_KEYS.has('PageDown')).toBeTrue();
      expect(SCROLL_KEYS.has('Home')).toBeTrue();
      expect(SCROLL_KEYS.has('End')).toBeTrue();
      expect(SCROLL_KEYS.has(' ')).toBeTrue();
    });

    it('should not include keys that are not related to scrolling', () => {
      expect(SCROLL_KEYS.has('Tab')).toBeFalse();
      expect(SCROLL_KEYS.has('Enter')).toBeFalse();
      expect(SCROLL_KEYS.has('Escape')).toBeFalse();
      expect(SCROLL_KEYS.has('a')).toBeFalse();
    });
  });

  describe('resolveScrollLockMode:', () => {
    it('should return "free" when options.allowScroll is exactly true', () => {
      expect(resolveScrollLockMode({ allowScroll: true })).toBe('free');
    });

    it('should return "blocked" when options.allowScroll is false', () => {
      expect(resolveScrollLockMode({ allowScroll: false })).toBe('blocked');
    });

    it('should return "blocked" when options.allowScroll is undefined', () => {
      expect(resolveScrollLockMode({})).toBe('blocked');
    });

    it('should return "blocked" when options is null', () => {
      expect(resolveScrollLockMode(null)).toBe('blocked');
    });

    it('should return "blocked" when options is undefined', () => {
      expect(resolveScrollLockMode(undefined)).toBe('blocked');
    });

    it('should return "blocked" when called without arguments', () => {
      expect(resolveScrollLockMode()).toBe('blocked');
    });

    it('should not coerce truthy values different from boolean true', () => {
      expect(resolveScrollLockMode({ allowScroll: 1 })).toBe('blocked');
      expect(resolveScrollLockMode({ allowScroll: 'true' })).toBe('blocked');
      expect(resolveScrollLockMode({ allowScroll: {} })).toBe('blocked');
      expect(resolveScrollLockMode({ allowScroll: null })).toBe('blocked');
    });
  });

  describe('isActive:', () => {
    it('should return false when the lock is fresh', () => {
      expect(scrollLock.isActive()).toBeFalse();
    });

    it('should return true after lock() and false after unlock()', () => {
      scrollLock.lock();
      expect(scrollLock.isActive()).toBeTrue();

      scrollLock.unlock();
      expect(scrollLock.isActive()).toBeFalse();
    });
  });

  describe('lock:', () => {
    it('should be a no-op when not running in a browser environment', () => {
      spyOn<any>(scrollLock, 'isBrowser').and.returnValue(false);
      const captureSpy = spyOn<any>(scrollLock, 'captureSnapshot').and.callThrough();

      scrollLock.lock();

      expect(scrollLock.isActive()).toBeFalse();
      expect(captureSpy).not.toHaveBeenCalled();
    });

    it('should be a no-op when invoked while already active', () => {
      scrollLock.lock();
      const captureSpy = spyOn<any>(scrollLock, 'captureSnapshot').and.callThrough();

      scrollLock.lock();

      expect(captureSpy).not.toHaveBeenCalled();
      expect(scrollLock.isActive()).toBeTrue();
    });

    it('should set overflow:hidden on documentElement when locking', () => {
      scrollLock.lock();

      expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('should NOT alter body paddingRight when scrollbarWidth is 0', () => {
      const initialPadding = document.body.style.paddingRight;
      const snapshot = buildSnapshot({ scrollbarWidth: 0 });

      (scrollLock as any).applyLockStyles(snapshot);

      expect(document.body.style.paddingRight).toBe(initialPadding);
    });

    it('should add padding to body equal to the scrollbarWidth when there is a scrollbar', () => {
      document.body.style.paddingRight = '';
      const snapshot = buildSnapshot({ scrollbarWidth: 17 });

      (scrollLock as any).applyLockStyles(snapshot);

      expect(document.body.style.paddingRight).toBe('17px');
    });

    it('should add the scrollbarWidth on top of an existing parseable paddingRight', () => {
      const snapshot = buildSnapshot({
        scrollbarWidth: 10,
        body: {
          overflow: '',
          overflowX: '',
          overflowY: '',
          position: '',
          top: '',
          left: '',
          width: '',
          paddingRight: '5px'
        }
      });

      (scrollLock as any).applyLockStyles(snapshot);

      expect(document.body.style.paddingRight).toBe('15px');
    });

    it('should fall back to a base padding of 0 when previous paddingRight is not finite', () => {
      const snapshot = buildSnapshot({
        scrollbarWidth: 8,
        body: {
          overflow: '',
          overflowX: '',
          overflowY: '',
          position: '',
          top: '',
          left: '',
          width: '',
          paddingRight: 'auto'
        }
      });

      (scrollLock as any).applyLockStyles(snapshot);

      expect(document.body.style.paddingRight).toBe('8px');
    });

    it('should attach wheel, touchmove and keydown listeners on document', () => {
      const addSpy = spyOn(document, 'addEventListener').and.callThrough();

      scrollLock.lock();

      expect(findListener(addSpy, 'wheel')).toBeDefined();
      expect(findListener(addSpy, 'touchmove')).toBeDefined();
      expect(findListener(addSpy, 'keydown')).toBeDefined();
    });

    it('should mark the lock as active after a successful lock()', () => {
      scrollLock.lock();

      expect(scrollLock.isActive()).toBeTrue();
    });
  });

  describe('lock - listeners behavior:', () => {
    it('should call preventDefault on the wheel listener', () => {
      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const wheelListener = findListener(addSpy, 'wheel');
      const preventSpy = jasmine.createSpy('preventDefault');
      wheelListener({ preventDefault: preventSpy } as any);

      expect(preventSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT call preventDefault on the wheel listener when ctrlKey is pressed (browser zoom)', () => {
      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const wheelListener = findListener(addSpy, 'wheel');
      const preventSpy = jasmine.createSpy('preventDefault');
      wheelListener({ ctrlKey: true, preventDefault: preventSpy } as any);

      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('should call preventDefault on the touchmove listener', () => {
      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const touchListener = findListener(addSpy, 'touchmove');
      const preventSpy = jasmine.createSpy('preventDefault');
      touchListener({ preventDefault: preventSpy } as any);

      expect(preventSpy).toHaveBeenCalledTimes(1);
    });

    it('should call preventDefault on keydown when the key is a scroll key and the target is not editable in popover', () => {
      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const keydownListener = findListener(addSpy, 'keydown');
      const preventSpy = jasmine.createSpy('preventDefault');
      const div = document.createElement('div');
      keydownListener({ key: 'ArrowDown', target: div, preventDefault: preventSpy } as any);

      expect(preventSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT call preventDefault on keydown when the key is not a scroll key', () => {
      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const keydownListener = findListener(addSpy, 'keydown');
      const preventSpy = jasmine.createSpy('preventDefault');
      const div = document.createElement('div');
      keydownListener({ key: 'a', target: div, preventDefault: preventSpy } as any);

      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('should NOT call preventDefault on keydown when the target is an input within a popover', () => {
      const popover = document.createElement('div');
      popover.classList.add('driver-popover');
      const input = document.createElement('input');
      popover.appendChild(input);
      document.body.appendChild(popover);

      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const keydownListener = findListener(addSpy, 'keydown');
      const preventSpy = jasmine.createSpy('preventDefault');
      keydownListener({ key: 'ArrowDown', target: input, preventDefault: preventSpy } as any);

      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('should NOT call preventDefault on keydown when the target is a textarea within a popover', () => {
      const popover = document.createElement('div');
      popover.classList.add('driver-popover');
      const textarea = document.createElement('textarea');
      popover.appendChild(textarea);
      document.body.appendChild(popover);

      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const keydownListener = findListener(addSpy, 'keydown');
      const preventSpy = jasmine.createSpy('preventDefault');
      keydownListener({ key: 'ArrowDown', target: textarea, preventDefault: preventSpy } as any);

      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('should NOT call preventDefault on keydown when the target is a contentEditable element within a popover', () => {
      const popover = document.createElement('div');
      popover.classList.add('driver-popover');
      const editable = document.createElement('div');
      editable.setAttribute('contenteditable', 'true');
      popover.appendChild(editable);
      document.body.appendChild(popover);

      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const keydownListener = findListener(addSpy, 'keydown');
      const preventSpy = jasmine.createSpy('preventDefault');
      keydownListener({ key: 'ArrowDown', target: editable, preventDefault: preventSpy } as any);

      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('should call preventDefault on keydown when the target is editable but NOT within a popover', () => {
      const input = document.createElement('input');
      input.setAttribute('data-po-user-guide-scroll-lock-test', '1');
      document.body.appendChild(input);

      const addSpy = spyOn(document, 'addEventListener').and.callThrough();
      scrollLock.lock();

      const keydownListener = findListener(addSpy, 'keydown');
      const preventSpy = jasmine.createSpy('preventDefault');
      keydownListener({ key: 'ArrowDown', target: input, preventDefault: preventSpy } as any);

      expect(preventSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('unlock:', () => {
    it('should be a no-op when not active', () => {
      const removeSpy = spyOn(document, 'removeEventListener').and.callThrough();

      scrollLock.unlock();

      expect(removeSpy).not.toHaveBeenCalled();
      expect(scrollLock.isActive()).toBeFalse();
    });

    it('should restore documentElement and body inline styles to their pre-lock values', () => {
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.position = 'static';
      document.body.style.paddingRight = '4px';

      scrollLock.lock();
      expect(document.documentElement.style.overflow).toBe('hidden');

      scrollLock.unlock();

      expect(document.documentElement.style.overflow).toBe('auto');
      expect(document.documentElement.style.position).toBe('static');
      expect(document.body.style.paddingRight).toBe('4px');
    });

    it('should call window.scrollTo with the captured scroll position on unlock', () => {
      const scrollSpy = spyOn(window, 'scrollTo');

      scrollLock.lock();
      const snapshot = (scrollLock as any).snapshot as ScrollLockSnapshot;
      scrollLock.unlock();

      expect(scrollSpy).toHaveBeenCalledWith(snapshot.scrollX, snapshot.scrollY);
    });

    it('should remove wheel, touchmove and keydown listeners from document', () => {
      scrollLock.lock();
      const removeSpy = spyOn(document, 'removeEventListener').and.callThrough();

      scrollLock.unlock();

      const eventTypes = removeSpy.calls.allArgs().map(args => args[0]);
      expect(eventTypes).toContain('wheel');
      expect(eventTypes).toContain('touchmove');
      expect(eventTypes).toContain('keydown');
    });

    it('should leave the lock inactive after unlock', () => {
      scrollLock.lock();
      scrollLock.unlock();

      expect(scrollLock.isActive()).toBeFalse();
    });

    it('should be safe to call unlock multiple times in a row', () => {
      scrollLock.lock();

      expect(() => {
        scrollLock.unlock();
        scrollLock.unlock();
        scrollLock.unlock();
      }).not.toThrow();
      expect(scrollLock.isActive()).toBeFalse();
    });

    it('should skip removeEventListener for listeners that are null when state is active (defensive branch)', () => {
      scrollLock.lock();
      (scrollLock as any).wheelListener = null;
      (scrollLock as any).touchListener = null;
      (scrollLock as any).keydownListener = null;
      const removeSpy = spyOn(document, 'removeEventListener').and.callThrough();

      scrollLock.unlock();

      const eventTypes = removeSpy.calls.allArgs().map(args => args[0]);
      expect(eventTypes).not.toContain('wheel');
      expect(eventTypes).not.toContain('touchmove');
      expect(eventTypes).not.toContain('keydown');
      expect(scrollLock.isActive()).toBeFalse();
    });

    it('should skip restoreSnapshot when snapshot is null but the lock is active (defensive branch)', () => {
      scrollLock.lock();
      (scrollLock as any).snapshot = null;
      const restoreSpy = spyOn<any>(scrollLock, 'restoreSnapshot').and.callThrough();

      scrollLock.unlock();

      expect(restoreSpy).not.toHaveBeenCalled();
      expect(scrollLock.isActive()).toBeFalse();
    });

    it('should clear listener references and snapshot after unlock', () => {
      scrollLock.lock();
      scrollLock.unlock();

      expect((scrollLock as any).wheelListener).toBeNull();
      expect((scrollLock as any).touchListener).toBeNull();
      expect((scrollLock as any).keydownListener).toBeNull();
      expect((scrollLock as any).snapshot).toBeNull();
    });
  });

  describe('captureSnapshot:', () => {
    it('should snapshot the current scroll position, scrollbar width and inline styles', () => {
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.overflowY = 'scroll';
      document.documentElement.style.position = 'relative';
      document.documentElement.style.top = '1px';
      document.documentElement.style.left = '2px';
      document.documentElement.style.width = '100%';
      document.documentElement.style.paddingRight = '3px';

      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
      document.body.style.position = 'static';
      document.body.style.top = '4px';
      document.body.style.left = '5px';
      document.body.style.width = '99%';
      document.body.style.paddingRight = '6px';

      const expectedHtmlOverflow = document.documentElement.style.overflow;
      const expectedBodyOverflow = document.body.style.overflow;

      const snapshot: ScrollLockSnapshot = (scrollLock as any).captureSnapshot();

      expect(snapshot.scrollX).toBe(window.scrollX);
      expect(snapshot.scrollY).toBe(window.scrollY);
      expect(snapshot.scrollbarWidth).toBeGreaterThanOrEqual(0);

      expect(snapshot.documentElement.overflow).toBe(expectedHtmlOverflow);
      expect(snapshot.documentElement.overflowX).toBe('hidden');
      expect(snapshot.documentElement.overflowY).toBe('scroll');
      expect(snapshot.documentElement.position).toBe('relative');
      expect(snapshot.documentElement.top).toBe('1px');
      expect(snapshot.documentElement.left).toBe('2px');
      expect(snapshot.documentElement.width).toBe('100%');
      expect(snapshot.documentElement.paddingRight).toBe('3px');

      expect(snapshot.body.overflow).toBe(expectedBodyOverflow);
      expect(snapshot.body.overflowX).toBe('hidden');
      expect(snapshot.body.overflowY).toBe('auto');
      expect(snapshot.body.position).toBe('static');
      expect(snapshot.body.top).toBe('4px');
      expect(snapshot.body.left).toBe('5px');
      expect(snapshot.body.width).toBe('99%');
      expect(snapshot.body.paddingRight).toBe('6px');
    });

    it('should clamp scrollbarWidth to 0 when the computed value would be negative', () => {
      const html = document.documentElement;
      const originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(html, 'clientWidth');

      Object.defineProperty(html, 'clientWidth', {
        configurable: true,
        get: () => window.innerWidth + 50
      });

      try {
        const snapshot: ScrollLockSnapshot = (scrollLock as any).captureSnapshot();
        expect(snapshot.scrollbarWidth).toBe(0);
      } finally {
        if (originalClientWidthDescriptor) {
          Object.defineProperty(html, 'clientWidth', originalClientWidthDescriptor);
        } else {
          delete (html as any).clientWidth;
        }
      }
    });
  });

  describe('restoreSnapshot:', () => {
    it('should write all snapshot fields back to documentElement and body', () => {
      const snapshot = buildSnapshot({
        scrollX: 9,
        scrollY: 11,
        documentElement: {
          overflow: '',
          overflowX: 'auto',
          overflowY: 'hidden',
          position: 'fixed',
          top: '7px',
          left: '8px',
          width: '50%',
          paddingRight: '2px'
        },
        body: {
          overflow: '',
          overflowX: 'visible',
          overflowY: 'scroll',
          position: 'absolute',
          top: '13px',
          left: '14px',
          width: '60%',
          paddingRight: '15px'
        }
      });

      const scrollSpy = spyOn(window, 'scrollTo');

      (scrollLock as any).restoreSnapshot(snapshot);

      expect(document.documentElement.style.overflowX).toBe('auto');
      expect(document.documentElement.style.overflowY).toBe('hidden');
      expect(document.documentElement.style.position).toBe('fixed');
      expect(document.documentElement.style.top).toBe('7px');
      expect(document.documentElement.style.left).toBe('8px');
      expect(document.documentElement.style.width).toBe('50%');
      expect(document.documentElement.style.paddingRight).toBe('2px');

      expect(document.body.style.overflowX).toBe('visible');
      expect(document.body.style.overflowY).toBe('scroll');
      expect(document.body.style.position).toBe('absolute');
      expect(document.body.style.top).toBe('13px');
      expect(document.body.style.left).toBe('14px');
      expect(document.body.style.width).toBe('60%');
      expect(document.body.style.paddingRight).toBe('15px');

      expect(scrollSpy).toHaveBeenCalledWith(9, 11);
    });
  });

  describe('isBrowser:', () => {
    it('should return true in the karma browser test environment', () => {
      expect((scrollLock as any).isBrowser()).toBeTrue();
    });
  });

  describe('isScrollKey:', () => {
    it('should return true for known scroll keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      expect((scrollLock as any).isScrollKey(event)).toBeTrue();
    });

    it('should return false for non-scroll keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      expect((scrollLock as any).isScrollKey(event)).toBeFalse();
    });

    it('should return true for Space (" ") key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      expect((scrollLock as any).isScrollKey(event)).toBeTrue();
    });
  });

  describe('isWithinEditableInPopover:', () => {
    it('should return false when the target is null', () => {
      const event = { target: null } as unknown as Event;
      expect((scrollLock as any).isWithinEditableInPopover(event)).toBeFalse();
    });

    it('should return false when the target is a non-editable HTMLElement', () => {
      const div = document.createElement('div');
      const event = { target: div } as unknown as Event;
      expect((scrollLock as any).isWithinEditableInPopover(event)).toBeFalse();
    });

    it('should return false when the target is editable but not within a popover', () => {
      const input = document.createElement('input');
      const event = { target: input } as unknown as Event;
      expect((scrollLock as any).isWithinEditableInPopover(event)).toBeFalse();
    });

    it('should return true when the target is an input within a popover', () => {
      const popover = document.createElement('div');
      popover.classList.add('driver-popover');
      const input = document.createElement('input');
      popover.appendChild(input);
      document.body.appendChild(popover);

      const event = { target: input } as unknown as Event;
      expect((scrollLock as any).isWithinEditableInPopover(event)).toBeTrue();
    });

    it('should return true when the target is a textarea within a popover', () => {
      const popover = document.createElement('div');
      popover.classList.add('driver-popover');
      const textarea = document.createElement('textarea');
      popover.appendChild(textarea);
      document.body.appendChild(popover);

      const event = { target: textarea } as unknown as Event;
      expect((scrollLock as any).isWithinEditableInPopover(event)).toBeTrue();
    });

    it('should return true when the target is a contentEditable element within a popover', () => {
      const popover = document.createElement('div');
      popover.classList.add('driver-popover');
      const editable = document.createElement('div');
      editable.setAttribute('contenteditable', 'true');
      popover.appendChild(editable);
      document.body.appendChild(popover);

      const event = { target: editable } as unknown as Event;
      expect((scrollLock as any).isWithinEditableInPopover(event)).toBeTrue();
    });

    it('should return false when the target is not an HTMLElement (e.g. plain object)', () => {
      const event = { target: { isContentEditable: true } } as unknown as Event;
      expect((scrollLock as any).isWithinEditableInPopover(event)).toBeFalse();
    });
  });
});
