import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';

import { DocumentosRoutingModule } from './documentos-routing.module';
import { DocumentosFormComponent } from './documentos-form/documentos-form.component';
import { DocumentosListComponent } from './documentos-list/documentos-list.component';
import { DocumentosComponent } from './documentos.component';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [DocumentosFormComponent, DocumentosListComponent, DocumentosComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatToolbarModule,
    DocumentosRoutingModule
  ],
  exports: [
    DocumentosComponent,
    DocumentosFormComponent,
    DocumentosListComponent
  ]
})
export class DocumentosModule { }
