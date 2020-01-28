import { Input, Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { PoCodeEditorRegisterableSuggestion } from './interfaces/po-code-editor-registerable-suggestion.interface';

const PO_CODE_EDITOR_THEMES = ['vs-dark', 'vs', 'hc-black'];
const PO_CODE_EDITOR_THEME_DEFAULT = 'vs';

/**
 * @description
 *
 * O `po-code-editor` é um componente para edição de código fonte baseado no Monaco Editor da Microsoft.
 *
 * Sendo assim, algumas configurações presentes no Monaco podem ser utilizadas aqui, como a escolha da linguagem
 * (utilizando o highlight syntax específico), escolha do tema e opção de diff, além de ser muito similar ao Visual
 * Studio Code, com autocomplete e fechamento automático de brackets.
 *
 * Este componente pode ser usado em qualquer situação que necessite de adição de códigos, como por exemplo, criar
 * receitas utilizando Terraform para gerenciar topologias.
 * É importante ressaltar que este não é um componente para edição de textos comuns.
 *
 * O [(ngModel)] deve ser usado para manipular o conteúdo do po-code-editor, ou seja, tanto para incluir um conteúdo quanto
 * para recuperar o conteúdo do po-code-editor, utiliza-se uma variável passada por [(ngModel)].
 *
 * #### Adicionando o pacote @po-ui/ng-code-editor
 *
 * Para instalar o pacote `po-code-editor` em sua aplicação execute:
 *
 * ```shell
 * ng add @po-ui/ng-code-editor
 * ```
 *
 * O comando `ng add` do `Angular CLI`:
 * - inclui o `po-code-editor` no seu projeto;
 * - adiciona o módulo `PoCodeEditorModule`:;
 *
 * ```
 * // app.module.ts
 * ...
 * import { PoModule } from '@po-ui/ng-components';
 * import { PoCodeEditorModule } from '@po-ui/ng-code-editor';
 * ...
 * @NgModule({
 *   imports: [
 *     ...
 *     PoModule,
 *     PoCodeEditorModule
 *   ],
 *   ...
 * })
 * export class AppModule { }
 * ```
 *
 * - adiciona o tema PO UI e também o *asset* do Monaco no arquivo `angular.json`, conforme abaixo:
 *
 * <pre ngNonBindable>
 * ...
 * "assets": [
 *    { "glob": "&#42;&#42;/&#42;", "input": "node_modules/monaco-editor/min", "output": "/assets/monaco/" }
 *  ],
 * "styles": [
 *    "./node_modules/@po-ui/style/css/po-theme-default.min.css"
 * ]
 * ...
 * </pre>
 */
@Directive()
export abstract class PoCodeEditorBaseComponent implements ControlValueAccessor {
  private _height: number = 150;
  private _language = 'plainText';
  private _readonly: boolean = false;
  private _showDiff: boolean = false;
  private _suggestions: Array<PoCodeEditorRegisterableSuggestion>;
  private _theme = PO_CODE_EDITOR_THEME_DEFAULT;

  editor: any;
  modifiedValue: string = '';
  value: any = '';

  /**
   * @optional
   *
   * @description
   *
   * Linguagem na qual será apresentado o código fonte.
   * Para saber quais são as linguagens compatíveis, consulte a documentação oficial do
   * [**Monaco Editor**](https://microsoft.github.io/monaco-editor/).
   *
   * Também é possível adicionar uma nova linguagem personalizada utilizando o serviço:
   * [**po-code-editor-register**](https://po-ui.io/documentation/po-code-editor-register?view=doc).
   *
   * @default `plainText`
   */
  @Input('p-language') set language(language: string) {
    this._language = language && language.length ? language.trim() : 'plainText';

    if (this.editor && this._language) {
      this.setLanguage(this._language);
    }
  }

  get language(): string {
    return this._language;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica se o editor será aberto em modo de leitura.
   *
   * Neste caso, não é possível editar o código inserido.
   *
   * Obs: Esta propriedade não refletirá efeito se alterada após o carregamento do componente.
   *
   * @default `false`
   */
  @Input('p-readonly') set readonly(readonly: boolean) {
    this._readonly = <any>readonly === '' ? true : this.convertToBoolean(readonly);

    if (this.editor) {
      this.setReadOnly(readonly);
    }
  }

  get readonly(): boolean {
    return this._readonly;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica se o editor será aberto em modo de comparação.
   *
   * Caso esteja habilitada esta opção, então o [(ngModel)] deverá ser passado como um array, cuja primeira opção deve
   * conter uma string com o código original e na segunda posição uma string código modificado para efeito de
   * comparação. Neste caso, o usuário conseguirá editar apenas o código modificado e isso refletirá na segunda posição
   * do array consequentemente.
   *
   * Obs: Esta propriedade não refletirá efeito se alterada após o carregamento do componente.
   *
   * @default `false`
   */
  @Input('p-show-diff') set showDiff(showDiff: boolean) {
    this._showDiff = <any>showDiff === '' ? true : this.convertToBoolean(showDiff);
  }

  get showDiff(): boolean {
    return this._showDiff;
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista de sugestões usadas pelo autocomplete dentro do editor.
   *
   * Para visualizar a lista de sugestões use o comando `CTRL + SPACE`.
   *
   * Caso o editor esteja usando uma linguagem que já tenha uma lista de sugestões predefinida, o valor passado será adicionado
   * a lista preexistente, aumentando as opções para o usuário.
   *
   * Caso tenha mais de um editor da mesma linguagem na aplicação, as sugestões serão adicionadas para que todos os editores da mesma linguagem
   * tenham as mesmas sugestões.
   *
   * ```
   *  <po-code-editor
   *    [p-suggestions]="[{ label: 'po', insertText: 'Portinari UI' }, { label: 'ng', insertText: 'Angular' }]">
   *  </po-code-editor>
   * ```
   *
   * Ao fornecer uma lista de sugestões é possível acelerar a escrita de scripts pelos usuários.
   */
  @Input('p-suggestions') set suggestions(values: Array<PoCodeEditorRegisterableSuggestion>) {
    this._suggestions = values;

    if (this.editor && this._suggestions) {
      this.setSuggestions(this._suggestions);
    }
  }

  get suggestions(): Array<PoCodeEditorRegisterableSuggestion> {
    return this._suggestions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define um tema para o editor.
   *
   * Temas válidos:
   *  - `vs-dark`
   *  - `vs`
   *  - `hc-black`
   *
   * É importante salientar que o tema será aplicados a todos os componentes po-code-editor existentes na tela,
   * ou seja, todas as instâncias do componente receberão o último tema atribuído ou o tema da última instância
   * criada.
   *
   * @default `vs`
   */
  @Input('p-theme') set theme(theme: string) {
    this._theme = PO_CODE_EDITOR_THEMES.includes(theme) ? theme : PO_CODE_EDITOR_THEME_DEFAULT;

    if (this.editor) {
      this.setTheme(theme);
    }
  }

  get theme(): string {
    return this._theme;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do componente em pixels do po-code-editor.
   * Esta propriedade não poderá ser alterada após o componente ter sido iniciado.
   * A altura mínima é 150 pixels.
   */
  @Input('p-height') set height(height: string) {
    this._height = parseFloat(height) >= 150 ? parseFloat(height) : 150;
  }

  get height(): string {
    return `${this._height}px`;
  }

  /* istanbul ignore next */
  onTouched = (value: any) => {};
  /* istanbul ignore next */
  onChangePropagate = (value: any) => {};

  getOptions() {
    return { language: this.language, theme: this.theme, readOnly: this.readonly };
  }

  registerOnChange(fn: any): void {
    this.onChangePropagate = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  abstract writeValue(value: any);

  abstract setLanguage(value: any);

  abstract setTheme(value: any);

  abstract setReadOnly(value: any);

  abstract setSuggestions(value: any);

  protected convertToBoolean(val: any): boolean {
    if (typeof val === 'string') {
      val = val.toLowerCase().trim();
      return val === 'true' || val === 'on' || val === '';
    }

    if (typeof val === 'number') {
      return val === 1;
    }

    return !!val;
  }
}
