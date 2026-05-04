---
inclusion: auto
name: issue-triage
classification: workflow
source: .github/ISSUE_TEMPLATE/bug_report.md + .github/ISSUE_TEMPLATE/feature.md
description: Use ao analisar issues, bugs, solicitações de feature e requisitos vindos do GitHub.
---

# Triagem de Issues PO UI

## Bug report

Ao analisar um bug, buscar ou solicitar evidências suficientes para:

- identificar o componente afetado;
- reproduzir o problema em StackBlitz ou por teste automatizado;
- entender o comportamento atual;
- entender o comportamento esperado;
- registrar ambiente, versão do PO UI, versão do Angular, browser e sistema operacional;
- verificar observações e histórico de interação.

Issues sem reprodução clara têm menor prioridade. Antes de corrigir, tentar criar uma reprodução mínima por código, teste ou análise determinística.

## Feature request

Ao analisar uma feature, identificar:

- problema ou necessidade que motiva a alteração;
- componente, serviço, pacote ou documentação afetada;
- API pública proposta;
- impacto em compatibilidade;
- impacto em acessibilidade, i18n, responsividade e estados visuais;
- necessidade de documentação, exemplos e testes.

## Conduta

- Não implementar diretamente quando a issue estiver incompleta e a intenção não estiver clara.
- Preferir perguntas objetivas para fechar lacunas essenciais.
- Ao propor solução, manter alteração mínima e compatível.
- Para bugs, conectar a correção a um teste de regressão sempre que possível.
