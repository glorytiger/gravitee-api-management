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

import io.gravitee.apim.core.integration.usecase.IntegrationGetEntitiesUsecase;
import io.gravitee.apim.core.integration.usecase.IntegrationImportUsecase;
import io.gravitee.common.http.MediaType;
import io.gravitee.rest.api.management.v2.rest.mapper.IntegrationMapper;
import io.gravitee.rest.api.management.v2.rest.model.IntegrationEntity;
import io.gravitee.rest.api.management.v2.rest.resource.AbstractResource;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.AsyncResponse;
import jakarta.ws.rs.container.Suspended;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Remi Baptiste (remi.baptiste at graviteesource.com)
 * @author GraviteeSource Team
 */
@Slf4j
@Path("/environments/{envId}/integrations/{integrationId}/entities")
public class IntegrationEntitiesResource extends AbstractResource {

    @Inject
    private IntegrationGetEntitiesUsecase integrationGetEntitiesUsecase;

    @Inject
    private IntegrationImportUsecase integrationImportUsecase;

    @PathParam("integrationId")
    String integrationId;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getIntegrationEntities(@Suspended final AsyncResponse response) {
        integrationGetEntitiesUsecase
            .execute(IntegrationGetEntitiesUsecase.Input.builder().integrationId(integrationId).build())
            .entities()
            .doOnSuccess(integrationEntities -> log.info("received entities {}", integrationEntities))
            .subscribe(response::resume, response::resume);
    }

    @POST
    @Path("_import")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void importIntegrationEntities(@Valid @NotNull List<IntegrationEntity> entities, @Suspended final AsyncResponse response) {
        var userDetails = getAuthenticatedUserDetails();

        var modelEntities = IntegrationMapper.INSTANCE.mapEntities(entities);
        integrationImportUsecase
            .execute(
                IntegrationImportUsecase.Input
                    .builder()
                    .integrationId(integrationId)
                    .entities(modelEntities)
                    .userId(userDetails.getUsername())
                    .build()
            )
            .status()
            .doOnSuccess(status -> log.info("received entities {}", status))
            .subscribe(response::resume, response::resume);
    }
}