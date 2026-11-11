import { NgZone } from '@angular/core';

import { isMacPlatform, listenSearchShortcut, matchSearchShortcut, shortcutLabel } from './search-shortcut';

describe('search-shortcut', () => {
  const key = (init: KeyboardEventInit, target?: EventTarget) => {
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });

    if (target) {
      Object.defineProperty(event, 'target', { value: target });
    }

    return event;
  };

  it('reconhece Ctrl+K e Cmd+K (qualquer caixa)', () => {
    expect(matchSearchShortcut(key({ key: 'k', ctrlKey: true }))).toEqual({ via: 'shortcut', shortcutKey: 'ctrl_k' });
    expect(matchSearchShortcut(key({ key: 'K', metaKey: true }))).toEqual({ via: 'shortcut', shortcutKey: 'cmd_k' });
  });

  it('ignora teclas e combinações que não são o atalho', () => {
    expect(matchSearchShortcut(key({ key: 'k' }))).toBeNull();
    expect(matchSearchShortcut(key({ key: 'j', ctrlKey: true }))).toBeNull();
    expect(matchSearchShortcut(key({ key: 'k', ctrlKey: true, shiftKey: true }))).toBeNull();
    expect(matchSearchShortcut(key({ key: 'k', ctrlKey: true, altKey: true }))).toBeNull();
  });

  it('não intercepta com o foco no editor Monaco, mas abre em input comum', () => {
    const monaco = document.createElement('div');
    const inner = document.createElement('textarea');
    const input = document.createElement('input');

    monaco.className = 'monaco-editor';
    monaco.appendChild(inner);

    expect(matchSearchShortcut(key({ key: 'k', ctrlKey: true }, inner))).toBeNull();
    expect(matchSearchShortcut(key({ key: 'k', ctrlKey: true }, input))).not.toBeNull();
  });

  it('listenSearchShortcut chama preventDefault, entra na zona e remove o listener', () => {
    const zone = new NgZone({ enableLongStackTrace: false });
    const spy = jasmine.createSpy('open');
    const remove = listenSearchShortcut(zone, spy);
    const event = key({ key: 'k', ctrlKey: true });

    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(spy).toHaveBeenCalledOnceWith({ via: 'shortcut', shortcutKey: 'ctrl_k' });

    const other = key({ key: 'a' });

    document.dispatchEvent(other);
    expect(other.defaultPrevented).toBeFalse();

    remove();
    document.dispatchEvent(key({ key: 'k', ctrlKey: true }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('rótulo do atalho depende da plataforma', () => {
    expect(isMacPlatform({ platform: 'MacIntel', userAgent: '' })).toBeTrue();
    expect(shortcutLabel({ platform: 'MacIntel', userAgent: '' })).toBe('⌘ K');
    expect(shortcutLabel({ platform: 'Linux x86_64', userAgent: 'X11' })).toBe('Ctrl K');
  });
});
