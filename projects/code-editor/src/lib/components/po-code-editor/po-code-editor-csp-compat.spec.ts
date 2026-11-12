import {
  applyMarkedStyles,
  disposeMonacoCspCompat,
  installMonacoCspCompat,
  PO_CSP_STYLE_MARKER,
  rewriteStyleAttributes
} from './po-code-editor-csp-compat';

function currentScriptUrl(): string {
  const match = (new Error().stack ?? '').match(/(https?:\/\/[^\s)]+?):\d+:\d+/);
  return match ? match[1] : '';
}

describe('PoCodeEditorCspCompat:', () => {
  const nonce = 'test-nonce';
  let previousEnvironment: any;
  let policyCounter = 0;

  const uniquePolicyName = () => `po-csp-compat-test-${++policyCounter}`;

  beforeEach(() => {
    previousEnvironment = (window as any).MonacoEnvironment;
    delete (window as any).MonacoEnvironment;
  });

  afterEach(() => {
    disposeMonacoCspCompat();
    (window as any).MonacoEnvironment = previousEnvironment;
  });

  describe('rewriteStyleAttributes:', () => {
    it('should rename the style attribute of the tags', () => {
      expect(rewriteStyleAttributes('<div class="view-line" style="top:19px;">a</div>')).toBe(
        `<div class="view-line" ${PO_CSP_STYLE_MARKER}="top:19px;">a</div>`
      );
    });

    it('should not change text content that looks like a style attribute', () => {
      const html = '<span class="mtk1">&lt;div style="color: red"&gt;</span><span>style="x"</span>';

      expect(rewriteStyleAttributes(html)).toBe(html);
    });

    it('should not change attributes that only end with "style"', () => {
      const html = '<div data-style="x"></div>';

      expect(rewriteStyleAttributes(html)).toBe(html);
    });

    it('should rename every style attribute, including empty ones and svg tags', () => {
      const result = rewriteStyleAttributes('<svg style="position:absolute"></svg><div class="cmdr" style=""></div>');

      expect(result).not.toContain(' style=');
      expect(result.split(PO_CSP_STYLE_MARKER).length - 1).toBe(2);
    });

    it('should return the value unchanged when there is no style attribute or when it is not a string', () => {
      expect(rewriteStyleAttributes('<div class="a"></div>')).toBe('<div class="a"></div>');
      expect(rewriteStyleAttributes(undefined)).toBeUndefined();
    });
  });

  describe('applyMarkedStyles:', () => {
    it('should apply the marked styles through CSSOM and remove the marker, including on the root', () => {
      const root = document.createElement('div');
      root.setAttribute(PO_CSP_STYLE_MARKER, 'width: 10px;');
      root.innerHTML = `<span ${PO_CSP_STYLE_MARKER}="top: 5px;"></span>`;

      applyMarkedStyles(root);

      const child = root.firstElementChild as HTMLElement;
      expect(root.style.width).toBe('10px');
      expect(child.style.top).toBe('5px');
      expect(root.querySelectorAll(`[${PO_CSP_STYLE_MARKER}]`)).toHaveSize(0);
      expect(root.hasAttribute(PO_CSP_STYLE_MARKER)).toBeFalse();
    });

    it('should not throw when the root is not available', () => {
      expect(() => applyMarkedStyles(null)).not.toThrow();
    });

    it('should clear the inline style when the marker has no value', () => {
      const style = { cssText: 'top: 1px;' };
      const element: any = {
        hasAttribute: () => true,
        getAttribute: () => null,
        removeAttribute: jasmine.createSpy('removeAttribute'),
        querySelectorAll: () => [],
        style
      };

      applyMarkedStyles(element);

      expect(element.removeAttribute).toHaveBeenCalledWith(PO_CSP_STYLE_MARKER);
      expect(style.cssText).toBe('');
    });

    it('should only remove the marker of elements without inline style support', () => {
      const element: any = {
        hasAttribute: () => true,
        getAttribute: () => 'top: 1px;',
        removeAttribute: jasmine.createSpy('removeAttribute'),
        querySelectorAll: () => []
      };

      expect(() => applyMarkedStyles(element)).not.toThrow();
      expect(element.removeAttribute).toHaveBeenCalledWith(PO_CSP_STYLE_MARKER);
    });
  });

  describe('installMonacoCspCompat:', () => {
    it('should apply the style attributes of the HTML created by a Monaco policy (innerHTML)', () => {
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      const policy = (window as any).MonacoEnvironment.createTrustedTypesPolicy(uniquePolicyName(), {
        createHTML: (value: string) => value
      });
      const container = document.createElement('div');

      container.innerHTML = policy.createHTML('<div class="view-line" style="top:38px;width:1000000px;">a</div>');

      const line = container.firstElementChild as HTMLElement;
      expect(line.style.top).toBe('38px');
      // O navegador serializa 1000000px como 1e+06px.
      expect(parseFloat(line.style.width)).toBe(1000000);
      expect(line.hasAttribute(PO_CSP_STYLE_MARKER)).toBeFalse();
    });

    it('should apply the style attributes of the HTML created by a Monaco policy (insertAdjacentHTML afterend)', () => {
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      const policy = (window as any).MonacoEnvironment.createTrustedTypesPolicy(uniquePolicyName(), {
        createHTML: (value: string) => value
      });
      const container = document.createElement('div');
      container.appendChild(document.createElement('div'));

      container.firstElementChild.insertAdjacentHTML('afterend', policy.createHTML('<div style="top:19px;"></div>'));

      expect((container.lastElementChild as HTMLElement).style.top).toBe('19px');
      expect(container.querySelectorAll(`[${PO_CSP_STYLE_MARKER}]`)).toHaveSize(0);
    });

    it('should mark the HTML returned as string by a previous policy factory', () => {
      (window as any).MonacoEnvironment = {
        createTrustedTypesPolicy: (name: string, options: any) => ({ name, createHTML: options.createHTML })
      };
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      const policy = (window as any).MonacoEnvironment.createTrustedTypesPolicy(uniquePolicyName(), {
        createHTML: (value: string) => value
      });
      const container = document.createElement('div');

      container.innerHTML = policy.createHTML('<div style="left:4px;"></div>');

      expect((container.firstElementChild as HTMLElement).style.left).toBe('4px');
    });

    it('should apply the style attributes of the HTML inserted inside the element (insertAdjacentHTML beforeend)', () => {
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      const policy = (window as any).MonacoEnvironment.createTrustedTypesPolicy(uniquePolicyName(), {
        createHTML: (value: string) => value
      });
      const container = document.createElement('div');

      container.insertAdjacentHTML('beforeend', policy.createHTML('<div style="top:57px;"></div>'));

      expect((container.firstElementChild as HTMLElement).style.top).toBe('57px');
      expect(container.querySelectorAll(`[${PO_CSP_STYLE_MARKER}]`)).toHaveSize(0);
    });

    it('should mark the HTML when no Trusted Types policy is available', () => {
      (window as any).MonacoEnvironment = { createTrustedTypesPolicy: (): undefined => undefined };
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      const name = uniquePolicyName();
      const policy = (window as any).MonacoEnvironment.createTrustedTypesPolicy(name, {
        createHTML: (value: string) => value
      });
      const container = document.createElement('div');

      const html = policy.createHTML('<div class="view-line" style="top:76px;">a</div>');
      container.innerHTML = html;

      expect(policy.name).toBe(name);
      expect(String(html)).toBe(`<div class="view-line" ${PO_CSP_STYLE_MARKER}="top:76px;">a</div>`);
      expect((container.firstElementChild as HTMLElement).style.top).toBe('76px');
      expect(container.firstElementChild.textContent).toBe('a');
      expect(container.querySelectorAll(`[${PO_CSP_STYLE_MARKER}]`)).toHaveSize(0);
    });

    it('should use the requested name when the created policy has no name', () => {
      (window as any).MonacoEnvironment = {
        createTrustedTypesPolicy: (_name: string, options: any) => ({ createHTML: options.createHTML })
      };
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      const name = uniquePolicyName();

      const policy = (window as any).MonacoEnvironment.createTrustedTypesPolicy(name, {
        createHTML: (value: string) => value
      });

      expect(policy.name).toBe(name);
    });

    it('should not change innerHTML assignments that were not created by a Monaco policy', () => {
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      const container = document.createElement('div');

      container.innerHTML = '<div style="top:1px;"></div>';

      expect(container.firstElementChild.getAttribute('style')).toBe('top:1px;');
    });

    it('should keep policies without createHTML (e.g. worker URLs) unchanged', () => {
      const workerPolicy = { name: 'worker', createScriptURL: (value: string) => value };
      (window as any).MonacoEnvironment = { createTrustedTypesPolicy: () => workerPolicy };
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });

      const policy = (window as any).MonacoEnvironment.createTrustedTypesPolicy('defaultWorkerFactory', {
        createScriptURL: (value: string) => value
      });

      expect(policy).toBe(workerPolicy);
    });

    it('should set the nonce on <style> elements created by Monaco code', () => {
      installMonacoCspCompat({ nonce, monacoBaseUrl: currentScriptUrl() });

      const style = document.createElement('style');

      expect(style.nonce).toBe(nonce);
    });

    it('should not set the nonce on <style> elements created outside Monaco code', () => {
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });

      expect(document.createElement('style').nonce).toBe('');
      expect(document.createElement('div').hasAttribute('nonce')).toBeFalse();
    });

    it('should apply setAttribute("style") through CSSOM when called by Monaco code', () => {
      installMonacoCspCompat({ nonce, monacoBaseUrl: currentScriptUrl() });
      const element = document.createElement('div');
      const cssTextSetter = spyOnProperty(element.style, 'cssText', 'set').and.callThrough();

      element.setAttribute('style', 'position:absolute;top:2px;');

      expect(cssTextSetter).toHaveBeenCalledWith('position:absolute;top:2px;');
      expect(element.style.top).toBe('2px');
    });

    it('should keep setAttribute unchanged for other attributes and for calls outside Monaco code', () => {
      installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      const element = document.createElement('div');

      element.setAttribute('style', 'top:3px;');
      element.setAttribute('class', 'a');

      expect(element.getAttribute('style')).toBe('top:3px;');
      expect(element.getAttribute('class')).toBe('a');
    });

    it('should install only once and return the same dispose function', () => {
      const dispose = installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });

      expect(installMonacoCspCompat({ nonce: 'other', monacoBaseUrl: 'https://other.invalid/' })).toBe(dispose);
    });

    it('should restore the original behavior when disposed', () => {
      const originalCreateElement = Document.prototype.createElement;
      const originalSetAttribute = Element.prototype.setAttribute;
      const originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
      const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');

      const dispose = installMonacoCspCompat({ nonce, monacoBaseUrl: 'https://monaco.invalid/vs/' });
      dispose();

      expect(Document.prototype.createElement).toBe(originalCreateElement);
      expect(Element.prototype.setAttribute).toBe(originalSetAttribute);
      expect(Element.prototype.insertAdjacentHTML).toBe(originalInsertAdjacentHTML);
      expect(Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set).toBe(originalInnerHTML.set);
      expect((window as any).MonacoEnvironment.createTrustedTypesPolicy).toBeUndefined();
    });
  });
});
