import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional, Renderer2, RendererFactory2 } from '@angular/core';
import { ICONS_DICTIONARY, PhosphorIconDictionary } from '../../components/po-icon/index';

import { PoThemeColor } from './interfaces/po-theme-color.interface';
import { PoThemeTokens } from './interfaces/po-theme-tokens.interface';
import { PoTheme, PoThemeActive } from './interfaces/po-theme.interface';
import { PoThemeA11yEnum } from './enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from './enum/po-theme-type.enum';
import { poThemeDefaultAA } from './helpers/accessibilities/po-theme-default-aa.constant';
import { poThemeDefaultAAA } from './helpers/accessibilities/po-theme-default-aaa.constant';
import { poThemeDefaultLightValues } from './helpers/types/po-theme-light-defaults.constant';
import { poThemeDefaultDarkValues } from './helpers/types/po-theme-dark-defaults.constant';
import { poThemeDefault } from './helpers/po-theme-poui.constant';

/**
 * @description
 *
 * O `PoThemeService` possibilita a personalização das cores do tema padrão do `PO-UI`, permitindo a alteração dos valores das variáveis de estilo usadas no CSS padrão.
 *
 * > Para saber mais sobre como customizar as cores do tema padrão verifique o item [Customizando cores do tema padrão](https://po-ui.io/guides/colors-customization) na aba `Guias`.
 *
 * > Obs.: Não está documentado aqui e não indicamos a customização das cores de 'feedback' por motivos de acessibilidade e usabilidade.
 */

/**
 * @example
 *
 * <example name="po-theme-labs" title="PO Theme Labs">
 *  <file name="sample-po-theme-labs/sample-po-theme-labs.component.html"> </file>
 *  <file name="sample-po-theme-labs/sample-po-theme-labs.component.ts"> </file>
 * </example>
 *
 */
@Injectable({
  providedIn: 'root'
})
export class PoThemeService {
  private renderer: Renderer2;
  private theme: PoTheme;
  private _iconToken: { [key: string]: string };

  get iconNameLib() {
    return this._iconToken.NAME_LIB;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2,
    @Optional() @Inject(ICONS_DICTIONARY) value: { [key: string]: string }
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this._iconToken = value ?? PhosphorIconDictionary;

    // set triple A for all themes (its the base theme)
    // result: html:root
    this.setPerComponentAndOnRoot(undefined, poThemeDefaultAAA.perComponent, poThemeDefaultAAA.onRoot);

    // set double A
    // result: html[class*="-AA"]:root
    this.setPerComponentAndOnRoot({ a11y: PoThemeA11yEnum.AA }, poThemeDefaultAA.perComponent, poThemeDefaultAA.onRoot);

    // set Light mode values
    // result: html[class*="-light"]:root
    this.setPerComponentAndOnRoot(
      { type: PoThemeTypeEnum.light },
      poThemeDefaultLightValues.perComponent,
      poThemeDefaultLightValues.onRoot
    );

    // set Dark mode values
    // result: html[class*="-dark"]:root
    this.setPerComponentAndOnRoot(
      { type: PoThemeTypeEnum.dark },
      poThemeDefaultDarkValues.perComponent,
      poThemeDefaultDarkValues.onRoot
    );
  }

  /**
   * Aplica um tema ao componente de acordo com o tipo de tema e o nível de acessibilidade especificados.
   *
   * Este método configura o tema do componente com base no objeto `themeConfig` fornecido, no `themeType` e no `a11yLevel`.
   * Além disso, ele pode opcionalmente salvar a preferência de tema no localStorage, se solicitado.
   *
   * @param {PoTheme} themeConfig - Configuração de tema a ser aplicada ao componente.
   * @param {PoThemeTypeEnum} [themeType=PoThemeTypeEnum.light] - (Opcional) Tipo de tema, podendo ser 'light' (claro) ou 'dark' (escuro). O tema claro é o padrão.
   * @param {PoThemeA11yEnum} [a11yLevel=PoThemeA11yEnum.AAA] - (Opcional) Nível de acessibilidade do tema, podendo ser AA ou AAA. Padrão é AAA.
   * @param {boolean} [persistPreference=true] - (Opcional) Define se a preferência de tema deve ser salva no localStorage para persistência. `true` para salvar, `false` para não salvar.
   */
  setTheme(
    themeConfig: PoTheme,
    themeType: PoThemeTypeEnum = PoThemeTypeEnum.light,
    a11yLevel: PoThemeA11yEnum = PoThemeA11yEnum.AAA,
    persistPreference: boolean = true
  ): void {
    // Change theme name, remove special characteres and number, replace space with dash
    this.formatTheme(themeConfig, themeType, a11yLevel);

    const _themeActive =
      Array.isArray(themeConfig.type) && themeConfig.type.length >= 1
        ? themeConfig.type.find(e => e.a11y === a11yLevel)
        : themeConfig.type;

    const _themeType = _themeActive[PoThemeTypeEnum[themeType]];
    if (!_themeType) {
      return;
    }

    const colorStyles = _themeType.color ? this.generateThemeStyles(_themeType.color) : '';
    const perComponentStyles = _themeType.perComponent ? this.generatePerComponentStyles(_themeType.perComponent) : '';
    const onRootStyles = _themeType.onRoot ? this.generateAdditionalStyles(_themeType.onRoot) : '';
    const additionalStyles = this.generateAdditionalStyles(_themeType);

    const combinedStyles = `
      html.${themeConfig.name}-${PoThemeTypeEnum[themeType]}-${a11yLevel}:root {
        ${colorStyles}
        ${perComponentStyles}
        ${onRootStyles}
        ${additionalStyles}
      }`;

    this.applyThemeStyles(combinedStyles);
    this.changeThemeType(themeConfig, persistPreference);
  }

