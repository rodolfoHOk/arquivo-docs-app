import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Documento } from './documentos/documento';
import { TipoDocumento } from './documentos/tipos-documentos';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  
  url: string = environment.urlBase + '/api/documentos';

  urlTipos: string = this.url + '/tipos';
  
  constructor(
    private http: HttpClient
  ) { }

  buscar(cliente: number, caixa: number,
            tipo: number, nome: string): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.url}?nome=${nome}&cliente=${cliente}
                                       &caixa=${caixa}&tipo=${tipo}`);
  }

  buscarPorId(id: number): Observable<Documento> {
    return this.http.get<Documento>(`${this.url}/${id}`);
  }

  salvar(documento: Documento): Observable<Documento>{
    return this.http.post<Documento>(this.url, documento);
  }

  deletar(id: number): Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  atualizar(documento: Documento): Observable<any>{
    return this.http.put<Documento>(`${this.url}/${documento.id}`, documento);
  }

  buscarTipos(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.urlTipos);
  }

  salvarTipos(tipoDocumento: TipoDocumento): Observable<TipoDocumento>{
    return this.http.post<TipoDocumento>(this.urlTipos, tipoDocumento);
  }

  deletarTipos(id: number): Observable<any>{
    return this.http.delete<any>(`${this.urlTipos}/${id}`);
  }

  atualizarTipo(tipoDocumento: TipoDocumento): Observable<any>{
    return this.http.put<TipoDocumento>(`${this.urlTipos}/${tipoDocumento.id}`, tipoDocumento);
  }
}
