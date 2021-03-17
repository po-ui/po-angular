import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PoCustomAreaService {
  constructor(private http: HttpClient) {}
}
