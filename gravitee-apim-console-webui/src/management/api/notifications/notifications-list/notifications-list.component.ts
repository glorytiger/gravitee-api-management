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

import { Component, Inject, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { NotificationSettingsService } from '../../../../services-ngx/notification-settings.service';
import { UIRouterStateParams } from '../../../../ajs-upgraded-providers';
import { Notifier } from '../../../../entities/notification/notifier';
import {
  NotificationsServices
} from "../../../../components/notifications/notifications-list/notifications-list-reusable.component";

@Component({
  selector: 'notifications-list',
  template: require('./notifications-list.component.html'),
  styles: [require('./notifications-list.component.scss')],
})
export class NotificationsListComponent implements OnInit {
  public notifiersGroup: Notifier[] = [];
  public isLoadingData = true;
  public displayedColumns = ['name', 'notifier', 'actions'];
  public notificationsList = [];
  notificationsServices: NotificationsServices;

  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(UIRouterStateParams) private readonly ajsStateParams,
    private readonly notificationSettingsService: NotificationSettingsService,
  ) {}

  public ngOnInit() {
    this.isLoadingData = true;

    this.notificationsServices = {
      reference: { referenceType: "API", referenceId: this.ajsStateParams.apiId},
      create: (newMetadata) => this.notificationSettingsService.create(this.ajsStateParams.apiId, newMetadata),
      delete: (id) => this.notificationSettingsService.delete(this.ajsStateParams.applicationId, id)
    }

    combineLatest([
      this.notificationSettingsService.getAll(this.ajsStateParams.apiId),
      this.notificationSettingsService.getNotifiers(this.ajsStateParams.apiId),
    ])
      .pipe(
        tap(([notificationsList, notifiers]) => {
          this.notifiersGroup = notifiers;
          this.notificationsList = notificationsList;
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
