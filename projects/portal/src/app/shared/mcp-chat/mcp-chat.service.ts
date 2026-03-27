import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatToolResult {
  tool: string;
  params: Record<string, string>;
  result: string;
}

@Injectable({ providedIn: 'root' })
export class McpChatService {
  private apiUrl = 'http://localhost:3333/api/chat';

  constructor(private http: HttpClient) {}

  sendQuery(query: string): Observable<ChatToolResult> {
    return this.http.post<ChatToolResult>(this.apiUrl, { query });
  }
}
