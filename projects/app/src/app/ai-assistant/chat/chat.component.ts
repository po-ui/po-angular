import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AiAgentService, ChatMessage } from '../services/ai-agent.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: false,
  styles: [
    `
      .chat-wrapper {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 120px);
        max-width: 900px;
        margin: 0 auto;
      }
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .message {
        display: flex;
        gap: 12px;
        max-width: 80%;
      }
      .message--user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }
      .message--assistant {
        align-self: flex-start;
      }
      .message-bubble {
        padding: 12px 16px;
        border-radius: 12px;
        line-height: 1.5;
        position: relative;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
      .message--user .message-bubble {
        background-color: var(--color-brand-01-lightest, #f0e6f6);
        border-bottom-right-radius: 4px;
      }
      .message--assistant .message-bubble {
        background-color: var(--color-neutral-light-00, #f5f5f5);
        border-bottom-left-radius: 4px;
      }
      .message-actions {
        display: flex;
        gap: 4px;
        margin-top: 4px;
        justify-content: flex-end;
      }
      .chat-input-area {
        display: flex;
        gap: 8px;
        padding: 16px;
        align-items: flex-end;
        border-top: 1px solid var(--color-neutral-light-20, #ddd);
      }
      .chat-input-area po-textarea {
        flex: 1;
      }
      .copy-btn {
        cursor: pointer;
        opacity: 0.6;
        font-size: 12px;
        background: none;
        border: none;
        padding: 2px 6px;
      }
      .copy-btn:hover {
        opacity: 1;
      }
      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 8px 12px;
      }
      .typing-indicator span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--color-neutral-mid-40, #999);
        animation: bounce 1.4s infinite ease-in-out both;
      }
      .typing-indicator span:nth-child(1) {
        animation-delay: -0.32s;
      }
      .typing-indicator span:nth-child(2) {
        animation-delay: -0.16s;
      }
      @keyframes bounce {
        0%,
        80%,
        100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    `
  ]
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  userName = '';

  constructor(
    private agentService: AiAgentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.agentService.isConfigured()) {
      this.router.navigate(['/setup']);
      return;
    }
    this.userName = this.agentService.getConfig()!.name;
    this.messages.push({
      role: 'assistant',
      content: `Olá, ${this.userName}! 👋 Sou o assistente PO-UI. Posso ajudar com dúvidas sobre componentes, padrões, configurações e boas práticas do Design System PO-UI. Como posso ajudar?`,
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    const text = this.currentMessage.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', content: text, timestamp: new Date() });
    this.currentMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    this.agentService.sendMessage(text).subscribe({
      next: res => {
        this.messages.push({ role: 'assistant', content: res.response, timestamp: new Date() });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  copyMessage(content: string): void {
    navigator.clipboard.writeText(content);
  }

  goToSetup(): void {
    this.router.navigate(['/setup']);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
