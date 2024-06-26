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
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController } from '@angular/common/http/testing';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MatRadioButtonHarness, MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { CreateIntegrationComponent } from './create-integration.component';
import { CreateIntegrationHarness } from './create-integration.harness';

import { IntegrationsModule } from '../integrations.module';
import { CONSTANTS_TESTING, GioTestingModule } from '../../../shared/testing';
import { SnackBarService } from '../../../services-ngx/snack-bar.service';
import { CreateIntegrationPayload } from '../integrations.model';

describe('CreateIntegrationComponent', () => {
  let fixture: ComponentFixture<CreateIntegrationComponent>;
  let componentHarness: CreateIntegrationHarness;
  let httpTestingController: HttpTestingController;

  const fakeSnackBarService = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateIntegrationComponent],
      imports: [GioTestingModule, IntegrationsModule, BrowserAnimationsModule, NoopAnimationsModule],
      providers: [
        {
          provide: SnackBarService,
          useValue: fakeSnackBarService,
        },
      ],
    })
      .overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true, // This traps focus checks and so avoid warnings when dealing with
          isTabbable: () => true, // This traps focus checks and so avoid warnings when dealing with
        },
      })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(CreateIntegrationComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    componentHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, CreateIntegrationHarness);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('choose provider', () => {
    it('should set correct value in reactive forms object', async () => {
      fixture.componentInstance.integrationProviders = {
        active: [{ name: 'AWS', icon: 'aws.svg', value: 'test_my_value' }],
      };

      let reactiveFormsValue = fixture.componentInstance.chooseProviderForm.controls.provider.getRawValue();
      expect(reactiveFormsValue).toEqual('');

      const radioButtonsGroup: MatRadioGroupHarness = await componentHarness.getRadioButtonsGroup();
      await radioButtonsGroup.checkRadioButton();

      reactiveFormsValue = fixture.componentInstance.chooseProviderForm.controls.provider.getRawValue();
      expect(reactiveFormsValue).toEqual('test_my_value');
    });

    it('should have correct numbers of radio buttons', async () => {
      fixture.componentInstance.integrationProviders = {
        active: [
          { name: 'AWS', icon: 'aws.svg', value: 'aws-api-gateway' },
          { name: 'Solace', icon: 'solace.svg', value: 'solace' },
          { name: 'Apigee', icon: 'apigee.svg', value: 'apigee' },
        ],
        comingSoon: [
          { name: 'Confluent', icon: 'confluent.svg', value: 'confluent' },
          { name: 'Azure', icon: 'azure.svg', value: 'azure' },
          { name: 'Kong', icon: 'kong.svg', value: 'kong' },
        ],
      };
      const radioButtonsGroup: MatRadioGroupHarness = await componentHarness.getRadioButtonsGroup();
      const radioButtons: MatRadioButtonHarness[] = await radioButtonsGroup.getRadioButtons();
      expect(radioButtons.length).toEqual(6);
    });

    it('should have not selected radio by default', async () => {
      const radioButtonsGroup: MatRadioGroupHarness = await componentHarness.getRadioButtonsGroup();
      const checked: MatRadioButtonHarness = await radioButtonsGroup.getCheckedRadioButton();
      expect(checked).toBe(null);
    });

    it('should disable button when no radio button selected', async () => {
      const submitFirstStepButton: MatButtonHarness = await componentHarness.getSubmitStepFirstButton();
      expect(await submitFirstStepButton.isDisabled()).toBe(true);
    });

    it('should show active button when form is active', async () => {
      const radioButtonsGroup: MatRadioGroupHarness = await componentHarness.getRadioButtonsGroup();
      await radioButtonsGroup.checkRadioButton();

      const submitFirstStepButton: MatButtonHarness = await componentHarness.getSubmitStepFirstButton();
      expect(await submitFirstStepButton.isDisabled()).toBe(false);
    });
  });

  describe('details form', () => {
    it('should not submit integration with too short name', async () => {
      await componentHarness.setName('');
      await componentHarness.setDescription('Some description');
      fixture.detectChanges();

      const error: MatErrorHarness = await componentHarness.matErrorMessage();
      expect(await error.getText()).toEqual('Integration name is required.');

      await componentHarness.clickOnSubmit();
      httpTestingController.expectNone(`${CONSTANTS_TESTING.env.v2BaseURL}/integrations`);
    });

    it('should not submit integration with too long name', async () => {
      await componentHarness.setName('test too long name 01234567890123456789012345678901234567890123456789');
      await componentHarness.setDescription('Test Description');
      fixture.detectChanges();

      const error: MatErrorHarness = await componentHarness.matErrorMessage();
      expect(await error.getText()).toEqual('Integration name has to be less than 50 characters long.');

      await componentHarness.clickOnSubmit();
      httpTestingController.expectNone(`${CONSTANTS_TESTING.env.v2BaseURL}/integrations`);
    });

    it('should not submit integration with too long description', async () => {
      await componentHarness.setName('test0');
      await componentHarness.setDescription(
        'TOO long description: loa hdvoiah dfopivioa fdo[ivu[au f[09vu a[09eu v9[ua09efu 0v9u e09fv u09qw uef09v uq0w9duf v0 qu0efdu 0vwu df09vu 0wduf09v wu0dfu v0 wud0fv uqw0 uf90v uw9efuv9wu efvu wqpefuvqwu e0fu v0wu ef0vu w0euf 0vqwu 0efu v0qwuef uvqw uefvru wfeuvwufvu w0  ufev',
      );
      await componentHarness.clickOnSubmit();
      httpTestingController.expectNone(`${CONSTANTS_TESTING.env.v2BaseURL}/integrations`);
    });

    it('should create integration with valid name', async () => {
      const expectedPayload: CreateIntegrationPayload = {
        name: 'TEST123',
        description: '',
        provider: '',
      };
      await componentHarness.setName('TEST123');
      await componentHarness.clickOnSubmit();
      expectIntegrationPostRequest(expectedPayload);
    });

    it('should create integration with description', async () => {
      const expectedPayload: CreateIntegrationPayload = {
        name: 'TEST123',
        description: 'Test Description',
        provider: '',
      };
      await componentHarness.setName('TEST123');
      await componentHarness.setDescription('Test Description');
      await componentHarness.clickOnSubmit();

      expectIntegrationPostRequest(expectedPayload);
    });

    it('should handle error with message', async () => {
      await componentHarness.setName('TEST123');
      await componentHarness.clickOnSubmit();

      expectIntegrationWithError();

      fixture.detectChanges();

      expect(fakeSnackBarService.error).toHaveBeenCalledWith('An error occurred. Integration not created');
    });
  });

  function expectIntegrationPostRequest(payload: CreateIntegrationPayload): void {
    const req = httpTestingController.expectOne(`${CONSTANTS_TESTING.env.v2BaseURL}/integrations`);
    req.flush([]);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(payload);
  }

  function expectIntegrationWithError(): void {
    const req = httpTestingController.expectOne(`${CONSTANTS_TESTING.env.v2BaseURL}/integrations`);
    expect(req.request.method).toEqual('POST');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
  }
});
