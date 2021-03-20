import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DocumentosRoutingModule } from './documentos-routing.module';
import { DocumentosFormComponent } from './documentos-form/documentos-form.component';
import { DocumentosDeleteDialog, DocumentosListComponent } from './documentos-list/documentos-list.component';
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
import { MatSelectModule } from '@angular/material/select'; 
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog'; 


@NgModule({
  declarations: [
    DocumentosFormComponent,
    DocumentosListComponent,
    DocumentosComponent,
    DocumentosDeleteDialog
  ],
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
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    DocumentosRoutingModule
  ],
  exports: [
    DocumentosComponent,
    DocumentosFormComponent,
    DocumentosListComponent
  ]
})
export class DocumentosModule { }
