import { Injectable } from '@angular/core';
import {
  PoCodeEditorSuggestionList,
  PoCodeEditorRegisterableSuggestion
} from './interfaces/po-code-editor-registerable-suggestion.interface';

@Injectable({
  providedIn: 'root'
})
export class PoCodeEditorSuggestionService {
  private suggestions: PoCodeEditorSuggestionList = {};
  constructor() {}

  public getSuggestion(language: string, newSuggestion: Array<PoCodeEditorRegisterableSuggestion>) {
    if (this.suggestions[language]) {
      const deduplicateSuggestions = this.deduplicateSuggestions(this.suggestions[language], newSuggestion);
      this.suggestions[language] = [...this.suggestions[language], ...deduplicateSuggestions];
      return deduplicateSuggestions;
    } else {
      return (this.suggestions[language] = [...newSuggestion]);
    }
  }

  private deduplicateSuggestions(
    originalSuggestions: Array<PoCodeEditorRegisterableSuggestion>,
    newSuggestions: Array<PoCodeEditorRegisterableSuggestion>
  ) {
    return newSuggestions.filter(
      newItem => !originalSuggestions.find(originalItem => originalItem['label'] === newItem['label'])
    );
  }
}
