[comment]: # (@label Ferramentas para I.A.)
[comment]: # (@link guides/llms)

## Introdução

O **PO UI** oferece suporte ao padrão [llms.txt](https://llmstxt.org/), uma especificação aberta que facilita o consumo de documentação por **Large Language Models (LLMs)** e ferramentas de Inteligência Artificial. Este recurso permite que assistentes de código como **GitHub Copilot**, **Claude**, **ChatGPT** e outros agentes de IA acessem informações estruturadas sobre os componentes da biblioteca de forma otimizada.

### O que é llms.txt?

O padrão `/llms.txt` foi proposto para fornecer conteúdo amigável para LLMs em websites. Diferente de páginas HTML complexas com navegação, anúncios e JavaScript, os arquivos llms.txt oferecem informações concisas e especializadas em formato Markdown, ideal para o contexto limitado das janelas de processamento dos modelos de linguagem.

> **Referência oficial:** [https://llmstxt.org/](https://llmstxt.org/)

---

## Arquivos Disponíveis

O PO UI gera automaticamente três tipos de documentação para consumo por ferramentas de IA:

### 1. Índice Resumido (`llms.txt`)

**URL:** [https://po-ui.io/llms.txt](https://po-ui.io/llms.txt)

Arquivo de índice seguindo a especificação oficial do llmstxt.org. Contém:

- Descrição geral da biblioteca PO UI
- Instruções de instalação
- Lista categorizada de todos os componentes, serviços, interfaces e enums
- Links para documentação detalhada de cada item
- Referências para guias importantes

Este arquivo é ideal para dar contexto inicial sobre a biblioteca a um LLM, permitindo que ele entenda a estrutura e saiba onde buscar informações específicas.

**Exemplo de uso:**
```
Adicione https://po-ui.io/llms.txt ao contexto do seu assistente de IA para que ele conheça todos os componentes disponíveis no PO UI.
```

---

### 2. Documentação Completa (`llms-full.txt`)

**URL:** [https://po-ui.io/llms-full.txt](https://po-ui.io/llms-full.txt)

Arquivo com a documentação completa de todos os componentes concatenada em um único arquivo. Inclui:

- Descrição detalhada de cada componente
- Tabelas de propriedades (Inputs) com tipo, alias, valores padrão e descrição
- Tabelas de eventos (Outputs)
- Propriedades de interfaces e modelos
- Valores de enums
- Métodos de serviços com parâmetros e tipos de retorno

Este arquivo é útil quando você precisa fornecer contexto completo sobre a biblioteca ao LLM, permitindo respostas mais precisas sobre qualquer componente.

> **Atenção:** Este arquivo pode ser grande. Use-o quando precisar de informações detalhadas sobre múltiplos componentes ou quando o LLM precisar entender relacionamentos entre diferentes partes da API.

---

### 3. Documentação Individual por Componente

**URL Base:** `https://po-ui.io/llms-generated/<componente>.md`

Cada componente, serviço, interface e enum possui seu próprio arquivo Markdown com documentação completa. Isso permite carregar apenas a documentação necessária para uma tarefa específica.

**Exemplos:**

| Tipo | Componente | URL |
|------|------------|-----|
| Componente | po-button | [https://po-ui.io/llms-generated/po-button.md](https://po-ui.io/llms-generated/po-button.md) |
| Componente | po-table | [https://po-ui.io/llms-generated/po-table.md](https://po-ui.io/llms-generated/po-table.md) |
| Componente | po-modal | [https://po-ui.io/llms-generated/po-modal.md](https://po-ui.io/llms-generated/po-modal.md) |
| Serviço | PoNotificationService | [https://po-ui.io/llms-generated/po-notification-service.md](https://po-ui.io/llms-generated/po-notification-service.md) |
| Interface | PoTableColumn | [https://po-ui.io/llms-generated/po-table-column.md](https://po-ui.io/llms-generated/po-table-column.md) |
| Enum | PoButtonKind | [https://po-ui.io/llms-generated/po-button-kind.md](https://po-ui.io/llms-generated/po-button-kind.md) |

**Padrão de nomenclatura:**
- Componentes: `po-<nome>.md` (ex: `po-button.md`, `po-combo.md`)
- Serviços: `po-<nome>-service.md` (ex: `po-dialog-service.md`)
- Interfaces: `po-<nome>.md` (ex: `po-table-column.md`)
- Enums: `po-<nome>.md` (ex: `po-button-kind.md`)

---

## Como Usar com Ferramentas de IA

### GitHub Copilot

No VS Code com GitHub Copilot, você pode referenciar a documentação do PO UI de diferentes formas:

**1. Usando o arquivo de contexto:**
```
@workspace Adicione o conteúdo de https://po-ui.io/llms.txt como contexto
```

**2. Referenciando componentes específicos:**
```
Usando a documentação em https://po-ui.io/llms-generated/po-table.md, 
crie uma tabela com ordenação e paginação.
```

### Claude / ChatGPT

Ao iniciar uma conversa sobre PO UI, forneça o contexto:

```
Estou trabalhando com a biblioteca PO UI para Angular. 
A documentação completa está disponível em: https://po-ui.io/llms-full.txt

[sua pergunta aqui]
```

Para perguntas específicas sobre um componente:

```
Consulte https://po-ui.io/llms-generated/po-lookup.md e me explique 
como configurar o filtro avançado do po-lookup.
```

### Cursor / Continue.dev / Outros Agentes

Configure o arquivo `llms.txt` como fonte de documentação nas configurações do seu agente de IA preferido. A maioria dos agentes modernos suporta URLs externas como fonte de contexto.

---

## Estrutura dos Arquivos Gerados

### Formato do llms.txt

O arquivo `llms.txt` segue a especificação oficial:

## Componentes e Diretivas

- [PoButtonComponent](https://po-ui.io/llms-generated/po-button.md): O po-button permite que o usuário execute ações...
- [PoTableComponent](https://po-ui.io/llms-generated/po-table.md): Componente de tabela para exibição de dados...
...

## Serviços

- [PoDialogService](https://po-ui.io/llms-generated/po-dialog-service.md): Serviço para exibição de diálogos...
...

## Interfaces e Modelos

- [PoTableColumn](https://po-ui.io/llms-generated/po-table-column.md): Interface para configuração de colunas...
...

## Guias

- [Instalação e configuração](https://po-ui.io/guides/getting-started): Como instalar o PO UI...
```

### Formato dos Arquivos de Componente (.md)

Cada arquivo individual contém:

```markdown
# PoButtonComponent

**Seletor:** `po-button`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-button

[Descrição completa do componente...]

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `label` | `p-label` | `string` | não | - | Texto exibido no botão |
| `disabled` | `p-disabled` | `boolean` | sim | `false` | Desabilita o botão |
...

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `click` | `p-click` | `EventEmitter<void>` | Emitido ao clicar no botão |
...
```

---

## Geração Automática

Os arquivos de documentação para IA são gerados automaticamente durante o build do portal PO UI.

Isso garante que a documentação para LLMs esteja sempre sincronizada com a versão mais recente da biblioteca.

### Arquivos Gerados

| Arquivo | Localização | Descrição |
|---------|-------------|-----------|
| `llms.txt` | `/llms.txt` | Índice com links para documentação detalhada |
| `llms-full.txt` | `/llms-full.txt` | Documentação completa em arquivo único |
| `*.md` | `/llms-generated/*.md` | Documentação individual por componente |

---

## Benefícios

- **Contexto otimizado:** Informações estruturadas em Markdown, ideal para janelas de contexto de LLMs
- **Sempre atualizado:** Gerado automaticamente a partir do código-fonte
- **Flexibilidade:** Escolha entre índice resumido, documentação completa ou arquivos individuais
- **Padrão aberto:** Segue a especificação [llmstxt.org](https://llmstxt.org/)
- **Compatibilidade:** Funciona com qualquer ferramenta de IA que aceite contexto em texto

---

## Referências

- [Especificação llms.txt](https://llmstxt.org/)
- [Diretório de sites com llms.txt](https://llmstxt.site/)
- [GitHub - llms-txt](https://github.com/AnswerDotAI/llms-txt)
