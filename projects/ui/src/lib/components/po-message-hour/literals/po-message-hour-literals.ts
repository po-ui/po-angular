export interface PoMessageHourLiterals {
  /**
   * @usedBy PoMessageHour
   *
   * @description
   *
   * Interface para configuração de mensagem de saudação.
   */
  salutation?: string;

  /**
   * @usedBy PoMessageHour
   *
   * @description
   *
   * Mensagem exibida durante a madrugada.
   */
  dawn?: string;

  /**
   * @usedBy PoMessageHour
   *
   * @description
   *
   * Mensagem exibida durante a manhã.
   */
  morning?: string;

  /**
   * @usedBy PoMessageHour
   *
   * @description
   *
   * Mensagem exibida durante a tarde.
   */
  afternoon?: string;

  /**
   * @usedBy PoMessageHour
   *
   * @description
   *
   * Mensagem exibida durante a noite.
   */
  night?: string;
}
