import { NgModule } from "@angular/core";
import { NotificationsListComponent } from "../../../api/notifications/notifications-list/notifications-list.component";
import { CommonModule } from "@angular/common";
import { GioTableWrapperModule } from "../../../../shared/components/gio-table-wrapper/gio-table-wrapper.module";
import { GioPermissionModule } from "../../../../shared/components/gio-permission/gio-permission.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { GioLoaderModule } from "@gravitee/ui-particles-angular";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UIRouterModule } from "@uirouter/angular";
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {
  NotificationsAddNotificationDialogModule
} from "../../../api/notifications/notifications-add-notification-dialog/notifications-add-notification-dialog.module";
import {
  NotificationsListReusableModule
} from "../../../../components/notifications/notifications-list/notifications-list-reusable.module";
import { ApplicationNotificationsListComponent } from "./application-notifications-list.component";
import {
  ApplicationNotificationDetailsComponent
} from "./notification-details/application-notification-details.component";

@NgModule({
  declarations: [ApplicationNotificationsListComponent, ApplicationNotificationDetailsComponent],
  exports: [ApplicationNotificationsListComponent, ApplicationNotificationDetailsComponent],
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
    NotificationsAddNotificationDialogModule,
    NotificationsListReusableModule
  ],
})
export class ApplicationNotificationsListModule {}
