import { Component, ViewChild } from '@angular/core';

import { PoPageSlideComponent } from '@po-ui/ng-components';

import { McpChatService, ChatToolResult } from './mcp-chat.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  tool?: string;
  params?: Record<string, string>;
}

@Component({
  selector: 'app-mcp-chat',
  templateUrl: './mcp-chat.component.html',
  styleUrls: ['./mcp-chat.component.css'],
  standalone: false
})
export class McpChatComponent {
  @ViewChild('chatSlide', { static: true }) chatSlide: PoPageSlideComponent;

  messages: ChatMessage[] = [];
  inputText = '';
  isLoading = false;

  suggestions = [
    'Quais componentes de formulário existem?',
    'Como usar o po-table?',
    'Tokens CSS do po-button',
    'Guias disponíveis',
    'Exemplos do po-combo',
    'Estrutura do monorepo'
  ];

  constructor(private mcpChatService: McpChatService) {}

  openChat(): void {
    this.chatSlide.open();
  }

  closeChat(): void {
    this.chatSlide.close();
  }

  sendMessage(): void {
    const query = this.inputText.trim();
    if (!query || this.isLoading) {
      return;
    }

    this.messages.push({ role: 'user', content: query });
    this.inputText = '';
    this.isLoading = true;

    this.mcpChatService.sendQuery(query).subscribe({
      next: (result: ChatToolResult) => {
        this.messages.push({
          role: 'assistant',
          content: result.result,
          tool: result.tool,
          params: result.params
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: 'Erro ao conectar com o servidor MCP. Verifique se o servidor está rodando em `npm run start:demo`.'
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });

    setTimeout(() => this.scrollToBottom(), 100);
  }

  sendSuggestion(suggestion: string): void {
    this.inputText = suggestion;
    this.sendMessage();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatParams(params: Record<string, string>): string {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }
    return Object.entries(params).map(([k, v]) => `${k}="${v}"`).join(', ');
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatBody = document.querySelector('.mcp-chat-messages');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 50);
  }
}
