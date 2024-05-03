import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PoThemeTypeEnum } from './enum/po-theme-type.enum';
import { poThemeDefault } from './helpers/po-theme-poui.constant';
import { PoThemeColor } from './interfaces/po-theme-color.interface';
import { PoThemeTokens } from './interfaces/po-theme-tokens.interface';
import { PoTheme } from './interfaces/po-theme.interface';

/**
 * @description
 *
 * O `PoThemeService` possibilita a personalização das cores do tema padrão do `PO-UI`, permitindo a alteração dos valores das variáveis de estilo usadas no CSS padrão.
 *
 * > Para saber mais sobre como customizar as cores do tema padrão verifique o item [Customizando cores do tema padrão](https://po-ui.io/guides/colors-customization) na aba `Guias`.
 *
 * > Obs.: Não está documentado aqui e não indicamos a customização das cores de 'feedback' por motivos de acessibilidade e usabilidade.
 */
@Injectable({
  providedIn: 'root'
})
export class PoThemeService {
  private renderer: Renderer2;
  private theme: PoTheme = poThemeDefault;

  constructor(
    @Inject('Window') private window: Window,
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Define o tema a ser aplicado no componente, de acordo com o tipo de tema especificado.
   *
   * Este método define o tema a ser aplicado no componente com base no objeto `theme` fornecido e no tipo de tema especificado.
   * Ele atualiza as propriedades do componente para refletir o tema selecionado, como cores, estilos e comportamentos.
   *
   * @param {PoTheme} theme - Objeto contendo as definições de tema a serem aplicadas no componente.
   * @param {PoThemeTypeEnum} [themeType=PoThemeTypeEnum.light] - (Opcional) Tipo de tema a ser aplicado, podendo ser 'light' (claro) ou 'dark' (escuro). Por padrão, o tema claro é aplicado.
   */
  setTheme(theme: PoTheme, themeType: PoThemeTypeEnum = PoThemeTypeEnum.light): void {
    // Change theme name, remove special characteres and number, replace space with dash
    theme.name = theme.name
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s+/g, '-');
    theme.active = themeType;

    const _themeType = theme.type[PoThemeTypeEnum[themeType]];
    if (!_themeType) {
      return;
    }

    const colorStyles = _themeType.color ? this.generateThemeStyles(_themeType.color) : '';
    const perComponentStyles = _themeType.perComponent ? this.generatePerComponentStyles(_themeType.perComponent) : '';
    const onRootStyles = _themeType.onRoot ? this.generateAdditionalStyles(_themeType.onRoot) : '';
    const additionalStyles = this.generateAdditionalStyles(_themeType);

    const combinedStyles = `
      .${theme.name}-${PoThemeTypeEnum[themeType]}:root { 
        ${colorStyles} 
        ${perComponentStyles}
        ${onRootStyles}
        ${additionalStyles} 
      }`;

    this.applyThemeStyles(combinedStyles);
    this.changeThemeType(theme);
  }

  /**
   * @docsPrivate
   *
   * Gera estilos adicionais com base nos tokens de tema fornecidos, excluindo os tokens de cor.
   * @param theme Os tokens de tema contendo os estilos adicionais a serem gerados.
   * @returns Uma string contendo os estilos adicionais formatados.
   */
  private generateAdditionalStyles(theme: PoThemeTokens): string {
    return Object.entries(theme)
      .filter(([key]) => !['color', 'perComponent', 'onRoot'].includes(key))
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
  }

  /**
   * @docsPrivate
   *
   * Aplica os estilos de tema ao documento.
   * @param styleCss Os estilos CSS a serem aplicados.
   */
  private applyThemeStyles(styleCss: string): void {
    const styleElement = this.createStyleElement(styleCss);
    const existingStyleElement = document.head.querySelector('#pouiTheme');

    if (existingStyleElement) {
      this.renderer.removeChild(document.head, existingStyleElement);
    }

    this.renderer.appendChild(document.head, styleElement);
  }

  private changeThemeType(theme: PoTheme) {
    this.cleanThemeActive();
    this.setThemeActive(theme);
    document.getElementsByTagName('html')[0].classList.add(...[`${theme.name}-${PoThemeTypeEnum[theme.active]}`]);
  }

  /**
   * Persiste e define o tema do aplicativo com base nos dados armazenados.
   *
   * Este método recupera os dados do tema armazenados e os aplica ao aplicativo.
   *
   * @returns {PoTheme} Recupera o tema armazenado.
   */
  persistThemeActive() {
    const _theme = this.getThemeActive();
    this.setTheme(_theme, _theme.active);
    return _theme;
  }

  /**
   * Altera o tipo do tema armazenado e aplica os novos estilos ao documento.
   *
   * Este método altera o tipo do tema armazenado ativo (light/dark)
   *
   * @param {PoThemeTypeEnum} themeType O tipo de tema a ser aplicado, light ou dark.
   */
  changeCurrentThemeType(type: PoThemeTypeEnum): void {
    const _theme = this.getThemeActive();
    _theme.active = type;
    this.changeThemeType(_theme);
  }

  /**
   * Método remove o tema armazenado e limpa todos os estilos de tema
   * aplicados ao documento.
   */
  cleanThemeActive(): void {
    const _theme = this.getThemeActive();
    document.getElementsByTagName('html')[0].classList.remove(`${_theme.name}-${PoThemeTypeEnum[_theme.active]}`);
    localStorage.removeItem('totvs-theme');
  }

