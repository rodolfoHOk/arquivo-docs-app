import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RelatorioService } from '../relatorio.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {

  title = 'Relatorio';

  aguardando: boolean = false;
  formGroupRel: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private relatorioService: RelatorioService,
    private snackBar: MatSnackBar
  ) {
    this.formGroupRel = this.formBuilder.group({
      'de': [''],
      'ate': ['']
    })
  }

  ngOnInit(): void {
  }

  baixarRelatorio(){
    const clienteDe = this.formGroupRel.get('de')?.value;
    const clienteAte = this.formGroupRel.get('ate')?.value;
    this.aguardando = true;
    this.relatorioService.getPdf(clienteDe, clienteAte)
      .subscribe(
         (resultBlob: Blob) => {
            var downloadURL = URL.createObjectURL(resultBlob);
            window.open(downloadURL);
          this.aguardando = false;
        },
        error => {
          this.snackBar.open('Erro ao tentar baixa o relatório!', 'fechar', {
            duration: 3000
          });
          this.aguardando = false;
        }
      );

  }

}
