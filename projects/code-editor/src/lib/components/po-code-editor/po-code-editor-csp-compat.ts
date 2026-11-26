/**
 * @docsPrivate
 *
 * Camada de compatibilidade entre o Monaco Editor (`0.44.0`) e Content-Security-Policy (CSP) baseada em *nonce*.
 *
 * O Monaco não oferece opção de *nonce* para os estilos que cria em tempo de execução. Sem esta camada, uma política
 * sem `'unsafe-inline'` bloqueia:
 *
 * 1. os elementos `<style>` criados pelo Monaco (`document.createElement('style')`, inclusive no *shadow DOM* do menu
 * de contexto). **Correção:** o *nonce* é aplicado somente nos `<style>` criados por código do Monaco;
 * 2. os atributos `style` do HTML que o Monaco monta como texto (linhas, números de linha, seleção, decorações etc.).
 * O *nonce* não se aplica a atributos. **Correção:** o HTML passa pelo *hook* público
 * `MonacoEnvironment.createTrustedTypesPolicy`; o atributo `style` das tags é renomeado para um atributo de marcação e,
 * logo após a inserção no DOM (na mesma tarefa), o valor é aplicado via CSSOM (`element.style.cssText`), que a CSP não
 * bloqueia;
 * 3. o `setAttribute('style', ...)` usado pelo Monaco (indicadores do modo diff). **Correção:** quando a chamada vem
 * do Monaco, o valor é aplicado via CSSOM.
 *
 * Escopo:
 * - A camada só é instalada quando a aplicação informa o `CSP_NONCE`, uma vez por página, antes do carregamento do
 * Monaco.
 * - Apenas o HTML produzido pelas políticas de Trusted Types do Monaco é convertido. O Monaco escapa `<`, `>` e `&` no
 * conteúdo do usuário, então o conteúdo não consegue criar tags nem atributos. As demais atribuições de `innerHTML`
 * da página não são alteradas.
 * - Chamadas de `createElement` e `setAttribute` só são alteradas quando o código do Monaco está na pilha de chamadas
 * (identificado pela URL da pasta `vs` do Monaco). Se essa identificação falhar, o comportamento é o anterior.
 */

/** Atributo de marcação que substitui o `style` no HTML gerado pelo Monaco até a aplicação via CSSOM. */
export const PO_CSP_STYLE_MARKER = 'data-po-csp-style';

const INSTALLED_KEY = '__poCodeEditorCspCompat';

/**
 * Tags do HTML gerado pelo Monaco. Como o Monaco escapa `<` e `>` no conteúdo, cada trecho `<...>` é uma tag.
 */
const TAG_REGEX = /<[a-zA-Z][^<>]*>/g;

