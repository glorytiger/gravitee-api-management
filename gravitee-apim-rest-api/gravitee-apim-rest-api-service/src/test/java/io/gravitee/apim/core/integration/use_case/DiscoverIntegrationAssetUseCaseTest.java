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
package io.gravitee.apim.core.integration.use_case;

import static fixtures.core.model.RoleFixtures.apiPrimaryOwnerRoleId;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import fixtures.core.model.AuditInfoFixtures;
import fixtures.core.model.IntegrationAssetFixtures;
import fixtures.core.model.IntegrationFixture;
import inmemory.ApiCrudServiceInMemory;
import inmemory.ApiMetadataQueryServiceInMemory;
import inmemory.AuditCrudServiceInMemory;
import inmemory.FlowCrudServiceInMemory;
import inmemory.GroupQueryServiceInMemory;
import inmemory.InMemoryAlternative;
import inmemory.IndexerInMemory;
import inmemory.IntegrationAgentInMemory;
import inmemory.IntegrationCrudServiceInMemory;
import inmemory.MembershipCrudServiceInMemory;
import inmemory.MembershipQueryServiceInMemory;
import inmemory.MetadataCrudServiceInMemory;
import inmemory.NotificationConfigCrudServiceInMemory;
import inmemory.ParametersQueryServiceInMemory;
import inmemory.RoleQueryServiceInMemory;
import inmemory.UserCrudServiceInMemory;
import inmemory.WorkflowCrudServiceInMemory;
import io.gravitee.apim.core.api.domain_service.ApiIndexerDomainService;
import io.gravitee.apim.core.api.domain_service.ApiMetadataDecoderDomainService;
import io.gravitee.apim.core.api.domain_service.ApiMetadataDomainService;
import io.gravitee.apim.core.api.domain_service.CreateApiDomainService;
import io.gravitee.apim.core.api.domain_service.ValidateFederatedApiDomainService;
import io.gravitee.apim.core.api.model.Api;
import io.gravitee.apim.core.audit.domain_service.AuditDomainService;
import io.gravitee.apim.core.audit.model.AuditEntity;
import io.gravitee.apim.core.audit.model.AuditInfo;
import io.gravitee.apim.core.audit.model.event.ApiAuditEvent;
import io.gravitee.apim.core.audit.model.event.MembershipAuditEvent;
import io.gravitee.apim.core.exception.ValidationDomainException;
import io.gravitee.apim.core.integration.exception.IntegrationNotFoundException;
import io.gravitee.apim.core.integration.model.Asset;
import io.gravitee.apim.core.integration.model.Integration;
import io.gravitee.apim.core.membership.domain_service.ApiPrimaryOwnerDomainService;
import io.gravitee.apim.core.membership.domain_service.ApiPrimaryOwnerFactory;
import io.gravitee.apim.core.membership.model.Membership;
import io.gravitee.apim.core.membership.model.PrimaryOwnerEntity;
import io.gravitee.apim.core.policy.domain_service.PolicyValidationDomainService;
import io.gravitee.apim.core.search.model.IndexableApi;
import io.gravitee.apim.core.user.model.BaseUserEntity;
import io.gravitee.apim.infra.json.jackson.JacksonJsonDiffProcessor;
import io.gravitee.apim.infra.template.FreemarkerTemplateProcessor;
import io.gravitee.common.utils.TimeProvider;
import io.gravitee.definition.model.DefinitionVersion;
import io.gravitee.repository.management.model.Parameter;
import io.gravitee.repository.management.model.ParameterReferenceType;
import io.gravitee.rest.api.model.parameters.Key;
import io.gravitee.rest.api.model.settings.ApiPrimaryOwnerMode;
import io.gravitee.rest.api.service.common.UuidString;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;
import org.assertj.core.api.Assertions;
import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

class DiscoverIntegrationAssetUseCaseTest {

    private static final Instant INSTANT_NOW = Instant.parse("2023-10-22T10:15:30Z");
    private static final String INTEGRATION_ID = "integration-id";
    private static final String ORGANIZATION_ID = "organization-id";
    private static final String ENVIRONMENT_ID = "environment-id";
    private static final String USER_ID = "user-id";

    private static final AuditInfo AUDIT_INFO = AuditInfoFixtures.anAuditInfo(ORGANIZATION_ID, ENVIRONMENT_ID, USER_ID);

