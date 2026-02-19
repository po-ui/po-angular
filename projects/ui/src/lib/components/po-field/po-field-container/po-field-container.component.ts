import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
  input
} from '@angular/core';

import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { convertToBoolean, updateTooltip } from '../../../utils/util';
import { PoHelperComponent, PoHelperOptions } from '../../po-helper';
import { poFieldContainerLiterals } from './po-field-container-literals';

/**
 * @docsPrivate
 *
 * Componente de uso interno, responsável por atribuir uma label para o campo
 */
@Component({
  selector: 'po-field-container',
  templateUrl: './po-field-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoFieldContainerComponent implements OnInit, OnChanges {
  @ViewChild('labelEl', { read: ElementRef }) labelEl!: ElementRef<HTMLElement>;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;

  /** Indica se o campo será desabilitado. */
  @Input('p-disabled') disabled: boolean;

  /** Identificador do campo */
  @Input('p-id') id: string;

  /** Label do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help: string;

  /** Configurações do ícone de ajuda adicional vínculado ao label. */
  poHelperComponent = input<PoHelperOptions>(undefined, { alias: 'p-helper' });

  /** Define se o componente helper estará visível através das ações customizadas */
  showHelperComponent = input<boolean>(false, { alias: 'p-show-helper' });

  /**
   * @optional
   *
   * Habilita a quebra automática do texto do componente po-label. Quando ativada, o texto que excede
   * o espaço disponível é transferido para a próxima linha em pontos apropriados para uma
   * leitura clara.
   *
   * @default `false`
   */
  textWrap = input<boolean>(false, { alias: 'p-text-wrap' });

  literals: object;
  requirement: string;
  showTip = false;

  private _optional: boolean = false;
  private _required: boolean = false;

  /** Indica se o campo será opcional. */
  @Input('p-optional') set optional(value: boolean) {
    this._optional = convertToBoolean(value);
  }

  get optional() {
    return this._optional;
  }

  /** Indica se o campo será obrigatório. */
  @Input('p-required') set required(value: boolean) {
    this._required = convertToBoolean(value);
  }

  get required() {
    return this._required;
  }

  /** Define se a indicação de campo obrigatório será exibida. */
  @Input('p-show-required') showRequired: boolean = false;

  /** Define o tamanho do componente. */
  @Input('p-size') size?: string;

  private _compactLabel: boolean = false;

  /** Define se o título do campo será compacto. */
  @Input('p-compact-label') set compactLabel(value: boolean) {
    this._compactLabel = convertToBoolean(value);
  }

  get compactLabel(): boolean {
    return this._compactLabel;
  }

  constructor(private readonly cdr: ChangeDetectorRef) {
    const languageService = inject(PoLanguageService);

    const language = languageService.getShortLanguage();

    this.literals = {
      ...poFieldContainerLiterals[language]
    };
  }

  ngOnInit(): void {
    this.setRequirement();
    this.handleLabelTooltip();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.help ||
      changes.label ||
      changes.optional ||
      changes.required ||
      changes.showRequired ||
      changes.textWrap
    ) {
      this.setRequirement();
      queueMicrotask(() => this.handleLabelTooltip());
      this.cdr.detectChanges();
    }

    if (changes.showHelperComponent && this.showHelperComponent()) {
      if (typeof this.poHelperComponent()?.eventOnClick === 'function') {
        this.poHelperComponent()?.eventOnClick();
        return;
      }
      this.helperEl?.openHelperPopover();
    } else if (changes.showHelperComponent && !this.showHelperComponent()) {
      this.helperEl?.closeHelperPopover();
    }
  }

  private setRequirement(): void {
    if (this.label || this.help) {
      if (!this.required && this.optional) {
        this.requirement = this.literals['optional'];
      } else if (this.required && this.showRequired) {
        this.requirement = this.literals['required'];
      } else {
        this.requirement = undefined;
      }
    }
  }

  public handleLabelTooltip(): void {
    this.showTip = updateTooltip(this.showTip, this.labelEl);
    this.cdr.markForCheck();
  }
}
