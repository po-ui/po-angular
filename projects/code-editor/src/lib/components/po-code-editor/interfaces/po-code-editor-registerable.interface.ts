import { PoCodeEditorRegisterableOptions } from './po-code-editor-registerable-options.interface';

/**
 * @usedBy PoCodeEditorRegister
 *
 * @description
 *
 * Interface para configuração de novas sintaxes ao code editor.
 */
export interface PoCodeEditorRegisterable {
  /** Nome da sintaxe a ser registrada no code editor. */
  language: string;

  /** Opções de configuração da sintaxe customizada. */
  options: PoCodeEditorRegisterableOptions;
}
