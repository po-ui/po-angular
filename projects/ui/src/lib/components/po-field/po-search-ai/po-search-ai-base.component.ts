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
 * #### Endpoint de IA (backend)
 *
 * O componente **não conversa diretamente com a LLM**. Você deve disponibilizar um endpoint
 * próprio (proxy) e informá-lo em `p-url`.
 * É nesse backend que devem ficar a chave de acesso da IA e as regras usadas para montar
 * o prompt. Essas informações nunca devem ficar expostas no client-side
 *
 * O contrato é simples. O componente faz um `POST` enviando:
 *
 * ```json
 * {
 *   "query": "funcionários de São Paulo com salário acima de 5000",
 *   "columns": [
 *     { "property": "name", "label": "Nome", "type": "string" },
 *     { "property": "city", "label": "Cidade", "type": "string" },
 *     { "property": "salary", "label": "Salário", "type": "number" }
 *   ]
 * }
 * ```
 *
 * E o endpoint deve responder com:
 *
 * ```json
 * {
 *   "filter": "city eq 'São Paulo' and salary gt 5000",
 *   "description": "Funcionários de São Paulo com salário acima de 5000",
 *   "confidence": 0.92
 * }
 * ```
 *
 * Onde `filter` é o filtro estruturado gerado pela IA (normalmente OData), `description` é um
 * resumo legível e `confidence` (`0.0` a `1.0`) indica o quão confiável foi a interpretação —
 * comparado com `p-min-confidence` para decidir entre os eventos `p-result` e `p-low-confidence`.
 *
 * > **Exemplo de implementação:** o PO UI mantém um backend de referência, open source, que recebe
 * > esse contrato e o encaminha para um provedor de IA (Groq/Gemini).
 * > - Endpoint público: [`/v1/ai/filter`](https://po-sample-api.onrender.com/api#/ai)
 * > - Código-fonte: [po-sample-api/src/ai/ai.service.ts](https://github.com/po-ui/po-sample-api/blob/main/src/ai/ai.service.ts)
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
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                   | Descrição                                                       | Valor Padrão                       |
 * |-------------------------------|-----------------------------------------------------------------|------------------------------------|
 * | **Default**                   |                                                                 |                                    |
 * | `--font-family`               | Família tipográfica do campo                                    | `var(--font-family-theme)`         |
 * | `--font-size`                 | Tamanho da fonte do campo                                       | `var(--font-size)`                 |
 * | `--text-color`                | Cor do texto digitado                                           | `var(--color-neutral-dark-90)`     |
 * | `--text-color-placeholder`    | Cor do texto do placeholder                                     | `var(--color-neutral-light-30)`    |
 * | `--color`                     | Cor da borda do campo                                           | `var(--color-neutral-dark-70)`     |
 * | `--background`                | Cor de fundo do campo                                           | `var(--color-neutral-light-05)`    |
 * | `--border-radius`             | Raio da borda do campo                                          | `var(--border-radius-md)`          |
 * | **Ícones e divisória**        |                                                                 |                                    |
 * | `--color-icon-read`           | Cor do ícone de busca por IA                                    | `var(--color-neutral-dark-70)`     |
 * | `--color-divider`             | Cor da divisória vertical entre o campo e o botão de busca      | `var(--color-neutral-mid-40)`      |
 * | `--color-icon-processing`     | Cor do ícone exibido enquanto a consulta está sendo processada  | `var(--color-action-default)`      |
 * | **Hover**                     |                                                                 |                                    |
 * | `--color-hover`               | Cor da borda no estado hover                                    | `var(--color-brand-01-dark)`       |
 * | `--background-hover`          | Cor de fundo no estado hover                                    | `var(--color-brand-01-lightest)`   |
 * | **Focused**                   |                                                                 |                                    |
 * | `--color-focused`             | Cor da borda no estado de foco                                  | `var(--color-action-default)`      |
 * | `--outline-color-focused`     | Cor do outline no estado de foco                                | `var(--color-action-focus)`        |
 * | **Disabled**                  |                                                                 |                                    |
 * | `--color-disabled`            | Cor da borda no estado desabilitado                             | `var(--color-neutral-light-30)`    |
 * | `--background-disabled`       | Cor de fundo no estado desabilitado                             | `var(--color-neutral-light-20)`    |
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
   *
   * O campo `type` do resultado indica como o consumidor deve interpretar a resposta:
   *
   * - **`filter`** _(padrão)_: a IA retornou um filtro estruturado (ex: OData). Use `result.filter`
   *   para aplicar a consulta à fonte de dados — por exemplo, passando para um `po-table` via `p-filter`.
   *
   * - **`chat`**: a IA retornou uma resposta conversacional. Use `result.data` para exibir a mensagem
   *   ao usuário, por exemplo em um painel lateral ou tooltip.
   *
   * - **`custom`**: a IA retornou um payload genérico definido pelo backend. Use `result.data` para
   *   executar qualquer ação específica da aplicação (ex: navegação, abertura de modal, acionamento de comando).
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
  url = input<string>(undefined, { alias: 'p-url' });

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
