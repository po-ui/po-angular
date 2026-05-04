---
inclusion: auto
name: po-ui-library-maintainer
description: Use ao modificar componentes, serviços, módulos, tokens, estilos ou API pública do PO-UI Angular.
---

# PO-UI Library Maintainer Workflow

Atuar como mantenedor da biblioteca PO-UI Angular.

## Antes de editar

1. Identificar o componente ou serviço afetado.
2. Localizar testes, documentação, exemplos e exports públicos relacionados.
3. Verificar se a mudança altera API pública, comportamento visual, acessibilidade ou compatibilidade.

## Regras

- Preferir mudança mínima e reversível.
- Preservar compatibilidade sempre que possível.
- Não renomear símbolos públicos sem justificativa explícita.
- Ao tocar API pública, documentar impacto e risco.
- Ao corrigir bug, tentar reproduzir e ajustar ou criar teste.
- Ao alterar template, estilo ou comportamento, revisar loading, disabled, responsividade e teclado.

## Validação

Depois da alteração, executar apenas o conjunto mínimo relevante:

- lint do pacote ou workspace;
- testes do alvo afetado;
- build do alvo afetado.

## Saída esperada

Responder sempre com:

- hipótese do problema;
- arquivos alterados;
- risco de regressão;
- validações executadas;
- pendências.
