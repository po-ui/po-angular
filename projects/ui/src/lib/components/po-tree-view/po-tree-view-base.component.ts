import { Directive, HostBinding, HostListener, effect, input, output } from '@angular/core';

import { PoFieldSize } from '../../enums/po-field-size.enum';
import { PoTreeViewItem } from './po-tree-view-item/po-tree-view-item.interface';
import { convertToBoolean, convertToInt, getDefaultSizeFn, validateSizeFn } from '../../utils/util';

const poTreeViewMaxLevel = 4;

/**
 * @description
 *
 * O componente fornece um modelo de visualização em árvore, possibilitando a exibição de informações de maneira
 * hierárquica com suporte a múltiplos níveis (configurável via `p-max-level`).
 *
 * O componente permite:
 * - Navegação completa por teclado seguindo o padrão WAI-ARIA TreeView;
 * - Expansão e recolhimento de itens agrupadores;
 * - Seleção múltipla (checkbox) ou única (radio) dos itens;
 * - Exibição de ícones automáticos para agrupadores e itens finais;
 * - Estado desabilitado global ou individual por item;
 * - Execução de itens finais via clique ou teclado.
 *
 * #### Navegação por teclado
 *
 * | Tecla                 | Descrição                                                                                                 |
 * |-----------------------|-----------------------------------------------------------------------------------------------------------|
 * | **Tab**               | Entra no componente posicionando o foco no primeiro nó ativo. Ao pressionar novamente, sai do componente. |
 * | **ArrowDown**         | Move o foco para o próximo nó visível.                                                                    |
 * | **ArrowUp**           | Move o foco para o nó visível anterior.                                                                   |
 * | **ArrowRight**        | Se colapsado, expande o nó. Se expandido, move o foco para o nó filho.                                    |
 * | **ArrowLeft**         | Se expandido, recolhe o nó. Se filho, move o foco para o nó pai.                                          |
 * | **Home**              | Move o foco para o primeiro nó visível.                                                                   |
 * | **End**               | Move o foco para o último nó visível.                                                                     |
 * | **Enter / Space**     | Com `p-selectable`: alterna a seleção do item. Sem `p-selectable`: executa o item final.                  |
 * | **Caractere**         | Move o foco para o próximo nó cujo label inicia com o caractere pressionado (busca cíclica).              |
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default**                            |                                                       |                                                 |
 * | `--background-color`                   | Cor de background do item                             | `var(--color-neutral-light-00)`                 |
 * | `--divider-color`                      | Cor do divider dos agrupadores de nível 0             | `var(--color-neutral-mid-40)`                   |
 * | `--font-family`                        | Família tipográfica                                   | `var(--font-family-theme)`                      |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                      |
 * | `--line-height`                        | Altura da linha                                       | `var(--line-height-md)`                         |
 * | `--color`                              | Cor padrão do item                                    | `var(--color-action-default)`                   |
 * | **Hover**                              |                                                       |                                                 |
 * | `--color-hover`                        | Cor do item em hover                                  | `var(--color-action-hover)`                     |
 * | **Pressed**                            |                                                       |                                                 |
 * | `--color-pressed`                      | Cor do item em pressed                                | `var(--color-action-pressed)`                   |
 * | **Disabled**                           |                                                       |                                                 |
 * | `--color-disabled`                     | Cor do item desabilitado                              | `var(--color-action-disabled)`                  |
 * | **Selected**                           |                                                       |                                                 |
 * | `--title-color`                        | Cor do label quando selecionado                       | `var(--color-action-focus)`                     |
 */
@Directive()
export class PoTreeViewBaseComponent {
  // ==============================
  // #region Inputs
  // ==============================

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos componentes de formulário:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  readonly componentsSizeInput = input<string>(undefined, { alias: 'p-components-size' });

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o componente inteiro.
   *
   * Quando `true`, todos os itens do tree-view serão exibidos no estado desabilitado,
   * independentemente do valor individual da propriedade `disabled` de cada item.
   *
   * > O botão de expansão/recolhimento (arrow) permanece interativo mesmo quando o componente está desabilitado.
   *
   * @default `false`
   */
  readonly disabled = input<boolean, boolean>(false, {
    alias: 'p-disabled',
    transform: (value: boolean) => convertToBoolean(value)
  });

