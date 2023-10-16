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

import { Component, Inject, OnInit } from "@angular/core";
import { NotificationSettingsNewService } from "../../../../services-ngx/notification-settings-new.service";
import { combineLatest, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { Notifier } from "../../../../entities/notification/notifier";
import { NotificationSettings } from "../../../../entities/notification/notificationSettings";
import { UIRouterStateParams } from "../../../../ajs-upgraded-providers";
import {
  NotificationDetailsServices
} from "../../../../components/notifications/notifications-list/notification-details/notifications-details-reusable.component";


@Component({
  selector: "notifications-details-settings",
  template: require("./notifications-details-settings.component.html"),
  styles: [require("./notifications-details-settings.component.scss")]
})
export class NotificationsDetailsSettingsComponent implements OnInit {
  public isLoadingData = true;
  public notifier: Notifier;
  public notificationSettings: NotificationSettings;
  public hooks:any;
  notificationsDetailsServices: NotificationDetailsServices;

  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly notificationSettingsNewService: NotificationSettingsNewService,
    @Inject(UIRouterStateParams) private readonly ajsStateParams,
  ) {
  }

  public ngOnInit() {
    this.isLoadingData = true;

    this.notificationsDetailsServices = {
      reference: { referenceType: "PORTAL", referenceId: this.ajsStateParams.applicationId},
      update: (newMetadata) => this.notificationSettingsNewService.update(this.ajsStateParams.notificationId, newMetadata),
    }

    combineLatest([
      this.notificationSettingsNewService.getHooks(),
      this.notificationSettingsNewService.getSingleNotificationSetting(this.ajsStateParams.notificationId),
      this.notificationSettingsNewService.getNotifiers(),
    ])
      .pipe(
        tap(([hooks, notificationSettings, notifiers]) => {
          this.notificationSettings = notificationSettings;
          this.hooks = hooks;
          this.notifier = notifiers.find((i) => i.id === this.notificationSettings.notifier);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.isLoadingData = false;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  listUpdate() {
    this.ngOnInit();
  }

}
