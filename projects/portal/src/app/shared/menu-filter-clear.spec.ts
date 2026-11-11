import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PoMenuComponent } from '@po-ui/ng-components';

import { DocumentationComponent } from '../documentation/documentation.component';
import { GuidesComponent } from '../guide/guides.components';
import { MenuFilterClear } from './menu-filter-clear';

describe('MenuFilterClear', () => {
  let host: HTMLElement;
  let input: HTMLInputElement;
  let rootList: HTMLUListElement;
  let menu: jasmine.SpyObj<PoMenuComponent>;
  let clear: MenuFilterClear;
  let frames: Map<number, FrameRequestCallback>;

  // caminho do evento como o navegador monta no disparo (do alvo até o po-menu)
  const eventFrom = (target: HTMLElement) => {
    const path: Array<EventTarget> = [];
    for (let el: HTMLElement = target; el; el = el.parentElement) {
      path.push(el);
    }
    return { target, composedPath: () => path } as unknown as Event;
  };

  // o MutationObserver avisa numa microtarefa
  const mutationsDelivered = () => new Promise(resolve => setTimeout(resolve));

  const runFrames = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(0));
  };

  // o po-menu troca os itens raiz quando o filtro muda
  const rerenderRootItems = () => rootList.replaceChildren(document.createElement('li'), document.createElement('li'));

  beforeEach(() => {
    host = document.createElement('po-menu');
    host.innerHTML = `
      <po-menu-filter><input /><button class="clean"></button></po-menu-filter>
      <ul class="po-menu-list" id="root">
        <li><po-menu-item><div><ul class="po-menu-list" id="sub"><li></li></ul></div></po-menu-item></li>
      </ul>`;
    input = host.querySelector('input');
    rootList = host.querySelector('#root');
    menu = jasmine.createSpyObj<PoMenuComponent>('PoMenuComponent', ['activateMenuByUrl']);
    menu.linkActive = '/documentation/po-link';
    menu.menus = [{ label: 'Link', link: '/documentation/po-link' }];
    clear = new MenuFilterClear();

    frames = new Map();
    let nextFrame = 0;
    spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    spyOn(window, 'cancelAnimationFrame').and.callFake((id: number) => frames.delete(id));
  });

  afterEach(() => clear.disconnect());

  it('arma no filtro vazio e recalcula uma vez só depois da troca de itens e do quadro', async () => {
    input.value = '';
    clear.onMenuEvent(eventFrom(input), menu);

    rerenderRootItems();
    rerenderRootItems();
    await mutationsDelivered();

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(menu.activateMenuByUrl).not.toHaveBeenCalled();

    runFrames();
    expect(menu.activateMenuByUrl).toHaveBeenCalledOnceWith('/documentation/po-link', menu.menus);
  });

  it('não recalcula de novo em mutações depois do recálculo (sem loop)', async () => {
    input.value = '';
    clear.onMenuEvent(eventFrom(input), menu);
    rerenderRootItems();
    await mutationsDelivered();
    runFrames();

    rerenderRootItems();
    await mutationsDelivered();
    runFrames();

    expect(menu.activateMenuByUrl).toHaveBeenCalledTimes(1);
  });

  it('vale também para o botão limpar do filtro, mesmo que ele saia do DOM no clique', async () => {
    input.value = '';
    const event = eventFrom(host.querySelector('.clean'));
    host.querySelector('.clean').remove();
    clear.onMenuEvent(event, menu);

    rerenderRootItems();
    await mutationsDelivered();
    runFrames();

    expect(menu.activateMenuByUrl).toHaveBeenCalledTimes(1);
  });

  it('não arma com texto no filtro', async () => {
    input.value = 'tabs';
    clear.onMenuEvent(eventFrom(input), menu);

    rerenderRootItems();
    await mutationsDelivered();
    runFrames();

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(menu.activateMenuByUrl).not.toHaveBeenCalled();
  });

  it('desarma quando o usuário digita de novo antes da troca de itens', async () => {
    input.value = '';
    clear.onMenuEvent(eventFrom(input), menu);
    input.value = 't';
    clear.onMenuEvent(eventFrom(input), menu);

    rerenderRootItems();
    await mutationsDelivered();
    runFrames();

    expect(menu.activateMenuByUrl).not.toHaveBeenCalled();
  });

  it('ignora a lista dos subitens e eventos fora do filtro', async () => {
    clear.onMenuEvent(eventFrom(rootList), menu);
    input.value = '';
    clear.onMenuEvent(eventFrom(input), menu);

    host.querySelector('#sub').appendChild(document.createElement('li'));
    await mutationsDelivered();

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('não recalcula sem item ativo no menu', async () => {
    menu.linkActive = undefined;
    input.value = '';
    clear.onMenuEvent(eventFrom(input), menu);
    rerenderRootItems();
    await mutationsDelivered();
    runFrames();

    expect(menu.activateMenuByUrl).not.toHaveBeenCalled();
  });

  it('disconnect para de observar e cancela o quadro pendente', async () => {
    input.value = '';
    clear.onMenuEvent(eventFrom(input), menu);
    rerenderRootItems();
    await mutationsDelivered();

    clear.disconnect();
    runFrames();
    rerenderRootItems();
    await mutationsDelivered();

    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(menu.activateMenuByUrl).not.toHaveBeenCalled();
  });

  describe('componentes com o menu:', () => {
    it('documentation desconecta no destroy', () => {
      TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: {} }] });
      const component = TestBed.runInInjectionContext(() => new DocumentationComponent(null, null));
      spyOn(component.menuFilterClear, 'disconnect');

      component.ngOnDestroy();

      expect(component.menuFilterClear.disconnect).toHaveBeenCalled();
    });

    it('guides desconecta no destroy', () => {
      const component = new GuidesComponent(null, null);
      spyOn(component.menuFilterClear, 'disconnect');

      component.ngOnDestroy();

      expect(component.menuFilterClear.disconnect).toHaveBeenCalled();
    });
  });
});
