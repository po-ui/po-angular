import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeColorfulService {
  private url = 'https://api.github.com/repos/po-ui/po-angular';

  constructor(private http: HttpClient) {}

  getRepoData(): Observable<any> {
    return this.http.get(this.url);
  }
}
