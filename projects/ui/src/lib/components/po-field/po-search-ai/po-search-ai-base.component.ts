import { AbstractControl } from '@angular/forms';
import { ChangeDetectorRef, computed, Directive, ElementRef, inject, input, OnDestroy, output } from '@angular/core';

import { Subscription } from 'rxjs';

import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoInputGeneric } from '../po-input-generic/po-input-generic';
import { PoSearchAiColumn } from './interfaces/po-search-ai-column.interface';
import { poSearchAiLiteralsDefault } from './interfaces/po-search-ai-literals-default.interface';
import { PoSearchAiLiterals } from './interfaces/po-search-ai-literals.interface';
import { PoSearchAiError, PoSearchAiResult } from './interfaces/po-search-ai.interface';
import { PoSearchAiService } from './po-search-ai.service';

const PO_SEARCH_AI_DEFAULT_TIMEOUT = 10000;
const PO_SEARCH_AI_DEFAULT_MIN_CONFIDENCE = 0.5;

/* eslint-disable @angular-eslint/directive-class-suffix */
/**
 * @description
 *
 * O `po-search-ai` é um componente de **busca em linguagem natural** baseado em input.
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
 * #### Tokens customizáveis
 *
 * Por herdar de `po-input`, reaproveita os mesmos tokens CSS. As cores de destaque da IA
 * seguem os Design Tokens do Animalia DS.
 */
@Directive()
export abstract class PoSearchAiBaseComponent extends PoInputGeneric implements OnDestroy {
  protected aiErrorMessage = '';

  protected aiLoading = false;

  protected aiSubscription: Subscription;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando o filtro aplicado via IA é limpo, seja pela ação do usuário
   * ou programaticamente. Não emite valor.
   */
  clearEvent = output<void>({ alias: 'p-clear' });

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
  columns = input<Array<PoSearchAiColumn>>([], { alias: 'p-columns' });

  protected readonly effectiveLiterals = computed(() => {
    const val = this.literals();
    return val && typeof val === 'object'
      ? { ...poSearchAiLiteralsDefault[this.language], ...val }
      : poSearchAiLiteralsDefault[this.language];
  });

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando a chamada à API de IA falha (erro HTTP, timeout, etc.).
   * Emite um objeto `PoSearchAiError`.
   */
  error = output<PoSearchAiError>({ alias: 'p-error' });

  private readonly language: string;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com os literais usados no componente. Permite sobrescrever as mensagens padrão
   * para internacionalização ou customização.
   */
  literals = input<PoSearchAiLiterals>(undefined, { alias: 'p-literals' });

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando a confiança da resposta da IA é menor que `p-min-confidence`.
   * Emite um objeto `PoSearchAiResult`, permitindo ao desenvolvedor decidir o que fazer
   * (ex: confirmar com o usuário antes de aplicar o filtro).
   */
  lowConfidence = output<PoSearchAiResult>({ alias: 'p-low-confidence' });

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
  minConfidence = input<number>(PO_SEARCH_AI_DEFAULT_MIN_CONFIDENCE, {
    alias: 'p-min-confidence',
    transform: (value: number) => {
      const parsed = Number(value);
      return parsed >= 0 && parsed <= 1 ? parsed : PO_SEARCH_AI_DEFAULT_MIN_CONFIDENCE;
    }
  });

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando a IA retorna um resultado com confiança maior ou igual a
   * `p-min-confidence`. Emite um objeto `PoSearchAiResult`.
   */
  result = output<PoSearchAiResult>({ alias: 'p-result' });

  protected searchAiService: PoSearchAiService;

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
  timeout = input<number>(PO_SEARCH_AI_DEFAULT_TIMEOUT, {
    alias: 'p-timeout',
    transform: (value: number) => {
      const parsed = Number(value);
      return parsed > 0 ? parsed : PO_SEARCH_AI_DEFAULT_TIMEOUT;
    }
  });

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
  url = input<string | undefined>(undefined, { alias: 'p-url' });

  constructor() {
    super(inject(ElementRef), inject(ChangeDetectorRef));
    this.searchAiService = inject(PoSearchAiService);
    this.language = inject(PoLanguageService).getShortLanguage();
  }

  abstract clearSearch(): void;

  abstract search(): void;

  override getErrorPattern() {
    return this.aiErrorMessage || super.getErrorPattern();
  }

  extraValidation(_c: AbstractControl): { [key: string]: any } {
    return null;
  }

  hasValue(): boolean {
    return !!this.getScreenValue();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy?.();
    this.aiSubscription?.unsubscribe();
  }
}
