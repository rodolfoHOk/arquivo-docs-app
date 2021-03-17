import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Caixa } from './clientes/caixa';
import { Cliente } from './clientes/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  url: string = environment.urlBase + '/api/clientes';

  constructor(
    private http: HttpClient
  ) { }

  buscar(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.url}/nome?nome=${nome}`);
  }

  salvar(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.url, cliente);
  }

  deletar(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`);
  }

  buscarPorId(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  atualizar(cliente: Cliente): Observable<any>{
    return this.http.put<Cliente>(`${this.url}/${cliente.id}`, cliente);
  }

  buscarCaixasPorClienteId(clienteId : number): Observable<Caixa[]> {
    return this.http.get<Caixa[]>(`${this.url}/${clienteId}/caixas`);
  }

  deletarCaixa(clienteId: number, caixaId: number): Observable<any> {
    return this.http.delete(`${this.url}/${clienteId}/caixas/${caixaId}`);
  }

  salvarCaixa(caixa: Caixa): Observable<Caixa>{
    return this.http.post<Caixa>(`${this.url}/${caixa.cliente}/caixas`, caixa);
  }
  
}
