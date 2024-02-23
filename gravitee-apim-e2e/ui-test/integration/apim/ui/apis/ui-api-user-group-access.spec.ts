// api-ug-access-add-members

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
import { ADMIN_USER, API_PUBLISHER_USER } from '@fakers/users/users';
import ApiDetails from 'ui-test/support/PageObjects/Apis/ApiDetails';
import UserGroupAccess from 'ui-test/support/PageObjects/Apis/UserGroupAccess';
import { HttpListener, MAPIV2ApisFaker } from '@gravitee/fixtures/management/MAPIV2ApisFaker';
import { ApiType, ApiV4, FlowV4 } from '@gravitee/management-v2-webclient-sdk/src/lib';

const envId = 'DEFAULT';

describe('API User & Group Access Page functionality', () => {
  let v4Api: ApiV4;
  const apiDetails = new ApiDetails();
  const userGroupAccess = new UserGroupAccess();
  const httpListener1: HttpListener = MAPIV2ApisFaker.newHttpListener();

  beforeEach(() => {
    cy.loginInAPIM(ADMIN_USER.username, ADMIN_USER.password);
    cy.visit('/#!/default/apis/');
    cy.url().should('include', '/apis/');
  });

  before(() => {
    cy.log('Create v4 API for Info');
    cy.request({
      method: 'POST',
      url: `${Cypress.env('managementApi')}/management/v2/environments/DEFAULT/apis`,
      auth: { username: API_PUBLISHER_USER.username, password: API_PUBLISHER_USER.password },
      body: MAPIV2ApisFaker.newApi({
        type: ApiType.PROXY,
        listeners: [httpListener1],
        endpointGroups: [MAPIV2ApisFaker.newHttpEndpointGroup()],
      }),
    }).then((response) => {
      expect(response.status).to.eq(201);
      v4Api = response.body;
    });
  });

  it('Verify User & Group Access Page Elements', () => {
    cy.visit(`/#!/DEFAULT/apis/${v4Api.id}`);
    apiDetails.policyStudioMenuItem().should('be.visible');
    apiDetails.infoMenuItem().should('be.visible');
    apiDetails.plansMenuItem().should('be.visible');
    apiDetails.userAndGroupAccessMenuItem().click();
    cy.get(`[href="#!/default/apis/${v4Api.id}/members"]`).should('be.visible');
    cy.get(`[href="#!/default/apis/${v4Api.id}/groups"]`).should('be.visible');
    cy.get(`[href="#!/default/apis/${v4Api.id}/transfer-ownership"]`).should('be.visible');
    cy.url().should('include', '/members');
    cy.contains('Add members').should('be.visible')
    // cy.getByDataTestId('api_usergroup_add_members').should('be.visible');
    // cy.getByDataTestId('api_usergroup_notify_toggle').should('be.visible');
    // cy.getByDataTestId('api-ug-access-members-table').should('be.visible');
  });

  after(() => {
    cy.clearCookie('Auth-Graviteeio-APIM');
    cy.log('Clean up APIs');
    cy.teardownV4Api(v4Api.id);
  });
});