  /**
   * @docsPrivate
   *
   * Este método define um dados do tema e o armazena.
   * @param theme Os tokens de tema contendo os estilos adicionais a serem gerados.
   */
  private setThemeActive(theme: PoTheme): void {
    if (theme) {
      localStorage.setItem('totvs-theme', JSON.stringify(theme));
      this.theme = theme;
    }
  }

  /**
   * Retorna o tema ativo como um observable.
   * @returns {PoTheme} Tema ativo.
   */
  getThemeActive(): PoTheme {
    try {
      const themeData = JSON.parse(localStorage.getItem('totvs-theme'));
      if (themeData && JSON.stringify(themeData) !== JSON.stringify(this.theme)) {
        this.theme = themeData;
      }
    } catch (error) {
      console.error('Erro ao obter o tema do armazenamento local:', error);
    }
    return this.theme;
  }

  /**
   * @docsPrivate
   *
   * Gera estilos CSS com base nos tokens de cores fornecidos.
   * @param themeColor Os tokens de cor a serem usados para gerar os estilos.
   * @returns Uma string contendo os estilos CSS gerados.
   */
  private createStyleElement(css: string): HTMLStyleElement {
    const styleElement = this.renderer.createElement('style');
    styleElement.id = 'pouiTheme';
    this.renderer.appendChild(styleElement, this.renderer.createText(css));
    return styleElement;
  }

  /**
   * @docsPrivate
   *
   * Gera estilos CSS com base nos tokens de cores fornecidos.
   * @param themeColor Os tokens de cor a serem usados para gerar os estilos.
   * @returns Uma string contendo os estilos CSS gerados.
   */
  private generateThemeStyles(themeColor: PoThemeColor): string {
    const selectBgIconStyle = this.getSelectBgIconsStyle(themeColor);

    return [
      Object.entries(themeColor)
        .flatMap(([type, values]) =>
          Object.entries(values).flatMap(([tonality, tonalityValues]) => {
            if (type === 'action') {
              return [`--color-${type}-${tonality}: ${tonalityValues};`];
            } else {
              return Object.entries(tonalityValues).map(
                ([level, colorValue]) => `--color-${type}-${tonality}-${level}: ${colorValue};`
              );
            }
          })
        )
        .join(''),
      selectBgIconStyle
    ].join('');
  }

  /**
   * @docsPrivate
   *
   * Gera estilos CSS com base nos tokens per Component fornecidos.
   * @param themePerComponent Os tokens de cor a serem usados para gerar os estilos.
   * @returns Uma string contendo os estilos CSS gerados.
   */
  private generatePerComponentStyles(themePerComponent: any): string {
    return Object.entries(themePerComponent)
      .flatMap(([type, values]) =>
        Object.entries(values).flatMap(([level, colorValue]) => [`${type} {${level}: ${colorValue};};`])
      )
      .join('');
  }

  /**
   * Define o tema atual como o tema "PoUI Padrão".
   *
   * @param {PoThemeTypeEnum} type O tipo de Tema a ser aplicado, light / dark.
   */
  setDefaultTheme(type: PoThemeTypeEnum): void {
    this.setTheme(poThemeDefault, type);
  }

  /**
   * @docsPrivate
   *
   * Retorna o estilo CSS para o fundo dos ícones do componente po-select, com base nas cores do tema.
   *
   * @param {PoThemeColor} themeColor - Objeto contendo as cores do tema.
   * @returns {string} - Estilo CSS para o fundo dos ícones do po-select.
   */
  private getSelectBgIconsStyle(themeColor: PoThemeColor): string {
    let selectBgIcon = '';

    if (themeColor?.brand?.['01']?.dark) {
      selectBgIcon += `po-select { --background-image: url("${this.getSelectBgIcon(themeColor.brand['01'].dark)}"); };`;
    }
    if (themeColor?.feedback?.negative?.base)
      selectBgIcon += `po-select.ng-dirty.ng-invalid select { --background-image: url("${this.getSelectBgIcon(themeColor.feedback.negative.base)}"); };`;

    if (themeColor?.neutral?.light?.['30'])
      selectBgIcon += `select:disabled { --background-image: url("${this.getSelectBgIcon(themeColor.neutral.light['30'])}"); };`;

    return selectBgIcon;
  }

  /**
   * @docsPrivate
   *
   * Retorna a imagem SVG utilizada como fundo do po-select.
   *
   * @param {string} color Cor da Imagem - Utilizada no atributo 'fill'.
   * @returns {string} Imagem SVG utilizada no po-select.
   */
  private getSelectBgIcon(color: string): string {
    let svg: string = `"data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' `;

    svg = svg.concat(`xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' `);
    svg = svg.concat(`d='M18.707 8.29301C18.316 7.90201 17.684 7.90201 17.293 8.29301L12 13.586L6.70701 `);
    svg = svg.concat(`8.29301C6.31601 7.90201 5.68401 7.90201 5.29301 8.29301C4.90201 8.68401 4.90201 `);
    svg = svg.concat(`9.31601 5.29301 9.70701L11.293 15.707C11.488 15.902 11.744 16 12 16C12.256 16 12.512 `);
    svg = svg.concat(`15.902 12.707 15.707L18.707 9.70701C19.098 9.31601 19.098 8.68401 18.707 8.29301Z' `);
    svg = svg.concat(`fill='%23${color}'/%3E%3C/svg%3E%0A");`);

    return svg;
  }
}
