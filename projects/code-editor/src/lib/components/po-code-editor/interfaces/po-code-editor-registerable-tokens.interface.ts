/**
 * @usedBy PoCodeEditorRegister
 *
 * @description
 *
 * Interface para configuração de tokens de novas sintaxes ao code editor.
 */
export interface PoCodeEditorRegisterableTokens {
  /** Principal tokenizer da sintaxe customizada. */
  root: Array<any>;

  /** Tokenizer de comentários. */
  comment?: Array<any>;

  /** Tokenizer de strings. */
  string?: Array<any>;

  /** Tokenizer de whitespaces. */
  whitespace?: Array<any>;

  /** Sequência de interpolação.  */
  interpolated?: Array<any>;

  /** Sequência de interpolação composta. */
  interpolatedCompound?: Array<any>;
}
