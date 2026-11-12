import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { Router, UrlSerializer, DefaultUrlSerializer } from '@angular/router';

import { COPIED_FEEDBACK_MS, CopyLinkButtonComponent, deepLinkUrl } from './copy-link-button.component';
import { CopyLinkService, targetName } from './copy-link.service';
import { copyText } from './copy-text';

const serializer = new DefaultUrlSerializer();
const routerAt = (url: string) =>
  ({
    url,
    parseUrl: (u: string) => serializer.parse(u),
    serializeUrl: (tree: ReturnType<DefaultUrlSerializer['parse']>) => serializer.serialize(tree)
  }) as unknown as Router;

describe('deepLinkUrl', () => {
  const base = document.baseURI.replace(/\/[^/]*$/, '/');

  it('API: rota atual + view=doc + #id, com a origem', () => {
    expect(deepLinkUrl(routerAt('/documentation/po-button?view=web'), 'prop-p-kind')).toBe(
      `${base}documentation/po-button?view=doc#prop-p-kind`
    );
  });

  it('sample: view=web; troca o fragmento que já estava na URL', () => {
    expect(deepLinkUrl(routerAt('/documentation/po-button?view=doc#prop-p-kind'), 'sample-po-button-labs')).toBe(
      `${base}documentation/po-button?view=web#sample-po-button-labs`
    );
  });

  it('guia: sem query', () => {
    expect(deepLinkUrl(routerAt('/guides/getting-started'), 'pre-requisitos')).toBe(
      `${base}guides/getting-started#pre-requisitos`
    );
  });
});

describe('copyText', () => {
  it('usa navigator.clipboard quando existe', async () => {
    const write = jasmine.createSpy('writeText').and.returnValue(Promise.resolve());
    const fakeDoc = { defaultView: { navigator: { clipboard: { writeText: write } } } } as unknown as Document;

    expect(await copyText('x', fakeDoc)).toBeTrue();
    expect(write).toHaveBeenCalledWith('x');
  });

  it('sem clipboard (ou se ele falhar) cai no execCommand com um textarea temporário', async () => {
    const exec = spyOn(document, 'execCommand').and.callFake(() => {
      expect(document.querySelector<HTMLTextAreaElement>('textarea[readonly]').value).toBe('link');

      return true;
    });
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject(new Error('negado')));

    expect(await copyText('link')).toBeTrue();
    expect(exec).toHaveBeenCalledWith('copy');
    expect(document.querySelector('textarea[readonly]')).toBeNull();
  });
});

describe('CopyLinkService', () => {
  let service: CopyLinkService;
  let root: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerAt('/documentation/po-button?view=doc') },
        { provide: UrlSerializer, useClass: DefaultUrlSerializer }
      ]
    });
    service = TestBed.inject(CopyLinkService);
    root = document.createElement('div');
    root.innerHTML = `
      <div class="docs-api">
        <table><tr class="docs-api-properties-row" id="prop-p-kind">
          <td><div class="docs-api-input-marker"><span class="docs-api-input-alias"> p-kind<br /> </span></div></td>
        </tr></table>
        <h4 class="docs-api-class-name" id="enum-po-button-kind"><code class="doc-code">PoButtonKind</code></h4>
        <p id="prop-p-extra"></p>
      </div>
      <div id="prop-fora-da-docs"></div>
      <blockquote class="sample-blockquote" id="sample-po-button-labs"><label class="sample-title">PO Button Labs</label></blockquote>
      <div class="guides"><h3 id="pre-requisitos">Pré-requisitos</h3><p id="nao-e-titulo"></p></div>`;
    document.body.appendChild(root);
  });

  afterEach(() => {
    service.stop();
    root.remove();
  });

  it('põe um botão por alvo (API, sample e títulos de guia), só dentro da documentação', () => {
    service.scan();

    const withButton = Array.from(root.querySelectorAll('[data-copy-link-target]')).map(e => e.id);

    expect(withButton).toEqual([
      'prop-p-kind',
      'enum-po-button-kind',
      'prop-p-extra',
      'sample-po-button-labs',
      'pre-requisitos'
    ]);
    expect(root.querySelector('#prop-fora-da-docs .copy-link')).toBeNull();
    expect(root.querySelector('#nao-e-titulo .copy-link')).toBeNull();
  });

  it('o botão fica ao lado do nome e não muda o texto do título', () => {
    service.scan();

    const alias = root.querySelector('#prop-p-kind .docs-api-input-alias');

    expect(alias.querySelector('.copy-link')).not.toBeNull();
    expect(alias.textContent.trim()).toBe('p-kind');
    expect(root.querySelector('#sample-po-button-labs .sample-title + .copy-link')).not.toBeNull();
    expect(root.querySelector('#pre-requisitos').textContent).toBe('Pré-requisitos');
  });

  it('botão real com aria-label específico', () => {
    service.scan();

    expect(root.querySelector('#prop-p-kind .copy-link button').getAttribute('aria-label')).toBe(
      'Copiar link para p-kind'
    );
    expect(root.querySelector('#enum-po-button-kind .copy-link button').getAttribute('aria-label')).toBe(
      'Copiar link para PoButtonKind'
    );
  });

  it('não duplica ao varrer de novo e solta o botão quando o alvo sai da página', () => {
    service.scan();
    service.scan();
    expect(root.querySelectorAll('#prop-p-kind .copy-link').length).toBe(1);

    root.querySelector('#pre-requisitos').remove();
    expect(() => service.scan()).not.toThrow();
  });

  it('observa a página: alvo que aparece depois (aba lazy) ganha o botão', async () => {
    service.start();

    const late = document.createElement('h2');

    late.id = 'chegou-depois';
    late.textContent = 'Chegou depois';
    root.querySelector('.guides').appendChild(late);
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(late.querySelector('.copy-link')).not.toBeNull();
  });

  it('targetName usa o nome visível do alvo', () => {
    expect(targetName(root.querySelector('#sample-po-button-labs'))).toBe('PO Button Labs');
    expect(targetName(root.querySelector('#prop-p-extra'))).toBe('prop-p-extra');
  });
});

describe('CopyLinkButtonComponent', () => {
  it('copia a URL canônica, mostra "copiado" por 2 s e anuncia', fakeAsync(() => {
    const announce = jasmine.createSpy('announce').and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [CopyLinkButtonComponent],
      providers: [
        { provide: Router, useValue: routerAt('/documentation/po-button?view=doc') },
        { provide: LiveAnnouncer, useValue: { announce } }
      ]
    });
    const write = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const fixture = TestBed.createComponent(CopyLinkButtonComponent);

    fixture.componentRef.setInput('anchor', 'prop-p-kind');
    fixture.componentRef.setInput('target', 'p-kind');
    fixture.detectChanges();

    void fixture.componentInstance.copy();
    flushMicrotasks();
    fixture.detectChanges();

    expect(write.calls.mostRecent().args[0]).toMatch(/\/documentation\/po-button\?view=doc#prop-p-kind$/);
    expect(fixture.componentInstance.ariaLabel()).toBe('Link para p-kind copiado');
    expect(fixture.nativeElement.querySelector('.an-check')).not.toBeNull();
    expect(announce).toHaveBeenCalledWith('Link copiado', 'polite');

    tick(COPIED_FEEDBACK_MS);
    expect(fixture.componentInstance.ariaLabel()).toBe('Copiar link para p-kind');
    fixture.destroy();
  }));
});
