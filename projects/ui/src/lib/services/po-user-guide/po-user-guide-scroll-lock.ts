export interface ScrollLockSnapshot {
  scrollX: number;
  scrollY: number;
  scrollbarWidth: number;

  documentElement: {
    overflow: string;
    overflowX: string;
    overflowY: string;
    position: string;
    top: string;
    left: string;
    width: string;
    paddingRight: string;
  };

  body: {
    overflow: string;
    overflowX: string;
    overflowY: string;
    position: string;
    top: string;
    left: string;
    width: string;
    paddingRight: string;
  };
}

export type ScrollLockMode = 'blocked' | 'free';

export const SCROLL_KEYS: ReadonlySet<string> = new Set<string>([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' '
]);

export function resolveScrollLockMode(options?: { allowScroll?: unknown } | null): ScrollLockMode {
  return options != null && options.allowScroll === true ? 'free' : 'blocked';
}

/**
 * @internal
 *
 * Classe interna do PoUserGuideService responsável por congelar o scroll do navegador
 * (`document.documentElement` e `document.body`) durante o
 * ciclo de vida de um tour conduzido pelo `driver.js` e por restaurar o estado original
 * de forma síncrona em qualquer caminho de saída.
 *
 */
export class PoUserGuideScrollLock {
  private active = false;
  private snapshot: ScrollLockSnapshot | null = null;

  private wheelListener: ((event: WheelEvent) => void) | null = null;
  private touchListener: ((event: TouchEvent) => void) | null = null;
  private keydownListener: ((event: KeyboardEvent) => void) | null = null;

  isActive(): boolean {
    return this.active;
  }

  lock(): void {
    if (!this.isBrowser() || this.active === true) {
      return;
    }

    this.snapshot = this.captureSnapshot();
    this.applyLockStyles(this.snapshot);

    const listenerOptions: AddEventListenerOptions = { passive: false };
    this.wheelListener = (event: WheelEvent) => {
      // Libera o zoom do navegador (Ctrl + scroll e pinça no trackpad, que dispara wheel com ctrlKey).
      if (event.ctrlKey) {
        return;
      }
      event.preventDefault();
    };
    this.touchListener = (event: TouchEvent) => event.preventDefault();
    this.keydownListener = (event: KeyboardEvent) => {
      if (this.isScrollKey(event) && !this.isWithinEditableInPopover(event)) {
        event.preventDefault();
      }
    };
    document.addEventListener('wheel', this.wheelListener, listenerOptions);
    document.addEventListener('touchmove', this.touchListener, listenerOptions);
    document.addEventListener('keydown', this.keydownListener);

    this.active = true;
  }

  unlock(): void {
    if (this.active === false) {
      return;
    }

    if (this.snapshot !== null) {
      this.restoreSnapshot(this.snapshot);
    }

    const listenerOptions: AddEventListenerOptions = { passive: false };
    if (this.wheelListener !== null) {
      document.removeEventListener('wheel', this.wheelListener, listenerOptions);
    }
    if (this.touchListener !== null) {
      document.removeEventListener('touchmove', this.touchListener, listenerOptions);
    }
    if (this.keydownListener !== null) {
      document.removeEventListener('keydown', this.keydownListener);
    }

    this.wheelListener = null;
    this.touchListener = null;
    this.keydownListener = null;
    this.snapshot = null;

    this.active = false;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  private captureSnapshot(): ScrollLockSnapshot {
    const html = document.documentElement;
    const body = document.body;
    const scrollbarWidth = Math.max(0, window.innerWidth - html.clientWidth);

    return {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      scrollbarWidth,
      documentElement: {
        overflow: html.style.overflow,
        overflowX: html.style.overflowX,
        overflowY: html.style.overflowY,
        position: html.style.position,
        top: html.style.top,
        left: html.style.left,
        width: html.style.width,
        paddingRight: html.style.paddingRight
      },
      body: {
        overflow: body.style.overflow,
        overflowX: body.style.overflowX,
        overflowY: body.style.overflowY,
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        width: body.style.width,
        paddingRight: body.style.paddingRight
      }
    };
  }

  private applyLockStyles(snapshot: ScrollLockSnapshot): void {
    document.documentElement.style.overflow = 'hidden';

    if (snapshot.scrollbarWidth > 0) {
      const previousPadding = parseFloat(snapshot.body.paddingRight);
      const basePadding = Number.isFinite(previousPadding) ? previousPadding : 0;
      document.body.style.paddingRight = `${basePadding + snapshot.scrollbarWidth}px`;
    }
  }

  private restoreSnapshot(snapshot: ScrollLockSnapshot): void {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = snapshot.documentElement.overflow;
    html.style.overflowX = snapshot.documentElement.overflowX;
    html.style.overflowY = snapshot.documentElement.overflowY;
    html.style.position = snapshot.documentElement.position;
    html.style.top = snapshot.documentElement.top;
    html.style.left = snapshot.documentElement.left;
    html.style.width = snapshot.documentElement.width;
    html.style.paddingRight = snapshot.documentElement.paddingRight;

    body.style.overflow = snapshot.body.overflow;
    body.style.overflowX = snapshot.body.overflowX;
    body.style.overflowY = snapshot.body.overflowY;
    body.style.position = snapshot.body.position;
    body.style.top = snapshot.body.top;
    body.style.left = snapshot.body.left;
    body.style.width = snapshot.body.width;
    body.style.paddingRight = snapshot.body.paddingRight;

    window.scrollTo(snapshot.scrollX, snapshot.scrollY);
  }

  private isScrollKey(event: KeyboardEvent): boolean {
    return SCROLL_KEYS.has(event.key);
  }

  private isWithinEditableInPopover(event: Event): boolean {
    const target = event.target;

    const isEditable =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable === true);

    if (!isEditable) {
      return false;
    }

    return target.closest('.driver-popover') !== null;
  }
}
