---
inclusion: always
---

# Product Overview

Este workspace corresponde ao desenvolvimento da biblioteca PO-UI Angular, atuando como mantenedor da biblioteca, não como consumidor.

PO UI é uma biblioteca brasileira de componentes UI para Angular, estruturada como monorepo com múltiplos pacotes publicáveis e portal de documentação.

## Objetivos

- Evoluir componentes, serviços, tokens, estilos e APIs públicas da biblioteca.
- Preservar compatibilidade e coerência entre comportamento, documentação, testes e exemplos.
- Considerar sempre o impacto em consumidores existentes.
- Manter a documentação JSDoc em português e o código em inglês.

## Critérios de decisão

Ao propor ou alterar implementação, priorizar:

1. compatibilidade com consumidores existentes;
2. consistência com padrões já presentes no PO-UI;
3. acessibilidade, i18n, estados visuais e responsividade;
4. alteração mínima, isolada e revisável;
5. cobertura de teste adequada para regressões e novos comportamentos.
