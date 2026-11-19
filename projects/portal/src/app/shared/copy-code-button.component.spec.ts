import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { DefaultUrlSerializer, Router, UrlSerializer } from '@angular/router';

import { CopyCodeButtonComponent, codeText } from './copy-code-button.component';
import { COPIED_FEEDBACK_MS } from './copy-link-button.component';
import { CopyLinkService } from './copy-link.service';

// Como o gerador escreve: `{{`/`}}` em ngNonBindable, chaves e `@` como entidades; o highlight.js põe spans.
const SOURCE = '<p>{{ total }}</p>\n@if (a) { <b>{ a: { b: 1 } }</b> }\n';
const BLOCK = `
  <div class="docs-code-block" data-file="sample-po-x/sample-po-x.component.html"><pre appcodehighlight class="html"><span class="hljs-tag">&lt;p&gt;</span><span>{{</span> total <span>}}</span>&lt;/p&gt;
&#64;if (a) &#123; <span class="hljs-tag">&lt;b&gt;</span>&#123; a: &#123; b: 1 &#125; &#125;&lt;/b&gt; &#125;
</pre></div>`;

describe('Copiar código', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    root.innerHTML = BLOCK;
    document.body.appendChild(root);
  });

  afterEach(() => root.remove());

  it('codeText devolve o arquivo original (sem "{ {" e sem os spans do highlight)', () => {
    expect(codeText(root.querySelector('.docs-code-block'))).toBe(SOURCE);
  });

  it('o CopyLinkService põe um botão por bloco, dentro do bloco e fora do <pre>', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { url: '/documentation/po-x' } },
        { provide: UrlSerializer, useClass: DefaultUrlSerializer }
      ]
    });
    const service = TestBed.inject(CopyLinkService);

    service.scan();
    service.scan();

    const block = root.querySelector('.docs-code-block');

    expect(block.querySelectorAll(':scope > .copy-code').length).toBe(1);
    expect(block.querySelector('pre .copy-code')).toBeNull();
    expect(block.querySelector('.copy-code button').getAttribute('aria-label')).toContain(
      'Copiar código de sample-po-x.component.html'
    );
    expect(codeText(block)).toBe(SOURCE);
    service.stop();
  });

  it('copia o arquivo, mostra "Copiado" por 2 s, anuncia e não mexe na rolagem', fakeAsync(() => {
    const write = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const fixture = TestBed.createComponent(CopyCodeButtonComponent);
    const scroll = document.documentElement.scrollTop;

    fixture.componentRef.setInput('block', root.querySelector('.docs-code-block'));
    fixture.componentRef.setInput('file', 'sample-po-x.component.html');
    fixture.detectChanges();
    expect(fixture.componentInstance.label()).toBe('Copiar código de sample-po-x.component.html');

    void fixture.componentInstance.copy();
    flushMicrotasks();
    fixture.detectChanges();

    expect(write).toHaveBeenCalledWith(SOURCE);
    expect(fixture.componentInstance.label()).toBe('Copiado');
    expect(fixture.nativeElement.querySelector('.an-check')).not.toBeNull();
    tick(50);
    expect(document.getElementById('app-live-announcer').textContent).toBe('Código copiado');
    expect(document.documentElement.scrollTop).toBe(scroll);

    tick(COPIED_FEEDBACK_MS - 50);
    expect(fixture.componentInstance.label()).toBe('Copiar código de sample-po-x.component.html');
    fixture.destroy();
  }));
});
