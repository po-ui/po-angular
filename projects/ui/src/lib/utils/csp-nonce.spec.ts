import { Renderer2 } from '@angular/core';

import { applyCspNonce } from './csp-nonce';

describe('applyCspNonce:', () => {
  it('should set the nonce on the element when a nonce is provided', () => {
    const style = document.createElement('style');

    applyCspNonce(style, 'test-nonce');

    expect(style.nonce).toBe('test-nonce');
  });

  it('should use the renderer when it is provided', () => {
    const style = document.createElement('style');
    const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['setAttribute']);

    applyCspNonce(style, 'test-nonce', renderer);

    expect(renderer.setAttribute).toHaveBeenCalledWith(style, 'nonce', 'test-nonce');
  });

  it('should not change the element when the nonce is null, undefined or empty', () => {
    const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['setAttribute']);

    [null, undefined, ''].forEach(nonce => {
      const style = document.createElement('style');

      applyCspNonce(style, nonce);
      applyCspNonce(style, nonce, renderer);

      expect(style.hasAttribute('nonce')).toBeFalse();
    });

    expect(renderer.setAttribute).not.toHaveBeenCalled();
  });

  it('should not throw when the element is not available', () => {
    expect(() => applyCspNonce(null, 'test-nonce')).not.toThrow();
  });
});
