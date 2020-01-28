/**
 * @usedBy PoCodeEditorRegister, PoCodeEditorComponent
 *
 * @description
 *
 * Interface para configuração da lista de sugestão do autocomplete do code editor.
 */
export interface PoCodeEditorRegisterableSuggestion {
  /** Texto que será exibido na lista de sugestões. */
  label: string;

  /** Texto que será inserido no editor ao selecionar a sugestão exibida pelo autocomplete. */
  insertText: string;

  /** Texto de ajuda que será exibido caso o usuário deseje ver mais informações sobre a sugestão. */
  documentation?: string;
}

/**
 * @usedBy PoCodeEditorRegister, PoCodeEditorRegisterable
 *
 * @description
 *
 * Interface do objeto usado pelo monaco para lista de sugestão do autocomplete do code editor.
 */
export interface PoCodeEditorRegisterableSuggestionType {
  provideCompletionItems: () => { suggestions: Array<PoCodeEditorRegisterableSuggestion> };
}

/**
 *
 * @description
 *
 * Interface do objeto usado pelo monaco para lista de sugestão do autocomplete do code editor.
 * Utilizado internamente pelo serviço PoCodeEditorSuggestionService
 */
export interface PoCodeEditorSuggestionList {
  [index: string]: Array<PoCodeEditorRegisterableSuggestion>;
}
