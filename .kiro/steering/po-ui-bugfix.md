---
inclusion: auto
name: po-ui-bugfix
description: Use ao corrigir defeitos em componentes PO-UI com foco em reprodução, causa raiz e teste de regressão.
---

# PO-UI Bugfix Workflow

## Fluxo obrigatório

1. Encontrar o ponto de entrada do bug.
2. Reproduzir por código, teste ou análise determinística.
3. Identificar a causa raiz.
4. Corrigir com a menor mudança possível.
5. Criar ou ajustar teste cobrindo regressão.
6. Resumir por que a correção é segura.

## Evitar

- Refatoração ampla junto com bugfix.
- Alteração incidental de API pública.
- Ajustes visuais não relacionados.

## Saída esperada

Ao concluir, responder com:

- hipótese do problema;
- causa raiz;
- arquivos alterados;
- risco de regressão;
- validações executadas;
- pendências.
