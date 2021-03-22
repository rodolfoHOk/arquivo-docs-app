import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientesService } from '../clientes.service';
import { Caixa } from '../clientes/caixa';
import { Cliente } from '../clientes/cliente';
import { DocumentosService } from '../documentos.service';
import { TipoDocumento } from '../documentos/tipos-documentos';

@Component({
  selector: 'app-outras',
  templateUrl: './outras.component.html',
  styleUrls: ['./outras.component.css']
})
export class OutrasComponent implements OnInit {

  fromGroupTipo: FormGroup;
  tiposDocumento: TipoDocumento[] = [{'id':1,'nome':'tipoA'},{'id':2,'nome':'tipoB'}];
  deletandoTipo: boolean = false;
  tipoDocumento: TipoDocumento = new TipoDocumento();

  formGroupCaixa: FormGroup;
  opcoesClientes: Cliente[] = [];
  opcoesClientesFiltrado: Cliente[] = [];
  caixasDoCliente: Caixa[] = [];
  deletandoCaixa: boolean = false;
  carregandoClientes: boolean = false;
  carregandoCaixas: boolean = false;
  caixa: Caixa = new Caixa();

  constructor(
    private formBuilder: FormBuilder,
    private clientesService: ClientesService,
    private documentosService: DocumentosService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.fromGroupTipo = this.formBuilder.group({
      "idTipo": ['', Validators.required],
    });
    this.formGroupCaixa = this.formBuilder.group({
      "nomeCliente": ['', Validators.required],
      "idCliente": [{value: '', disabled: true}],
      "idCaixa": ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.documentosService.buscarTipos()
      .subscribe(
        response => { 
          this.tiposDocumento = response;
        },
        error => {
          this.snackBar.open('Erro ao tentar buscar tipos de documentos', 'fechar', {
            duration: 2000
          });
        }
      );
  }

  // Tipo Documento
  openDeletarTipoDialog(): void {
    this.deletandoTipo = true;
    const dialogRef = this.dialog.open(OutrasDeleteTipoDialog, {
      width: '',
      height: '',
      panelClass: 'panelDialog',
      data: { idTipo: this.fromGroupTipo.get('idTipo')?.value }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result === 'deletado'){
          this.documentosService.buscarTipos()
          .subscribe(
            response => { 
              this.tiposDocumento = response;
            },
            error => {
              this.snackBar.open('Erro ao tentar buscar tipos de documentos', 'fechar', {
                duration: 2000
              });
            }
          );
        }
        this.deletandoTipo = false;
      }
    );
  }

  // Caixa
  onChangeNomeCliente(nomeCliente: string){
    if(nomeCliente.length >= 3){
      if(nomeCliente.length === 3){
        this.carregandoClientes = true;
        this.clientesService.buscar(nomeCliente)
          .subscribe(
            response => {
              this.opcoesClientes = response;
              this.carregandoClientes = false;
            },
            error => {
              this.snackBar.open('Erro ao tentar buscar clientes!', 'fechar', {
                duration: 2000
              });
              this.carregandoClientes = false;
            }
          );
      }
      this.opcoesClientesFiltrado = this.filtrarCliente(this.opcoesClientes, nomeCliente);
    } else {
        this.opcoesClientesFiltrado = [];
    }
  }
  
  private filtrarCliente(clientes: Cliente[], nomeFiltrar: string): Cliente[] {
    return clientes.filter(cliente =>
      cliente.nome?.toLowerCase().includes(nomeFiltrar.toLowerCase()));
  }

  onClienteSelected(nomeCliente: string){
    const cliente = this.opcoesClientesFiltrado
    .find(cliente => cliente.nome === nomeCliente);
    if(cliente){
      if(cliente.id){
        this.caixa.cliente = cliente.id;
        this.formGroupCaixa.controls['idCliente'].setValue(cliente.id);
        this.buscarCaixasCliente(cliente.id);
      }
    } else {
      this.caixa.cliente = 0;
      this.formGroupCaixa.controls['idCliente'].setValue('');
    }
  }
  
  private buscarCaixasCliente(idCliente: number): void {
    this.carregandoCaixas = true;
    this.clientesService.buscarCaixasPorClienteId(idCliente)
      .subscribe(
        response => {
          this.caixasDoCliente = response;
          this.carregandoCaixas = false;
        },
        error =>{
          this.snackBar.open('Erro ao tentar adquidir caixas do cliente!', 'fechar', {
            duration: 2000
          });
          this.carregandoCaixas = false;
        }
    );
  }

  openDeletarCaixaDialog(){
    this.deletandoCaixa = true;
    const dialogRef = this.dialog.open(OutrasDeleteCaixaDialog, {
      width: '',
      height: '',
      panelClass: 'panelDialog',
      data: { idCliente: this.formGroupCaixa.get('idCliente')?.value,
              idCaixa: this.formGroupCaixa.get('idCaixa')?.value }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result === 'deletado'){
          this.buscarCaixasCliente(this.formGroupCaixa.get('idCliente')?.value);
        }
        this.deletandoCaixa = false;
      }
    );
  }
}

@Component({
  selector: 'outras-delete-tipo-dialog',
  templateUrl: 'outras-delete-tipo-dialog.html'
})
export class OutrasDeleteTipoDialog{
  
  deletando: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<OutrasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogTipoData,
    private documentosService: DocumentosService,
    private snackBar: MatSnackBar
  ){}

  deletar(idTipo: number){
    this.deletando = true;
    this.documentosService.deletarTipos(idTipo)
      .subscribe(
        response => {
          this.snackBar.open('Tipo de documento deletado com sucesso!', 'fechar', {
            duration: 2000
          });
          this.deletando = false;
          this.dialogRef.close('deletado');
        },
        error => {
          this.snackBar.open('Erro ao tentar deletar tipo de documento!', 'fechar', {
            duration: 2000
          });
          this.deletando = false;
          this.dialogRef.close();
        }
      );
  }

  fechar(){
    this.dialogRef.close();
  }
}

export interface DialogTipoData{
  'idTipo': number;
}

@Component({
  selector: 'outras-delete-caixa-dialog',
  templateUrl: 'outras-delete-caixa-dialog.html'
})
export class OutrasDeleteCaixaDialog{
  
  deletando: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<OutrasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogCaixaData,
    private clientesService: ClientesService,
    private snackBar: MatSnackBar
  ){}

  deletar(idCliente: number, idCaixa: number){
    this.deletando = true;
    this.clientesService.deletarCaixa(idCliente, idCaixa)
      .subscribe(
        response => {
          this.snackBar.open('Caixa deletada com sucesso!', 'fechar', {
            duration: 2000
          });
          this.deletando = false;
          this.dialogRef.close('deletado');
        },
        error => {
          this.snackBar.open('Erro ao tentar deletar caixa!', 'fechar', {
            duration: 2000
          });
          this.deletando = false;
          this.dialogRef.close();
        }
      );
  }

  fechar(){
    this.dialogRef.close();
  }
}

export interface DialogCaixaData{
  'idCliente': number;
  'idCaixa': number;
}
