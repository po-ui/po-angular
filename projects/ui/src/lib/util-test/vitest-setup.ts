import 'zone.js';
import 'zone.js/testing';

// Disable Angular's runtime unknown element/property validation (NG0303/NG0304)
// MUST be called before any component is instantiated.
import { ɵsetUnknownElementStrictMode, ɵsetUnknownPropertyStrictMode } from '@angular/core';
ɵsetUnknownElementStrictMode(false);
ɵsetUnknownPropertyStrictMode(false);

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

// ============================================================
// Suppress noisy jsdom warnings that don't affect test results
// ============================================================
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const suppressedPatterns = ['Could not parse CSS stylesheet', 'Not implemented:', 'Error: Not implemented:'];

function shouldSuppress(args: any[]): boolean {
  const msg = args.map(a => (typeof a === 'string' ? a : a?.message || String(a))).join(' ');
  return suppressedPatterns.some(p => msg.includes(p));
}

console.error = (...args: any[]) => {
  if (shouldSuppress(args)) return;
  originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
  if (shouldSuppress(args)) return;
  originalConsoleWarn.apply(console, args);
};

// ============================================================
// jsdom Polyfills — APIs not implemented in jsdom that Angular
// components and their tests depend on.
// ============================================================

// --- AnimationEvent ---
if (typeof globalThis.AnimationEvent === 'undefined') {
  (globalThis as any).AnimationEvent = class AnimationEvent extends Event {
    animationName: string;
    elapsedTime: number;
    pseudoElement: string;
    constructor(type: string, init?: any) {
      super(type, init);
      this.animationName = init?.animationName || '';
      this.elapsedTime = init?.elapsedTime || 0;
      this.pseudoElement = init?.pseudoElement || '';
    }
  };
}

// --- TransitionEvent ---
if (typeof globalThis.TransitionEvent === 'undefined') {
  (globalThis as any).TransitionEvent = class TransitionEvent extends Event {
    propertyName: string;
    elapsedTime: number;
    pseudoElement: string;
    constructor(type: string, init?: any) {
      super(type, init);
      this.propertyName = init?.propertyName || '';
      this.elapsedTime = init?.elapsedTime || 0;
      this.pseudoElement = init?.pseudoElement || '';
    }
  };
}

// --- window.open ---
window.open = vi.fn().mockReturnValue(null) as any;

// --- window.scrollTo / window.scroll ---
window.scrollTo = vi.fn() as any;
window.scroll = vi.fn() as any;

// --- Element.prototype.scrollTo ---
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function () {};
}

// --- Element.prototype.scrollIntoView ---
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

// --- HTMLElement.prototype.focus (jsdom sometimes throws) ---
const originalFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function (options?: FocusOptions) {
  try {
    originalFocus.call(this, options);
  } catch (e) {
    // silently ignore focus errors in jsdom
  }
};

// --- offsetWidth / offsetHeight / offsetTop / offsetLeft ---
function defineOffsetProperty(prop: string, fallback: number = 0) {
  if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop)?.get) {
    Object.defineProperty(HTMLElement.prototype, prop, {
      configurable: true,
      get() {
        return parseInt(this.style?.[prop.replace('offset', '').toLowerCase()] || '0', 10) || fallback;
      }
    });
  }
}
defineOffsetProperty('offsetWidth');
defineOffsetProperty('offsetHeight');
defineOffsetProperty('offsetTop');
defineOffsetProperty('offsetLeft');

// --- getBoundingClientRect ---
const originalGetBCR = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function () {
  try {
    return originalGetBCR.call(this);
  } catch {
    return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
  }
};

// --- getComputedStyle fallback ---
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = function (element: Element, pseudoElt?: string | null) {
  try {
    return originalGetComputedStyle.call(window, element, pseudoElt);
  } catch {
    return {} as CSSStyleDeclaration;
  }
};

// --- CSS.supports ---
if (typeof globalThis.CSS === 'undefined') {
  (globalThis as any).CSS = { supports: () => false };
} else if (!CSS.supports) {
  (CSS as any).supports = () => false;
}

// --- window.matchMedia ---
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// --- ResizeObserver ---
if (typeof globalThis.ResizeObserver === 'undefined') {
  (globalThis as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// --- MutationObserver (jsdom has it, but ensure it's available) ---
if (typeof globalThis.MutationObserver === 'undefined') {
  (globalThis as any).MutationObserver = class MutationObserver {
    observe() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

// --- IntersectionObserver ---
if (typeof globalThis.IntersectionObserver === 'undefined') {
  (globalThis as any).IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// --- HTMLElement.prototype.animate ---
if (!HTMLElement.prototype.animate) {
  (HTMLElement.prototype as any).animate = function () {
    return { onfinish: null, cancel: () => {}, finished: Promise.resolve() };
  };
}

// --- CSSStyleSheet.insertRule / replaceSync ---
if (!CSSStyleSheet.prototype.replaceSync) {
  CSSStyleSheet.prototype.replaceSync = function () {};
}

// --- navigator.userLanguage (non-standard, used in some tests) ---
if (!('userLanguage' in navigator)) {
  Object.defineProperty(navigator, 'userLanguage', {
    get: () => undefined,
    configurable: true
  });
}

// ============================================================
// Angular TestBed patch
// ============================================================

// Patch TestBed.configureTestingModule to always include CUSTOM_ELEMENTS_SCHEMA and disable unknown element errors
const originalConfigureTestingModule = TestBed.configureTestingModule.bind(TestBed);
TestBed.configureTestingModule = function (moduleDef: any) {
  if (!moduleDef.schemas || !moduleDef.schemas.includes(CUSTOM_ELEMENTS_SCHEMA)) {
    moduleDef.schemas = [...(moduleDef.schemas || []), CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA];
  }
  if (moduleDef.errorOnUnknownElements === undefined) {
    moduleDef.errorOnUnknownElements = false;
  }
  if (moduleDef.errorOnUnknownProperties === undefined) {
    moduleDef.errorOnUnknownProperties = false;
  }
  return originalConfigureTestingModule(moduleDef);
};
