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

import { Component, OnInit } from "@angular/core";
import { Notifier } from "../../../entities/notification/notifier";
import { combineLatest, Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { NotificationSettingsNewService } from "../../../services-ngx/notification-settings-new.service";
import {
  NotificationsServices
} from "../../../components/notifications/notifications-list/notifications-list-reusable.component";

@Component({
  selector: "notifications-list-settings",
  template: require("./notifications-list-settings.component.html"),
  styles: [require("./notifications-list-settings.component.scss")]
})
export class NotificationsListSettingsComponent implements OnInit {
  public notifiersGroup: Notifier[] = [];
  public isLoadingData = true;
  public displayedColumns = ["name", "notifier", "actions"];
  public notificationsList = [];
  notificationsServices: NotificationsServices;

  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly notificationSettingsNewService: NotificationSettingsNewService
  ) {
  }

  public ngOnInit() {
    this.isLoadingData = true;
    this.notificationsServices = {
      reference: { referenceType: "PORTAL", referenceId: "DEFAULT" },
      create: (newMetadata) => this.notificationSettingsNewService.create(newMetadata),
      delete: (id) => this.notificationSettingsNewService.delete(id)
    };
    combineLatest([
      this.notificationSettingsNewService.getAll(),
      this.notificationSettingsNewService.getNotifiers()
    ])
      .pipe(
        tap(([notificationsList, notifiers]) => {
          this.notifiersGroup = notifiers;
          this.notificationsList = notificationsList;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.isLoadingData = false;
      });
  }

  createNotification(note): Observable<any> {
    return this.notificationSettingsNewService.create(note);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  listUpdate() {
    this.ngOnInit();
  }

  protected readonly event = event;
}
