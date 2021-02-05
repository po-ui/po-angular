import { PoCodeEditorRegisterableTokens } from './po-code-editor-registerable-tokens.interface';

/**
 * @usedBy PoCodeEditorRegister
 *
 * @description
 *
 * Interface para configuração de Opções de novas sintaxes ao code editor.
 */
export interface PoCodeEditorRegisterableOptions {
  /** Palavras chaves da sintaxe. */
  keywords: Array<string>;

  /** Operadores específicos da sintaxe.  */
  operators: Array<string>;

  /** Símbolos específicos da sintaxes. */
  symbols: RegExp;

  /** Escapes específicos da sintaxes. */
  escapes: RegExp;

  /** Interface para recebimento de token específicos da sintaxe. */
  tokenizer: PoCodeEditorRegisterableTokens;

  /** Define se a sintaxe será case sensitive ou não. */
  ignoreCase?: boolean;
}
