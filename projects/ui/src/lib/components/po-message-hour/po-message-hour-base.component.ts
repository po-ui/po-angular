import { Directive, EventEmitter, Input, Output } from '@angular/core';

/**
 * @description
 *
 * O componente `PoMessageHour` é responsável por exibir mensagens horárias personalizadas com base no período do dia.
 *
 * #### Boas Práticas
 *
 * Este componente é projetado seguindo as práticas recomendadas para proporcionar uma experiência de usuário eficiente e acessível, sendo especialmente útil para saudações exibidas após alguma ação do usuário:
 *
 * ##### Uso
 * - Gera mensagens de saudação de acordo com o período do dia: madrugada, manhã, tarde ou noite.
 *
 * ##### Acessibilidade
 * - Utiliza controles HTML padrão para permitir a identificação por tecnologias assistivas.
 * - Mantém o underline no link para diferenciar de textos comuns, atendendo às diretrizes de contraste.
 * - Preserva o estado de foco do componente e garante que a aparência do foco atenda aos requisitos de acessibilidade.
 *
 */
@Directive()
export class PoMessageHourBaseComponent {
  /**
   * @optional
   *
   * @description
   *
   * Label da mensagem.
   */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Evento emitido quando o período do dia da mensagem é atualizado.
   * O período do dia pode ser 'dawn' (madrugada), 'morning' (manhã), 'afternoon' (tarde) ou 'night' (noite).
   */
  @Output('p-message-hour') messageHour = new EventEmitter<string>();
}
