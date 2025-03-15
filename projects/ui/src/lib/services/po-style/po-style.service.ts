import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MediaQueryRule } from './po-style.interface';

@Injectable({
  providedIn: 'root'
})
export class PoStyleService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  updateMediaQueries(globalMediaQueriesRules: Array<MediaQueryRule>): void {
    const styleSheets = document.styleSheets;

    const styleElement = this.renderer.createElement('style');
    this.renderer.appendChild(document.head, styleElement);

    const sheetDom = styleElement.sheet as CSSStyleSheet;

    Array.from(styleSheets).forEach(sheet => {
      const rules = sheet.cssRules || sheet.rules;

      Array.from(rules).forEach(rule => {
        // Verifica se a regra é de mídia (CSSMediaRule)
        if (rule instanceof CSSMediaRule) {
          const mediaRule = rule;

          // Itera sobre cada conjunto de regras de media queries fornecido
          globalMediaQueriesRules.forEach(queryRule => {
            if (mediaRule.media.mediaText.includes(queryRule.mediaRule)) {
              let updatedMediaText = mediaRule.cssText;
              const variablesInMediaRule = updatedMediaText.match(/var\(--[^)]+\)/g) || [];
              console.log('variablesInMediaRule:', variablesInMediaRule);

              // Substitui as variáveis de media queries pelos valores fornecidos
              variablesInMediaRule.forEach((variable, index) => {
                if (index < queryRule.valuesRule.length) {
                  updatedMediaText = updatedMediaText.replace(variable, queryRule.valuesRule[index]);
                  console.log('variable:', variable, ',', updatedMediaText);
                }
              });

              // Adiciona a regra modificada à folha de estilo dinâmica
              sheetDom.insertRule(updatedMediaText, sheetDom.cssRules.length);
            }
          });
        }
      });
    });
  }
}