  /**
   * @docsPrivate
   *
   * Aplica estilos customizados para o componente e para o root HTML, utilizando os tokens definidos.
   *
   * Esse método é chamado para inserir ou atualizar estilos no DOM, aplicando tanto tokens de `onRoot` (ex: `--font-family: 'Roboto'`)
   * quanto estilos específicos de componentes (`perComponent`, como `po-listbox [hidden]: { display: 'flex !important' }`).
   *
   * O seletor CSS gerado leva em consideração o tema (`type`) e as configurações de acessibilidade (`a11y`) do tema ativo.
   * A classe do tema é aplicada no HTML e pode ser formatada como `html[class*="-light-AA"]` para personalizações
   * em temas específicos.
   *
   * @param {PoThemeActive} active - Objeto que define o tema ativo, com `type` e `a11y`.
   * @param {any} perComponent - Objeto contendo os estilos específicos para componentes a serem aplicados.
   * @param {any} onRoot - Objeto contendo tokens de estilo que serão aplicados diretamente no seletor `:root` do HTML.
   *
   * @example
   *
   * // Exemplo de utilização com um tema ativo e tokens de estilo
   * const themeActive = { type: 'light', a11y: 'AA' };
   * const perComponentStyles = {
   *   'po-listbox [hidden]': {
   *     'display': 'flex !important'
   *   }
   * };
   * const onRootStyles = {
   *   '--font-family': 'Roboto',
   *   '--background-color': '#fff'
   * };
   *
   * this.setPerComponentAndOnRoot(themeActive, perComponentStyles, onRootStyles);
   *
   * // Resultado:
   * // Gera e aplica os seguintes estilos no DOM
   * // html[class*="-light-AA"]:root {
   * //   --font-family: 'Roboto';
   * //   --background-color: '#fff';
   * //   po-listbox [hidden] {
   * //     display: flex !important;
   * //   }
   * // }
   *
   */
  public setPerComponentAndOnRoot(active: PoThemeActive, perComponent: any, onRoot: any) {
    const perComponentStyles = perComponent ? this.generatePerComponentStyles(perComponent) : '';
    const onRootStyles = onRoot ? this.generateAdditionalStyles(onRoot) : '';

    let selector = 'html';
    const typeSelector = active?.type !== undefined ? `-${PoThemeTypeEnum[active.type]}` : '';
    const accessibilitySelector = active?.a11y !== undefined ? `-${PoThemeA11yEnum[active.a11y]}` : '';

    if (typeSelector && accessibilitySelector) {
      selector += `[class*="${typeSelector}${accessibilitySelector}"]`;
    } else if (!typeSelector && accessibilitySelector) {
      selector += `[class$="${accessibilitySelector}"]`;
    } else if (typeSelector) {
      selector += `[class*="${typeSelector}"]`;
    }

    const styleCss = `
      ${selector}:root {
        ${perComponentStyles}
        ${onRootStyles}
      }
    `;

    let styleElement = this.document.head.querySelector('#baseStyle');
    if (!styleElement) {
      styleElement = this.renderer.createElement('style');
      styleElement.id = 'baseStyle';
      this.renderer.appendChild(styleElement, this.renderer.createText(styleCss));
      this.renderer.appendChild(this.document.head, styleElement);
    } else {
      if (!styleElement.textContent.includes(styleCss.trim())) {
        this.renderer.appendChild(styleElement, this.renderer.createText(styleCss));
      }
    }
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
    const styleElement = this.createStyleElement(styleCss, 'theme');
    const existingStyleElement = document.head.querySelector('#theme');

    if (existingStyleElement) {
      this.renderer.removeChild(document.head, existingStyleElement);
    }

    this.renderer.appendChild(document.head, styleElement);
  }

