import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PoThemeTokens } from './interfaces/po-theme-tokens.interface';
import {
  poSunsetDarkTheme,
  poSunsetTheme,
  poTotvsDarkTheme,
  poTotvsTheme
} from './helpers/po-theme-default-values.constant';

/**
 * @description
 *
 * O `PoThemeService` possibilita a personalização das cores do tema padrão do `PO-UI`, permitindo a alteração dos valores das variáveis de estilo usadas no CSS padrão.
 *
 * > Para saber mais sobre como customizar as cores do tema padrão verifique o item [Customizando cores do tema padrão](https://po-ui.io/guides/colors-customization) na aba `Guias`.
 *
 * > Atenção: Para saber quais browsers dão suporte a variáveis você pode consultar a ferramenta [Can I use](https://caniuse.com/?search=CSS%20Variables).
 *
 * @example
 *
 * <example name="po-theme-basic" title="PO Theme Basic">
 *  <file name="sample-po-theme-basic/sample-po-theme-basic.component.html"> </file>
 *  <file name="sample-po-theme-basic/sample-po-theme-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-theme-form" title="PO Theme Form">
 *  <file name="sample-po-theme-form/sample-po-theme-form.component.html"> </file>
 *  <file name="sample-po-theme-form/sample-po-theme-form.component.ts"> </file>
 * </example>
 */
@Injectable({
  providedIn: 'root'
})
export class PoThemeService {
  private renderer: Renderer2;

  constructor(
    @Inject('Window') private window: Window,
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * <a id="set-theme"></a>
   *
   * Método para alterar o tema utilizado.
   *
   * Ao utilizar este método, será adicionado um novo estilo (CSS) somente com as variáveis que foram informadas.
   *
   * > O método `setTheme()` recebe um parâmetro do tipo da interface `PoThemeTokens`, porém, nenhuma das propriedades são obrigatórias.
   * Caso o valor de uma propriedade seja vazio, a mesma será ignorada.
   *
   * @param {PoThemeTokens} theme Objeto com os tokens do Tema.
   */
  setTheme(theme: PoThemeTokens): void {
    let styleCss: string = '';

    Object.keys(theme).forEach((token: string) => {
      styleCss = theme[token as keyof any] ? styleCss.concat(`${token}: ${theme[token as keyof any]};`) : styleCss;
      if (token === '--color-brand-01-dark') {
        this.changeBGImagemInPoSelect(theme[token] || '5b1c7d');
      }
    });

    if (styleCss) {
      this.renderer.setProperty(this.document.documentElement, 'style', styleCss);
    }
  }

  /**
   * @docsPrivate
   *
   * Método para alterar o tema para o tema Sunset.
   */
  setSunsetTheme(): void {
    this.setTheme(poSunsetTheme);
  }

  /**
   * @docsPrivate
   *
   * Método para alterar o tema para o tema Sunset escuro.
   */
  setSunsetDarkTheme(): void {
    this.setTheme(poSunsetDarkTheme);
  }

  /**
   * @docsPrivate
   *
   * Método para alterar o tema para o tema TOTVS.
   */
  setTotvsTheme(): void {
    this.setTheme(poTotvsTheme);
  }

  /**
   * @docsPrivate
   *
   * Método para alterar o tema para o tema TOTVS escuro.
   */
  setTotvsDarkTheme(): void {
    this.setTheme(poTotvsDarkTheme);
  }

  /**
   * @docsPrivate
   *
   * Altera a cor de fundo da imagem utilizada no po-select.
   * @param {string} color Cor da Imagem - Utilizada no atributo Fill.
   */
  private changeBGImagemInPoSelect(color: string): void {
    const styleElement: HTMLStyleElement = this.renderer.createElement('style');

    color = color[0] === '#' ? color.substring(1) : color;
    const css: string = `select {--background-image: url(${this.getBGImageforPoSelect(color)})}`;

    this.cleanBGImageStyleInPoSelect();

    this.renderer.appendChild(styleElement, this.renderer.createText(css));
    this.renderer.appendChild(this.window.document.head, styleElement);
  }

  /**
   * @docsPrivate
   *
   * Limpa o estilo de uma imagem de fundo do po-select par aum tema personalizado.
   */
  private cleanBGImageStyleInPoSelect(): void {
    const styleElement: HTMLStyleElement | undefined = this.getBGImageStyleInPoSelect();

    if (styleElement) {
      this.renderer.removeChild(this.window.document.head, styleElement);
    }
  }

  /**
   * @docsPrivate
   *
   * Obtem a Imagem no formato SVG utilizada como fundo do po-select
   * @param {string} color Cor da Imagem - Utilizada no atributo Fill.
   * @returns {string} Imagem SVG utilizada no componente po-select
   */
  private getBGImageforPoSelect(color: string): string {
    let svg: string = `"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' fill='none' `;

    svg = svg.concat(`xmlns='http://www.w3.org/2000/svg'%3E%3Cpath `);
    svg = svg.concat(`fill-rule='evenodd' clip-rule='evenodd' `);
    svg = svg.concat(`d='M18.707 8.293a.999.999 0 00-1.414 0L12 13.586 6.707 `);
    svg = svg.concat(`8.293a.999.999 0 10-1.414 1.414l6 6a.997.997 `);

    return svg.concat(`0 001.414 0l6-6a.999.999 0 000-1.414z' fill='%23${color}'/%3E%3C/svg%3E"`);
  }

  /**
   * @docsPrivate
   *
   * Obtem o estilo (style) da imagem utilizada no po-select utilizado em um tema personalizado.
   * @returns {HTMLStyleElement | undefined} Estilo (style) personalizado do po-select.
   */
  private getBGImageStyleInPoSelect(): HTMLStyleElement | undefined {
    const styles = this.document.head.querySelectorAll('style');
    let style: HTMLStyleElement | undefined;

    styles.forEach((el: HTMLStyleElement) => {
      if (el.textContent.includes('select {--background-image')) {
        style = el;
      }
    });

    return style;
  }
}
