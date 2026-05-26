import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LlmConfig {
  name: string;
  email: string;
  provider: 'openai' | 'anthropic' | 'google' | 'openrouter';
  modelName?: string;
  apiKey: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  model: string;
  model_name?: string;
  api_key: string;
  thread_id?: string;
  channel?: 'dev_assistant' | 'customer_support';
}

export interface ChatResponse {
  answer: string;
}

@Injectable({ providedIn: 'root' })
export class AiAgentService {
  private config: LlmConfig | null = null;
  private baseUrl = 'http://localhost:8000';
  private threadId: string | null = null;

  constructor(private http: HttpClient) {}

  setConfig(config: LlmConfig): void {
    this.config = config;
    this.threadId = crypto.randomUUID();
  }

  getConfig(): LlmConfig | null {
    return this.config;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  getThreadId(): string | null {
    return this.threadId;
  }

  /** Envia mensagem via SSE (streaming token a token) */
  async sendMessageStream(message: string, onChunk: (partial: string) => void): Promise<string> {
    const payload: ChatRequest = {
      message,
      model: this.config!.provider,
      api_key: this.config!.apiKey,
      thread_id: this.threadId!,
      channel: 'dev_assistant'
    };

    if (this.config!.modelName) {
      payload.model_name = this.config!.modelName;
    }

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config!.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(error.detail || `Erro ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const json = JSON.parse(line.slice(6));
          if (json.answer) {
            result = json.answer;
            onChunk(result);
          }
          if (json.error) throw new Error(json.error);
        }
      }
    }
    return result;
  }

  /** Envia mensagem via JSON (resposta única, fallback) */
  sendMessageSync(message: string): Observable<ChatResponse> {
    const payload: ChatRequest = {
      message,
      model: this.config!.provider,
      api_key: this.config!.apiKey,
      thread_id: this.threadId!,
      channel: 'dev_assistant'
    };

    if (this.config!.modelName) {
      payload.model_name = this.config!.modelName;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config!.apiKey
    };

    return this.http.post<ChatResponse>(`${this.baseUrl}/chat/sync`, payload, { headers });
  }
}
