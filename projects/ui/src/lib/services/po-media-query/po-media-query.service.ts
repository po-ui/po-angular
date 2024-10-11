import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { PoMediaQueryTokens } from './po-media-query.interface';

/**
 * @description
 *
 * O PoMediaQueryService é um serviço que atualiza dinamicamente regras de media query dentro de folhas de estilo do DOM.
 *
 * Ele utiliza as regras de media queries que contêm tokens CSS (definidos como var(--nome-da-variavel)) e as replica, aplicando os novos valores fornecidos, facilitando a adaptação dos estilos com base nas condições das media queries.
 *
 * Exemplo de uso:
 *
 * Neste exemplo, estamos alterando os valores dos breakpoints para o grid system, que determina como o layout deve se comportar em diferentes larguras de tela. Utilizando o PoMediaQueryService, definimos os limites para três tamanhos de tela: pequeno (sm), médio (md), e grande (lg), e aplicamos esses valores dinamicamente para garantir que o layout responda adequadamente às mudanças no tamanho da janela.
 * Isso permite que o grid system do PO UI seja personalizado para se ajustar às necessidades do seu projeto.
 *
 * ```
 * import { PoMediaQueryService } from './po-media-query.service';
 *
 * @Component({
 *  selector: 'app-root',
 *  templateUrl: './app.component.html',
 *  styleUrls: ['./app.component.css']
 * })
 *
 * export class AppComponent {
 *
 *  // Definindo tokens personalizados para os breakpoints do grid system
 *  constructor(private poMediaQueryService: PoMediaQueryService) {}
 *
 *  ngOnInit() {
 *    const tokens: PoMediaQueryTokens =  {
 *     sm: {
 *      gridSystemSmMaxWidth: '1024px' // Limite máximo para telas pequenas (até 1024px)
 *      },
 *     md: {
 *      gridSystemMdMinWidth: '1025px', // Limite mínimo para telas médias (a partir de 1025px)
 *      gridSystemMdMaxWidth: '1366px' // Limite máximo para telas médias (até 1366px)
 *     },
 *     lg: {
 *      gridSystemLgMinWidth: '1367px', // Limite mínimo para telas grandes (a partir de 1367px)
 *      gridSystemLgMaxWidth: '1465px' // Limite máximo para telas grandes (até 1465px)
 *     },
 *     xl: {
 *      gridSystemXlMinWidth: '1466px' // Limite mínimo para telas extra grandes (a partir de 1466px)
 *     }
 *    };
 *
 *    // Atualiza os tokens de media queries com os novos valores
 *    this.poMediaQueryService.updateTokens(tokens);
 *  }
 * }
 * ```
 *
 */

@Injectable({
  providedIn: 'root'
})
export class PoMediaQueryService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Método que replica as regras baseando-se pelos tokens de media query dentro das folhas de estilo do documento, permitindo a modificação dinâmica
   * dos valores CSS correspondentes aos tokens fornecidos.
   *
   * @param {PoMediaQueryTokens} tokens Objeto contendo os tokens que devem ser atualizados. Cada propriedade corresponde a uma variável CSS que será
   * dinamicamente modificada dentro das regras de media query.
   *
   */
  updateTokens(tokens: PoMediaQueryTokens): void {
    const styleSheets = document.styleSheets;
    const styleElement = this.createStyleElement();
    const dynamicSheet = styleElement.sheet;

    Array.from(styleSheets).forEach(sheet => {
      if (sheet) {
        this.processStyleSheet(sheet, tokens, dynamicSheet);
      }
    });
  }

  private createStyleElement(): HTMLStyleElement {
    const styleElement = this.renderer.createElement('style');
    this.renderer.appendChild(document.head, styleElement);
    return styleElement;
  }

  private processStyleSheet(sheet: CSSStyleSheet, tokens: PoMediaQueryTokens, dynamicSheet: CSSStyleSheet): void {
    const rules: CSSRuleList = sheet.cssRules;

    if (!rules) {
      console.warn('No rules found in stylesheet');
      return;
    }

    Array.from(rules).forEach(rule => {
      if ('media' in rule) {
        this.updateTokensMediaRule(rule as CSSMediaRule, tokens, dynamicSheet);
      }
    });
  }

  private updateTokensMediaRule(
    mediaRule: CSSMediaRule,
    tokens: PoMediaQueryTokens,
    dynamicSheet: CSSStyleSheet
  ): void {
    if (!dynamicSheet) {
      console.error('dynamicSheet is null or undefined. Cannot insert rule.');
      return;
    }

    const variablesInMediaRule = mediaRule.media.mediaText.match(/var\(--[^)]+\)/g) || [];
    if (variablesInMediaRule.length === 0) return;

    let updatedMediaQuery = '';

    variablesInMediaRule.forEach(variable => {
      Object.entries(tokens).forEach(([token, breakpoints]) => {
        if (breakpoints) {
          Object.entries(breakpoints).forEach(([breakpointVariable, value]) => {
            if (typeof value === 'string') {
              const tokenToCompare = `var(--${breakpointVariable})`;

              if (tokenToCompare === variable) {
                updatedMediaQuery = this.buildMediaQuery(token, value, updatedMediaQuery);
              }
            }
          });
        }
      });
    });

    if (updatedMediaQuery) {
      const cssRules = Array.from(mediaRule.cssRules)
        .map(rule => rule.cssText)
        .join(' ');

      dynamicSheet.insertRule(`${updatedMediaQuery} { ${cssRules} }`, dynamicSheet.cssRules.length);
    }
  }

  private buildMediaQuery(token: string, value: string, existingQuery: string): string {
    switch (true) {
      case token.includes('sm') || token.includes('pull') || token.includes('offset'):
        return `@media (max-width: ${value})`;
      case token.includes('xl'):
        return `@media (min-width: ${value})`;
      case token.includes('md') || token.includes('lg'):
        return existingQuery ? `${existingQuery} and (max-width: ${value})` : `@media (min-width: ${value})`;
      default:
        return existingQuery;
    }
  }
}