  private changeThemeType(theme: PoTheme, persistPreference: boolean = true) {
    this.cleanThemeActive(persistPreference);

    if (persistPreference) {
      this.setThemeLocal(theme);
    }

    document
      .getElementsByTagName('html')[0]
      .classList.add(
        ...[
          `${theme.name}-${PoThemeTypeEnum[this.getActiveTypeFromTheme(theme.active)]}-${PoThemeA11yEnum[this.getActiveA11yFromTheme(theme.active)]}`
        ]
      );
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
    this.setTheme(_theme, this.getActiveTypeFromTheme(_theme.active), this.getActiveA11yFromTheme(_theme.active));
    return _theme;
  }

  private formatTheme(themeConfig, themeType, a11yLevel) {
    themeConfig.name = themeConfig.name
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s+/g, '-');
    themeConfig.active = { type: themeType, a11y: a11yLevel };
  }

  applyTheme(theme?: any): any {
    const _localTheme = this.getThemeActive();

    if (!theme) {
      if (_localTheme) {
        this.persistThemeActive();
        return _localTheme;
      }
      return undefined;
    }

    const _type = this.getActiveTypeFromTheme(theme.active);
    const _accessibility = this.getActiveA11yFromTheme(theme.active);

    if (_localTheme && JSON.stringify(_localTheme) === JSON.stringify(theme)) {
      this.persistThemeActive();
      return _localTheme;
    }

    this.formatTheme(theme, _type, _accessibility);
    this.setTheme(theme, _type, _accessibility);
    return theme;
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
    typeof _theme.active === 'object' ? (_theme.active.type = type) : (_theme.active = type);
    this.changeThemeType(_theme);
  }

  /**
   * Método remove o tema armazenado e limpa todos os estilos de tema
   * aplicados ao documento.
   *
   * @param {boolean} [persistPreference=true] - (Opcional) Define se a preferência de tema não deve ser mantida no localStorage para persistência. `true` para remover, `false` para manter.
   */
  cleanThemeActive(persistPreference: boolean = true): void {
    // Sufixo existentes hoje
    const themeSuffixes = ['-light-', '-dark-'];
    const htmlElement = document.getElementsByTagName('html')[0];

    // Converte `classList` em um array e remove as classes que terminam com os sufixos especificados
    Array.from(htmlElement.classList).forEach(className => {
      if (themeSuffixes.some(suffix => className.includes(suffix))) {
        htmlElement.classList.remove(className);
      }
    });

    // Remove o tema ativo do localStorage
    if (persistPreference) {
      localStorage.removeItem('totvs-theme');
    }
  }

  private getActiveTypeFromTheme(active): PoThemeTypeEnum {
    return typeof active === 'object' ? active.type : active;
  }

  private getActiveA11yFromTheme(active): PoThemeA11yEnum {
    return typeof active === 'object' ? active.a11y : PoThemeA11yEnum.AAA;
  }

  /**
   * @docsPrivate
   *
   * Este método define um dados do tema e o armazena.
   * @param theme Os tokens de tema contendo os estilos adicionais a serem gerados.
   */
  private setThemeLocal(theme: PoTheme): void {
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
   * @param css Os tokens de cor a serem usados para gerar os estilos.
   * @param id id do style a ser aplicado.
   * @returns Uma string contendo os estilos CSS gerados.
   */
  private createStyleElement(css: string, id: string): HTMLStyleElement {
    const styleElement = this.renderer.createElement('style');
    styleElement.id = id;
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
      const selector = this.iconNameLib === 'PhosphorIcon' ? 'po-select .po-select-phosphor' : 'po-select';
      selectBgIcon += `${selector} { --background-image: url(${this.getSelectBgIcon(themeColor.neutral.dark[70])}); };`;
    }

    if (themeColor?.feedback?.negative?.base) {
      if (this.iconNameLib === 'PoIcon') {
        selectBgIcon += `po-select.ng-dirty.ng-invalid select { --background-image: url(${this.getSelectBgIcon(themeColor.feedback.negative.base)}); };`;
      }

      if (this.iconNameLib === 'PhosphorIcon') {
        selectBgIcon += `po-select.ng-dirty.ng-invalid select.po-select-phosphor { background-image: url(${this.getSelectBgIcon(themeColor.feedback.negative.base)}); };`;
      }
    }

    if (themeColor?.neutral?.light?.['30']) {
      if (this.iconNameLib === 'PoIcon') {
        selectBgIcon += `select:disabled { background-image: url(${this.getSelectBgIcon(themeColor.neutral.light['30'])}); };`;
      }

      if (this.iconNameLib === 'PhosphorIcon') {
        selectBgIcon += `po-select select.po-select-phosphor:disabled { background-image: url(${this.getSelectBgIcon(themeColor.neutral.light['30'])}); };`;
      }
    }

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
    let svg: string;

    if (this.iconNameLib === 'PoIcon') {
      svg = `"data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' `;

      svg = svg.concat(`xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' `);
      svg = svg.concat(`d='M18.707 8.29301C18.316 7.90201 17.684 7.90201 17.293 8.29301L12 13.586L6.70701 `);
      svg = svg.concat(`8.29301C6.31601 7.90201 5.68401 7.90201 5.29301 8.29301C4.90201 8.68401 4.90201 `);
      svg = svg.concat(`9.31601 5.29301 9.70701L11.293 15.707C11.488 15.902 11.744 16 12 16C12.256 16 12.512 `);
      svg = svg.concat(`15.902 12.707 15.707L18.707 9.70701C19.098 9.31601 19.098 8.68401 18.707 8.29301Z' `);
      svg = svg.concat(`fill='${color.replace('#', '%23')}'/%3E%3C/svg%3E%0A");`);

      return svg;
    }

    svg = `"data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 256 256' fill='${color.replace('#', '%23')}' `;
    svg = svg.concat(`xmlns='http://www.w3.org/2000/svg'%3E%3Cpath `);
    svg = svg.concat(
      `d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'`
    );
    svg = svg.concat(`%3E%3C/path%3E%3C/svg%3E");`);

    return svg;
  }

  /**
   * Define o tipo (light/dark) quando um tema está sendo aplicado.
   *
   * @param {PoTheme} theme - Objeto contendo as definições de tema a serem aplicadas no componente.
   * @param {PoThemeTypeEnum} [themeType=PoThemeTypeEnum.light] - (Opcional) Tipo de tema a ser aplicado, podendo ser 'light' (claro) ou 'dark' (escuro). Por padrão, o tema claro é aplicado.
   */
  setThemeType(theme: PoTheme, themeType: PoThemeTypeEnum = PoThemeTypeEnum.light) {
    const _accessibility = typeof theme.active === 'object' ? theme.active.a11y : PoThemeA11yEnum.AAA;
    this.setTheme(theme, themeType, _accessibility);
  }

  /**
   *  Define o tipo (light/dark) para um tema já ativo.
   *
   * @param {PoThemeTypeEnum} [themeType=PoThemeTypeEnum.light] - (Opcional) Tipo de tema a ser aplicado, podendo ser 'light' (claro) ou 'dark' (escuro). Por padrão, o tema claro é aplicado.
   */
  setCurrentThemeType(themeType: PoThemeTypeEnum = PoThemeTypeEnum.light) {
    const _theme = this.getThemeActive();
    this.setThemeType(_theme, themeType);
  }

  /**
   * Define o nivel de acessibilidade quando um tema está sendo aplicado.
   *
   * @param {PoTheme} theme - Objeto contendo as definições de tema a serem aplicadas no componente.
   * @param {PoThemeA11yEnum} [a11y=PoThemeA11yEnum.AAA] - (Opcional) Nível de acessibilidade a ser aplicado ao tema, como AA ou AAA. Se não for informado, por padrão a acessibilidade será AAA.
   */
  setThemeA11y(theme: PoTheme, a11y: PoThemeA11yEnum = PoThemeA11yEnum.AAA) {
    const _type = (typeof theme.active === 'object' ? theme.active.type : theme.active) || 0;
    this.setTheme(theme, _type, a11y);
  }

  /**
   * Define o nivel de acessibilidade para um tema já ativo.
   *
   * @param {PoThemeA11yEnum} [a11y=PoThemeA11yEnum.AAA] - (Opcional) Nível de acessibilidade a ser aplicado ao tema, como AA ou AAA. Se não for informado, por padrão a acessibilidade será AAA.
   */
  setCurrentThemeA11y(a11y: PoThemeA11yEnum = PoThemeA11yEnum.AAA) {
    const _theme = this.getThemeActive();
    this.setThemeA11y(_theme, a11y);
  }
}
