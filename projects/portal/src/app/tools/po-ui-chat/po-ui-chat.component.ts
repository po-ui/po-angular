import { Component, ElementRef, ViewChild } from '@angular/core';
import { PoStepperComponent } from '@po-ui/ng-components';
import { AiAgentService, ChatMessage } from './ai-agent.service';

@Component({
  selector: 'app-po-ui-chat',
  templateUrl: './po-ui-chat.component.html',
  standalone: false,
  styles: [
    `
      .setup-container {
        max-width: 680px;
        margin: 0 auto;
        padding: 24px;
      }
      .step-content {
        padding: 24px 0;
      }
      .step-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 16px;
      }
      .chat-wrapper {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 200px);
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
export class PoUiChatComponent {
  @ViewChild('stepper') stepper!: PoStepperComponent;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  showChat = false;

  // Setup - Step 1
  name = '';
  email = '';

  // Setup - Step 2
  provider = '';
  modelName = '';
  apiKey = '';

  providerOptions = [
    { label: 'OpenAI', value: 'openai' },
    { label: 'Anthropic', value: 'anthropic' },
    { label: 'Google Gemini', value: 'google' },
    { label: 'OpenRouter', value: 'openrouter' }
  ];

  modelPlaceholder = 'Opcional — usa modelo padrão do provedor';

  private defaultModels: Record<string, string> = {
    openai: 'gpt-4.1',
    anthropic: 'claude-3-7-sonnet-20250219',
    google: 'gemini-2.0-flash',
    openrouter: 'google/gemini-2.0-flash-001'
  };

  // Chat
  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  streamingMessage = '';

  constructor(private agentService: AiAgentService) {}

  canAdvanceStep1(): boolean {
    return !!(this.name?.trim() && this.email?.trim());
  }

  canAdvanceStep2(): boolean {
    return !!(this.provider && this.apiKey?.trim());
  }

  onProviderChange(provider: string): void {
    this.modelName = '';
    this.modelPlaceholder = `Padrão: ${this.defaultModels[provider] || ''}`;
  }

  onFinish(): void {
    this.agentService.setConfig({
      name: this.name,
      email: this.email,
      provider: this.provider as any,
      modelName: this.modelName || undefined,
      apiKey: this.apiKey
    });
    this.showChat = true;
    this.messages = [
      {
        role: 'assistant',
        content: `Olá, ${this.name}! 👋 Sou o assistente PO-UI. Posso ajudar com dúvidas sobre componentes, padrões e boas práticas do Design System PO-UI. Como posso ajudar?`,
        timestamp: new Date()
      }
    ];
  }

  onBackToSetup(): void {
    this.showChat = false;
  }

  async sendMessage(): Promise<void> {
    const text = this.currentMessage.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', content: text, timestamp: new Date() });
    this.currentMessage = '';
    this.isLoading = true;
    this.streamingMessage = '';
    this.scrollToBottom();

    try {
      const answer = await this.agentService.sendMessageStream(text, partial => {
        this.streamingMessage = partial;
        this.scrollToBottom();
      });
      this.messages.push({ role: 'assistant', content: answer, timestamp: new Date() });
      this.streamingMessage = '';
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro ao processar sua mensagem. Tente novamente.';
      this.messages.push({ role: 'assistant', content: `⚠️ ${errorMsg}`, timestamp: new Date() });
      this.streamingMessage = '';
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
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

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