  /**
   * Lista de itens do tipo `PoTreeViewItem` que será renderizada pelo componente.
   *
   * > Consulte a documentação de `PoTreeViewItem` para detalhes sobre as propriedades disponíveis em cada item.
   */
  readonly inputedItems = input<Array<PoTreeViewItem>>([], { alias: 'p-items' });

  /**
   * @optional
   *
   * @description
   *
   * Define o máximo de níveis para o tree-view.
   *
   * > O valor padrão é 4
   *
   * @default 4
   */
  readonly maxLevel = input<number, number>(poTreeViewMaxLevel, {
    alias: 'p-max-level',
    transform: (value: number) => convertToInt(value, poTreeViewMaxLevel)
  });

  /**
   * @optional
   *
   * @description
   *
   * Habilita uma caixa de seleção para selecionar e/ou desmarcar um item da lista.
   *
   * > Quando habilitado, a propriedade `showIcon` dos itens não será aplicada.
   *
   * @default false
   */
  readonly selectable = input<boolean, boolean>(false, {
    alias: 'p-selectable',
    transform: (value: boolean) => convertToBoolean(value)
  });

  /**
   * @optional
   *
   * @description
   *
   * Habilita a seleção para item único atráves de po-radio.
   *
   * @default false
   */
  readonly singleSelect = input<boolean, boolean>(false, {
    alias: 'p-single-select',
    transform: (value: boolean) => convertToBoolean(value)
  });
  // ==============================
  // #endregion
  // ==============================

  // ==============================
  // #region Outputs
  // ==============================

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao colapsar um item.
   *
   * > Como parâmetro o componente envia o item colapsado.
   */
  readonly collapsed = output<PoTreeViewItem>({ alias: 'p-collapsed' });

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao expandir um item.
   *
   * > Como parâmetro o componente envia o item expandido.
   */
  readonly expanded = output<PoTreeViewItem>({ alias: 'p-expanded' });

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao selecionar um item.
   *
   * > Como parâmetro o componente envia o item selecionado.
   */
  readonly selected = output<PoTreeViewItem>({ alias: 'p-selected' });

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao desfazer a seleção de um item.
   *
   * > Como parâmetro o componente envia o item que foi desmarcado.
   */
  readonly unselected = output<PoTreeViewItem>({ alias: 'p-unselected' });

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao executar um item final (sem `subItems`).
   *
   * > Como parâmetro o componente envia o item executado.
   */
  readonly activated = output<PoTreeViewItem>({ alias: 'p-activated' });
  // ==============================
  // #endregion
  // ==============================

  // ==============================
  // #region Internal Properties
  // ==============================

  private _componentsSize: string = undefined;
  private _items: Array<PoTreeViewItem> = [];

  // armazena o value do item selecionado
  selectedValue: string | number;

  @HostBinding('attr.p-components-size')
  get componentsSize(): string {
    return this._componentsSize ?? getDefaultSizeFn(PoFieldSize);
  }

  set items(value: Array<PoTreeViewItem>) {
    this._items = Array.isArray(value) ? this.getItemsByMaxLevel(value) : [];
  }

  get items() {
    return this._items;
  }

  constructor() {
    effect(() => {
      const value = this.componentsSizeInput();
      this.applySizeBasedOnA11y(value);
    });
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y(this.componentsSizeInput());
  }

  protected emitExpanded(treeViewItem: PoTreeViewItem) {
    if (treeViewItem.expanded) {
      this.expanded.emit({ ...treeViewItem });
    } else {
      this.collapsed.emit({ ...treeViewItem });
    }
  }

  protected emitSelected(treeViewItem: PoTreeViewItem) {
    if (treeViewItem.disabled) {
      return;
    }

    this.selectedValue = treeViewItem.value;

    const { subItems, ...rest } = treeViewItem;
    const treeViewToEmit = this.singleSelect() ? { ...rest } : treeViewItem;

    this.updateItemsOnSelect(treeViewToEmit);

    if (treeViewItem.selected) {
      this.selected.emit({ ...treeViewToEmit });
    } else {
      this.unselected.emit({ ...treeViewToEmit });
    }
  }

