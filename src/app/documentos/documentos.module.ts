import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DocumentosRoutingModule } from './documentos-routing.module';
import { DocumentosFormComponent } from './documentos-form/documentos-form.component';
import { DocumentosListComponent } from './documentos-list/documentos-list.component';
import { DocumentosComponent } from './documentos.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [DocumentosFormComponent, DocumentosListComponent, DocumentosComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    DocumentosRoutingModule
  ],
  exports: [
    DocumentosComponent,
    DocumentosFormComponent,
    DocumentosListComponent
  ]
})
export class DocumentosModule { }
