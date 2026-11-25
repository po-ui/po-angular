import { firstValueFrom } from 'rxjs';

import { PoMenuItem } from '@po-ui/ng-components';

import { MenuShortcutFilter, filterMenuWithoutShortcuts, isMenuShortcut, menuShortcut } from './menu-shortcut-filter';

// Como o menu da documentação: o Dialog em Serviços e os atalhos em Feedback e Sobreposição.
const menus = (): Array<PoMenuItem> => {
  const go = () => {};

  return [
    {
      label: 'Componentes',
      subItems: [
        {
          label: 'Feedback',
          subItems: [
            menuShortcut({ label: 'Dialog (Serviços)', action: go }),
            { label: 'Toaster', link: '/documentation/po-toaster' }
          ]
        },
        {
          label: 'Sobreposição',
          subItems: [
            menuShortcut({ label: 'Dialog (Serviços)', action: go }),
            { label: 'Modal', link: '/documentation/po-modal' }
          ]
        },
        { label: 'Contêineres', subItems: [menuShortcut({ label: 'Tabs (Navegação)', action: go })] },
        { label: 'Navegação', subItems: [{ label: 'Tabs', link: '/documentation/po-tabs' }] }
      ]
    },
    {
      label: 'Utilitários',
      subItems: [{ label: 'Serviços', subItems: [{ label: 'Dialog', link: '/documentation/po-dialog' }] }]
    }
  ];
};

describe('menu-shortcut-filter', () => {
  it('filtrar "Dialog" traz só o item principal, sem os atalhos de Feedback e Sobreposição', () => {
    expect(filterMenuWithoutShortcuts(menus(), 'Dialog')).toEqual([
      { label: 'Dialog', link: '/documentation/po-dialog', action: undefined }
    ]);
  });

  it('vale para outros atalhos (Tabs em Contêineres) e não traz grupos (categorias sem link)', () => {
    expect(filterMenuWithoutShortcuts(menus(), 'tabs').map(i => i.label)).toEqual(['Tabs']);
    expect(filterMenuWithoutShortcuts(menus(), 'feedback')).toEqual([]);
  });

  it('sem termo de filtro o menu continua igual: os atalhos estão lá, só marcados', () => {
    const items = menus();
    const feedback = items[0].subItems[0].subItems;

    expect(feedback.map(i => i.label)).toEqual(['Dialog (Serviços)', 'Toaster']);
    expect(isMenuShortcut(feedback[0])).toBe(true);
    expect(isMenuShortcut(feedback[1])).toBe(false);
  });

  it('MenuShortcutFilter (p-service do po-menu) usa os menus atuais', async () => {
    let current: Array<PoMenuItem> = [];
    const filter = new MenuShortcutFilter(() => current);

    expect(await firstValueFrom(filter.getFilteredData('Dialog'))).toEqual([]);

    current = menus();

    expect((await firstValueFrom(filter.getFilteredData('Dialog'))).map(i => i.label)).toEqual(['Dialog']);
  });
});
