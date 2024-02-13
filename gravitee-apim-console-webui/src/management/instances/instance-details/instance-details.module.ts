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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { InstanceDetailsComponent } from './instance-details.component';
import { InstanceDetailsHeaderModule } from './instance-details-header/instance-details-header.module';
import { InstanceDetailsMonitoringModule } from './instance-details-monitoring/instance-details-monitoring.module';
import { InstanceDetailsEnvironmentModule } from './instance-details-environment/instance-details-environment.module';

@NgModule({
  declarations: [InstanceDetailsComponent],
  exports: [InstanceDetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    InstanceDetailsHeaderModule,
    MatTabsModule,
    InstanceDetailsMonitoringModule,
    InstanceDetailsEnvironmentModule,
  ],
})
export class InstanceDetailsModule {}
