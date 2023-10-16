/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { EMPTY, Observable, Subject } from "rxjs";
import { Notifier } from "../../../entities/notifier";
import { UIRouterState } from "../../../ajs-upgraded-providers";
import { GIO_DIALOG_WIDTH, GioConfirmDialogComponent, GioConfirmDialogData } from "@gravitee/ui-particles-angular";
import { catchError, filter, switchMap, takeUntil, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { SnackBarService } from "../../../services-ngx/snack-bar.service";
import {
  NotificationsAddNotificationDialogComponent,
  NotificationsAddNotificationDialogData, NotificationsAddNotificationDialogResult
} from "../../../management/api/notifications/notifications-add-notification-dialog/notifications-add-notification-dialog.component";
import { GioTableWrapperFilters } from "../../../shared/components/gio-table-wrapper/gio-table-wrapper.component";
import { gioTableFilterCollection } from "../../../shared/components/gio-table-wrapper/gio-table-wrapper.util";
import { StateService } from "@uirouter/angular";

export interface NotificationsServices {
  reference: {
    referenceType: "API" | "APPLICATION" | "PORTAL",
    referenceId: "DEFAULT" | "APPLICATION"
  };
  create: (newMetadata: any) => Observable<any>;
  delete: (id) => Observable<any>;
}

@Component({
  selector: "notifications-list-reusable",
  template: require("./notifications-list-reusable.component.html"),
  styles: [require("./notifications-list-reusable.component.scss")]
})
export class NotificationsListReusableComponent implements OnInit {
  public isLoadingData = true;
  public displayedColumns = ["name", "notifier", "actions"];
  public notificationUnpaginatedLength = 0;
  public filteredNotificationsSettingsTable = [];
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();
  public notificationsSettingsTable;
  currentName;

  @Input()
  notifiersGroup: Notifier[];

  @Input()
  notificationsList;

  @Output()
  listUpdate = new EventEmitter<any>();

  @Input() notificationsServices: NotificationsServices;

  constructor(
    @Inject(UIRouterState) private readonly ajsState: StateService,
    private readonly matDialog: MatDialog,
    private readonly snackBarService: SnackBarService
  ) {
  }

  public ngOnInit() {
    this.currentName = this.ajsState.current.name;
    this.isLoadingData = true;
    this.filteredNotificationsSettingsTable = [];
    this.notificationsSettingsTable = this.notificationsList.map((notificationSettings) => {
      return {
        id: notificationSettings.id,
        configType: notificationSettings.config_type,
        name: notificationSettings.name,
        notifier: notificationSettings.notifier || "none",
        notifierName: this.setNotifierName(notificationSettings)
      };
    });
    this.filteredNotificationsSettingsTable = this.notificationsSettingsTable;
    this.notificationUnpaginatedLength = this.filteredNotificationsSettingsTable.length;
    this.isLoadingData = false;

  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  deleteNotification(name: string, id: string) {
    this.matDialog
      .open<GioConfirmDialogComponent, GioConfirmDialogData>(GioConfirmDialogComponent, {
        width: "500px",
        data: {
          title: "Delete notification",
          content: `Are you sure you want to delete the notification <strong>${name}</strong>?`,
          confirmButton: "Delete"
        },
        role: "alertdialog",
        id: "deleteNotificationConfirmDialog"
      })
      .afterClosed()
      .pipe(
        filter((confirm) => confirm === true),
        switchMap(() => this.notificationsServices.delete(id)),
        tap(() => this.snackBarService.success(`“${name}” has been deleted”`)),
        catchError(({ error }) => {
          this.snackBarService.error(error.message);
          return EMPTY;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.listUpdate.next());
  }

  addNotification() {
    this.matDialog
      .open<NotificationsAddNotificationDialogComponent, NotificationsAddNotificationDialogData, NotificationsAddNotificationDialogResult>(
        NotificationsAddNotificationDialogComponent,
        {
          width: GIO_DIALOG_WIDTH.MEDIUM,
          data: {
            notifier: this.notifiersGroup,
            reference: this.notificationsServices.reference
          },
          role: "dialog",
          id: "addNotificationDialog"
        }
      )
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap((newNotificationSettings) => this.notificationsServices.create(newNotificationSettings)),
        tap(() => {
          this.snackBarService.success("Notification created successfully");
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.listUpdate.next());
  }

  setNotifierName(element) {
    if (element.id) {
      return this.notifiersGroup.find((i) => i.id === element.notifier).name;
    }
  }

  onPropertiesFiltersChanged(filters: GioTableWrapperFilters) {
    const filtered = gioTableFilterCollection(this.notificationsSettingsTable, filters);
    this.filteredNotificationsSettingsTable = filtered.filteredCollection;
    this.notificationUnpaginatedLength = filtered.unpaginatedLength;
  }

}
