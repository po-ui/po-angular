import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, DestroyRef, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { PoMenuComponent } from '@po-ui/ng-components';

import { Documentation } from './documentation.class';
import { parentsOf } from './docs-groups';
import { MenuComponentsService } from './menu-components.service';
import { MenuFilterClear } from '../shared/menu-filter-clear';
import { MenuShortcutFilter } from '../shared/menu-shortcut-filter';

@Component({
  templateUrl: './documentation.component.html',
  providers: [MenuComponentsService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class DocumentationComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') menu?: PoMenuComponent;

  menus = [];
  /** Busca do menu sem os atalhos (só o item principal aparece). */
  readonly menuFilter = new MenuShortcutFilter(() => this.menus);
  /** Recalcula a altura dos grupos do menu quando o filtro é limpo. */
  readonly menuFilterClear = new MenuFilterClear();

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  /** subcomponente -> pai (`@docsParent`): a página do sub marca o pai no menu. */
  private parents = new Map<string, string>();

  constructor(
    private menuComponentsService: MenuComponentsService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get<Array<Documentation>>('./assets/json/api-list.json').subscribe(
      result => {
        this.parents = parentsOf(result);
        this.menus = this.menuComponentsService.getMenus(result);
        // o menu recebe os itens no próximo ciclo; só então dá para marcar o pai
        setTimeout(() => this.markParentOfSubcomponent());
      },
      error => console.error(error)
    );

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.markParentOfSubcomponent());
  }

  ngOnDestroy() {
    this.menuFilterClear.disconnect();
  }

  /**
   * Subcomponentes não estão no menu: na página deles, marca o item do pai.
   * shortcut: usa `activateMenuByUrl`, público mas não documentado no po-menu; trocar por uma API oficial
   * de "marcar item" se o po-menu ganhar uma.
   */
  private markParentOfSubcomponent(): void {
    const name = this.router.url.split(/[?#]/)[0].split('/').pop();
    const parent = this.parents.get(name);

    if (parent && this.menu) {
      this.menu.activateMenuByUrl(`/documentation/${parent}`, this.menu.menus);
    }
  }
}
