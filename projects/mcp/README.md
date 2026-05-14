# @po-ui/mcp

Servidor [Model Context Protocol](https://modelcontextprotocol.io) que expõe a documentação oficial do **PO UI** para agentes de IA.

[![npm version](https://img.shields.io/npm/v/@po-ui/mcp.svg)](https://www.npmjs.com/package/@po-ui/mcp)
[![license](https://img.shields.io/npm/l/@po-ui/mcp.svg)](https://github.com/po-ui/po-angular/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@po-ui/mcp.svg)](https://nodejs.org)

</div>

---

## Sumário

- [Visão geral](#visão-geral)
- [Por que usar](#por-que-usar)
- [Instalação](#instalação)
- [Configuração nos clientes MCP](#configuração-nos-clientes-mcp)
  - [Claude Desktop](#claude-desktop)
  - [Cursor](#cursor)
  - [VS Code (GitHub Copilot Chat)](#vs-code-github-copilot-chat)
  - [Kiro](#kiro)
  - [Continue.dev](#continuedev)
- [Ferramentas disponíveis](#ferramentas-disponíveis)
  - [`list_components`](#list_components)
  - [`get_component_docs`](#get_component_docs)
  - [`search_docs`](#search_docs)
  - [`get_guide`](#get_guide)
- [Exemplos de prompts](#exemplos-de-prompts)
- [Fontes de dados](#fontes-de-dados)
- [Requisitos](#requisitos)
- [Troubleshooting](#troubleshooting)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Visão geral

O `@po-ui/mcp` é um servidor [MCP](https://modelcontextprotocol.io) que conecta assistentes de IA (Claude, Cursor, GitHub Copilot, Kiro, Continue, entre outros) à base de conhecimento oficial do **[PO UI](https://po-ui.io)**

Em vez de copiar e colar trechos de documentação no chat, o agente passa a consultar diretamente o portal `po-ui.io` em tempo real, retornando descrições, tabelas de inputs/outputs, exemplos de uso e guias atualizados de mais de **80 componentes, diretivas, serviços, interfaces e enums**.

```
┌──────────────────┐      stdio      ┌─────────────────┐     HTTPS    ┌──────────────┐
│ Cliente MCP      │ ◄─────────────► │ @po-ui/mcp      │ ◄──────────► │ po-ui.io     │
│ (Claude/Cursor)  │                 │ (servidor Node) │              │ (llms.txt)   │
└──────────────────┘                 └─────────────────┘              └──────────────┘
```

## Por que usar

- **Documentação sempre atualizada**: o servidor consome `llms.txt`, `llms-full.txt` e `llms-generated/*.md` direto do `po-ui.io`, sem versão congelada no pacote.
- **Respostas precisas**: o agente recebe o conteúdo oficial em Markdown, com tabelas de propriedades, tipos e exemplos, reduzindo alucinação.
- **Busca semântica simples**: pesquise por comportamento (`"upload de arquivo"`), propriedade (`"p-loading"`) ou padrão (`"lazy load"`) e descubra qual componente atende.
- **Zero configuração**: roda via `npx`, sem clone, sem build, sem instalação global.
- **Resiliente**: faz fallback automático para `raw.githubusercontent.com` quando o portal está fora do ar.

## Instalação

Não é necessário instalar globalmente. Os clientes MCP executam o pacote sob demanda via `npx`:

```bash
npx -y @po-ui/mcp
```

> O comando inicia o servidor em modo `stdio`. Em uso normal, quem invoca o processo é o cliente MCP — o usuário apenas configura o JSON de cada ferramenta.

Se preferir instalar localmente para inspecionar ou rodar em modo offline-first:

```bash
npm install -g @po-ui/mcp
po-ui-mcp
```

## Configuração nos clientes MCP

A configuração é a mesma em todos os clientes que seguem a especificação MCP: um bloco `mcpServers` apontando para o `npx`.

### Claude Desktop

Edite o arquivo de configuração:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "po-ui": {
      "command": "npx",
      "args": ["-y", "@po-ui/mcp"]
    }
  }
}
```

Reinicie o Claude Desktop. O ícone de ferramentas (🔌) deve indicar o servidor `po-ui` ativo.

### Cursor

Em **Settings → MCP → Add new MCP server**, ou editando `.cursor/mcp.json` na raiz do projeto:

```json
{
  "mcpServers": {
    "po-ui": {
      "command": "npx",
      "args": ["-y", "@po-ui/mcp"]
    }
  }
}
```

### VS Code (GitHub Copilot Chat)

Em `.vscode/mcp.json` no workspace, ou nas Settings (`chat.mcp.servers`):

```json
{
  "servers": {
    "po-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@po-ui/mcp"]
    }
  }
}
```

### Kiro

Em `.kiro/settings/mcp.json` (workspace) ou `~/.kiro/settings/mcp.json` (global):

```json
{
  "mcpServers": {
    "po-ui": {
      "command": "npx",
      "args": ["-y", "@po-ui/mcp"],
      "disabled": false,
      "autoApprove": ["list_components", "get_component_docs", "search_docs", "get_guide"]
    }
  }
}
```

### Continue.dev

Em `~/.continue/config.json`, dentro de `experimental.modelContextProtocolServers`:

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "npx",
          "args": ["-y", "@po-ui/mcp"]
        }
      }
    ]
  }
}
```

## Ferramentas disponíveis

O servidor expõe quatro ferramentas (`tools`) ao cliente MCP.

### `list_components`

Lista todos os componentes, diretivas, serviços, interfaces, enums e guias do PO UI com descrição resumida. Use como ponto de partida para descobrir o que existe antes de pedir detalhes.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `section` | `"components" \| "services" \| "interfaces" \| "enums" \| "guides" \| "all"` | não | Filtra por seção. Padrão: `all`. |
| `filter`  | `string` | não | Texto livre aplicado a nome e descrição (case-insensitive). |

**Exemplo de chamada:**

```json
{ "section": "components", "filter": "table" }
```

### `get_component_docs`

Retorna a documentação completa em Markdown de um componente, serviço, interface ou enum — incluindo descrição, tabelas de inputs/outputs/propriedades, tipos e exemplos.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `slug` | `string` | sim | Identificador do recurso. Aceita slug (`po-button`), seletor (`<po-button>`) e nome de classe (`PoButtonComponent`, `PoDialogService`). |

A entrada é normalizada automaticamente: angle brackets são removidos, `CamelCase` é convertido para `kebab-case` e o sufixo `-component` é descartado. Se o slug não for encontrado, o servidor responde com sugestões similares baseadas no índice.

**Exemplo:**

```json
{ "slug": "PoButtonComponent" }
```

### `search_docs`

Busca textual em toda a documentação do PO UI (arquivo `llms-full.txt`). Útil para encontrar componentes que suportem uma propriedade específica, um comportamento ou um padrão de uso.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `query` | `string` (mínimo 2 caracteres) | sim | Texto a buscar (case-insensitive). |
| `max_results` | `number` (1–50) | não | Limite de resultados. Padrão: `10`. |

Cada resultado traz o nome do componente identificado e um trecho com até três regiões de contexto (±2 linhas em torno de cada ocorrência).

**Exemplo:**

```json
{ "query": "lazy load", "max_results": 5 }
```

### `get_guide`

Retorna o conteúdo completo de um guia da documentação (ex.: `getting-started`, `schematics`, `theme-customization`, `browser-support`, `llms`).

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `guide` | `string` | sim | Nome do guia, com ou sem extensão `.md`. |

**Exemplo:**

```json
{ "guide": "getting-started" }
```

> Para descobrir os guias disponíveis, chame `list_components` com `section: "guides"`.

## Exemplos de prompts

Depois de configurar o servidor, basta conversar naturalmente com o agente. Algumas sugestões:

- *"Quais componentes do PO UI permitem upload de arquivo?"*
- *"Mostre as propriedades do `po-table` e como habilitar paginação por requisição."*
- *"Como configuro o tema escuro com o `PoThemeService`?"*
- *"Existe um componente para exibir uma timeline ou stepper?"*
- *"Liste todos os enums do PO UI e suas finalidades."*
- *"Traga o guia de `schematics` e explique o `ng add @po-ui/ng-components`."*

## Fontes de dados

O servidor consome documentação pública diretamente das seguintes URLs:

| Recurso | URL |
|---------|-----|
| Índice de APIs e guias | `https://po-ui.io/llms.txt` |
| Documentação consolidada (full text) | `https://po-ui.io/llms-full.txt` |
| Documentação por componente | `https://po-ui.io/llms-generated/{slug}.md` |
| Guias | `https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/{name}.md` |
| Fallback dos componentes | `https://raw.githubusercontent.com/po-ui/po-angular/master/projects/portal/src/llms-generated/{slug}.md` |

O índice (`llms.txt`) é cacheado em memória pelo tempo de vida do processo. Não há cache em disco — basta reiniciar o cliente MCP para atualizar.

## Requisitos

- **Node.js** 18 ou superior
- Conexão de internet com acesso a `po-ui.io` e `raw.githubusercontent.com`

Dependências de runtime:

- [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) — implementação oficial do protocolo
- [`zod`](https://www.npmjs.com/package/zod) — validação de schemas das ferramentas

## Troubleshooting

**O cliente não encontra o servidor.**
Verifique se o `npx` está no `PATH` do processo que executa o cliente MCP. No Windows, prefira o caminho completo (`C:\\Program Files\\nodejs\\npx.cmd`) quando o cliente roda fora do shell padrão.

**Resposta `Falha ao buscar llms.txt`.**
Indica bloqueio de rede ou portal indisponível. O servidor tem timeout de 10 s por requisição. Verifique acesso a `https://po-ui.io/llms.txt` e tente novamente.

**`Componente "..." não encontrado`.**
Confirme o slug com `list_components`. Lembre-se de que componentes usam o seletor (`po-*`), não o nome da classe interna.

**O agente não está acionando as ferramentas.**
Alguns clientes exigem aprovação manual na primeira chamada. Em Kiro, adicione as quatro ferramentas ao `autoApprove`. Em Cursor/Claude, verifique o painel de ferramentas conectadas.

**Logs do servidor.**
Mensagens de erro fatais são escritas em `stderr` com o prefixo `[po-ui-mcp]`. A maioria dos clientes expõe esse log em uma aba dedicada (em Cursor: *Output → MCP*).

## Contribuindo

O código-fonte vive no monorepo principal: [`po-ui/po-angular`](https://github.com/po-ui/po-angular), pasta [`projects/mcp`](https://github.com/po-ui/po-angular/tree/master/projects/mcp).

```bash
git clone https://github.com/po-ui/po-angular.git
cd po-angular
npm install
npm run build --workspace projects/mcp   # ou: cd projects/mcp && npm run build
npm test --workspace projects/mcp
```

Issues, sugestões de novas ferramentas e PRs são bem-vindos. Antes de abrir um PR, leia o [guia de contribuição](https://github.com/po-ui/po-angular/blob/master/CONTRIBUTING.md).

## Licença

[MIT](https://github.com/po-ui/po-angular/blob/master/LICENSE) © PO UI
