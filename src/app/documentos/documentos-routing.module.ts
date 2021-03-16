import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentosFormComponent } from './documentos-form/documentos-form.component';
import { DocumentosListComponent } from './documentos-list/documentos-list.component';
import { DocumentosComponent } from './documentos.component';

const routes: Routes = [
  { path: 'documentos', component: DocumentosComponent, children: [
    { path: 'form', component: DocumentosFormComponent },
    { path: 'list', component: DocumentosListComponent },
    { path: 'documentos', redirectTo: '/documentos/list', pathMatch: 'full' }
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosRoutingModule { }
