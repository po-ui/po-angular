import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PoPageSlideComponent } from '@po-ui/ng-components';

import { McpChatService, ChatToolResult } from './mcp-chat.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  tool?: string;
  params?: Record<string, string>;
  docLink?: string;
  docLinkLabel?: string;
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

  constructor(
    private mcpChatService: McpChatService,
    private router: Router
  ) {}

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
        const link = this.buildDocLink(result.tool, result.params);
        this.messages.push({
          role: 'assistant',
          content: result.result,
          tool: result.tool,
          params: result.params,
          docLink: link?.path,
          docLinkLabel: link?.label
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

  navigateToDoc(path: string): void {
    this.chatSlide.close();
    this.router.navigateByUrl(path);
  }

  private buildDocLink(tool: string, params: Record<string, string>): { path: string; label: string } | null {
    if (!tool || !params) {
      return null;
    }

    const name = params['name'];

    if ((tool === 'get_component' || tool === 'get_component_properties' ||
         tool === 'get_component_samples' || tool === 'get_css_tokens') && name) {
      return {
        path: `/documentation/${name}`,
        label: `Ver documentação completa de ${name}`
      };
    }

    if (tool === 'get_guide' && name) {
      const slug = name.replace(/\.md$/, '');
      return {
        path: `/guides/${slug}`,
        label: `Abrir guia: ${slug}`
      };
    }

    if (tool === 'list_components') {
      return {
        path: '/documentation',
        label: 'Ver todos os componentes'
      };
    }

    if (tool === 'list_guides') {
      return {
        path: '/guides',
        label: 'Ver todos os guias'
      };
    }

    return null;
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
