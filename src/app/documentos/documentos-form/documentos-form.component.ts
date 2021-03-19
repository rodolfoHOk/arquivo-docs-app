import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Caixa } from 'src/app/clientes/caixa';
import { Cliente } from 'src/app/clientes/cliente';
import { Documento } from '../documento';
import { TipoDocumento } from '../tipos-documentos';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}  from '@angular/material/core';
import { DocumentosService } from 'src/app/documentos.service';
import { ClientesService } from 'src/app/clientes.service';
import { Observable } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-documentos-form',
  templateUrl: './documentos-form.component.html',
  styleUrls: ['./documentos-form.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class DocumentosFormComponent implements OnInit {

  titulo: string = 'Cadastro de Documentos';
  atualizar: boolean = false;
  id: number = 0;
  aguardando: boolean = true;

  // Formulario de cadastro de documentos
  @ViewChild('formDocs')
  formDocs?: NgForm;
  formGroupDocs: FormGroup;
  
  tiposDocumento: TipoDocumento[] = [];
  opcoesCliente: Cliente[] = [];
  opcoesClienteFiltrado: Cliente[] = [];
  caixasDoCliente: Caixa[] = [];
  documento: Documento = new Documento();

  // Formulario de cadastro de tipos de documentos
  @ViewChild('formTipos')
  formTipos?: NgForm;
  formGroupTipos: FormGroup;

  mostrarFormTipo: boolean = false;
  novoTipo: TipoDocumento = new TipoDocumento();

  constructor(
    private formBuider : FormBuilder,
    private snackBar : MatSnackBar,
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private documentosService : DocumentosService,
    private clientesService : ClientesService,
  ) {
    this.formGroupDocs = this.formBuider.group({
      "id": [{ value:'', disabled: true }],
      "nomeCliente": [{value:'', disabled: false }, Validators.required ],
      "idCliente": [{ value:'', disabled: true }],
      "caixa": ['', Validators.required ],
      "nome": ['', Validators.required ],
      "tipo": ['', Validators.required ],
      "data": ['', Validators.required ],
      "observacao": ['', Validators.nullValidator ]
    });
    this.formGroupTipos = this.formBuider.group({
      "id": [{value:'', disable: true }],
      "nome": ['', Validators.required ]
    });
  }

  ngOnInit(): void {
    let idParam : Observable<Params> = this.activatedRoute.params;
    idParam.subscribe( urlParams => {
      this.id = urlParams['id'];
      if(this.id){
        this.titulo = 'Atualizar Documento';
        this.atualizar = true;
        this.formGroupDocs.controls['nomeCliente'].disable();
        this.formGroupDocs.controls['data'].disable();
        this.documentosService
              .buscarPorId(this.id)
              .subscribe(
                response => { 
                  this.documento = response;
                  if(this.documento.cliente){
                    this.buscarCaixasCliente(this.documento.cliente);
                  }
                  this.formGroupDocs.controls['id'].setValue(this.documento.id);
                  this.formGroupDocs.controls['caixa'].setValue(this.documento.caixa);
                  this.formGroupDocs.controls['tipo'].setValue(this.documento.tipoDocumento);
                  this.formGroupDocs.controls['idCliente'].setValue(this.documento.cliente);
                  this.formGroupDocs.controls['nome'].setValue(this.documento.nome);
                  this.formGroupDocs.controls['data'].setValue(this.documento.dtEntrada);
                  this.formGroupDocs.controls['observacao'].setValue(this.documento.observacao);
                },
                error => this.documento = new Documento()
              );
      }
    });
    this.buscarTiposDocumento();
  }
  
  // Formulario Documento
  
  onChangeNomeCliente(nomeCliente: string) {
    if(nomeCliente.length >= 3){
      if(nomeCliente.length === 3){
        this.clientesService.buscar(nomeCliente)
          .subscribe(
            response => {
              this.opcoesCliente = response;
            },
            error => {
              this.snackBar.open('Erro ao tentar buscar clientes!', 'fechar', {
                duration: 2000
              });
            }
          );
      }
      this.opcoesClienteFiltrado = this.filtrarCliente(this.opcoesCliente, nomeCliente);
    } else {
        this.opcoesClienteFiltrado = [];
      }
  }

  onClienteSelected(nomeCliente: string){
    const cliente = this.opcoesClienteFiltrado
    .find(cliente => cliente.nome === nomeCliente);
    if(cliente){
      if(cliente.id){
        this.documento.cliente = cliente.id;
        this.formGroupDocs.controls['idCliente'].setValue(cliente.id);
        this.buscarCaixasCliente(cliente.id);
      }
    } else {
      this.documento.cliente = 0;
      this.formGroupDocs.controls['idCliente'].setValue('');
    }
  }
  
  submeter(){
    if(this.atualizar){    
      // atualizar
      this.documento.caixa = this.formGroupDocs.value.caixa;
      this.documento.nome = this.formGroupDocs.value.nome;
      this.documento.tipoDocumento = this.formGroupDocs.value.tipo;
      this.documento.dtEntrada = this.formGroupDocs.value.data;
      this.documento.observacao = this.formGroupDocs.value.observacao;
      this.documentosService.atualizar(this.documento)
        .subscribe(
          response =>{
            this.snackBar.open('Documento atualizado com sucesso!', 'fechar', {
              duration: 3000
            });
          },
          error => {
            let mensagem: string = '';
            error.error.mensagensErros.forEach((mErro: string) => {
              mensagem = mensagem + mErro + ', ';
            });
            mensagem = mensagem.substring(0,-2);
            this.snackBar.open('Erro: ' + mensagem, 'fechar', {
              duration: 3000
            });
          }
      );

    } else {
      // cadastrar
      this.documento.caixa = this.formGroupDocs.value.caixa;
      this.documento.nome = this.formGroupDocs.value.nome;
      this.documento.tipoDocumento = this.formGroupDocs.value.tipo;
      this.documento.dtEntrada = this.formGroupDocs.value.data;
      this.documento.observacao = this.formGroupDocs.value.observacao;
      this.documentosService.salvar(this.documento)
        .subscribe(
          response =>{
            this.snackBar.open('Documento cadastrado com sucesso!', 'fechar', {
              duration: 3000
            });
          },
          error => {
            let mensagem: string = '';
            error.error.mensagensErros.forEach((mErro: string) => {
              mensagem = mensagem + mErro + ', ';
            });
            mensagem = mensagem.substring(0,-2);
            this.snackBar.open('Erro: ' + mensagem, 'fechar', {
              duration: 3000
            });
          }
      );
    }
  }

  limparParcial(){
    this.formGroupDocs.get('nome')?.reset();
    this.formGroupDocs.get('observacao')?.reset();
  }

  voltar(){
    console.log('voltando...');
  }

  private buscarTiposDocumento() : void {
    this.documentosService.buscarTipos()
      .subscribe(
        response => {
          this.tiposDocumento = response;
        },
        error => {
          this.snackBar.open('Erro ao tentar adquidir tipos de documento!', 'fechar', {
            duration: 2000
          });
        }
    );
  }
  
  private filtrarCliente(clientes: Cliente[], nomeFiltrar: string): Cliente[] {
    return clientes.filter(cliente =>
      cliente.nome?.toLowerCase().includes(nomeFiltrar.toLowerCase()));
  }
  
  private buscarCaixasCliente(idCliente: number): void {
    this.clientesService.buscarCaixasPorClienteId(idCliente)
      .subscribe(
        response => {
          this.caixasDoCliente = response;
        },
        error =>{
          this.snackBar.open('Erro ao tentar adquidir caixas do cliente!', 'fechar', {
            duration: 2000
          });
        }
      );
  }
    
  private formatarData(data: any): string {
    const dia: number = data._i.date;
    const mes : number = data._i.month + 1;
    const ano: number = data._i.year;
    if (mes < 10) {
      return dia+'/'+mes+'/'+ano
    }
    return dia+'/'+mes+'/'+ano
  }

  // Formulario Tipo Documento

  mostrarFormularioTipo(){
    this.mostrarFormTipo = !this.mostrarFormTipo;
  }

  submeterTipo(){
    this.novoTipo.nome = this.formGroupTipos.value.nome;
    this.documentosService.salvarTipos(this.novoTipo)
      .subscribe(
        response => {
          this.snackBar.open('Novo tipo de documento cadastrado com sucesso!', 'fechar', {
            duration: 3000
          });
          this.buscarTiposDocumento();
        },
        error => {
          this.snackBar.open('Erro ao tentar cadastrar novo tipo de documento!', 'fechar', {
            duration: 3000
          });
        }
      )
    this.mostrarFormTipo = false;
    this.formTipos?.resetForm();
  }
}