  private addChildItemInParent(childItem: PoTreeViewItem, parentItem: PoTreeViewItem) {
    if (!parentItem.subItems) {
      parentItem.subItems = [];
    }

    parentItem.subItems.push(childItem);
  }

  private addItem(items: Array<PoTreeViewItem>, childItem: PoTreeViewItem, parentItem?: PoTreeViewItem, isNewItem?) {
    if (parentItem) {
      if (isNewItem) {
        this.expandParentItem(childItem, parentItem);
      }

      this.addChildItemInParent(childItem, parentItem);

      if (!this.singleSelect()) {
        this.selectItemBySubItems(parentItem);
      }

      items.push(parentItem);
    } else {
      items.push(childItem);
    }
  }

  private selectAllItems(items: Array<PoTreeViewItem>, isSelected: boolean) {
    items.forEach(item => {
      if (item.subItems) {
        this.selectAllItems(item.subItems, isSelected);
      }

      item.selected = item.isSelectable !== false ? isSelected : false;
    });
  }

  private selectItemBySubItems(item: PoTreeViewItem) {
    item.selected = this.everyItemSelected(item.subItems);
  }

  private everyItemSelected(items: Array<PoTreeViewItem> = []): boolean | null {
    const itemsLength = items.length;

    const lengthCheckedItems = items.filter(item => item.selected).length;

    if (itemsLength && itemsLength === lengthCheckedItems) {
      return true;
    }

    const hasIndeterminateItems = items.filter(item => item.selected || item.selected === null).length;

    if (hasIndeterminateItems) {
      return null;
    }

    return false;
  }

  private expandParentItem(childItem: PoTreeViewItem, parentItem: PoTreeViewItem) {
    if (childItem.expanded) {
      parentItem.expanded = true;
    }
  }

  private getItemsByMaxLevel(
    items: Array<PoTreeViewItem> = [],
    level: number = 0,
    parentItem?: PoTreeViewItem,
    newItems = []
  ) {
    const globalDisabled = this.disabled();

    items.forEach(item => {
      const { subItems, ...currentItem } = item;

      if (level === this.maxLevel()) {
        return;
      }

      // Compatibilidade: isSelectable === false é redirecionado para disabled
      if (currentItem.isSelectable === false && !currentItem.disabled) {
        currentItem.disabled = true;
      }

      // p-disabled global prevalece sobre o estado individual
      if (globalDisabled) {
        currentItem.disabled = true;
      }

      if (Array.isArray(subItems)) {
        // caso um item pai iniciar selecionado, deve selecionar os filhos.
        if (currentItem.selected) {
          this.selectAllItems(subItems, currentItem.selected);
        }

        this.getItemsByMaxLevel(subItems, ++level, currentItem);
        --level;
      }

      if (item.selected) {
        this.selectedValue = currentItem.value;
      }

      this.addItem(newItems, currentItem, parentItem, true);
    });

    return newItems;
  }

  private getItemsWithParentSelected(items: Array<PoTreeViewItem> = [], parentItem?: PoTreeViewItem, newItems = []) {
    items.forEach(item => {
      const { subItems, ...currentItem } = item;

      if (Array.isArray(subItems)) {
        this.getItemsWithParentSelected(subItems, currentItem);
      }

      this.addItem(newItems, currentItem, parentItem);
    });

    return newItems;
  }

  private updateItemsOnSelect(selectedItem: PoTreeViewItem) {
    if (selectedItem.subItems && !this.singleSelect()) {
      this.selectAllItems(selectedItem.subItems, selectedItem.selected);
    }

    this._items = this.getItemsWithParentSelected(this.items);
  }

  private applySizeBasedOnA11y(initialValue: string): void {
    const size = validateSizeFn(initialValue, PoFieldSize);
    this._componentsSize = size;
  }
  // ==============================
  // #endregion
  // ==============================
}
