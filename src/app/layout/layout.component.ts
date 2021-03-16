import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  data: Date;

  constructor() {
    this.data = new Date();
    setInterval(() => {
      this.data = new Date();
    },60000);
  }

  ngOnInit(): void {
  }

}