    PolicyValidationDomainService policyValidationDomainService = mock(PolicyValidationDomainService.class);
    ApiCrudServiceInMemory apiCrudService = new ApiCrudServiceInMemory();
    AuditCrudServiceInMemory auditCrudService = new AuditCrudServiceInMemory();
    GroupQueryServiceInMemory groupQueryService = new GroupQueryServiceInMemory();
    IntegrationCrudServiceInMemory integrationCrudService = new IntegrationCrudServiceInMemory();
    MembershipCrudServiceInMemory membershipCrudService = new MembershipCrudServiceInMemory();
    MetadataCrudServiceInMemory metadataCrudService = new MetadataCrudServiceInMemory();
    NotificationConfigCrudServiceInMemory notificationConfigCrudService = new NotificationConfigCrudServiceInMemory();
    ParametersQueryServiceInMemory parametersQueryService = new ParametersQueryServiceInMemory();
    RoleQueryServiceInMemory roleQueryService = new RoleQueryServiceInMemory();
    UserCrudServiceInMemory userCrudService = new UserCrudServiceInMemory();
    WorkflowCrudServiceInMemory workflowCrudService = new WorkflowCrudServiceInMemory();

    IntegrationAgentInMemory integrationAgent = new IntegrationAgentInMemory();
    IndexerInMemory indexer = new IndexerInMemory();

    ValidateFederatedApiDomainService validateFederatedApiDomainService = spy(new ValidateFederatedApiDomainService());
    DiscoverIntegrationAssetUseCase useCase;

    @BeforeAll
    static void beforeAll() {
        UuidString.overrideGenerator(() -> "generated-id");
        TimeProvider.overrideClock(Clock.fixed(INSTANT_NOW, ZoneId.systemDefault()));
    }

    @AfterAll
    static void afterAll() {
        UuidString.reset();
        TimeProvider.overrideClock(Clock.systemDefaultZone());
    }

    @BeforeEach
    void setUp() {
        var auditDomainService = new AuditDomainService(auditCrudService, userCrudService, new JacksonJsonDiffProcessor());

        var metadataQueryService = new ApiMetadataQueryServiceInMemory(metadataCrudService);
        var membershipQueryService = new MembershipQueryServiceInMemory(membershipCrudService);
        var apiPrimaryOwnerFactory = new ApiPrimaryOwnerFactory(
            groupQueryService,
            membershipQueryService,
            parametersQueryService,
            roleQueryService,
            userCrudService
        );

        var createApiDomainService = new CreateApiDomainService(
            apiCrudService,
            auditDomainService,
            new ApiIndexerDomainService(
                new ApiMetadataDecoderDomainService(metadataQueryService, new FreemarkerTemplateProcessor()),
                indexer
            ),
            new ApiMetadataDomainService(metadataCrudService, auditDomainService),
            new ApiPrimaryOwnerDomainService(
                auditDomainService,
                groupQueryService,
                membershipCrudService,
                membershipQueryService,
                roleQueryService,
                userCrudService
            ),
            new FlowCrudServiceInMemory(),
            notificationConfigCrudService,
            parametersQueryService,
            workflowCrudService
        );

        useCase =
            new DiscoverIntegrationAssetUseCase(
                integrationCrudService,
                apiPrimaryOwnerFactory,
                validateFederatedApiDomainService,
                createApiDomainService,
                integrationAgent
            );

        enableApiPrimaryOwnerMode(ApiPrimaryOwnerMode.USER);
        when(policyValidationDomainService.validateAndSanitizeConfiguration(any(), any()))
            .thenAnswer(invocation -> invocation.getArgument(1));

        roleQueryService.resetSystemRoles(ORGANIZATION_ID);
        givenExistingUsers(
            List.of(BaseUserEntity.builder().id(USER_ID).firstname("Jane").lastname("Doe").email("jane.doe@gravitee.io").build())
        );
    }

    @AfterEach
    void tearDown() {
        Stream
            .of(
                apiCrudService,
                auditCrudService,
                groupQueryService,
                integrationCrudService,
                membershipCrudService,
                parametersQueryService,
                userCrudService
            )
            .forEach(InMemoryAlternative::reset);
        reset(validateFederatedApiDomainService);
    }

    @Nested
    class FederatedApiCreation {

        @Test
        void should_create_and_index_a_federated_api() {
            // Given
            givenAnIntegration(IntegrationFixture.anIntegration(ENVIRONMENT_ID).withId(INTEGRATION_ID));
            givenAssets(
                IntegrationAssetFixtures
                    .anAssetForIntegration(INTEGRATION_ID)
                    .toBuilder()
                    .id("asset-1")
                    .name("api-1")
                    .description("my description")
                    .version("1.1.1")
                    .build()
            );

            // When
            useCase.execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO)).test().awaitDone(10, TimeUnit.SECONDS);

