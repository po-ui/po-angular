import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  inject
} from '@angular/core';
import { Router } from '@angular/router';

import { PoHeaderActionTool, PoMenuItem, PoNavbarItem, PoTheme, PoThemeA11yEnum } from '@po-ui/ng-components';

import { PoDensityMode } from '../../../ui/src/lib/enums/po-density-mode.enum';
import { firstValueFrom } from 'rxjs';
import { poThemeDefault, PoThemeService, PoThemeTypeEnum } from '../../../ui/src/lib';
import { AppearancePopoverComponent } from './shared/appearance-popover/appearance-popover.component';
import { VersionService } from './shared/version.service';
import { DeepLinkScrollService } from './shared/deep-link-scroll.service';
import { SearchLauncherService } from './search/search-launcher.service';
import { listenSearchShortcut } from './search/search-shortcut';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly searchLauncher = inject(SearchLauncherService);
  private readonly deepLinkScroll = inject(DeepLinkScrollService);
  private readonly injector = inject(Injector);
  private removeSearchShortcut?: () => void;

  @ViewChild(AppearancePopoverComponent) appearancePopover!: AppearancePopoverComponent;

  menus: Array<PoMenuItem> = [];
  items: Array<PoNavbarItem> = [];
  iconActions: Array<PoHeaderActionTool> = [];
  logoPoUI = './assets/po-logos/po_black.png';
  theme: PoThemeTypeEnum = PoThemeTypeEnum.light;
  a11yLevel: PoThemeA11yEnum;

  constructor(
    protected versionService: VersionService,
    protected poTheme: PoThemeService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initTheme();
  }

  ngOnInit() {
    // Links com #id (busca, guias, samples): rola só a área de conteúdo, sem esconder o título da página.
    this.deepLinkScroll.start();
    // Botão "Copiar link" ao lado de cada propriedade, interface, sample e título de guia.
    // Em chunk lazy: o main não carrega o serviço, o botão nem o LiveAnnouncer do CDK.
    void import('./shared/copy-link.service').then(m => this.injector.get(m.CopyLinkService).start());

    // Ctrl+K / Cmd+K abre a busca (ignora o editor Monaco).
    this.removeSearchShortcut = listenSearchShortcut(this.zone, request => this.searchLauncher.open(request));

    firstValueFrom(this.versionService.getCurrentVersion()).then(version => {
      this.items = [
        { label: 'Iniciar', link: '/' },
        { label: 'Componentes', link: '/documentation' },
        { label: 'Guias', link: '/guides' },
        { label: 'Ícones', link: '/icons' },
        { label: 'Ferramentas', link: '/tools' },
        { label: 'Construtor de temas', link: '/construtor-de-temas' },
        { label: 'Como contribuir', link: 'https://github.com/po-ui/po-angular/blob/master/CONTRIBUTING.md' },
        { label: 'Licença', link: 'https://github.com/po-ui/po-angular/blob/master/LICENSE' },
        { label: 'Core Team', link: 'https://github.com/orgs/po-ui/people' },
        { label: `v${version}`, link: 'https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md' }
      ];
    });

    this.updateLogoFromActiveTheme();
  }

  ngOnDestroy(): void {
    this.removeSearchShortcut?.();
  }

  openExternalLink(url) {
    window.open(url, '_blank');
  }

  @HostListener('window:PoUiThemeChange')
  onPoUiThemeChange(): void {
    this.updateLogoFromActiveTheme();
  }

  /**
   * Reidrata o tema no boot a partir da preferência salva no `localStorage` (via `getThemeActive`,
   * que já re-resolve a constante embutida pelo `name`). Sem preferência salva, aplica o
   * `poThemeDefault` (light/AAA). Em seguida, ajusta a densidade conforme o nível de acessibilidade.
   */
  private initTheme(): void {
    this.poTheme.setA11yDefaultSizeSmall(true);

    const activeTheme = this.poTheme.getThemeActive();

    if (!activeTheme) {
      this.theme = PoThemeTypeEnum.light;
      this.a11yLevel = PoThemeA11yEnum.AAA;
      this.poTheme.setTheme(poThemeDefault, this.theme, this.a11yLevel);
    } else {
      this.theme = this.getActiveType(activeTheme);
      this.a11yLevel = this.getActiveA11y(activeTheme);
      this.poTheme.setTheme(activeTheme, this.theme, this.a11yLevel);
    }

    this.poTheme.setDensityMode(this.a11yLevel === PoThemeA11yEnum.AA ? PoDensityMode.Small : PoDensityMode.Medium);
  }

  /**
   * Sincroniza o logo a partir do tipo (light/dark) do tema atualmente ativo no `PoThemeService`.
   * Garante que o logo adapte a cor independentemente da via de troca de tema (boot ou popover).
   */
  private updateLogoFromActiveTheme(): void {
    const activeTheme = this.poTheme.getThemeActive();
    const isDark = activeTheme ? this.getActiveType(activeTheme) === PoThemeTypeEnum.dark : false;

    this.logoPoUI = isDark ? './assets/po-logos/po_white.png' : './assets/po-logos/po_black.png';
  }

  private getActiveType(theme: PoTheme): PoThemeTypeEnum {
    return typeof theme.active === 'object' ? theme.active.type : theme.active;
  }

  private getActiveA11y(theme: PoTheme): PoThemeA11yEnum {
    return typeof theme.active === 'object' ? theme.active.a11y : PoThemeA11yEnum.AAA;
  }

  get actions() {
    return [
      { icon: 'an an-github-logo', link: 'https://github.com/po-ui', label: 'Github', tooltip: 'Github' },
      {
        icon: 'an an-instagram-logo',
        link: 'https://www.instagram.com/pouidev/',
        label: 'Instagram',
        tooltip: 'Instagram'
      },
      {
        icon: 'an an-palette',
        label: 'Aparência',
        tooltip: 'Aparência'
      }
    ];
  }

  ngAfterViewInit(): void {
    this.iconActions = this.buildIconActions();
    this.cdr.detectChanges();
  }

  private buildIconActions(): Array<PoHeaderActionTool> {
    return this.actions.map(action =>
      action.label === 'Aparência' && this.appearancePopover
        ? { ...action, popover: { content: this.appearancePopover.popoverContentRef, width: 450 } }
        : action
    );
  }
}
