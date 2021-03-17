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
  
  @ViewChild('formDocs') formDocs?: NgForm;
  formGroupClientes: FormGroup;
  cliente: Cliente = new Cliente();
  titulo: string = 'Cadastrar Cliente';
  id: number = 0;
  atualizar: boolean = false;
  
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
                },
                error => this.cliente = new Cliente()
              );
      }
    });
  }
  
  submeter() {
    // Atualizar
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
                setTimeout(() => {
                  this.router.navigate(['/clientes/list']);
                }, 3000);
              },
              error => {
                this.snackBar.open('Erro ao tentar atualizar o cliente!', 'fechar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
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
                setTimeout(() => {
                  this.formDocs?.resetForm();
                }, 200);
              },
              error => {
                this.snackBar.open('Erro: ' + error.error.mensagensErros[0], 'fechar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
              }
            );
    }
  }

  voltar(){
    this.router.navigate(['/clientes/list']);
  }
}
