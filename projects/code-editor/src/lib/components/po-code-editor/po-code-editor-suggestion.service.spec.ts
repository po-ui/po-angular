import { TestBed } from '@angular/core/testing';

import { PoCodeEditorSuggestionService } from './po-code-editor-suggestion.service';
import { PoCodeEditorRegisterableSuggestion } from './interfaces/po-code-editor-registerable-suggestion.interface';

describe('PoCodeEditorSuggestionService', () => {
  let service: PoCodeEditorSuggestionService;
  const htmlSuggestions_1: Array<PoCodeEditorRegisterableSuggestion> = [
    { label: 'po', insertText: '<po-ui></po-ui>', documentation: 'best library!' },
    { label: 'angular', insertText: '<angular></angular>', documentation: 'best framework!' }
  ];

  const htmlSuggestions_2: Array<PoCodeEditorRegisterableSuggestion> = [
    { label: 'po', insertText: '<po-ui></po-ui>', documentation: 'best library!' },
    { label: 'angular', insertText: '<angular></angular>', documentation: 'best framework!' },
    { label: 'vue', insertText: '<vue></vue>', documentation: 'vuezin' }
  ];

  const htmlSuggestions_3: Array<PoCodeEditorRegisterableSuggestion> = [
    { label: 'po', insertText: '<po-ui></po-ui>', documentation: 'best library!' },
    { label: 'angular', insertText: '<angular></angular>', documentation: 'best framework!' },
    { label: 'react', insertText: '<vue></vue>', documentation: 'me' }
  ];

  const jsSuggestions: Array<PoCodeEditorRegisterableSuggestion> = [
    { label: 'log', insertText: 'console.log', documentation: 'debug time' },
    { label: 'alert', insertText: 'alert()', documentation: 'Hello' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoCodeEditorSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a array of new suggestion for two different languages', () => {
    expect(service.getSuggestion('html', htmlSuggestions_1)).toEqual(htmlSuggestions_1);
    expect(service.getSuggestion('js', jsSuggestions)).toEqual(jsSuggestions);
  });

  it('should deduplicate two arrays of new suggestion from the same language', () => {
    service.getSuggestion('html', htmlSuggestions_1);
    expect(service.getSuggestion('html', htmlSuggestions_2)).toEqual([
      { label: 'vue', insertText: '<vue></vue>', documentation: 'vuezin' }
    ]);
    expect(service.getSuggestion('html', htmlSuggestions_3)).toEqual([
      { label: 'react', insertText: '<vue></vue>', documentation: 'me' }
    ]);
  });
});
