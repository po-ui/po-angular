import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { GuideMenuCategory, MenuGuidesService } from './menu-guides.service';

const CATEGORIES: Array<GuideMenuCategory> = [
  {
    key: 'getting-started',
    label: 'Começando',
    items: [
      { name: 'getting-started', label: 'Primeiros passos', link: 'guides/getting-started' },
      {
        name: 'sync-fundamentals',
        label: 'Fundamentos do PO Sync',
        link: 'guides/sync-fundamentals',
        children: [{ name: 'sync-get-started', label: 'Começando com o PO Sync', link: 'guides/sync-get-started' }]
      }
    ]
  },
  {
    key: 'migration',
    label: 'Migração e depreciações',
    items: [{ name: 'schematics', label: 'Schematics', link: 'guides/schematics', shortcut: true, origin: 'Começando' }]
  }
];

describe('MenuGuidesService', () => {
  let service: MenuGuidesService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    TestBed.configureTestingModule({ providers: [MenuGuidesService, { provide: Router, useValue: router }] });
    service = TestBed.inject(MenuGuidesService);
  });

  it('monta Categoria › Guia com o link relativo a /guides', () => {
    const [start] = service.getMenus(CATEGORIES);

    expect(start.label).toBe('Começando');
    expect(start.subItems[0]).toEqual({ label: 'Primeiros passos', link: 'getting-started' });
  });

  it('guia com subguias vira grupo com "Visão geral" primeiro', () => {
    const sync = service.getMenus(CATEGORIES)[0].subItems[1];

    expect(sync).toEqual({
      label: 'Fundamentos do PO Sync',
      subItems: [
        { label: 'Visão geral', link: 'sync-fundamentals' },
        { label: 'Começando com o PO Sync', link: 'sync-get-started' }
      ]
    });
  });

  it('atalho sem link: rótulo com a categoria de origem e navega para a rota do guia', () => {
    const shortcut = service.getMenus(CATEGORIES)[1].subItems[0];

    expect(shortcut.label).toBe('Schematics (Começando)');
    expect(shortcut.link).toBeUndefined();

    shortcut.action(shortcut);

    expect(router.navigateByUrl).toHaveBeenCalledWith('/guides/schematics');
  });
});
