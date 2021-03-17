import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Caixa } from 'src/app/clientes/caixa';
import { Cliente } from 'src/app/clientes/cliente';
import { Documento } from '../documento';
import { TipoDocumento } from '../tipos-documentos';

@Component({
  selector: 'app-documentos-form',
  templateUrl: './documentos-form.component.html',
  styleUrls: ['./documentos-form.component.css']
})
export class DocumentosFormComponent implements OnInit {

  titulo: string = 'Cadastro de Documentos';

  @ViewChild('formDocs2') formDocs?: NgForm;
  formGroupDocs: FormGroup;
  
  opcoesCliente: Cliente[] = [];
  opcoesClienteFiltrado: Cliente[] = [];
  caixasDoCliente: Caixa[] = [];
  tiposDocumento: TipoDocumento[] = [];

  atualizar: boolean = false;
  documento: Documento = new Documento();

  constructor(
    private formBuider : FormBuilder,
    private snackBar : MatSnackBar,
    private activatedRoute : ActivatedRoute,
    private router: Router,
  ) {
    this.formGroupDocs = this.formBuider.group({
      "id": [{ value:'', disabled: true }, Validators.nullValidator ],
      "cliente": ['', Validators.required ],
      "idCliente": [{ value:'', disabled: true }, Validators.nullValidator ],
      "caixa": ['', Validators.required ],
      "nome": ['', Validators.required ],
      "tipo": ['', Validators.required ],
      "data": ['', Validators.required ],
      "observacao": ['', Validators.nullValidator ]
    });
  }

  ngOnInit(): void {
    this.tiposDocumento = this.buscarTiposDocumento();
    console.log(this.tiposDocumento);
  }
  
  private filtrarCliente(clientes: Cliente[], nomeFiltrar: string): Cliente[] {
    return clientes.filter(cliente =>
      cliente.nome?.toLowerCase().includes(nomeFiltrar.toLowerCase()));
  }
  
  onChangeNomeCliente(nomeCliente: string) {
    if(nomeCliente.length >= 3){
      if(nomeCliente.length === 3){
        this.opcoesCliente = [
          {id: 1, nome:'Cliente 1'},
          {id: 2, nome:'Cliente 2'},
          {id: 4, nome:'Empresa do Jose 4'},
          {id: 6, nome:'Empresa do Joao 6'},
          {id: 7, nome:'Empresa 7'}
        ];
      }
      this.opcoesClienteFiltrado = this.filtrarCliente(this.opcoesCliente, nomeCliente);
    } else {
        this.opcoesClienteFiltrado = [];
    }
  }

  onClienteSelected(nomeCliente: string){
    console.log(nomeCliente);
    const cliente = this.opcoesClienteFiltrado
                          .find(cliente => cliente.nome === nomeCliente);
    if(cliente){
      this.formGroupDocs.controls['idCliente'].setValue(cliente.id);
      this.caixasDoCliente = this.buscarCaixasCliente(cliente.id);
      console.log(this.caixasDoCliente);
    } else {
      this.formGroupDocs.controls['idCliente'].setValue('');
    }
  }

  buscarCaixasCliente(idCliente?: number): Caixa[] {
    return [{"id": 2, "cliente": 1},{"id": 4, "cliente": 1}];
  }

  buscarTiposDocumento() : TipoDocumento[]{
    return [{"id": 1, "nome": 'recibo'},{"id": 2, "nome": 'nota fiscal'}];
  }

  submeter(){
    this.documento.id = this.formGroupDocs.value.id;
    this.documento.cliente = this.formGroupDocs.value.cliente;
    this.documento.caixa = this.formGroupDocs.value.caixa;
    this.documento.nome = this.formGroupDocs.value.nome;
    this.documento.tipoDocumento = this.formGroupDocs.value.tipo;
    this.documento.dtEntrada = this.formGroupDocs.value.data;
    this.documento.observacao = this.formGroupDocs.value.observacao;
    console.log('submetendo: ');
    console.log(this.documento);
  }

  voltar(){
    console.log('voltando...');
  }
}
