import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {

  formulario: FormGroup;
  clientes: any[] = [];
  colunas: string[] = ['id', 'nome', 'cnpj', 'endereco', 'caixas', 'acoes'];
  buscaVazia: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formulario = this.formBuilder.group({
      nome: ['', Validators.nullValidator]
    });
  }

  ngOnInit(): void {
    this.formulario.reset();
  }

  buscar(){
    this.buscaVazia = true;
    this.clientes = [
      {
        "id": 1,
        "nome": 'Empresa A',
        "cnpj": '14580433000178',
        "endereco": 'Rua de Sao Paulo,123 - Sao Paulo - SP',
        "caixas": [3,4]      
      },
      {
        "id": 2,
        "nome": 'Empresa B',
        "cnpj": '14580433000178',
        "endereco": 'Rua de BH,234 - Belo Hozizonte - MG',
        "caixas": [2,6]      
      }
    ];
    // this.clientes = [];
    if(this.clientes.length !== 0){
      this.buscaVazia=false;
    };
    if(this.buscaVazia) {
      this.snackBar.open('Nenhum resultado encontrado!', 'fechar', {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "bottom",
      });
    };
  }

  editar(id: number){
    console.log("editar cliente: " + id);
  }

  deletar(id: number){
    console.log("deletando cliente: " + id);
  }

}
