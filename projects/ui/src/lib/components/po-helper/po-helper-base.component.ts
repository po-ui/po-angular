import { Component, input } from '@angular/core';
import { PoHelperOptions } from './interfaces/po-helper.interface';
import { PoHelperSize } from './enums/po-helper-size.enum';
/**
 * @description
 *
 * O componente `po-helper` exibe um ícone de ajuda ou informação ao lado de campos, botões ou outros elementos, permitindo ao usuário acessar conteúdos explicativos em um popover.
 *
 * Principais funcionalidades:
 * - Exibe ícone de ajuda (`help`) ou informação (`info`) conforme configuração.
 * - Permite definir título, conteúdo e ações no popover via propriedade `p-helper`.
 * - Suporte a acessibilidade: navegação por teclado, atributos ARIA e leitura do conteúdo por leitores de tela.
 * - Controle do tamanho do componente via propriedade `p-size` (`small` ou `medium`).
 * - Permite customizar ações no rodapé do popover.
 *
 * Exemplo de uso:
 * ```html
 * <po-helper
 *   [p-helper]="{ title: 'Ajuda', content: 'Texto explicativo', type: 'help' }"
 *   [p-size]="'medium'"
 * ></po-helper>
 * ```
 *
 * Também é possível passar apenas uma string para o conteúdo:
 * ```html
 * <po-helper p-helper="Texto explicativo"></po-helper>
 * ```
 *
 * A propriedade `p-helper` aceita um objeto do tipo `PoHelperOptions`:
 * ```typescript
 * interface PoHelperOptions {
 *   title?: string;
 *   content: string;
 *   type?: 'help' | 'info';
 *   eventOnClick?: Function;
 *   footerAction?: { label: string; action: Function };
 * }
 * ```
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                | Descrição                                                     | Valor Padrão                                      |
 * |--------------------------------------------|---------------------------------------------------------------|---------------------------------------------------|
 * | `--color`                                  | Cor principal do ícone                                        | `var(--color-action-default)`                     |
 * | `--color-hover`                            | Cor principal do ícone no estado hover                        | `var(--color-action-hover)`                       |
 * | `--background-hover`                       | Cor de background no estado hover                             | `var(--color-brand-01-lighter)`                   |
 * | `--border-color-hover`                     | Cor da borda no estado hover                                  | `var(--color-brand-01-darkest)`                   |
 * | `--background-pressed`                     | Cor de background no estado de pressionado&nbsp;              | `var(--color-brand-01-light)`                     |
 * | `--color-disabled`                         | Cor principal no estado disabled                              | `var(--color-action-disabled)`                    |
 *
 */
@Component({
  selector: 'po-helper-base',
  template: '',
  standalone: false
})
export class PoHelperBaseComponent {
  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define o conteúdo e as opções do popover de ajuda/informação.
   *
   * Aceita uma string simples (exibida como conteúdo) ou um objeto do tipo `PoHelperOptions` para configuração avançada:
   * - `title`: Título do popover.
   * - `content`: Conteúdo explicativo exibido no popover.
   * - `type`: Tipo do ícone (`help` ou `info`).
   * - `eventOnClick`: Função chamada ao clicar no ícone.
   * - `footerAction`: Objeto com `label` e `action` para ação customizada no rodapé do popover.
   *
   * Exemplo de uso:
   * ```html
   * <po-helper p-helper="Texto explicativo"></po-helper>
   * <po-helper [p-helper]="{ title: 'Ajuda', content: 'Texto', type: 'info' }"></po-helper>
   * ```
   *
   */
  helper = input<PoHelperOptions | string>(undefined, {
    alias: 'p-helper',
    transform: this.transformHelper.bind(this)
  });

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura do ícone com seu valor de 16px (disponível apenas para acessibilidade AA).
   * - `medium`: altura do ícone com seu valor de 24px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `PoHelperSize.Medium`
   */
  size = input<PoHelperSize>(undefined, { alias: 'p-size' });

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Indica se o helper está desativado.
   *
   * @default `false`
   */
  disabled = input<boolean>(false, { alias: 'p-disabled' });

  private transformHelper(value: PoHelperOptions | string): PoHelperOptions {
    if (typeof value === 'string') {
      return {
        title: '',
        content: value,
        type: 'help'
      };
    }
    return value;
  }
}
