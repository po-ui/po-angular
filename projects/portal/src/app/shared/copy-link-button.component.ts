import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PoButtonModule, PoTooltipModule } from '@po-ui/ng-components';

import { copyText } from './copy-text';

/** Tempo que o botão mostra "Link copiado" antes de voltar ao normal. */
export const COPIED_FEEDBACK_MS = 2000;

/**
 * URL completa e canônica até o `id` (a mesma que o `DeepLinkScrollService` abre):
 * origem + base + rota atual + `view=web` para samples / `view=doc` para a API + `#id`.
 */
export function deepLinkUrl(router: Router, id: string, doc: Document = document): string {
  const tree = router.parseUrl(router.url);
  const path = router.url.split(/[?#]/)[0];

  if (path.startsWith('/documentation/')) {
    tree.queryParams = { ...tree.queryParams, view: id.startsWith('sample-') ? 'web' : 'doc' };
  }
  tree.fragment = id;

  return new URL(router.serializeUrl(tree).replace(/^\//, ''), doc.baseURI).href;
}

/**
 * Botão "Copiar link" ao lado de um título/item com `id` da documentação. Criado em runtime pelo
 * `CopyLinkService`; é um `po-button` real (foco por teclado, nome acessível) com `po-tooltip`.
 * O tooltip é o próprio nome acessível: o `po-tooltip` reescreve o `aria-label` do botão com o texto dele.
 * Feedback no próprio botão (ícone e tooltip viram "Link ... copiado" por 2 s) + anúncio para leitor de tela:
 * local e discreto; um toaster chamaria atenção demais para algo que se faz várias vezes por página.
 */
@Component({
  selector: 'app-copy-link-button',
  imports: [PoButtonModule, PoTooltipModule],
  template: `
    <po-button
      p-kind="tertiary"
      p-size="small"
      [p-icon]="copied() ? 'an an-check' : 'an an-link'"
      [p-tooltip]="ariaLabel()"
      [p-aria-label]="ariaLabel()"
      (p-click)="copy()"
    ></po-button>
  `,
  host: { 'class': 'copy-link', '[class.copy-link-copied]': 'copied()' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyLinkButtonComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly announcer = inject(LiveAnnouncer);

  /** `id` do alvo (`prop-p-kind`, `sample-po-button-labs`, `pre-requisitos`...). */
  readonly anchor = input('');
  /** Nome do alvo para o leitor de tela (`p-kind`, `PoButtonKind`, título do guia). */
  readonly target = input('');

  readonly copied = signal(false);
  readonly ariaLabel = computed(() =>
    this.copied() ? `Link para ${this.target()} copiado` : `Copiar link para ${this.target()}`
  );

  private timer?: ReturnType<typeof setTimeout>;

  async copy(): Promise<void> {
    const url = deepLinkUrl(this.router, this.anchor(), this.doc);
    const ok = await copyText(url, this.doc);

    clearTimeout(this.timer);
    this.copied.set(ok);
    void this.announcer.announce(ok ? 'Link copiado' : 'Não foi possível copiar o link', 'polite');
    this.timer = setTimeout(() => this.copied.set(false), COPIED_FEEDBACK_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
