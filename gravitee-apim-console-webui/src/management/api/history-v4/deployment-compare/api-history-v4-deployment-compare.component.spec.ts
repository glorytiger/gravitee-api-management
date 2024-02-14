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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApiHistoryV4DeploymentCompareComponent } from './api-history-v4-deployment-compare.component';

import { ApiHistoryV4Module } from '../api-history-v4.module';

describe('DeploymentCompareCurrentComponent', () => {
  let component: ApiHistoryV4DeploymentCompareComponent;
  let fixture: ComponentFixture<ApiHistoryV4DeploymentCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiHistoryV4Module],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { left: '', right: '' } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiHistoryV4DeploymentCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
