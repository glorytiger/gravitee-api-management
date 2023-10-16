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
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { UIRouterStateParams } from '../../../../../ajs-upgraded-providers';
import { NotificationSettings } from '../../../../../entities/notification/notificationSettings';
import { Notifier } from '../../../../../entities/notification/notifier';
import {
  NotificationSettingsApplicationService
} from "../../../../../services-ngx/notification-settings-application.service";
import {
  NotificationDetailsServices
} from "../../../../../components/notifications/notifications-list/notification-details/notifications-details-reusable.component";

@Component({
  selector: 'application-notification-details',
  template: require('./application-notification-details.component.html'),
  styles: [require('./application-notification-details.component.scss')],
})
export class ApplicationNotificationDetailsComponent implements OnInit, OnDestroy {
  public isLoadingData = true;
  public notificationSettings: NotificationSettings;
  public formInitialValues: unknown;
  public notifier: Notifier;
  public hooks:any;
  notificationsDetailsServices: NotificationDetailsServices;

  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly notificationSettingsApplicationService: NotificationSettingsApplicationService,
    @Inject(UIRouterStateParams) private readonly ajsStateParams,
  ) {}

  public ngOnInit() {
    this.isLoadingData = true;

    this.notificationsDetailsServices = {
      reference: { referenceType: "APPLICATION", referenceId: this.ajsStateParams.applicationId},
      update: (newMetadata) => this.notificationSettingsApplicationService.update(this.ajsStateParams.applicationId, this.ajsStateParams.notificationId, newMetadata),
    }

    combineLatest([
      this.notificationSettingsApplicationService.getHooks(),
      this.notificationSettingsApplicationService.getSingleNotificationSetting(this.ajsStateParams.applicationId, this.ajsStateParams.notificationId),
      this.notificationSettingsApplicationService.getNotifiers(this.ajsStateParams.applicationId),
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
