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

package io.gravitee.apim.core.integration.domain_service;

import io.gravitee.apim.core.integration.model.Integration;
import io.gravitee.apim.core.integration.model.IntegrationEntity;
import io.gravitee.common.component.LifecycleComponent;
import io.reactivex.rxjava3.core.Single;
import java.util.List;

/**
 * @author Remi Baptiste (remi.baptiste at graviteesource.com)
 * @author GraviteeSource Team
 */
public interface IntegrationDomainService extends LifecycleComponent<IntegrationDomainService> {
    void startIntegration(Integration integration);
    Single<List<IntegrationEntity>> getIntegrationEntities(Integration integration);

    Single<List<IntegrationEntity>> fetchEntities(Integration integration, List<IntegrationEntity> entities);
    void importEntities(List<String> entitiesId);
}