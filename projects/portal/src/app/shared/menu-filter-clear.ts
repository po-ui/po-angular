import { PoMenuComponent } from '@po-ui/ng-components';

/**
 * Corrige a altura dos grupos do po-menu quando o filtro é limpo.
 *
 * Ao limpar, o po-menu recria os itens raiz e dá ao grupo aberto só a altura dos filhos do subgrupo ativo
 * (Componentes fica com a altura de "Ações"); o resto do grupo sobrepõe as categorias de baixo. Ativar de novo
 * o item atual pela URL faz o po-menu calcular as alturas como na carga da página.
 *
 * Uso: `(keyup)` e `(click)` do `<po-menu>` (os eventos do filtro e do botão limpar sobem até ele) e
 * `disconnect()` no `ngOnDestroy`. Com o filtro vazio, arma um `MutationObserver` na lista raiz do po-menu;
 * quando o po-menu troca os itens da lista, recalcula uma vez no próximo quadro e desarma.
 * shortcut: depende de `activateMenuByUrl` (público, não documentado) e da lista `ul.po-menu-list` do po-menu;
 * remover quando o po-menu recalcular as alturas ao limpar o filtro.
 */
export class MenuFilterClear {
  private observer?: MutationObserver;
  private frame?: number;

  onMenuEvent(event: Event, menu: PoMenuComponent): void {
    // o botão limpar some do DOM no clique; o caminho do evento ainda tem o po-menu-filter
    const filter = event.composedPath().find(el => (el as Element).tagName === 'PO-MENU-FILTER') as Element;
    const input = filter?.querySelector('input');

    if (!input) {
      return;
    }

    this.disconnect();

    if (!input.value.trim()) {
      this.arm(filter.closest('po-menu'), menu);
    }
  }

  /** Desarma: para de observar e cancela o recálculo pendente. */
  disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;

    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }
  }

  private arm(host: Element | null, menu: PoMenuComponent): void {
    // só as listas raiz: as dos subitens ficam dentro de um po-menu-item
    const lists = Array.from(host?.querySelectorAll('ul.po-menu-list') ?? []).filter(
      list => !list.parentElement?.closest('po-menu-item')
    );

    if (!lists.length) {
      return;
    }

    this.observer = new MutationObserver(() => {
      // várias mutações no mesmo quadro viram um recálculo só
      this.frame ??= requestAnimationFrame(() => {
        this.frame = undefined;
        // desarma antes de recalcular: mutações do recálculo ou da navegação não disparam de novo
        this.disconnect();

        if (menu.linkActive) {
          menu.activateMenuByUrl(menu.linkActive, menu.menus);
        }
      });
    });

    lists.forEach(list => this.observer.observe(list, { childList: true }));
  }
}
