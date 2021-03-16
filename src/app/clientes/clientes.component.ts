import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  title = 'Clientes';
  navLinks: any[];

  constructor(
    private router : Router
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
