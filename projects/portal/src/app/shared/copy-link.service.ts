import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  NgZone,
  createComponent,
  inject
} from '@angular/core';

import { CopyLinkButtonComponent } from './copy-link-button.component';

/**
 * Alvos que ganham o botão "Copiar link": os mesmos `id` que o gerador escreve (API com prefixo,
 * samples e títulos dos guias). Escopo restrito às áreas da documentação para não pegar `id` de
 * componentes de exemplo que por acaso comecem igual.
 */
export const COPY_LINK_TARGETS = [
  '.docs-api [id^="prop-"]',
  '.docs-api [id^="event-"]',
  '.docs-api [id^="method-"]',
  '.docs-api [id^="interface-"]',
  '.docs-api [id^="enum-"]',
  '.docs-api [id^="class-"]',
  'blockquote.sample-blockquote[id^="sample-"]',
  '.guides :is(h1, h2, h3, h4, h5, h6)[id]'
].join(', ');

const TARGET_ATTR = 'data-copy-link-target';

/**
 * Anexa, em runtime, um `CopyLinkButtonComponent` ao lado de cada alvo com `id` da documentação.
 *
 * Por que em runtime e não no template do Dgeni: o HTML da API, dos samples e dos guias é gerado por três
 * templates diferentes e compilado como template Angular estático; injetar lá exigiria repetir o botão em
 * todos eles (e regenerar tudo a cada ajuste). Aqui é um lugar só, depois que a página renderiza. O índice
 * de busca é gerado no build a partir dos dados do Dgeni, então o botão nunca entra nele; o botão não tem
 * texto (só ícone e `aria-label`) e tem `user-select: none`, então não suja o título copiado/selecionado.
 * Sem SSR no portal: só roda no navegador.
 */
@Injectable({ providedIn: 'root' })
export class CopyLinkService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly buttons = new Map<Element, ComponentRef<CopyLinkButtonComponent>>();
  private observer?: MutationObserver;
  private frame = 0;

  /** Passa a observar a página (o conteúdo das abas e páginas lazy chega depois). Chamar uma vez. */
  start(): void {
    if (this.observer || typeof MutationObserver === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.observer = new MutationObserver(() => this.schedule());
      this.observer.observe(this.doc.body, { childList: true, subtree: true });
    });
    this.scan();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    cancelAnimationFrame(this.frame);
    this.buttons.forEach(ref => this.destroy(ref));
    this.buttons.clear();
  }

  /** Procura alvos novos e solta os botões cujo alvo saiu da página. */
  scan(): void {
    this.buttons.forEach((ref, target) => {
      if (!target.isConnected) {
        this.destroy(ref);
        this.buttons.delete(target);
      }
    });

    this.doc.querySelectorAll<HTMLElement>(COPY_LINK_TARGETS).forEach(target => {
      if (!this.buttons.has(target)) this.attach(target);
    });
  }

  private schedule(): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.zone.run(() => this.scan()));
  }

  private attach(target: HTMLElement): void {
    const host = this.doc.createElement('span');
    const ref = createComponent(CopyLinkButtonComponent, { environmentInjector: this.injector, hostElement: host });

    ref.setInput('anchor', target.id);
    ref.setInput('target', targetName(target));
    this.appRef.attachView(ref.hostView);
    ref.changeDetectorRef.detectChanges();

    target.setAttribute(TARGET_ATTR, '');
    insertNextToName(target, ref.location.nativeElement);
    this.buttons.set(target, ref);
  }

  private destroy(ref: ComponentRef<CopyLinkButtonComponent>): void {
    this.appRef.detachView(ref.hostView);
    ref.destroy();
  }
}

/** Nome visível do alvo (sem o próprio botão), para o `aria-label`. */
export function targetName(target: HTMLElement): string {
  const named = target.querySelector('.docs-api-input-alias, .docs-api-output-alias, .sample-title, code');
  const text = (named ?? target).textContent ?? '';

  return text.replace(/\s+/g, ' ').trim() || target.id;
}

/** Põe o botão logo depois do nome: dentro do título, ou depois do alias/rótulo nas tabelas e samples. */
function insertNextToName(target: HTMLElement, button: HTMLElement): void {
  const alias = target.querySelector('.docs-api-input-alias, .docs-api-output-alias');

  if (alias) {
    alias.insertBefore(button, alias.querySelector(':scope > br'));

    return;
  }

  const sampleTitle = target.querySelector('.sample-title');

  if (sampleTitle) {
    sampleTitle.after(button);

    return;
  }

  target.appendChild(button);
}
