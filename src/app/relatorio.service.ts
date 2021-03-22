import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  url = environment.urlBase + '/api/relatorios/get-pdf'

  constructor(
    private http: HttpClient
  ) { }

  getPdf(clienteDe: number, clienteAte: number): Observable<any> {
    let headers : HttpHeaders = new HttpHeaders();
    headers.set('Accept', 'application/pdf');
    return this.http.get<any>(`${this.url}?clientede=${clienteDe}&clienteate=${clienteAte}`, 
                              { headers: headers, responseType: 'blob' as 'json'});
  }
}
