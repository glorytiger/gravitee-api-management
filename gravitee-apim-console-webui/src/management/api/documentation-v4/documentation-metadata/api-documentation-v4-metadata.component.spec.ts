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
import { HarnessLoader } from '@angular/cdk/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ActivatedRoute } from '@angular/router';

import { ApiDocumentationV4MetadataComponent } from './api-documentation-v4-metadata.component';

import { CONSTANTS_TESTING, GioTestingModule } from '../../../../shared/testing';
import { Metadata } from '../../../../entities/metadata/metadata';
import { fakeMetadata } from '../../../../entities/metadata/metadata.fixture';
import { GioMetadataHarness } from '../../../../components/gio-metadata/gio-metadata.harness';
import { GioTestingPermissionProvider } from '../../../../shared/components/gio-permission/gio-permission.service';
import { ApiDocumentationV4Module } from '../api-documentation-v4.module';
import { SearchApiMetadataParam } from '../../../../entities/management-api-v2';

describe('ApiDocumentationV4MetadataComponent', () => {
  let fixture: ComponentFixture<ApiDocumentationV4MetadataComponent>;
  let loader: HarnessLoader;
  let httpTestingController: HttpTestingController;
  const API_ID = 'my-api';

  const init = async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiDocumentationV4MetadataComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { apiId: API_ID } } } },
        { provide: GioTestingPermissionProvider, useValue: ['api-metadata-r', 'api-metadata-u', 'api-metadata-d', 'api-metadata-c'] },
      ],
      imports: [NoopAnimationsModule, GioTestingModule, ApiDocumentationV4Module, MatIconTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiDocumentationV4MetadataComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    expectMetadataList();
  };

  beforeEach(async () => await init());

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should load metadata list', async () => {
    const gioMetadata = await loader.getHarnessOrNull(GioMetadataHarness);
    expect(gioMetadata).toBeTruthy();
  });

  it('should sort metadata', async () => {
    const gioMetadata = await loader.getHarness(GioMetadataHarness);
    await gioMetadata.sortBy('name');
    expectMetadataList(undefined, { sortBy: 'name' });

    // Reverse direction on second click
    await gioMetadata.sortBy('name');
    expectMetadataList(undefined, { sortBy: '-name' });
  });

  function expectMetadataList(
    list: Metadata[] = [fakeMetadata({ key: 'key1' }), fakeMetadata({ key: 'key2' })],
    searchParams?: SearchApiMetadataParam,
  ) {
    let page = 1;
    let perPage = 10;
    let additionalParams = '';
    if (searchParams) {
      page = searchParams.page ?? page;
      perPage = searchParams.perPage ?? perPage;

      if (searchParams.source) {
        additionalParams += `&source=${searchParams.source}`;
      }

      if (searchParams.sortBy) {
        additionalParams += `&sortBy=${searchParams.sortBy}`;
      }
    }
    httpTestingController
      .expectOne({
        url: `${CONSTANTS_TESTING.env.v2BaseURL}/apis/${API_ID}/metadata?page=${page}&perPage=${perPage}${additionalParams}`,
        method: 'GET',
      })
      .flush(list);
  }
});
