import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  title = 'Documentos';
  navLinks: any[];

  constructor(
    private router: Router
  ) {
    this.navLinks = [
      {
        label: 'Consulta',
        link: './list',
      },
      {
        label: 'Cadastro',
        link: './form',
      }
    ]
  }

  ngOnInit(): void {
    
  }
}
