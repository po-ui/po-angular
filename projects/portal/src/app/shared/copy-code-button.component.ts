import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, input, signal } from '@angular/core';

import { PoButtonModule, PoTooltipModule } from '@po-ui/ng-components';

import { announce } from './announce';
import { COPIED_FEEDBACK_MS } from './copy-link-button.component';
import { copyText } from './copy-text';

/**
 * Texto do arquivo exibido no bloco (`.docs-code-block > pre`). O `textContent` é o próprio arquivo: o gerador
 * põe `{{`/`}}` em `<span ngNonBindable>` e as outras chaves e o `@` em entidades, e o highlight.js só envolve
 * o texto em `<span>`.
 */
export function codeText(block: Element): string {
  return block.querySelector('pre')?.textContent ?? '';
}

/**
 * Botão "Copiar código" no canto superior direito de cada arquivo de um sample. Criado em runtime pelo
 * `CopyLinkService` (chunk lazy), como o "Copiar link". Fica fora do `<pre>` (que rola), então não some ao rolar.
 */
@Component({
  selector: 'app-copy-code-button',
  imports: [PoButtonModule, PoTooltipModule],
  template: `
    <po-button
      p-kind="tertiary"
      p-size="small"
      p-tooltip-position="left"
      [p-icon]="copied() ? 'an an-check' : 'an an-copy'"
      [p-tooltip]="label()"
      [p-aria-label]="label()"
      (p-click)="copy()"
    ></po-button>
  `,
  host: { 'class': 'copy-code', '[class.copy-code-copied]': 'copied()' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyCodeButtonComponent implements OnDestroy {
  private readonly doc = inject(DOCUMENT);

  /** Bloco `.docs-code-block` com o `<pre>` do arquivo. */
  readonly block = input<Element>();
  /** Nome do arquivo, para o leitor de tela. */
  readonly file = input('');

  readonly copied = signal(false);
  readonly label = computed(() => (this.copied() ? 'Copiado' : `Copiar código de ${this.file()}`));

  private timer?: ReturnType<typeof setTimeout>;

  async copy(): Promise<void> {
    const ok = await copyText(codeText(this.block()), this.doc);

    clearTimeout(this.timer);
    this.copied.set(ok);
    announce(ok ? 'Código copiado' : 'Não foi possível copiar o código', this.doc);
    this.timer = setTimeout(() => this.copied.set(false), COPIED_FEEDBACK_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
