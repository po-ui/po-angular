import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoKendoService {
  constructor(private http: HttpClient) {}

  listItems(url): Observable<any> {
    return this.http.get<Array<any>>(url);
  }

  deleteItem(url, id): Observable<any> {
    return this.http.delete(url + '/' + id);
  }
}
