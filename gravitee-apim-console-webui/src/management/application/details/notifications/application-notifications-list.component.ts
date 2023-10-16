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
import { UIRouterState, UIRouterStateParams } from "../../../../ajs-upgraded-providers";
import { Notifier } from '../../../../entities/notification/notifier';
import {
  NotificationSettingsApplicationService
} from "../../../../services-ngx/notification-settings-application.service";
import {
  NotificationsServices
} from "../../../../components/notifications/notifications-list/notifications-list-reusable.component";
import { StateService } from "@uirouter/angular";

@Component({
  selector: 'application-notifications-list',
  template: require('./application-notifications-list.component.html'),
  styles: [require('./application-notifications-list.component.scss')],
})
export class ApplicationNotificationsListComponent implements OnInit {
  public notifiersGroup: Notifier[] = [];
  public isLoadingData = true;
  public displayedColumns = ['name', 'notifier', 'actions'];
  public notificationsList = [];
  notificationsServices: NotificationsServices;
  currentState;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(UIRouterStateParams) private readonly ajsStateParams,
    @Inject(UIRouterState) private readonly ajsState: StateService,
    private readonly notificationSettingsApplicationService: NotificationSettingsApplicationService,
  ) {}

  public ngOnInit() {
    this.isLoadingData = true;
    this.currentState = this.ajsState.current.name;
    this.notificationsServices = {
      reference: { referenceType: "APPLICATION", referenceId: this.ajsStateParams.applicationId},
      create: (newMetadata) => this.notificationSettingsApplicationService.create(this.ajsStateParams.applicationId, newMetadata),
      delete: (id) => this.notificationSettingsApplicationService.delete(this.ajsStateParams.applicationId, id)
    }

    combineLatest([
      this.notificationSettingsApplicationService.getAll(this.ajsStateParams.applicationId),
      this.notificationSettingsApplicationService.getNotifiers(this.ajsStateParams.applicationId),
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