            // Then
            SoftAssertions.assertSoftly(soft -> {
                Api expectedApi = Api
                    .builder()
                    .id("generated-id")
                    .definitionVersion(DefinitionVersion.FEDERATED)
                    .name("api-1")
                    .description("my description")
                    .version("1.1.1")
                    .createdAt(INSTANT_NOW.atZone(ZoneId.systemDefault()))
                    .updatedAt(INSTANT_NOW.atZone(ZoneId.systemDefault()))
                    .environmentId(ENVIRONMENT_ID)
                    .lifecycleState(null)
                    .build();
                soft.assertThat(apiCrudService.storage()).containsExactlyInAnyOrder(expectedApi);
                soft
                    .assertThat(indexer.storage())
                    .containsExactly(
                        new IndexableApi(
                            expectedApi,
                            new PrimaryOwnerEntity(USER_ID, "jane.doe@gravitee.io", "Jane Doe", PrimaryOwnerEntity.Type.USER),
                            Map.of()
                        )
                    );
            });
        }

        @Test
        void should_create_an_audit() {
            // Given
            givenAnIntegration(IntegrationFixture.anIntegration(ENVIRONMENT_ID).withId(INTEGRATION_ID));
            givenAssets(IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID));

            // When
            useCase.execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO)).test().awaitDone(10, TimeUnit.SECONDS);

            // Then
            assertThat(auditCrudService.storage())
                .usingRecursiveFieldByFieldElementComparatorIgnoringFields("patch")
                .containsExactly(
                    // API Audit
                    AuditEntity
                        .builder()
                        .id("generated-id")
                        .organizationId(ORGANIZATION_ID)
                        .environmentId(ENVIRONMENT_ID)
                        .referenceType(AuditEntity.AuditReferenceType.API)
                        .referenceId("generated-id")
                        .user(USER_ID)
                        .properties(Collections.emptyMap())
                        .event(ApiAuditEvent.API_CREATED.name())
                        .createdAt(INSTANT_NOW.atZone(ZoneId.systemDefault()))
                        .build(),
                    // Membership Audit
                    AuditEntity
                        .builder()
                        .id("generated-id")
                        .organizationId(ORGANIZATION_ID)
                        .environmentId(ENVIRONMENT_ID)
                        .referenceType(AuditEntity.AuditReferenceType.API)
                        .referenceId("generated-id")
                        .user(USER_ID)
                        .properties(Map.of("USER", USER_ID))
                        .event(MembershipAuditEvent.MEMBERSHIP_CREATED.name())
                        .createdAt(INSTANT_NOW.atZone(ZoneId.systemDefault()))
                        .build()
                );
        }

        @ParameterizedTest
        @EnumSource(value = ApiPrimaryOwnerMode.class, mode = EnumSource.Mode.INCLUDE, names = { "USER", "HYBRID" })
        void should_create_primary_owner_membership_when_user_or_hybrid_mode_is_enabled(ApiPrimaryOwnerMode mode) {
            // Given
            enableApiPrimaryOwnerMode(mode);
            givenAnIntegration(IntegrationFixture.anIntegration(ENVIRONMENT_ID).withId(INTEGRATION_ID));
            givenAssets(IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID));

            // When
            useCase.execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO)).test().awaitDone(10, TimeUnit.SECONDS);

            // Then
            assertThat(membershipCrudService.storage())
                .contains(
                    Membership
                        .builder()
                        .id("generated-id")
                        .roleId(apiPrimaryOwnerRoleId(ORGANIZATION_ID))
                        .memberId(USER_ID)
                        .memberType(Membership.Type.USER)
                        .referenceId("generated-id")
                        .referenceType(Membership.ReferenceType.API)
                        .source("system")
                        .createdAt(INSTANT_NOW.atZone(ZoneId.systemDefault()))
                        .updatedAt(INSTANT_NOW.atZone(ZoneId.systemDefault()))
                        .build()
                );
        }

        @Test
        void should_not_create_default_metadata() {
            // Given
            givenAnIntegration(IntegrationFixture.anIntegration(ENVIRONMENT_ID).withId(INTEGRATION_ID));
            givenAssets(IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID));

            // When
            useCase.execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO)).test().awaitDone(10, TimeUnit.SECONDS);

            // Then
            assertThat(metadataCrudService.storage()).isEmpty();
        }

        @Test
        void should_not_create_default_email_notification_configuration() {
            // Given
            givenAnIntegration(IntegrationFixture.anIntegration(ENVIRONMENT_ID).withId(INTEGRATION_ID));
            givenAssets(IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID));

            // When
            useCase.execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO)).test().awaitDone(10, TimeUnit.SECONDS);

            // Then
            assertThat(notificationConfigCrudService.storage()).isEmpty();
        }

        @Test
        void should_ignore_api_review_mode() {
            // Given
            enableApiReview();
            givenAnIntegration(IntegrationFixture.anIntegration(ENVIRONMENT_ID).withId(INTEGRATION_ID));
            givenAssets(
                IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID).toBuilder().id("asset-1").name("api-1").build(),
                IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID).toBuilder().id("asset-2").name("api-2").build()
            );

            // When
            useCase
                .execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO))
                .test()
                .awaitDone(0, TimeUnit.SECONDS)
                .assertComplete();

            // Then
            assertThat(workflowCrudService.storage()).isEmpty();
        }

        private void enableApiReview() {
            parametersQueryService.define(
                new Parameter(Key.API_REVIEW_ENABLED.key(), ENVIRONMENT_ID, ParameterReferenceType.ENVIRONMENT, "true")
            );
        }
    }

    @Test
    void should_throw_when_no_integration_is_found() {
        // When
        var obs = useCase.execute(new DiscoverIntegrationAssetUseCase.Input("unknown", AUDIT_INFO)).test();

        // Then
        obs.assertError(IntegrationNotFoundException.class);
    }

    @Test
    void should_do_nothing_when_no_asset_to_import() {
        // Given
        givenAnIntegration(IntegrationFixture.anIntegration().withId(INTEGRATION_ID));

        // When
        useCase.execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO)).test().awaitDone(10, TimeUnit.SECONDS);

        // Then
        Assertions.assertThat(apiCrudService.storage()).isEmpty();
    }

    @Test
    void should_create_a_federated_api_for_each_asset() {
        // Given
        givenAnIntegration(IntegrationFixture.anIntegration(ENVIRONMENT_ID).withId(INTEGRATION_ID));
        givenAssets(
            IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID).toBuilder().id("asset-1").name("api-1").build(),
            IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID).toBuilder().id("asset-2").name("api-2").build()
        );

        // When
        useCase
            .execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO))
            .test()
            .awaitDone(0, TimeUnit.SECONDS)
            .assertComplete();

        // Then
        Assertions.assertThat(apiCrudService.storage()).extracting(Api::getName).containsExactlyInAnyOrder("api-1", "api-2");
    }

    @Test
    void should_skip_creating_federated_api_when_validation_fails() {
        // Given
        givenAnIntegration(IntegrationFixture.anIntegration(ENVIRONMENT_ID).withId(INTEGRATION_ID));
        givenAssets(
            IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID).toBuilder().id("asset-1").name("api-1").build(),
            IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID).toBuilder().id("asset-2").name("api-2").build(),
            IntegrationAssetFixtures.anAssetForIntegration(INTEGRATION_ID).toBuilder().id("asset-3").name("api-3").build()
        );
        doThrow(new ValidationDomainException("validation failed"))
            .when(validateFederatedApiDomainService)
            .validateAndSanitizeForCreation(argThat(api -> api.getName().equals("api-2")));

        // When
        useCase
            .execute(new DiscoverIntegrationAssetUseCase.Input(INTEGRATION_ID, AUDIT_INFO))
            .test()
            .awaitDone(0, TimeUnit.SECONDS)
            .assertComplete();

        // Then
        Assertions.assertThat(apiCrudService.storage()).extracting(Api::getName).containsExactlyInAnyOrder("api-1", "api-3");
    }

    private void givenAnIntegration(Integration integration) {
        integrationCrudService.initWith(List.of(integration));
    }

    private void givenAssets(Asset... assets) {
        integrationAgent.initWith(List.of(assets));
    }

    private void givenExistingUsers(List<BaseUserEntity> users) {
        userCrudService.initWith(users);
    }

    private void enableApiPrimaryOwnerMode(ApiPrimaryOwnerMode mode) {
        parametersQueryService.initWith(
            List.of(new Parameter(Key.API_PRIMARY_OWNER_MODE.key(), ENVIRONMENT_ID, ParameterReferenceType.ENVIRONMENT, mode.name()))
        );
    }
}
