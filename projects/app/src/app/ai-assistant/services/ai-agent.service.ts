import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AgentConfig {
  name: string;
  email: string;
  provider: string;
  model: string;
  apiKey: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AiAgentService {
  private config: AgentConfig | null = null;
  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) {}

  setConfig(config: AgentConfig): void {
    this.config = config;
  }

  getConfig(): AgentConfig | null {
    return this.config;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  sendMessage(message: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(this.apiUrl, {
      message,
      provider: this.config?.provider,
      model: this.config?.model,
      apiKey: this.config?.apiKey,
      userName: this.config?.name
    });
  }
}
