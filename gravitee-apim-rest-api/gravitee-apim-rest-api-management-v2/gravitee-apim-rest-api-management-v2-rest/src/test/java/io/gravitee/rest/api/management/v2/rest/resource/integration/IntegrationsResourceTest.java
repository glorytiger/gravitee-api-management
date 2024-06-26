/*
 * Copyright © 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.gravitee.rest.api.management.v2.rest.resource.integration;

import static assertions.MAPIAssertions.assertThat;
import static io.gravitee.common.http.HttpStatusCode.OK_200;

import fixtures.core.model.IntegrationFixture;
import io.gravitee.common.http.HttpStatusCode;
import io.gravitee.rest.api.management.v2.rest.model.*;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Response;
import java.time.ZonedDateTime;
import java.util.stream.IntStream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

public class IntegrationsResourceTest extends IntegrationResourceTest {

    @Nested
    class CreateIntegrations {

        @Test
        public void should_create_integration() {
            //Given
            var createIntegration = CreateIntegration
                .builder()
                .name(INTEGRATION_NAME)
                .description(INTEGRATION_DESCRIPTION)
                .provider(INTEGRATION_PROVIDER)
                .build();

            //When
            Response response = target.request().post(Entity.json(createIntegration));

            //Then

            assertThat(response)
                .hasStatus(HttpStatusCode.CREATED_201)
                .asEntity(Integration.class)
                .isEqualTo(
                    Integration
                        .builder()
                        .id(INTEGRATION_ID)
                        .name(INTEGRATION_NAME)
                        .description(INTEGRATION_DESCRIPTION)
                        .provider(INTEGRATION_PROVIDER)
                        .agentStatus(Integration.AgentStatusEnum.DISCONNECTED)
                        .build()
                );
        }

        @Test
        public void should_throw_bad_request_when_name_is_missing() {
            //Given
            CreateIntegration createIntegration = CreateIntegration
                .builder()
                .description(INTEGRATION_DESCRIPTION)
                .provider(INTEGRATION_PROVIDER)
                .build();

            //When
            Response response = target.request().post(Entity.json(createIntegration));

            //Then
            assertThat(response).hasStatus(HttpStatusCode.BAD_REQUEST_400);
        }

        @Test
        public void should_throw_bad_request_when_payload_is_empty() {
            //When
            Response response = target.request().post(Entity.json(null));

            //Then
            assertThat(response).hasStatus(HttpStatusCode.BAD_REQUEST_400);
        }
    }

    @Nested
    class ListIntegrations {

        @BeforeEach
        void setup() {
            var integration = IntStream.range(0, 15).mapToObj(i -> IntegrationFixture.anIntegration()).toList();
            integrationCrudServiceInMemory.initWith(integration);
        }

        @Test
        public void get_first_page_of_integrations_for_specific_env_id() {
            var integrationOtherEnv = IntegrationFixture.anIntegration("other-env");
            integrationCrudServiceInMemory.create(integrationOtherEnv);

            //When
            Response response = target.queryParam("page", 1).queryParam("perPage", 5).request().get();

            //Then
            assertThat(response)
                .hasStatus(HttpStatusCode.OK_200)
                .asEntity(IntegrationsResponse.class)
                .extracting(IntegrationsResponse::getPagination)
                .isEqualTo(Pagination.builder().page(1).perPage(5).pageItemsCount(5).pageCount(3).totalCount(15L).build());
        }

        @Test
        public void get_second_page_of_integrations() {
            //When
            Response response = target.queryParam("page", 2).queryParam("perPage", 2).request().get();

            //Then
            assertThat(response)
                .hasStatus(HttpStatusCode.OK_200)
                .asEntity(IntegrationsResponse.class)
                .extracting(IntegrationsResponse::getPagination)
                .isEqualTo(Pagination.builder().page(2).perPage(2).pageItemsCount(2).pageCount(8).totalCount(15L).build());
        }

        @Test
        public void get_first_page_with_page_size_10_when_pagination_param_missing() {
            //When
            Response response = target.request().get();

            //Then
            assertThat(response)
                .hasStatus(HttpStatusCode.OK_200)
                .asEntity(IntegrationsResponse.class)
                .extracting(IntegrationsResponse::getPagination)
                .isEqualTo(Pagination.builder().page(1).perPage(10).pageItemsCount(10).pageCount(2).totalCount(15L).build());
        }

        @Test
        public void get_sorted_list_of_integrations() {
            //Given
            var name = "most-recent-integration";
            var description = "should-be-returned-first";
            var provider = "test-provider";
            var recentDate = ZonedDateTime.parse("2024-02-03T20:22:02.00Z");
            var integration = IntegrationFixture.BASE
                .get()
                .name(name)
                .description(description)
                .provider(provider)
                .createdAt(recentDate)
                .updatedAt(recentDate)
                .build();
            integrationCrudServiceInMemory.create(integration);

            //When
            Response response = target.request().get();

            //Then
            assertThat(response)
                .hasStatus(HttpStatusCode.OK_200)
                .asEntity(IntegrationsResponse.class)
                .extracting(IntegrationsResponse::getData)
                .extracting(integrations -> integrations.get(0))
                .isEqualTo(
                    Integration
                        .builder()
                        .id(INTEGRATION_ID)
                        .name(name)
                        .description(description)
                        .provider(provider)
                        .agentStatus(Integration.AgentStatusEnum.DISCONNECTED)
                        .build()
                );
        }

        @Test
        void should_compute_links() {
            Response response = target.queryParam("page", 2).queryParam("perPage", 5).request().get();

            assertThat(response)
                .hasStatus(OK_200)
                .asEntity(ApiLogsResponse.class)
                .extracting(ApiLogsResponse::getLinks)
                .isEqualTo(
                    Links
                        .builder()
                        .self(target.queryParam("page", 2).queryParam("perPage", 5).getUri().toString())
                        .first(target.queryParam("page", 1).queryParam("perPage", 5).getUri().toString())
                        .last(target.queryParam("page", 3).queryParam("perPage", 5).getUri().toString())
                        .previous(target.queryParam("page", 1).queryParam("perPage", 5).getUri().toString())
                        .next(target.queryParam("page", 3).queryParam("perPage", 5).getUri().toString())
                        .build()
                );
        }
    }
}