/** Atributo `style` dentro de uma tag (precedido de espaço, para não alcançar, por exemplo, `data-style`). */
const STYLE_ATTRIBUTE_REGEX = /(\s)style=(["'])/g;

export interface PoMonacoCspCompatOptions {
  /** Nonce da política (o mesmo valor do token `CSP_NONCE`). */
  nonce: string;

  /** URL absoluta da pasta `vs` do Monaco, usada para identificar chamadas originadas no código do Monaco. */
  monacoBaseUrl: string;
}

/** HTML gerado pelo Monaco quando o navegador não oferece Trusted Types. É convertido em texto pelo navegador. */
class PoCspMarkedHtml {
  constructor(private readonly html: string) {}

  toString(): string {
    return this.html;
  }
}

/**
 * Renomeia o atributo `style` das tags do HTML para o atributo de marcação. O conteúdo de texto não é alterado.
 */
export function rewriteStyleAttributes(html: string): string {
  if (typeof html !== 'string' || !html.includes('style=')) {
    return html;
  }

  return html.replaceAll(TAG_REGEX, tag => tag.replaceAll(STYLE_ATTRIBUTE_REGEX, `$1${PO_CSP_STYLE_MARKER}=$2`));
}

/**
 * Aplica via CSSOM os estilos marcados no elemento e nos seus descendentes e remove o atributo de marcação.
 */
export function applyMarkedStyles(root: Element | null | undefined): void {
  if (!root) {
    return;
  }

  if (root.hasAttribute(PO_CSP_STYLE_MARKER)) {
    applyMarkedStyle(root);
  }

  root.querySelectorAll(`[${PO_CSP_STYLE_MARKER}]`).forEach(applyMarkedStyle);
}

/**
 * Instala a camada de compatibilidade. A instalação é única por página: chamadas seguintes reaproveitam a primeira.
 *
 * @returns Função que desfaz a instalação (usada nos testes).
 */
export function installMonacoCspCompat(options: PoMonacoCspCompatOptions): () => void {
  const win = globalThis as any;

  if (win[INSTALLED_KEY]) {
    return win[INSTALLED_KEY].dispose;
  }

  const { nonce, monacoBaseUrl } = options;
  const producedHtml = new WeakSet<object>();

  const isProducedHtml = (value: unknown): boolean =>
    value !== null && typeof value === 'object' && producedHtml.has(value);

  const isCalledFromMonaco = (): boolean => {
    const stack = new Error('po-code-editor-csp-compat: call origin').stack;
    return !!stack && stack.includes(monacoBaseUrl);
  };

  const markHtml = (html: any): any => {
    if (typeof html === 'string') {
      const marked = new PoCspMarkedHtml(html);
      producedHtml.add(marked);
      return marked;
    }

    if (html !== null && typeof html === 'object') {
      producedHtml.add(html);
    }

    return html;
  };

  // 1) <style> criados pelo Monaco recebem o nonce.
  const originalCreateElement = Document.prototype.createElement;
  Document.prototype.createElement = function (this: Document, tagName: string, elementOptions?: any) {
    const element = originalCreateElement.call(this, tagName, elementOptions);

    if (isStyleTag(tagName) && !element.nonce && isCalledFromMonaco()) {
      element.setAttribute('nonce', nonce);
    }

    return element;
  } as typeof Document.prototype.createElement;

  // 2) setAttribute('style', ...) do Monaco passa a ser aplicado via CSSOM.
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (this: Element, name: string, value: string): void {
    if (name === 'style' && (this as HTMLElement).style && isCalledFromMonaco()) {
      (this as HTMLElement).style.cssText = String(value);
      return;
    }

    return originalSetAttribute.call(this, name, value);
  };

  // 3) HTML gerado pelo Monaco: o atributo style é marcado na criação do HTML...
  const environment = (win.MonacoEnvironment = win.MonacoEnvironment || {});
  const previousPolicyFactory = environment.createTrustedTypesPolicy;

  const createPolicy = (name: string, policyOptions?: any): any =>
    previousPolicyFactory
      ? previousPolicyFactory.call(environment, name, policyOptions)
      : win.trustedTypes?.createPolicy?.(name, policyOptions);

  environment.createTrustedTypesPolicy = (name: string, policyOptions?: any): any => {
    if (!policyOptions || typeof policyOptions.createHTML !== 'function') {
      return createPolicy(name, policyOptions);
    }

    const wrappedOptions = {
      ...policyOptions,
      createHTML: (input: string, ...args: Array<any>) =>
        rewriteStyleAttributes(policyOptions.createHTML(input, ...args))
    };

    const policy = createPolicy(name, wrappedOptions);

    if (!policy) {
      // Navegador sem Trusted Types: o HTML marcado é convertido em texto pelo setter de innerHTML.
      return {
        name,
        createHTML: (input: string, ...args: Array<any>) => markHtml(wrappedOptions.createHTML(input, ...args))
      };
    }

    return {
      name: policy.name ?? name,
      createHTML: (input: string, ...args: Array<any>) => markHtml(policy.createHTML(input, ...args)),
      createScript: policy.createScript?.bind(policy),
      createScriptURL: policy.createScriptURL?.bind(policy)
    };
  };

  // ... e aplicado via CSSOM logo após a inserção (mesma tarefa, antes das medições do Monaco).
  const innerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');

  if (innerHTMLDescriptor?.set) {
    Object.defineProperty(Element.prototype, 'innerHTML', {
      ...innerHTMLDescriptor,
      set(this: Element, value: unknown) {
        innerHTMLDescriptor.set.call(this, value);

        if (isProducedHtml(value)) {
          applyMarkedStyles(this);
        }
      }
    });
  }

  const originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
  Element.prototype.insertAdjacentHTML = function (this: Element, position: InsertPosition, text: string): void {
    originalInsertAdjacentHTML.call(this, position, text);

    if (isProducedHtml(text)) {
      const insertsAsSibling = /^(beforebegin|afterend)$/i.test(String(position));
      applyMarkedStyles(insertsAsSibling ? this.parentElement : this);
    }
  };

  const dispose = (): void => {
    Document.prototype.createElement = originalCreateElement;
    Element.prototype.setAttribute = originalSetAttribute;
    Element.prototype.insertAdjacentHTML = originalInsertAdjacentHTML;

    if (innerHTMLDescriptor) {
      Object.defineProperty(Element.prototype, 'innerHTML', innerHTMLDescriptor);
    }

    if (previousPolicyFactory) {
      environment.createTrustedTypesPolicy = previousPolicyFactory;
    } else {
      delete environment.createTrustedTypesPolicy;
    }

    delete win[INSTALLED_KEY];
  };

  win[INSTALLED_KEY] = { dispose };

  return dispose;
}

/** Desfaz a instalação, se houver (usada nos testes). */
export function disposeMonacoCspCompat(): void {
  (globalThis as any)[INSTALLED_KEY]?.dispose();
}

function isStyleTag(tagName: string): boolean {
  return typeof tagName === 'string' && tagName.length === 5 && tagName.toLowerCase() === 'style';
}

function applyMarkedStyle(element: Element): void {
  const css = element.getAttribute(PO_CSP_STYLE_MARKER) ?? '';
  element.removeAttribute(PO_CSP_STYLE_MARKER);

  const style = (element as HTMLElement).style;

  if (style) {
    style.cssText = css;
  }
}
