# @po-ui/mcp

Servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.io) que disponibiliza a documentação oficial do [PO UI](https://po-ui.io) para assistentes de IA.

[![npm version](https://img.shields.io/npm/v/@po-ui/mcp.svg)](https://www.npmjs.com/package/@po-ui/mcp)
[![license](https://img.shields.io/npm/l/@po-ui/mcp.svg)](https://github.com/po-ui/po-angular/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@po-ui/mcp.svg)](https://nodejs.org)

## Visão geral

O `@po-ui/mcp` conecta clientes compatíveis com MCP à documentação pública do PO UI. Com ele, um agente pode listar APIs e guias, obter a documentação completa de um recurso e pesquisar termos em toda a documentação consolidada.

O conteúdo é consultado nas fontes oficiais do PO UI durante a execução. Assim, o cliente não depende de uma cópia da documentação incluída no pacote.

## Requisitos

- Node.js 18 ou superior;
- acesso a `po-ui.io` e `raw.githubusercontent.com`.

## Uso com `npx`

Não é necessário instalar o pacote globalmente. Configure o cliente MCP para executar:

```bash
npx -y @po-ui/mcp
```

O servidor utiliza o transporte `stdio`; normalmente, o próprio cliente MCP inicia e encerra o processo.

## Configuração

### Claude Desktop

Adicione o servidor ao arquivo `claude_desktop_config.json`:

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

Depois de salvar o arquivo, reinicie o Claude Desktop.

### Cursor

Adicione o servidor em **Settings > MCP** ou crie o arquivo `.cursor/mcp.json` no projeto:

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

### Kiro

Abra a paleta de comandos e execute **Kiro: Open workspace MCP config (JSON)** ou crie o arquivo `.kiro/settings/mcp.json` no projeto:

```json
{
  "mcpServers": {
    "po-ui": {
      "command": "npx",
      "args": ["-y", "@po-ui/mcp"],
      "disabled": false
    }
  }
}
```

Depois de salvar o arquivo, o Kiro reconecta o servidor automaticamente. Confirme a conexão na seção **MCP Servers** do painel do Kiro.

### VS Code com GitHub Copilot

Execute **MCP: Add Server** na paleta de comandos ou adicione o servidor ao arquivo `.vscode/mcp.json`:

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

### Continue

Crie o arquivo `.continue/mcpServers/po-ui.yaml` no projeto:

```yaml
name: PO UI MCP
version: 0.0.1
schema: v1
mcpServers:
  - name: PO UI
    type: stdio
    command: npx
    args:
      - -y
      - "@po-ui/mcp"
```

As ferramentas MCP ficam disponíveis no modo Agent do Continue.

### Outros clientes

Em clientes compatíveis com servidores MCP locais, configure um servidor `stdio` com o comando `npx` e os argumentos `-y` e `@po-ui/mcp`. Consulte a documentação do cliente para confirmar o formato e o local do arquivo de configuração.

## Ferramentas disponíveis

O servidor expõe seis ferramentas somente de leitura.

### `list_components`

Lista componentes, diretivas, serviços, interfaces, enums e guias disponíveis no índice do PO UI.

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `section` | `"components" \| "services" \| "interfaces" \| "enums" \| "guides" \| "all"` | não | Seção consultada. O padrão é `all`. |
| `filter` | `string` | não | Texto procurado no nome ou na descrição, sem diferenciar maiúsculas e minúsculas. |

Exemplo:

```json
{ "section": "components", "filter": "table" }
```

### `get_component_docs`

Retorna, em Markdown, a documentação de um componente, uma diretiva, um serviço, uma interface ou um enum.

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `slug` | `string` | sim | Identificador do recurso. Aceita um slug, como `po-button`; um seletor, como `<po-button>`; ou um nome de classe, como `PoButtonComponent`. |

O valor informado é normalizado antes da consulta. Seletores perdem os sinais de maior e menor, nomes em `CamelCase` são convertidos para `kebab-case` e o sufixo `Component` é removido.

Exemplo:

```json
{ "slug": "PoButtonComponent" }
```

### `get_component_examples`

Retorna exemplos oficiais de um componente, buscados diretamente do repositório `po-ui/po-angular`. Cada exemplo inclui os arquivos que o compõem (TypeScript, HTML, estilos e configuração), com o conteúdo e o link para o código-fonte.

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `slug` | `string` | sim | Identificador do componente. Aceita slug (`po-button`), seletor (`<po-button>`) ou nome de classe (`PoButtonComponent`). |
| `example` | `string` | não | Filtro pelo nome do exemplo, sem diferenciar maiúsculas e minúsculas. Exemplos: `basic`, `labs`. |
| `max_examples` | número inteiro de 1 a 5 | não | Quantidade máxima de exemplos. O padrão é `3`. |

Quando o componente informado não possui exemplos próprios, o servidor procura os exemplos do componente pai (por exemplo, `po-tab` retorna exemplos de `po-tabs`) e sinaliza a origem na resposta.

Exemplo:

```json
{ "slug": "po-button", "example": "basic", "max_examples": 2 }
```

> Esta ferramenta consulta a API pública do GitHub. Consulte a seção [Limitação de taxa da API do GitHub](#limitação-de-taxa-da-api-do-github).

### `get_best_practices`

Retorna, em Markdown, um documento oficial de boas práticas do PO UI, junto com o título e o link da fonte.

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `topic` | `"contributing" \| "development-flow" \| "getting-started" \| "theme-service"` | sim | Tema das recomendações. |

Exemplo:

```json
{ "topic": "getting-started" }
```

### `search_docs`

Realiza uma busca textual, sem diferenciar maiúsculas e minúsculas, no arquivo `llms-full.txt`.

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `query` | `string` com pelo menos 2 caracteres | sim | Texto procurado na documentação. |
| `max_results` | número inteiro de 1 a 50 | não | Quantidade máxima de resultados. O padrão é `10`. |

Cada resultado contém o título da seção encontrada e trechos de contexto ao redor das ocorrências.

Exemplo:

```json
{ "query": "lazy load", "max_results": 5 }
```

### `get_guide`

Retorna o conteúdo completo de um guia da documentação.

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `guide` | `string` | sim | Nome do guia, com ou sem a extensão `.md`. |

Para conhecer os guias disponíveis, use `list_components` com `section` igual a `guides`.

Exemplo:

```json
{ "guide": "getting-started" }
```

## Exemplos de prompts

- “Quais componentes do PO UI permitem upload de arquivos?”
- “Mostre a documentação do `po-table`.”
- “Como usar o `PoThemeService`?”
- “Pesquise por `p-loading` na documentação do PO UI.”
- “Liste os guias disponíveis e traga o guia de schematics.”
- “Mostre exemplos oficiais do `po-table`.”
- “Quais são as boas práticas de customização de tema do PO UI?”

## Fontes de dados

| Conteúdo | Fonte principal | Fallback |
| --- | --- | --- |
| Índice de APIs e guias | `https://po-ui.io/llms.txt` | — |
| Documentação consolidada | `https://po-ui.io/llms-full.txt` | — |
| Documentação por recurso | `https://po-ui.io/llms-generated/{slug}.md` | `https://raw.githubusercontent.com/po-ui/po-angular/master/projects/portal/src/llms-generated/{slug}.md` |
| Guias | `https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/{name}.md` | — |
| Índice de exemplos | `https://api.github.com/repos/po-ui/po-angular/git/trees/master?recursive=1` | — |
| Arquivos de exemplo | `https://raw.githubusercontent.com/po-ui/po-angular/master/{path}` | — |
| Boas práticas | `https://raw.githubusercontent.com/po-ui/po-angular/master/{doc}` | — |

O índice `llms.txt` é mantido em memória durante a execução do servidor. O índice de exemplos (árvore do repositório) também é mantido em cache durante a execução. Para forçar uma nova leitura de qualquer um deles, reinicie o servidor no cliente MCP.

## Solução de problemas

### O cliente não inicia o servidor

Confirme que o Node.js 18 ou superior está instalado e que `npx` está disponível no `PATH` do processo que executa o cliente. No Windows, alguns clientes podem exigir o caminho completo para `npx.cmd`.

### Erro ao carregar o índice ou a documentação

Verifique se o ambiente permite acesso HTTPS a `po-ui.io`, `raw.githubusercontent.com` e `api.github.com`. Cada requisição possui timeout de 10 segundos.

### Limitação de taxa da API do GitHub

A ferramenta `get_component_examples` consulta a API pública do GitHub para localizar os exemplos no repositório. Sem autenticação, o GitHub limita as requisições a 60 por hora por endereço IP. Ao atingir esse limite, a API responde com HTTP 403 e a ferramenta retorna uma mensagem de erro correspondente.

Para reduzir o consumo, o servidor mantém a árvore do repositório em cache durante a execução: apenas a primeira chamada a `get_component_examples` consulta a API do GitHub; as demais reutilizam o resultado em memória. Se você atingir o limite, aguarde a renovação da cota ou reinicie o servidor mais tarde. Ambientes com IP compartilhado (proxies corporativos, por exemplo) podem atingir o limite com mais frequência.

### Recurso não encontrado

Use `list_components` para localizar o slug aceito pelo servidor e, em seguida, informe esse valor a `get_component_docs`.

### As ferramentas não aparecem no cliente

Reinicie o servidor após alterar a configuração e verifique o painel ou o log de servidores MCP do cliente. Algumas aplicações também solicitam autorização antes de disponibilizar as ferramentas.

## Desenvolvimento

O código-fonte está no monorepo [`po-ui/po-angular`](https://github.com/po-ui/po-angular), em [`projects/mcp`](https://github.com/po-ui/po-angular/tree/master/projects/mcp).

Na raiz do repositório, execute:

```bash
npm install
npm run build:mcp
npm run test:mcp
```

Antes de contribuir, consulte o [guia de contribuição](https://github.com/po-ui/po-angular/blob/master/CONTRIBUTING.md).

## Licença

[MIT](https://github.com/po-ui/po-angular/blob/master/LICENSE) © PO UI
