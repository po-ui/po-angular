import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { convertToBoolean } from '../../../utils/util';
import { PoInputGeneric } from '../po-input-generic/po-input-generic';
import { PoAiSearchColumn } from './interfaces/po-ai-search-column.interface';
import { PoAiSearchError, PoAiSearchResult } from './interfaces/po-ai-search.interface';
import { PoAiSearchService } from './po-ai-search.service';

const PO_AI_SEARCH_DEFAULT_TIMEOUT = 10000;
const PO_AI_SEARCH_DEFAULT_MIN_CONFIDENCE = 0.5;

/* eslint-disable @angular-eslint/directive-class-suffix */
/**
 * @description
 *
 * O `po-ai-search` é um componente de **busca em linguagem natural** baseado em input.
 * Ele permite que o usuário digite uma consulta em texto livre (por exemplo,
 * *"clientes de SP com saldo acima de R$ 500"*) e a converte, através de um provedor de IA,
 * em um filtro estruturado (normalmente OData) que pode ser aplicado por outro componente,
 * como o [`po-table`](/documentation/po-table).
 *
 * O componente é **agnóstico ao provedor de IA**. Toda a comunicação ocorre através do
 * endpoint informado em `p-url`, que recebe `{ query, columns }` e deve retornar
 * `{ filter, description, confidence }`. Isso garante que nenhuma chave de IA seja
 * exposta no client-side — a integração com a LLM é responsabilidade do backend (proxy).
 *
 * Por herdar de `po-input`, o componente suporta as propriedades comuns de formulário
 * (label, help, helper, required, disabled, readonly, size, clean, loading, etc.) e
 * integra-se a formulários `template-driven` e `reactive`.
 *
 * #### Estados de comportamento
 *
 * - **Idle:** aguardando a digitação da consulta.
 * - **Loading:** consulta em andamento (ícone de carregamento ativo).
 * - **Aplicado:** após uma resposta bem-sucedida, exibe um feedback persistente de
 *   "filtro aplicado via IA" enquanto a consulta estiver ativa, com opção de limpeza rápida.
 * - **Baixa confiança:** quando `confidence` for menor que `p-min-confidence`, emite
 *   `p-low-confidence` e não aplica o filtro automaticamente.
 * - **Erro:** quando a chamada falha, emite `p-error`.
 *
 * #### Acessibilidade
 *
 * - Utiliza `aria-live="polite"` para anunciar quando o filtro de IA é aplicado ou limpo,
 *   garantindo feedback para leitores de tela.
 * - Mantém foco sequencial via `Tab` entre o campo de busca, o feedback e o conteúdo associado.
 *
 * #### Tokens customizáveis
 *
 * Por herdar de `po-input`, reaproveita os mesmos tokens CSS. As cores de destaque da IA
 * seguem os Design Tokens do Animalia DS.
 */
@Directive()
export abstract class PoAiSearchBaseComponent extends PoInputGeneric implements OnDestroy {
  /**
   * @optional
   *
   * @description
   *
   * Metadados das colunas/campos disponíveis para a busca por IA. Essas informações são
   * enviadas ao endpoint configurado em `p-url` para que a IA mapeie os termos digitados
   * para as propriedades reais dos dados.
   *
   * @default `[]`
   */
  @Input('p-columns') columns: Array<PoAiSearchColumn> = [];

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando a IA retorna um resultado com confiança maior ou igual a
   * `p-min-confidence`. Emite um objeto `PoAiSearchResult`.
   */
  @Output('p-result') result = new EventEmitter<PoAiSearchResult>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando a confiança da resposta da IA é menor que `p-min-confidence`.
   * Emite um objeto `PoAiSearchResult`, permitindo ao desenvolvedor decidir o que fazer
   * (ex: confirmar com o usuário antes de aplicar o filtro).
   */
  @Output('p-low-confidence') lowConfidence = new EventEmitter<PoAiSearchResult>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando a chamada à API de IA falha (erro HTTP, timeout, etc.).
   * Emite um objeto `PoAiSearchError`.
   */
  @Output('p-error') error = new EventEmitter<PoAiSearchError>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando o filtro aplicado via IA é limpo, seja pela ação do usuário
   * ou programaticamente. Não emite valor.
   */
  @Output('p-clear') clearEvent = new EventEmitter<void>();

  /** Indica que uma consulta de IA está em andamento. */
  aiLoading = false;

  /** Descrição legível do último filtro aplicado (feedback persistente). */
  appliedDescription = '';

  /** Texto que será anunciado via região `aria-live`. */
  liveAnnouncement = '';

  protected aiSubscription: Subscription;

  private _url: string;
  private _timeout: number = PO_AI_SEARCH_DEFAULT_TIMEOUT;
  private _minConfidence: number = PO_AI_SEARCH_DEFAULT_MIN_CONFIDENCE;

  constructor(
    el: ElementRef,
    protected aiSearchService: PoAiSearchService,
    cd?: ChangeDetectorRef
  ) {
    super(el, cd);
  }

  /**
   * @optional
   *
   * @description
   *
   * Endpoint (proxy) responsável por encaminhar a consulta para o provedor de IA.
   * Recebe `{ query, columns }` via `POST` e deve retornar `{ filter, description, confidence }`.
   *
   * > A integração com a LLM e a guarda de chaves devem ocorrer **no backend**, nunca no client-side.
   */
  @Input('p-url') set url(value: string) {
    this._url = value;
  }
  get url(): string {
    return this._url;
  }

  /**
   * @optional
   *
   * @description
   *
   * Tempo máximo de espera (em milissegundos) pela resposta da IA antes de abortar a
   * requisição e emitir `p-error` com `statusCode 408`.
   *
   * @default `10000`
   */
  @Input('p-timeout') set timeout(value: number) {
    const parsed = Number(value);
    this._timeout = parsed > 0 ? parsed : PO_AI_SEARCH_DEFAULT_TIMEOUT;
  }
  get timeout(): number {
    return this._timeout;
  }

  /**
   * @optional
   *
   * @description
   *
   * Nível mínimo de confiança (`0.0` a `1.0`) para que o resultado da IA seja considerado
   * confiável. Quando a confiança retornada for menor, o evento `p-low-confidence` é
   * emitido em vez de `p-result`.
   *
   * @default `0.5`
   */
  @Input('p-min-confidence') set minConfidence(value: number) {
    const parsed = Number(value);
    this._minConfidence = parsed >= 0 && parsed <= 1 ? parsed : PO_AI_SEARCH_DEFAULT_MIN_CONFIDENCE;
  }
  get minConfidence(): number {
    return this._minConfidence;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define se o feedback visual de "filtro aplicado via IA" será exibido após uma
   * busca bem-sucedida.
   *
   * @default `true`
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  showAppliedFeedback = true;
  @Input('p-show-applied-feedback') set setShowAppliedFeedback(value: boolean) {
    this.showAppliedFeedback = value === undefined ? true : convertToBoolean(value);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy?.();
    this.aiSubscription?.unsubscribe();
  }

  /** Indica se há um filtro de IA atualmente aplicado. */
  get hasAppliedFilter(): boolean {
    return !!this.appliedDescription;
  }

  extraValidation(_c: AbstractControl): { [key: string]: any } {
    return null;
  }

  // Deve enviar a consulta atual para a IA.
  abstract search(): void;

  // Deve limpar o filtro aplicado via IA.
  abstract clearSearch(): void;
}
