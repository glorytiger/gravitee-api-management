import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { GioConfirmDialogModule, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TopApisComponent } from './top-apis.component';
import { TopApisDialogComponent } from './top-apis-dialog/top-apis-dialog.component';

import { GioTableWrapperModule } from '../../../../shared/components/gio-table-wrapper/gio-table-wrapper.module';
import { GioPermissionModule } from '../../../../shared/components/gio-permission/gio-permission.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    TopApisComponent,
    TopApisDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    GioIconsModule,
    GioConfirmDialogModule,
    GioTableWrapperModule,
    GioPermissionModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  exports: [
    TopApisComponent
  ]
})
export class TopApisModule { }
