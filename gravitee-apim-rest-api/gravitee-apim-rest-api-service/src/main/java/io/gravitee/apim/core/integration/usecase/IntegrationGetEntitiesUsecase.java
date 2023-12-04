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

package io.gravitee.apim.core.integration.usecase;

import io.gravitee.apim.core.integration.crud_service.IntegrationCrudService;
import io.gravitee.apim.core.integration.domain_service.IntegrationDomainService;
import io.gravitee.apim.core.integration.model.IntegrationEntity;
import io.reactivex.rxjava3.core.Flowable;
import lombok.Builder;

/**
 * @author Remi Baptiste (remi.baptiste at graviteesource.com)
 * @author GraviteeSource Team
 */
public class IntegrationGetEntitiesUsecase {

    private IntegrationDomainService integrationDomainService;

    private IntegrationCrudService integrationCrudService;

    public IntegrationGetEntitiesUsecase(IntegrationDomainService integrationDomainService, IntegrationCrudService integrationCrudService) {
        this.integrationDomainService = integrationDomainService;
        this.integrationCrudService = integrationCrudService;
    }

    public IntegrationGetEntitiesUsecase.Output execute(IntegrationGetEntitiesUsecase.Input input) {
        var integrationId = input.integrationId();

        var integration = integrationCrudService.get(integrationId);

        return new IntegrationGetEntitiesUsecase.Output(integrationDomainService.getIntegrationEntities(integration));
    }

    @Builder
    public record Input(String integrationId) {}

    public record Output(Flowable<IntegrationEntity> entities) {}
}
