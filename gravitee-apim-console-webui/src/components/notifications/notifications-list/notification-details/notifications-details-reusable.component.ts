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
import { FormControl, FormGroup } from "@angular/forms";
import { takeUntil, tap } from "rxjs/operators";
import { UIRouterStateParams } from "../../../../ajs-upgraded-providers";
import { SnackBarService } from "../../../../services-ngx/snack-bar.service";
import { Observable, Subject } from "rxjs";
import { Hooks } from "../../../../entities/notification/hooks";
import { groupBy, map } from "lodash";

export interface NotificationDetailsServices {
  reference: {
    referenceType: 'API' | 'APPLICATION' | 'PORTAL',
    referenceId: 'DEFAULT' | 'APPLICATION'
  };
  update: (newMetadata: any) => Observable<any>;
}

@Component({
  selector: "notifications-details-reusable",
  template: require("./notifications-details-reusable.component.html"),
  styles: [require("./notifications-details-reusable.component.scss")]
})
export class NotificationsDetailsReusableComponent implements OnInit {
  notificationForm: FormGroup;
  public formInitialValues: unknown;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  @Input() categoriesHooksVM;
  @Input() notifier;
  @Input() notificationSettings;
  @Input() hooks;
  @Input() goBackPath;
  @Output()
  listUpdate = new EventEmitter<any>();
  @Input() notificationDetailsServices: NotificationDetailsServices;

  constructor(
    @Inject(UIRouterStateParams) private readonly ajsStateParams,
    private readonly snackBarService: SnackBarService
  ) {
  }

  public ngOnInit() {
    this.notificationForm = new FormGroup({
      notifier: new FormControl(this.notificationSettings.config)
    });

    const hooksChecked: (Hooks & { checked: boolean })[] = this.hooks.map((hook) => ({
      ...hook,
      checked: this.notificationSettings.hooks.includes(hook.id),
    }));

    hooksChecked.map((item) => {
      this.notificationForm.addControl(`${item.id}`, new FormControl(item.checked));
    });

    const categories = groupBy(hooksChecked, 'category');
    this.categoriesHooksVM = map(categories, (hooks, k) => ({
      name: k,
      hooks: hooks,
    }));
  }

  ngOnDestroy() {
    this.unsubscribe$.unsubscribe();
  }

  onSubmit() {
    if (this.notificationForm.invalid) {
      return;
    }

    const notificationSettingsValue = {
      ...this.notificationSettings,
      hooks: Object.keys(
        Object.fromEntries(Object.entries(this.notificationForm.getRawValue()).filter(([key, value]) => value && key !== "config"))
      ),
      config: this.notificationForm.controls.notifier.value
    };

    this.notificationDetailsServices
      .update(notificationSettingsValue)
      .pipe(
        tap(() => this.snackBarService.success("Notification settings successfully saved!")),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.listUpdate.next());
  }


}
