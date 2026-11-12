import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';

import { DeepLinkScrollService } from './deep-link-scroll.service';

describe('DeepLinkScrollService', () => {
  let service: DeepLinkScrollService;
  let outer: HTMLElement;
  let scroller: HTMLElement;
  let target: HTMLElement;
  const events = new Subject<unknown>();
  let currentUrl = '/documentation/po-button?view=doc';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            events,
            get url() {
              return currentUrl;
            },
            parseUrl: (url: string) => ({ fragment: url.split('#')[1] ?? null })
          }
        }
      ]
    });
    service = TestBed.inject(DeepLinkScrollService);

    // .po-wrapper (rolável) > área de conteúdo (rolável) > alvo bem abaixo
    outer = document.createElement('div');
    outer.style.cssText = 'height:300px;overflow-y:auto;position:relative';
    outer.innerHTML =
      '<div style="height:356px"><div id="area" style="height:200px;overflow-y:auto"><div style="height:1500px"><p id="p-kind" style="margin-top:900px">alvo</p></div></div></div>';
    document.body.appendChild(outer);
    scroller = outer.querySelector('#area');
    target = outer.querySelector('#p-kind');
  });

  afterEach(() => outer.remove());

  it('rola só a área de conteúdo mais próxima e nunca o ancestral externo', async () => {
    service.scrollTo('p-kind');

    expect(scroller.scrollTop).toBeGreaterThan(800);
    expect(outer.scrollTop).toBe(0);
    expect(target.getBoundingClientRect().top - scroller.getBoundingClientRect().top).toBeCloseTo(16, 0);
    expect(target.classList.contains('search-target-highlight')).toBeTrue();
  });

  it('espera o elemento aparecer (conteúdo lazy)', async () => {
    target.removeAttribute('id');
    service.scrollTo('p-kind');
    expect(scroller.scrollTop).toBe(0);

    target.id = 'p-kind';
    await new Promise(resolve => setTimeout(resolve, 250));

    expect(scroller.scrollTop).toBeGreaterThan(800);
  });

  it('link antigo sem prefixo (#p-kind) abre o id com prefixo; o id exato tem prioridade', () => {
    target.id = 'prop-p-kind';
    service.scrollTo('p-kind');
    expect(scroller.scrollTop).toBeGreaterThan(800);

    scroller.scrollTop = 0;
    target.classList.remove('search-target-highlight');
    const exact = document.createElement('p');

    exact.id = 'p-kind';
    exact.textContent = 'exato';
    outer.querySelector('div > div > div').prepend(exact);
    service.scrollTo('p-kind');
    expect(exact.classList.contains('search-target-highlight')).toBeTrue();
    expect(target.classList.contains('search-target-highlight')).toBeFalse();
  });

  it('navegação terminada com fragmento dispara a rolagem; sem fragmento não faz nada', () => {
    service.start();
    currentUrl = '/documentation/po-button?view=doc#p-kind';
    events.next(new NavigationEnd(1, currentUrl, currentUrl));
    expect(scroller.scrollTop).toBeGreaterThan(800);

    scroller.scrollTop = 0;
    currentUrl = '/documentation/po-button?view=doc';
    events.next(new NavigationEnd(2, currentUrl, currentUrl));
    expect(scroller.scrollTop).toBe(0);
  });
});
