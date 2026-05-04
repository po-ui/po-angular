---
inclusion: fileMatch
fileMatchPattern: ["AGENTS.md", "**/agents/**/*.md", "**/skills/**/*.md", "**/*agent*.md", "**/*skill*.md"]
name: ai-agent-documentation
description: Use ao adicionar documentação de agentes de IA, skills ou arquivos de instruções a repositórios TOTVS.
---

# Documentação para Agentes de IA

Ao adicionar documentação de agentes de IA, skills ou arquivos de instruções a repositórios TOTVS, manter o conteúdo agnóstico à ferramenta.

## Regras

- Não usar caminhos específicos de ferramentas, como `.github/copilot/skills/`, quando a documentação for genérica.
- Preferir caminhos neutros no nível raiz ou em diretórios agnósticos.
- Evitar referências a ferramentas de IA específicas em documentação genérica.
- Escrever conteúdo em português formal e impessoal.
- Manter código, comandos e nomes de arquivos em inglês.
- Quando houver dúvida sobre o local adequado dos arquivos, perguntar antes de criar a estrutura.
