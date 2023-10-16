import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  GioFormFocusInvalidModule, GioFormHeadersModule,
  GioIconsModule,
  GioLoaderModule,
  GioSaveBarModule
} from "@gravitee/ui-particles-angular";
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UIRouterModule } from '@uirouter/angular';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationsListReusableComponent } from "./notifications-list-reusable.component";
import { GioTableWrapperModule } from "../../../shared/components/gio-table-wrapper/gio-table-wrapper.module";
import { GioPermissionModule } from "../../../shared/components/gio-permission/gio-permission.module";
import { NotificationsDetailsReusableComponent } from "./notification-details/notifications-details-reusable.component";
import { GioGoBackButtonModule } from "../../../shared/components/gio-go-back-button/gio-go-back-button.module";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [NotificationsListReusableComponent, NotificationsDetailsReusableComponent],
  exports: [NotificationsListReusableComponent, NotificationsDetailsReusableComponent],
  imports: [
    CommonModule,
    GioTableWrapperModule,
    GioPermissionModule,
    MatButtonModule,
    MatIconModule,
    GioLoaderModule,
    MatTableModule,
    MatTooltipModule,
    UIRouterModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    GioFormFocusInvalidModule,
    GioGoBackButtonModule,
    GioSaveBarModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    GioPermissionModule,
    GioIconsModule,
    GioFormHeadersModule,
  ]
})
export class NotificationsListReusableModule {}
