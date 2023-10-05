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
package io.gravitee.rest.api.management.rest.spring;

import inmemory.*;
import io.gravitee.apim.core.environment.crud_service.EnvironmentCrudService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InMemoryConfiguration {

    @Bean
    public ApplicationCrudServiceInMemory applicationRepository() {
        return new ApplicationCrudServiceInMemory();
    }

    @Bean
    public ConnectionLogCrudServiceInMemory connectionLogRepository() {
        return new ConnectionLogCrudServiceInMemory();
    }

    @Bean
    public MessageLogCrudServiceInMemory messageLogRepository() {
        return new MessageLogCrudServiceInMemory();
    }

    @Bean
    public PlanCrudServiceInMemory planRepository() {
        return new PlanCrudServiceInMemory();
    }

    @Bean
    public EnvironmentCrudService environmentCrudService() {
        return new EnvironmentCrudServiceInMemory();
    }

    @Bean
    public ApiSearchServiceInMemory apiSearchServiceInMemory() {
        return new ApiSearchServiceInMemory();
    }

    @Bean
    public PageQueryServiceInMemory pageQueryServiceInMemory() {
        return new PageQueryServiceInMemory();
    }
}