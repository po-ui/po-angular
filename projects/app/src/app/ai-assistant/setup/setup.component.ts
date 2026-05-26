import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoStepperComponent } from '../../../../../ui/src/public-api';
import { AiAgentService } from '../services/ai-agent.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
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
    `
  ]
})
export class SetupComponent {
  @ViewChild('stepper') stepper!: PoStepperComponent;

  // Step 1 - Dados pessoais
  name = '';
  email = '';

  // Step 2 - Configuração LLM
  provider = '';
  model = '';
  apiKey = '';

  providerOptions = [
    { label: 'OpenAI', value: 'openai' },
    { label: 'Anthropic', value: 'anthropic' },
    { label: 'Google Gemini', value: 'gemini' },
    { label: 'Ollama (Local)', value: 'ollama' }
  ];

  modelOptions: Array<{ label: string; value: string }> = [];

  private modelsByProvider: Record<string, Array<{ label: string; value: string }>> = {
    openai: [
      { label: 'GPT-4o', value: 'gpt-4o' },
      { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
      { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' }
    ],
    anthropic: [
      { label: 'Claude 4 Sonnet', value: 'claude-sonnet-4-20250514' },
      { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
      { label: 'Claude 3.5 Haiku', value: 'claude-3-5-haiku-20241022' }
    ],
    gemini: [
      { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
      { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' }
    ],
    ollama: [
      { label: 'Llama 3', value: 'llama3' },
      { label: 'Mistral', value: 'mistral' },
      { label: 'CodeLlama', value: 'codellama' }
    ]
  };

  constructor(
    private agentService: AiAgentService,
    private router: Router
  ) {}

  canAdvanceStep1(): boolean {
    return !!(this.name?.trim() && this.email?.trim());
  }

  canAdvanceStep2(): boolean {
    return !!(this.provider && this.model && this.apiKey?.trim());
  }

  onProviderChange(provider: string): void {
    this.model = '';
    this.modelOptions = this.modelsByProvider[provider] || [];
  }

  onFinish(): void {
    this.agentService.setConfig({
      name: this.name,
      email: this.email,
      provider: this.provider,
      model: this.model,
      apiKey: this.apiKey
    });
    this.router.navigate(['/chat']);
  }
}
