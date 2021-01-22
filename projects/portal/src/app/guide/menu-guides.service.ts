import { Injectable } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';

@Injectable()
export class MenuGuidesService {
  constructor() {}

  getMenus(documentationItems) {
    return new Array<PoMenuItem>(
      { label: 'Guia de implementação de APIs', link: 'guides/api' },
      { label: 'Compatibilidade com os navegadores', link: 'guides/browser-support' },
      { label: 'Contribuindo para o PO UI', link: 'guides/development-flow' },
      { label: 'Primeiros passos', link: 'guides/getting-started' },
      { label: 'Guia de codificação', link: 'guides/guide-code' },
      { label: 'Migração do PO UI para V2', link: 'guides/migration-poui-v2' },
      { label: 'Migração do PO UI para V3', link: 'guides/migration-poui-v3' },
      { label: 'Migração do PO UI para V4', link: 'guides/migration-poui-v4' },
      { label: 'Migração do THF para o PO UI v1.x', link: 'guides/migration-thf-to-po-ui' },
      { label: 'Press Kit', link: 'guides/press-kit' },
      { label: 'Schematics', link: 'guides/schematics' },
      { label: 'Fundamentos do PO Sync', link: 'guides/sync-fundamentals' },
      { label: 'Começando com o PO Sync', link: 'guides/sync-get-started' },
      { label: 'Customizando cores do tema padrão', link: 'guides/colors-customization' },
      { label: 'Criando um tema para o PO UI', link: 'guides/create-theme-customization' },
      { label: 'Grid System', link: 'guides/grid-system' },
      { label: 'Biblioteca de ícones', link: 'guides/icons' },
      { label: 'Espaçamento', link: 'guides/spacing' },
      { label: 'Tipografia', link: 'guides/typography' },
      { label: 'Começando com PO TSLint', link: 'guides/getting-started-po-tslint' }
    );
  }
}
