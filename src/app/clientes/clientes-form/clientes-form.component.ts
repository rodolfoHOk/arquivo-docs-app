import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientesService } from 'src/app/clientes.service';
import { Cliente } from '../cliente';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})


export class ClientesFormComponent implements OnInit {

  titulo: string = 'Cadastrar Cliente';
  id: number = 0;
  atualizar: boolean = false;
  carregando: boolean = false;
  aguardando: boolean = false;

  
  @ViewChild('formClientes') formClientes?: NgForm; // para acessar o resetForm()
  formGroupClientes: FormGroup;
  cliente: Cliente = new Cliente();
  
  constructor(
    private formBuider : FormBuilder,
    private snackBar : MatSnackBar,
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private service : ClientesService,
    ){
    this.formGroupClientes = this.formBuider.group({
      "id": [{ value:'', disabled: true }, Validators.nullValidator ], 
      "nome": ['', Validators.required ],
      "cnpj": ['', Validators.required ],
      "endereco": ['', Validators.required ]
    });
  }

  ngOnInit(): void {
    let idParam : Observable<Params> = this.activatedRoute.params;
    idParam.subscribe( urlParams => {
      this.id = urlParams['id'];
      if(this.id){
        this.carregando = true;
        this.titulo = 'Atualizar Cliente';
        this.atualizar = true;
        this.service
              .buscarPorId(this.id)
              .subscribe(
                response => { 
                  this.cliente = response;
                  this.formGroupClientes.controls['id'].setValue(this.cliente.id);
                  this.formGroupClientes.controls['nome'].setValue(this.cliente.nome);
                  this.formGroupClientes.controls['cnpj'].setValue(this.cliente.cnpj);
                  this.formGroupClientes.controls['endereco'].setValue(this.cliente.endereco);
                  this.carregando = false;
                },
                error => {
                  this.cliente = new Cliente();
                  this.carregando = false;
                }
        );
      }
    });
  }
  
  submeter() {
    // Atualizar
    this.aguardando = true;
    if(this.atualizar) {
      this.cliente.nome = this.formGroupClientes.value.nome;
      this.cliente.cnpj = this.formGroupClientes.value.cnpj;
      this.cliente.endereco = this.formGroupClientes.value.endereco;
      this.service
            .atualizar(this.cliente)
            .subscribe(
              response => {
                this.snackBar.open('Cliente atualizado com sucesso!', 'fechar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
                this.aguardando = false;
                setTimeout(() => {
                  this.router.navigate(['/clientes/list']);
                }, 3000);
              },
              error => {
                let mensagem: string = '';
                error.error.mensagensErros.forEach((mErro: string) => {
                  mensagem = mensagem + mErro + ', ';
                });
                mensagem = mensagem.substring(0,mensagem.length-2);
                this.snackBar.open('Erro:\n' + mensagem, 'fechar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
                this.aguardando = false;
              }
            );
    }
    // Cadastrar
    else {
      this.cliente.nome = this.formGroupClientes.value.nome;
      this.cliente.cnpj = this.formGroupClientes.value.cnpj;
      this.cliente.endereco = this.formGroupClientes.value.endereco;
      this.service
            .salvar(this.cliente)
            .subscribe(
              response => {
                this.snackBar.open('Cliente cadastrado com sucesso!', 'fechar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
                this.aguardando = false;
                setTimeout(() => {
                  this.formClientes?.resetForm(); // reseta os valores e a validacao
                }, 200);
              },
              error => {
                let mensagem: string = '';
                error.error.mensagensErros.forEach((mErro: string) => {
                  mensagem = mensagem + mErro + ', ';
                });
                mensagem = mensagem.substring(0, mensagem.length-2);
                this.snackBar.open('Erro: ' + mensagem, 'fechar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
                this.aguardando = false;
              }
            );
    }
  }

  voltar(){
    this.router.navigate(['/clientes/list']);
  }
}
