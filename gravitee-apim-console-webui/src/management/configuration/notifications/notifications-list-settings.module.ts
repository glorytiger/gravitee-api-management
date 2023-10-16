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
import { GioTableWrapperModule } from "../../../shared/components/gio-table-wrapper/gio-table-wrapper.module";
import { GioPermissionModule } from "../../../shared/components/gio-permission/gio-permission.module";
import { GioGoBackButtonModule } from "../../../shared/components/gio-go-back-button/gio-go-back-button.module";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NotificationsDetailsSettingsComponent
} from "./notifications-details/notifications-details-settings.component";
import { NotificationsListSettingsComponent } from "./notifications-list-settings.component";
import {
  NotificationsListReusableModule
} from "../../../components/notifications/notifications-list/notifications-list-reusable.module";


@NgModule({
  declarations: [NotificationsDetailsSettingsComponent, NotificationsListSettingsComponent],
  exports: [NotificationsDetailsSettingsComponent, NotificationsListSettingsComponent],
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
    NotificationsListReusableModule
  ]
})
export class NotificationsListSettingsModule {}
