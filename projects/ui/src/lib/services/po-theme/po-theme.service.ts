import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional, Renderer2, RendererFactory2 } from '@angular/core';
import { AnimaliaIconDictionary, ICONS_DICTIONARY } from '../../components/po-icon/index';

import { PoThemeA11yEnum } from './enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from './enum/po-theme-type.enum';
import { poThemeDefaultAA } from './helpers/accessibilities/po-theme-default-aa.constant';
import { poThemeDefaultAAA } from './helpers/accessibilities/po-theme-default-aaa.constant';
import { poThemeDefault } from './helpers/po-theme-poui.constant';
import { poThemeDefaultDarkValues } from './helpers/types/po-theme-dark-defaults.constant';
import { poThemeDefaultDarkValuesAA } from './helpers/types/po-theme-dark-defaults-AA.constant';
import { poThemeDefaultLightValues } from './helpers/types/po-theme-light-defaults.constant';
import { PoThemeColor } from './interfaces/po-theme-color.interface';
import { PoThemeTokens } from './interfaces/po-theme-tokens.interface';
import { PoTheme, PoThemeActive } from './interfaces/po-theme.interface';
import { poThemeDefaultLightValuesAA } from './helpers/types/po-theme-light-defaults-AA.constant';

/**
 * @description
 *
 * O `PoThemeService` possibilita a personalização das cores do tema padrão do `PO-UI`, permitindo a alteração dos valores das variáveis de estilo usadas no CSS padrão.
 *
 * > Para saber mais sobre como customizar o tema padrão verifique o item [Customização de Temas usando o serviço PO-UI](guides/theme-service) na aba `Guias`.
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
    this._iconToken = value ?? AnimaliaIconDictionary;

    this.setDefaultBaseStyle();
  }

  /**
   * Aplica um tema ao componente de acordo com o tipo de tema e o nível de acessibilidade especificados.
   *
   * Este método configura o tema do componente com base no objeto `themeConfig` fornecido, no `themeType` e no `a11yLevel`.
   * Além disso, ele pode opcionalmente salvar a preferência de tema no localStorage, se solicitado.
   *
   * @param {PoTheme} themeConfig - Configuração de tema a ser aplicada ao componente.
   * @param {PoThemeTypeEnum} [themeType=PoThemeTypeEnum.light] - (Opcional) Tipo de tema, podendo ser 'light' (claro) ou 'dark' (escuro). O tema claro é o padrão.
   * @param {PoThemeA11yEnum} [a11yLevel=PoThemeA11yEnum.AAA] - (Opcional) Nível de acessibilidade dos componentes, podendo ser AA ou AAA. Padrão é AAA.
   * @param {boolean} [persistPreference=true] - (Opcional) Define se a preferência de tema deve ser salva no localStorage para persistência. `true` para salvar, `false` para não salvar.
   */
  setTheme(
    themeConfig: PoTheme,
    themeType: PoThemeTypeEnum = PoThemeTypeEnum.light,
    a11yLevel: PoThemeA11yEnum = PoThemeA11yEnum.AAA,
    persistPreference: boolean = true
  ): void {
    if (themeConfig === poThemeDefault) {
      this.resetBaseTheme();
    }
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
      :root.${themeConfig.name}-${PoThemeTypeEnum[themeType]}-${a11yLevel} {
        ${colorStyles}
        ${perComponentStyles}
        ${onRootStyles}
        ${additionalStyles}
      }`;

    this.applyThemeStyles(combinedStyles);
    document.documentElement.setAttribute('data-a11y', a11yLevel === PoThemeA11yEnum.AAA ? 'AAA' : 'AA');
    this.changeThemeType(themeConfig, persistPreference);
    this.dispatchEvent(themeConfig);
  }

  /**
   * Retorna o nível de acessibilidade configurado no tema.
   * Se não estiver configurado, retorna `AAA` como padrão.
   * @returns {PoThemeA11yEnum} O nível de acessibilidade, que pode ser `AA` ou `AAA`.
   */
  getA11yLevel(): PoThemeA11yEnum {
    const a11yLevel = document.documentElement.getAttribute('data-a11y');
    if (a11yLevel !== 'AA' && a11yLevel !== 'AAA') {
      return PoThemeA11yEnum.AAA;
    }

    return a11yLevel === 'AAA' ? PoThemeA11yEnum.AAA : PoThemeA11yEnum.AA;
  }

  /**
   * Define o tamanho `small` como padrão para componentes de formulário que não possuem um tamanho definido.
   * Essa configuração é aplicada globalmente apenas quando o nível de acessibilidade for `AA`.
   * Caso contrário, o tamanho padrão será `medium`.
   *
   * @param {boolean} enable Habilita ou desabilita o tamanho `small` globalmente.
   */
  setA11yDefaultSizeSmall(enable: boolean): boolean {
    const a11yLevel = document.documentElement.getAttribute('data-a11y');

    if (!a11yLevel || (a11yLevel !== PoThemeA11yEnum.AA && a11yLevel !== PoThemeA11yEnum.AAA)) {
      return false;
    }

    if (a11yLevel === PoThemeA11yEnum.AA && enable) {
      const defaultSize = 'small';

      if (localStorage.getItem('po-default-size') !== defaultSize) {
        localStorage.setItem('po-default-size', defaultSize);
      }
      return true;
    }

    localStorage.removeItem('po-default-size');

    return false;
  }

  /**
   * @docsPrivate
   * Retorna a preferência global de tamanho dos componentes.
   *
   * @returns `'small'` ou `'medium'`.
   */
  getA11yDefaultSize(): string {
    const defaultSize = localStorage.getItem('po-default-size');
    const a11yLevel = document.documentElement.getAttribute('data-a11y');
    return defaultSize === 'small' && a11yLevel === 'AA' ? 'small' : 'medium';
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
   * @param {PoThemeActive} active - Configuração do tema ativo:
   * @param {any} perComponent - Objeto contendo os estilos específicos para componentes a serem aplicados.
   * @param {any} onRoot - Objeto contendo tokens de estilo que serão aplicados diretamente no seletor `:root` do HTML.
   * @param {string | Array<string>} [classPrefix] - Prefixo(s) de classe para direcionamento preciso.
   *
   * @example
   * #### 1. Com prefixo único
   * ```typescript
   * setPerComponentAndOnRoot(
   *   { type: 'dark', a11y: 'AA' },
   *   { 'po-input': { background: '#222' } },
   *   { '--text-color': '#fff' },
   *   'myTheme'
   * );
   * ```
   * **Saída:**
   * ```css
   * :root[class*="-dark-AA"][class*="myTheme"] {
   *   --text-color: #fff;
   *   po-input { background: #222; }
   * }
   * ```
   *
   * #### 2. Com múltiplos prefixos
   * ```typescript
   * setPerComponentAndOnRoot(
   *   { type: 'light' },
   *   null,
   *   { '--primary': '#3e8ed0' },
   *   ['myTheme', 'portal-v2']
   * );
   * ```
   * **Saída:**
   * ```css
   * :root[class*="-light"][class*="myTheme"],
   * :root[class*="-light"][class*="portal-v2"] {
   *   --primary: #3e8ed0;
   * }
   * ```
   *
   * - Quando usado com array, gera um seletor CSS com múltiplos targets (separados por vírgula).
   * - Mantém a especificidade original do tema (`[class*="-type-a11y"]`) combinada com cada prefixo.
   *
   */
  public setPerComponentAndOnRoot(
    active: PoThemeActive,
    perComponent: any,
    onRoot: any,
    classPrefix?: string | Array<string>
  ) {
    const perComponentStyles = perComponent ? this.generatePerComponentStyles(perComponent) : '';
    const onRootStyles = onRoot ? this.generateAdditionalStyles(onRoot) : '';

    let selector = ':root';
    const typeSelector = active?.type !== undefined ? `-${PoThemeTypeEnum[active.type]}` : '';
    const accessibilitySelector = active?.a11y !== undefined ? `-${PoThemeA11yEnum[active.a11y]}` : '';

    if (typeSelector && accessibilitySelector) {
      selector += `[class*="${typeSelector}${accessibilitySelector}"]`;
    } else if (!typeSelector && accessibilitySelector) {
      selector += `[class$="${accessibilitySelector}"]`;
    } else if (typeSelector) {
      selector += `[class*="${typeSelector}"]`;
    }

    if (classPrefix) {
      if (Array.isArray(classPrefix)) {
        selector = classPrefix.map(prefix => selector + `[class*="${prefix}"]`).join(', ');
      } else {
        selector += `[class*="${classPrefix}"]`;
      }
    }

    const styleCss = `
      ${selector} {
        ${perComponentStyles}
        ${onRootStyles}
      }
    `;

    let styleElement = this.document.head.querySelector('#baseStyle');
    if (!styleElement) {
      styleElement = this.renderer.createElement('style');
      styleElement.id = 'baseStyle';
      this.renderer.appendChild(styleElement, this.renderer.createText(styleCss));
      this.renderer.insertBefore(this.document.head, styleElement, this.document.head.firstChild);
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

    const existingBaseStyle = document.head.querySelector('#baseStyle');
    const referenceNode = existingBaseStyle ? existingBaseStyle.nextSibling : document.head.firstChild;

    this.renderer.insertBefore(document.head, styleElement, referenceNode);
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
    const defaultSize = this.getA11yDefaultSize();
    localStorage.setItem('po-default-size', defaultSize);
    return _theme;
  }

  private formatTheme(themeConfig, themeType, a11yLevel) {
    themeConfig.name = themeConfig.name
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s+/g, '-');
    themeConfig.active = { type: themeType, a11y: a11yLevel };
    this.theme = themeConfig;
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
    this.dispatchEvent(_theme);
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
   * Retorna o tema ativo como um observable. Este método funcionará apenas se o tema estiver armazenado no `localStorage`.
   *
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
            } else if (type === 'categorical' || type === 'categorical-overlay') {
              return [`--color-caption-${type}-${tonality}: ${tonalityValues};`];
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
      const selector = this.iconNameLib === 'AnimaliaIcon' ? 'po-select .po-select-phosphor' : 'po-select';
      selectBgIcon += `${selector} { --background-image: url(${this.getSelectBgIcon(themeColor.neutral.dark[70])}); };`;
    }

    if (themeColor?.feedback?.negative?.base) {
      if (this.iconNameLib === 'PoIcon') {
        selectBgIcon += `po-select.ng-dirty.ng-invalid select { --background-image: url(${this.getSelectBgIcon(themeColor.feedback.negative.base)}); };`;
      }

      if (this.iconNameLib === 'AnimaliaIcon') {
        selectBgIcon += `po-select.ng-dirty.ng-invalid select.po-select-phosphor { background-image: url(${this.getSelectBgIcon(themeColor.feedback.negative.base)}); };`;
      }
    }

    if (themeColor?.neutral?.light?.['30']) {
      if (this.iconNameLib === 'PoIcon') {
        selectBgIcon += `select:disabled { background-image: url(${this.getSelectBgIcon(themeColor.neutral.light['30'])}); };`;
      }

      if (this.iconNameLib === 'AnimaliaIcon') {
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

  private dispatchEvent(theme: any) {
    const evento = new CustomEvent('PoUiThemeChange', { detail: theme });
    window.dispatchEvent(evento);
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
   * Define o nível de acessibilidade quando um tema está sendo aplicado.
   *
   * @param {PoTheme} theme - Objeto contendo as definições de tema a serem aplicadas no componente.
   * @param {PoThemeA11yEnum} [a11y=PoThemeA11yEnum.AAA] - (Opcional) Nível de acessibilidade dos componentes podendo ser
   * AA ou AAA. Por padrão a acessibilidade é AAA.
   */
  setThemeA11y(theme: PoTheme, a11y: PoThemeA11yEnum = PoThemeA11yEnum.AAA) {
    const _type = (typeof theme.active === 'object' ? theme.active.type : theme.active) || 0;
    this.setTheme(theme, _type, a11y);
  }

  /**
   * Define o nível de acessibilidade para um tema já ativo.
   *
   * @param {PoThemeA11yEnum} [a11y=PoThemeA11yEnum.AAA] - (Opcional) Nível de acessibilidade dos componentes podendo ser
   * AA ou AAA. Por padrão a acessibilidade é AAA.
   */
  setCurrentThemeA11y(a11y: PoThemeA11yEnum = PoThemeA11yEnum.AAA) {
    const _theme = this.getThemeActive();
    this.setThemeA11y(_theme, a11y);
  }

  public resetBaseTheme() {
    const styleElement = this.document.head.querySelector('#baseStyle');
    if (styleElement) {
      this.renderer.removeChild(this.document.head, styleElement);
    }

    this.setDefaultBaseStyle();
  }

  private setDefaultBaseStyle() {
    // set triple A for all themes (its the base theme)
    // result: :root
    this.setPerComponentAndOnRoot(undefined, poThemeDefaultAAA.perComponent, poThemeDefaultAAA.onRoot);

    // set double A
    // result: :root[class*="-AA"]
    this.setPerComponentAndOnRoot({ a11y: PoThemeA11yEnum.AA }, poThemeDefaultAA.perComponent, poThemeDefaultAA.onRoot);

    // set Light mode values
    // result: :root[class*="-light"]
    this.setPerComponentAndOnRoot(
      { type: PoThemeTypeEnum.light },
      poThemeDefaultLightValues.perComponent,
      poThemeDefaultLightValues.onRoot
    );

    // set Light mode values AA
    // result: :root[class*="-light-AA"]
    this.setPerComponentAndOnRoot(
      { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AA },
      poThemeDefaultLightValuesAA.perComponent,
      poThemeDefaultLightValuesAA.onRoot
    );

    // set Dark mode values
    // result: :root[class*="-dark"]
    this.setPerComponentAndOnRoot(
      { type: PoThemeTypeEnum.dark },
      poThemeDefaultDarkValues.perComponent,
      poThemeDefaultDarkValues.onRoot
    );

    // set Dark mode values
    // result: :root[class*="-dark-AA"]Add commentMore actions
    this.setPerComponentAndOnRoot(
      { type: PoThemeTypeEnum.dark, a11y: PoThemeA11yEnum.AA },
      poThemeDefaultDarkValuesAA.perComponent,
      poThemeDefaultDarkValuesAA.onRoot
    );
  }
}
