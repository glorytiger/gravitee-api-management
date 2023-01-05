/**
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
package io.gravitee.gateway.jupiter.handlers.api.v4;

import static io.gravitee.common.component.Lifecycle.State.STOPPED;
import static io.gravitee.common.http.HttpStatusCode.GATEWAY_TIMEOUT_504;
import static io.gravitee.gateway.jupiter.api.ExecutionPhase.MESSAGE_RESPONSE;
import static io.gravitee.gateway.jupiter.api.ExecutionPhase.RESPONSE;
import static io.gravitee.gateway.jupiter.api.context.InternalContextAttributes.ATTR_INTERNAL_INVOKER;
import static io.gravitee.gateway.jupiter.api.context.InternalContextAttributes.ATTR_INTERNAL_INVOKER_SKIP;
import static io.gravitee.gateway.jupiter.handlers.api.v4.DefaultApiReactor.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.*;

import io.gravitee.common.component.Lifecycle;
import io.gravitee.definition.model.v4.listener.http.HttpListener;
import io.gravitee.definition.model.v4.listener.http.Path;
import io.gravitee.definition.model.v4.listener.subscription.SubscriptionListener;
import io.gravitee.gateway.api.handler.Handler;
import io.gravitee.gateway.api.proxy.ProxyConnection;
import io.gravitee.gateway.api.stream.ReadWriteStream;
import io.gravitee.gateway.core.component.CompositeComponentProvider;
import io.gravitee.gateway.env.RequestTimeoutConfiguration;
import io.gravitee.gateway.jupiter.api.ApiType;
import io.gravitee.gateway.jupiter.api.ExecutionFailure;
import io.gravitee.gateway.jupiter.api.ExecutionPhase;
import io.gravitee.gateway.jupiter.api.connector.entrypoint.async.EntrypointAsyncConnector;
import io.gravitee.gateway.jupiter.api.context.ContextAttributes;
import io.gravitee.gateway.jupiter.api.context.ExecutionContext;
import io.gravitee.gateway.jupiter.api.context.InternalContextAttributes;
import io.gravitee.gateway.jupiter.core.context.DefaultDeploymentContext;
import io.gravitee.gateway.jupiter.core.context.MutableExecutionContext;
import io.gravitee.gateway.jupiter.core.context.MutableRequest;
import io.gravitee.gateway.jupiter.core.context.MutableResponse;
import io.gravitee.gateway.jupiter.core.context.interruption.InterruptionException;
import io.gravitee.gateway.jupiter.core.context.interruption.InterruptionFailureException;
import io.gravitee.gateway.jupiter.core.processor.ProcessorChain;
import io.gravitee.gateway.jupiter.core.v4.endpoint.EndpointManager;
import io.gravitee.gateway.jupiter.core.v4.entrypoint.DefaultEntrypointConnectorResolver;
import io.gravitee.gateway.jupiter.core.v4.invoker.EndpointInvoker;
import io.gravitee.gateway.jupiter.handlers.api.adapter.invoker.ConnectionHandlerAdapter;
import io.gravitee.gateway.jupiter.handlers.api.v4.flow.FlowChainFactory;
import io.gravitee.gateway.jupiter.handlers.api.v4.processor.ApiProcessorChainFactory;
import io.gravitee.gateway.jupiter.handlers.api.v4.security.SecurityChain;
import io.gravitee.gateway.jupiter.policy.PolicyManager;
import io.gravitee.gateway.jupiter.reactor.v4.subscription.SubscriptionAcceptor;
import io.gravitee.gateway.reactor.handler.Acceptor;
import io.gravitee.gateway.reactor.handler.HttpAcceptor;
import io.gravitee.gateway.resource.ResourceLifecycleManager;
import io.gravitee.node.api.Node;
import io.gravitee.node.api.configuration.Configuration;
import io.gravitee.plugin.endpoint.EndpointConnectorPluginManager;
import io.gravitee.plugin.entrypoint.EntrypointConnectorPluginManager;
import io.gravitee.reporter.api.http.Metrics;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.reactivex.rxjava3.core.Completable;
import io.reactivex.rxjava3.core.CompletableEmitter;
import io.reactivex.rxjava3.core.CompletableObserver;
import io.reactivex.rxjava3.observers.TestObserver;
import io.reactivex.rxjava3.plugins.RxJavaPlugins;
import io.reactivex.rxjava3.schedulers.TestScheduler;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.function.Try;
import org.junit.platform.commons.util.ReflectionUtils;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class DefaultApiReactorTest {

    public static final Long REQUEST_TIMEOUT = 200L;
    public static final Long REQUEST_TIMEOUT_GRACE_DELAY = 30L;
    public static final String CONTEXT_PATH = "context-path";
    public static final String API_ID = "api-id";
    public static final String ORGANIZATION_ID = "organization-id";
    public static final String ENVIRONMENT_ID = "environment-id";

    @Spy
    Completable spyRequestPlatformFlowChain = Completable.complete();

    @Spy
    Completable spyMessageRequestPlatformFlowChain = Completable.complete();

    @Spy
    Completable spyResponsePlatformFlowChain = Completable.complete();

    @Spy
    Completable spyMessageResponsePlatformFlowChain = Completable.complete();

    @Spy
    Completable spyRequestPlanFlowChain = Completable.complete();

    @Spy
    Completable spyMessageRequestPlanFlowChain = Completable.complete();

    @Spy
    Completable spyResponsePlanFlowChain = Completable.complete();

    @Spy
    Completable spyMessageResponsePlanFlowChain = Completable.complete();

    @Spy
    Completable spyRequestApiFlowChain = Completable.complete();

    @Spy
    Completable spyMessageRequestApiFlowChain = Completable.complete();

    @Spy
    Completable spyResponseApiFlowChain = Completable.complete();

    @Spy
    Completable spyMessageResponseApiFlowChain = Completable.complete();

    @Spy
    Completable spyEntrypointRequest = Completable.complete();

    @Spy
    Completable spyEntrypointResponse = Completable.complete();

    @Spy
    Completable spyBeforeHandleProcessors = Completable.complete();

    @Spy
    Completable spyAfterHandleProcessors = Completable.complete();

    @Spy
    Completable spyBeforeApiFlowsProcessors = Completable.complete();

    @Spy
    Completable spyAfterApiFlowsProcessors = Completable.complete();

    @Spy
    Completable spyOnErrorProcessors = Completable.complete();

    @Spy
    Completable spyOnMessageProcessors = Completable.complete();

    @Spy
    Completable spyInvokerChain = Completable.complete();

    @Spy
    Completable spyInterruptionFailureException = Completable.error(new InterruptionFailureException(mock(ExecutionFailure.class)));

    @Spy
    Completable spyInterruptionException = Completable.error(new InterruptionException());

    @Spy
    Completable spySecurityChain = Completable.complete();

    @Spy
    Completable spyResponseEnd = Completable.complete();

    @Spy
    ResourceLifecycleManager resourceLifecycleManager;

    @Mock
    Configuration configuration;

    @Mock
    Node node;

    @Mock
    private Api api;

    @Mock
    private io.gravitee.definition.model.v4.Api apiDefinition;

    @Mock
    private CompositeComponentProvider apiComponentProvider;

    @Mock
    private PolicyManager policyManager;

    @Mock
    private DefaultEntrypointConnectorResolver entrypointConnectorResolver;

    @Mock
    private EntrypointConnectorPluginManager entrypointConnectorPluginManager;

    @Mock
    private EndpointConnectorPluginManager endpointConnectorPluginManager;

    @Mock
    private EndpointManager endpointManager;

    @Mock
    private EndpointInvoker defaultInvoker;

    @Mock
    private io.gravitee.gateway.jupiter.handlers.api.flow.FlowChainFactory flowChainFactory;

    @Mock
    private FlowChainFactory v4FlowChainFactory;

    @Mock
    private ApiProcessorChainFactory apiProcessorChainFactory;

    @Mock
    private ProcessorChain beforeHandleProcessors;

    @Mock
    private ProcessorChain afterHandleProcessors;

    @Mock
    private ProcessorChain beforeApiFlowsProcessors;

    @Mock
    private ProcessorChain afterApiFlowsProcessors;

    @Mock
    private ProcessorChain onErrorProcessors;

    @Mock
    private ProcessorChain onMessageProcessors;

    @Mock
    private MutableExecutionContext ctx;

    @Mock
    private MutableRequest request;

    @Mock
    private MutableResponse response;

    @Mock
    private EntrypointAsyncConnector entrypointConnector;

    @Mock
    private io.gravitee.gateway.jupiter.handlers.api.flow.FlowChain platformFlowChain;

    @Mock
    private io.gravitee.gateway.jupiter.handlers.api.v4.flow.FlowChain apiPlanFlowChain;

    @Mock
    private io.gravitee.gateway.jupiter.handlers.api.v4.flow.FlowChain apiFlowChain;

    @Mock
    private SecurityChain securityChain;

    @Mock
    private RequestTimeoutConfiguration requestTimeoutConfiguration;

    private TestScheduler testScheduler;

    private DefaultApiReactor cut;

    @BeforeEach
    public void init() throws Exception {
        lenient().when(ctx.request()).thenReturn(request);
        lenient().when(ctx.response()).thenReturn(response);
        lenient().when(ctx.getInternalAttribute(ATTR_INTERNAL_INVOKER)).thenReturn(defaultInvoker);
        lenient().when(ctx.getInternalAttribute(ATTR_INTERNAL_INVOKER_SKIP)).thenReturn(false);

        lenient().when(request.contextPath()).thenReturn("/contextPath");
        lenient().when(request.timestamp()).thenReturn(System.currentTimeMillis());
        lenient().when(request.metrics()).thenReturn(mock(Metrics.class));
        lenient().when(response.end()).thenReturn(Completable.complete());
        lenient().when(ctx.response()).thenReturn(response);
        lenient().when(ctx.componentProvider(any())).thenReturn(ctx);
        lenient().when(ctx.templateVariableProviders(any())).thenReturn(ctx);
        lenient().when(ctx.interruptWith(any())).thenReturn(spyInterruptionFailureException);
        lenient().when(ctx.interrupt()).thenReturn(spyInterruptionException);

        lenient().when(request.contextPath()).thenReturn(CONTEXT_PATH);
        lenient().when(api.getDefinition()).thenReturn(apiDefinition);
        lenient().when(api.getId()).thenReturn(API_ID);
        lenient().when(api.getDeployedAt()).thenReturn(new Date());
        lenient().when(api.getOrganizationId()).thenReturn(ORGANIZATION_ID);
        lenient().when(api.getEnvironmentId()).thenReturn(ENVIRONMENT_ID);
        lenient().when(apiDefinition.getType()).thenReturn(io.gravitee.definition.model.v4.ApiType.ASYNC);
        lenient().when(apiProcessorChainFactory.beforeHandle(api)).thenReturn(beforeHandleProcessors);
        lenient().when(apiProcessorChainFactory.afterHandle(api)).thenReturn(afterHandleProcessors);
        lenient().when(apiProcessorChainFactory.beforeApiExecution(api)).thenReturn(beforeApiFlowsProcessors);
        lenient().when(apiProcessorChainFactory.afterApiExecution(api)).thenReturn(afterApiFlowsProcessors);
        lenient().when(apiProcessorChainFactory.onError(api)).thenReturn(onErrorProcessors);
        lenient().when(apiProcessorChainFactory.onMessage(api)).thenReturn(onMessageProcessors);

        lenient().when(flowChainFactory.createPlatformFlow(api)).thenReturn(platformFlowChain);
        lenient().when(platformFlowChain.execute(ctx, ExecutionPhase.REQUEST)).thenReturn(spyRequestPlatformFlowChain);
        lenient().when(platformFlowChain.execute(ctx, ExecutionPhase.MESSAGE_REQUEST)).thenReturn(spyMessageRequestPlatformFlowChain);
        lenient().when(platformFlowChain.execute(ctx, ExecutionPhase.RESPONSE)).thenReturn(spyResponsePlatformFlowChain);
        lenient().when(platformFlowChain.execute(ctx, ExecutionPhase.MESSAGE_RESPONSE)).thenReturn(spyMessageResponsePlatformFlowChain);
        lenient().when(securityChain.execute(any())).thenReturn(spySecurityChain);
        lenient().when(v4FlowChainFactory.createPlanFlow(api)).thenReturn(apiPlanFlowChain);
        lenient().when(apiPlanFlowChain.execute(ctx, ExecutionPhase.REQUEST)).thenReturn(spyRequestPlanFlowChain);
        lenient().when(apiPlanFlowChain.execute(ctx, ExecutionPhase.MESSAGE_REQUEST)).thenReturn(spyMessageRequestPlanFlowChain);
        lenient().when(apiPlanFlowChain.execute(ctx, ExecutionPhase.RESPONSE)).thenReturn(spyResponsePlanFlowChain);
        lenient().when(apiPlanFlowChain.execute(ctx, ExecutionPhase.MESSAGE_RESPONSE)).thenReturn(spyMessageResponsePlanFlowChain);
        lenient().when(v4FlowChainFactory.createApiFlow(api)).thenReturn(apiFlowChain);
        lenient().when(apiFlowChain.execute(ctx, ExecutionPhase.REQUEST)).thenReturn(spyRequestApiFlowChain);
        lenient().when(apiFlowChain.execute(ctx, ExecutionPhase.MESSAGE_REQUEST)).thenReturn(spyMessageRequestApiFlowChain);
        lenient().when(apiFlowChain.execute(ctx, ExecutionPhase.RESPONSE)).thenReturn(spyResponseApiFlowChain);
        lenient().when(apiFlowChain.execute(ctx, ExecutionPhase.MESSAGE_RESPONSE)).thenReturn(spyMessageResponseApiFlowChain);

        lenient().when(beforeHandleProcessors.execute(ctx, ExecutionPhase.REQUEST)).thenReturn(spyBeforeHandleProcessors);
        lenient().when(afterHandleProcessors.execute(ctx, RESPONSE)).thenReturn(spyAfterHandleProcessors);
        lenient().when(beforeApiFlowsProcessors.execute(ctx, ExecutionPhase.REQUEST)).thenReturn(spyBeforeApiFlowsProcessors);
        lenient().when(afterApiFlowsProcessors.execute(ctx, ExecutionPhase.RESPONSE)).thenReturn(spyAfterApiFlowsProcessors);
        lenient().when(onErrorProcessors.execute(ctx, ExecutionPhase.RESPONSE)).thenReturn(spyOnErrorProcessors);
        lenient().when(onMessageProcessors.execute(ctx, MESSAGE_RESPONSE)).thenReturn(spyOnMessageProcessors);

        lenient().when(beforeHandleProcessors.getId()).thenReturn("mockBeforeHandleProcessors");
        lenient().when(afterHandleProcessors.getId()).thenReturn("mockBeforeHandleProcessors");
        lenient().when(beforeApiFlowsProcessors.getId()).thenReturn("mockBeforeApiFlowsProcessors");
        lenient().when(afterApiFlowsProcessors.getId()).thenReturn("mockAfterApiFlowsProcessors");
        lenient().when(onErrorProcessors.getId()).thenReturn("mockOnErrorProcessors");
        lenient().when(onMessageProcessors.getId()).thenReturn("mockOnMessageProcessors");

        lenient().when(defaultInvoker.invoke(any(ExecutionContext.class))).thenReturn(spyInvokerChain);
        lenient().when(ctx.getInternalAttribute(InternalContextAttributes.ATTR_INTERNAL_INVOKER)).thenReturn(defaultInvoker);
        lenient().when(entrypointConnector.handleRequest(ctx)).thenReturn(spyEntrypointRequest);
        lenient().when(entrypointConnector.handleResponse(ctx)).thenReturn(spyEntrypointResponse);

        lenient().when(response.end()).thenReturn(spyResponseEnd);
        lenient().when(entrypointConnectorResolver.resolve(ctx)).thenReturn(entrypointConnector);
        lenient()
            .when(ctx.getInternalAttribute(InternalContextAttributes.ATTR_INTERNAL_ENTRYPOINT_CONNECTOR))
            .thenReturn(entrypointConnector);
        lenient().when(entrypointConnector.supportedApi()).thenReturn(ApiType.ASYNC);

        when(configuration.getProperty(SERVICES_TRACING_ENABLED_PROPERTY, Boolean.class, false)).thenReturn(false);
        when(configuration.getProperty(PENDING_REQUESTS_TIMEOUT_PROPERTY, Long.class, 10_000L)).thenReturn(10_000L);

        lenient().when(requestTimeoutConfiguration.getRequestTimeout()).thenReturn(0L);
        lenient().when(requestTimeoutConfiguration.getRequestTimeoutGraceDelay()).thenReturn(10000L);

        cut = buildApiReactor();

        testScheduler = new TestScheduler();
        RxJavaPlugins.setComputationSchedulerHandler(s -> testScheduler);
    }

    private DefaultApiReactor buildApiReactor() {
        DefaultApiReactor defaultApiReactor = null;
        try {
            defaultApiReactor =
                new DefaultApiReactor(
                    api,
                    new DefaultDeploymentContext(),
                    apiComponentProvider,
                    new ArrayList<>(),
                    policyManager,
                    entrypointConnectorPluginManager,
                    endpointConnectorPluginManager,
                    endpointManager,
                    resourceLifecycleManager,
                    apiProcessorChainFactory,
                    flowChainFactory,
                    v4FlowChainFactory,
                    configuration,
                    node,
                    requestTimeoutConfiguration
                );
            ReflectionTestUtils.setField(defaultApiReactor, "entrypointConnectorResolver", entrypointConnectorResolver);
            ReflectionTestUtils.setField(defaultApiReactor, "defaultInvoker", defaultInvoker);
            defaultApiReactor.doStart();
            ReflectionTestUtils.setField(defaultApiReactor, "securityChain", securityChain);
        } catch (Exception e) {
            fail(e);
        }
        return defaultApiReactor;
    }

    @Test
    void shouldPrepareContextAttributes() {
        cut.handle(ctx).test().assertComplete();

        verify(ctx).setAttribute(ContextAttributes.ATTR_CONTEXT_PATH, CONTEXT_PATH);
        verify(ctx).setAttribute(ContextAttributes.ATTR_API, API_ID);
        verify(ctx).setAttribute(ContextAttributes.ATTR_ORGANIZATION, ORGANIZATION_ID);
        verify(ctx).setAttribute(ContextAttributes.ATTR_ENVIRONMENT, ENVIRONMENT_ID);
        verify(ctx).setInternalAttribute(ContextAttributes.ATTR_API, api);
    }

    @Test
    void shouldInterruptWith404FailureWhenNoEntrypoint() {
        when(entrypointConnectorResolver.resolve(ctx)).thenReturn(null);

        cut.handle(ctx).test().assertComplete();

        final ArgumentCaptor<ExecutionFailure> failureArgumentCaptor = ArgumentCaptor.forClass(ExecutionFailure.class);
        verify(ctx, atLeastOnce()).interruptWith(failureArgumentCaptor.capture());

        // 404 isn't directly set on the response status as it is more a job for the error processor chain.
        // The only way to assert here is to check the context has been interrupted with a failure.
        final ExecutionFailure executionFailure = failureArgumentCaptor.getValue();
        assertThat(executionFailure.statusCode()).isEqualTo(404);
        assertThat(executionFailure.message()).isEqualTo("No entrypoint matches the incoming request");

        verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldExecuteRequestAndResponsePhasesOnlyWhenUsingSyncEntrypoint() {
        when(entrypointConnectorResolver.resolve(ctx)).thenReturn(entrypointConnector);
        lenient().when(apiDefinition.getType()).thenReturn(io.gravitee.definition.model.v4.ApiType.SYNC);

        cut = buildApiReactor();
        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();

        // Message request and response phase must NOT be invoked with sync entrypoint.
        inOrder.verify(spyMessageRequestPlatformFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlatformFlowChain, never()).subscribe(any(CompletableObserver.class));

        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldExecuteAllPhasesWhenUsingAsyncEntrypoint() {
        when(entrypointConnectorResolver.resolve(ctx)).thenReturn(entrypointConnector);

        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldSkipInvoker() {
        when(entrypointConnectorResolver.resolve(ctx)).thenReturn(entrypointConnector);
        lenient().when(apiDefinition.getType()).thenReturn(io.gravitee.definition.model.v4.ApiType.SYNC);

        when(ctx.getInternalAttribute(ATTR_INTERNAL_INVOKER_SKIP)).thenReturn(true);

        cut = buildApiReactor();
        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();

        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));

        // Invoker most not be invoked.
        inOrder.verify(spyInvokerChain, never()).subscribe(any(CompletableObserver.class));

        inOrder.verify(spyResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldSkipApiResponseAndExecuteErrorChainWhenExceptionOccurs() {
        spyInvokerChain = spy(Completable.error(new Exception("Mock exception")));
        when(defaultInvoker.invoke(any(ExecutionContext.class))).thenReturn(spyInvokerChain);

        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));

        // Response phases at api level must NOT be invoked if an unexpected error occurred during invocation.
        inOrder.verify(spyResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors, never()).subscribe(any(CompletableObserver.class));

        // But the rest of the response chains must be called (error chain, platform).
        inOrder.verify(spyOnErrorProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldSkipApiResponseAndExecuteErrorChainWhenInterruptionFailureExceptionOccurs() {
        spyInvokerChain = spy(Completable.error(new InterruptionFailureException(new ExecutionFailure(500))));
        when(defaultInvoker.invoke(any(ExecutionContext.class))).thenReturn(spyInvokerChain);

        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));

        // Response phases at api level must NOT be invoked if an unexpected error occurred during invocation.
        inOrder.verify(spyResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors, never()).subscribe(any(CompletableObserver.class));

        // But the rest of the response chains must be called (error chain, platform).
        inOrder.verify(spyOnErrorProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldSkipApiResponseAndExecutePostProcessorChainWhenNormalInterruptionOccurs() {
        spyInvokerChain = spy(Completable.error(new InterruptionException()));
        when(defaultInvoker.invoke(any(ExecutionContext.class))).thenReturn(spyInvokerChain);

        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));

        // Response phases at api level must NOT be invoked if an unexpected error occurred during invocation.
        inOrder.verify(spyResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnErrorProcessors, never()).subscribe(any(CompletableObserver.class));

        // But the rest of the response chains must be called (post processor chain, platform).
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldHandleUnexpectedError() {
        spyResponsePlatformFlowChain = spy(Completable.error(new Exception("Unexpected mock exception")));
        when(platformFlowChain.execute(ctx, RESPONSE)).thenReturn(spyResponsePlatformFlowChain);
        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));

        // Skip because platform response failed.
        inOrder.verify(spyMessageResponsePlatformFlowChain, never()).subscribe(any(CompletableObserver.class));

        // In case of error we do not expect entrypoint.handleResponse to be called
        inOrder.verify(spyEntrypointResponse, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));

        verify(response).status(HttpResponseStatus.INTERNAL_SERVER_ERROR.code());
        verify(response).reason(HttpResponseStatus.INTERNAL_SERVER_ERROR.reasonPhrase());
    }

    @Test
    void shouldHandleUnexpectedErrorDuringEntrypointResponseHandling() {
        spyEntrypointResponse = spy(Completable.error(new Exception("Unexpected mock exception")));
        when(entrypointConnector.handleResponse(ctx)).thenReturn(spyEntrypointResponse);
        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));

        verify(response).status(HttpResponseStatus.INTERNAL_SERVER_ERROR.code());
        verify(response).reason(HttpResponseStatus.INTERNAL_SERVER_ERROR.reasonPhrase());
    }

    @Test
    void shouldTimeoutDuringApiFlow() {
        when(requestTimeoutConfiguration.getRequestTimeout()).thenReturn(10000L, 0L);
        spyInvokerChain = spy(Completable.complete().delay(20000, TimeUnit.MILLISECONDS));
        when(defaultInvoker.invoke(ctx)).thenReturn(spyInvokerChain);

        final TestObserver<Void> obs = cut.handle(ctx).subscribeOn(testScheduler).test();

        obs.assertNotComplete();

        testScheduler.advanceTimeBy(10000, TimeUnit.MILLISECONDS);
        testScheduler.triggerActions();
        obs.assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));

        // The next steps must not be executed because of timeout.
        inOrder.verify(spyResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors, never()).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors, never()).subscribe(any(CompletableObserver.class));

        inOrder.verify(spyOnErrorProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));

        final ArgumentCaptor<ExecutionFailure> failureArgumentCaptor = ArgumentCaptor.forClass(ExecutionFailure.class);
        verify(ctx, atLeastOnce()).interruptWith(failureArgumentCaptor.capture());

        // 504 isn't directly set on the response status as it is more a job for the error processor chain.
        // The only way to assert here is to check the context has been interrupted with a failure.
        final ExecutionFailure executionFailure = failureArgumentCaptor.getValue();
        assertThat(executionFailure.statusCode()).isEqualTo(GATEWAY_TIMEOUT_504);
        assertThat(executionFailure.key()).isEqualTo(REQUEST_TIMEOUT_KEY);

        verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldTimeoutDuringPlatformResponseFlow() {
        // Simulate a grace delay for platform flow (a bit tricky due to use of System.currentTimeMillis).
        when(requestTimeoutConfiguration.getRequestTimeout()).thenReturn(0L, 1000L);
        when(requestTimeoutConfiguration.getRequestTimeoutGraceDelay()).thenReturn(1000L);
        spyInvokerChain = spy(Completable.complete().delay(9000, TimeUnit.MILLISECONDS));
        spyResponsePlatformFlowChain = spy(Completable.complete().delay(3000, TimeUnit.MILLISECONDS));
        when(defaultInvoker.invoke(ctx)).thenReturn(spyInvokerChain);
        when(platformFlowChain.execute(ctx, RESPONSE)).thenReturn(spyResponsePlatformFlowChain);

        final TestObserver<Void> obs = cut.handle(ctx).subscribeOn(testScheduler).test();
        obs.assertNotComplete();

        testScheduler.advanceTimeBy(9000, TimeUnit.MILLISECONDS);
        testScheduler.triggerActions();

        // Should not have completed after 9s because there is no request timeout.
        obs.assertNotComplete();

        // Should have complete after grace delay.
        testScheduler.advanceTimeBy(1000, TimeUnit.MILLISECONDS);
        testScheduler.triggerActions();
        obs.assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));

        // Platform message response flow isn't executed because timeout occurs during platform response.
        inOrder.verify(spyMessageResponsePlatformFlowChain, never()).subscribe(any(CompletableObserver.class));

        // Error flow must have been executed.
        inOrder.verify(spyOnErrorProcessors).subscribe(any(CompletableObserver.class));

        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));

        final ArgumentCaptor<ExecutionFailure> failureArgumentCaptor = ArgumentCaptor.forClass(ExecutionFailure.class);
        verify(ctx, atLeastOnce()).interruptWith(failureArgumentCaptor.capture());

        // 504 isn't directly set on the response status as it is more a job for the error processor chain.
        // The only way to assert here is to check the context has been interrupted with a failure.
        final ExecutionFailure executionFailure = failureArgumentCaptor.getValue();
        assertThat(executionFailure.statusCode()).isEqualTo(GATEWAY_TIMEOUT_504);
        assertThat(executionFailure.key()).isEqualTo(REQUEST_TIMEOUT_KEY);

        verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldEndProperlyWhenTimeoutDuringEntrypointHandleResponse() {
        // Note: due to clash with scheduler time vs System.currentTimeMillis when calculation remaining time for timeout,
        // this trick to force set a timeout on entrypoint handle response.
        when(requestTimeoutConfiguration.getRequestTimeout()).thenReturn(0L, 0L, 10000L);
        when(requestTimeoutConfiguration.getRequestTimeoutGraceDelay()).thenReturn(10000L);
        spyEntrypointResponse = spy(Completable.complete().delay(10000, TimeUnit.MILLISECONDS));

        when(entrypointConnector.handleResponse(ctx)).thenReturn(spyEntrypointResponse);

        final TestObserver<Void> obs = cut.handle(ctx).subscribeOn(testScheduler).test();
        obs.assertNotComplete();

        testScheduler.advanceTimeBy(9000, TimeUnit.MILLISECONDS);
        testScheduler.triggerActions();

        // Should not have completed after 9s because timeout is set to 10s.
        obs.assertNotComplete();

        testScheduler.advanceTimeBy(1001, TimeUnit.MILLISECONDS);
        testScheduler.triggerActions();
        obs.assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyInvokerChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyOnMessageProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyMessageResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));

        inOrder.verify(spyOnErrorProcessors, never()).subscribe(any(CompletableObserver.class));

        final ArgumentCaptor<ExecutionFailure> failureArgumentCaptor = ArgumentCaptor.forClass(ExecutionFailure.class);
        verify(ctx, atLeastOnce()).interruptWith(failureArgumentCaptor.capture());

        // 504 isn't directly set on the response status as it is more a job for the error processor chain.
        // The only way to assert here is to check the context has been interrupted with a failure.
        final ExecutionFailure executionFailure = failureArgumentCaptor.getAllValues().get(0);
        assertThat(executionFailure.statusCode()).isEqualTo(GATEWAY_TIMEOUT_504);
        assertThat(executionFailure.key()).isEqualTo(REQUEST_TIMEOUT_KEY);

        verify(spyResponseEnd).subscribe(any(CompletableObserver.class));
    }

    @Test
    void shouldHandleRequestWithLegacyInvoker() {
        lenient().when(apiDefinition.getType()).thenReturn(io.gravitee.definition.model.v4.ApiType.SYNC);

        io.gravitee.gateway.core.invoker.EndpointInvoker endpointInvoker = mock(io.gravitee.gateway.core.invoker.EndpointInvoker.class);
        when(ctx.getInternalAttribute(InternalContextAttributes.ATTR_INTERNAL_INVOKER)).thenReturn(endpointInvoker);

        final ArgumentCaptor<Handler<ProxyConnection>> handlerArgumentCaptor = ArgumentCaptor.forClass(Handler.class);
        doAnswer(
                invocation -> {
                    ConnectionHandlerAdapter connectionHandlerAdapter = invocation.getArgument(2);
                    final Try<Object> nextEmitter = ReflectionUtils.tryToReadFieldValue(
                        ConnectionHandlerAdapter.class,
                        "nextEmitter",
                        connectionHandlerAdapter
                    );
                    ((CompletableEmitter) nextEmitter.get()).onComplete();
                    return null;
                }
            )
            .when(endpointInvoker)
            .invoke(any(io.gravitee.gateway.api.ExecutionContext.class), any(ReadWriteStream.class), any(Handler.class));
        cut.handle(ctx).test().assertComplete();

        // Verify flow chain has been executed in the right order
        InOrder inOrder = getInOrder();
        inOrder.verify(spyBeforeHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spySecurityChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyBeforeApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointRequest).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestPlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyRequestApiFlowChain).subscribe(any(CompletableObserver.class));

        // Original invoker must NOT have been called because it has been replace with a v3 invoker.
        inOrder.verify(spyInvokerChain, never()).subscribe(any(CompletableObserver.class));

        inOrder.verify(spyResponsePlanFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseApiFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterApiFlowsProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponsePlatformFlowChain).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyEntrypointResponse).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyAfterHandleProcessors).subscribe(any(CompletableObserver.class));
        inOrder.verify(spyResponseEnd).subscribe(any(CompletableObserver.class));

        verify(endpointInvoker).invoke(any(), any(), handlerArgumentCaptor.capture());
        assertThat(handlerArgumentCaptor.getValue()).isNotNull().isInstanceOf(ConnectionHandlerAdapter.class);
    }

    @Test
    void shouldReturnHttpAcceptors() {
        HttpListener httpListener = new HttpListener();
        Path path = new Path("host", "path");
        httpListener.setPaths(List.of(path));
        SubscriptionListener subscriptionListener = new SubscriptionListener();
        when(apiDefinition.getListeners()).thenReturn(List.of(httpListener, subscriptionListener));

        List<Acceptor<?>> acceptors = cut.acceptors();
        assertThat(acceptors).hasSize(2);
        Acceptor<?> acceptor1 = acceptors.get(0);
        assertThat(acceptor1).isInstanceOf(HttpAcceptor.class);
        HttpAcceptor httpAcceptor = (HttpAcceptor) acceptor1;
        assertThat(httpAcceptor.path()).isEqualTo("path/");
        assertThat(httpAcceptor.host()).isEqualTo(path.getHost());
        Acceptor<?> acceptor2 = acceptors.get(1);
        assertThat(acceptor2).isInstanceOf(SubscriptionAcceptor.class);
        SubscriptionAcceptor subscriptionAcceptor = (SubscriptionAcceptor) acceptor2;
        assertThat(subscriptionAcceptor.apiId()).isEqualTo(api.getId());
    }

    @Test
    void shouldWaitForPendingRequestBeforeStopping() throws Exception {
        when(node.lifecycleState()).thenReturn(Lifecycle.State.STARTED);
        final AtomicLong pendingRequests = new AtomicLong(1);
        ReflectionTestUtils.setField(cut, "pendingRequests", pendingRequests);

        cut.doStop();

        // Pre-stop should have been called
        verify(entrypointConnectorResolver).preStop();
        verify(endpointManager).preStop();

        testScheduler.advanceTimeBy(2500L, TimeUnit.MILLISECONDS);
        testScheduler.triggerActions();

        // Not called yet as there is still a pending request and timeout has not expired.
        verify(entrypointConnectorResolver, times(0)).stop();
        verify(endpointManager, times(0)).stop();
        verify(resourceLifecycleManager, times(0)).stop();
        verify(policyManager, times(0)).stop();

        // Ends the pending request.
        pendingRequests.decrementAndGet();
        testScheduler.advanceTimeBy(100L, TimeUnit.MILLISECONDS);
        testScheduler.triggerActions();

        verify(entrypointConnectorResolver).stop();
        verify(endpointManager).stop();
        verify(resourceLifecycleManager).stop();
        verify(policyManager).stop();
    }

    @Test
    void shouldWaitForPendingRequestAndForceStopAfter10sWhenRequestDoesNotFinish() throws Exception {
        when(node.lifecycleState()).thenReturn(Lifecycle.State.STARTED);
        final AtomicLong pendingRequests = new AtomicLong(1);
        ReflectionTestUtils.setField(cut, "pendingRequests", pendingRequests);
        cut.doStop();

        // Pre-stop should have been called
        verify(entrypointConnectorResolver).preStop();
        verify(endpointManager).preStop();

        for (int i = 0; i < 99; i++) {
            testScheduler.advanceTimeBy(100L, TimeUnit.MILLISECONDS);
            testScheduler.triggerActions();

            // Not called yet as there is still a pending request and timeout has not expired.
            verify(entrypointConnectorResolver, times(0)).stop();
            verify(endpointManager, times(0)).stop();
            verify(resourceLifecycleManager, times(0)).stop();
            verify(policyManager, times(0)).stop();
        }

        testScheduler.advanceTimeBy(100L, TimeUnit.MILLISECONDS);
        testScheduler.triggerActions();

        verify(entrypointConnectorResolver).stop();
        verify(endpointManager).stop();
        verify(resourceLifecycleManager).stop();
        verify(policyManager).stop();

        assertEquals(STOPPED, cut.lifecycleState());
    }

    @Test
    void shouldNotWaitForPendingRequestWhenNodeIsShutdown() throws Exception {
        when(node.lifecycleState()).thenReturn(STOPPED);
        final AtomicLong pendingRequests = new AtomicLong(1);
        ReflectionTestUtils.setField(cut, "pendingRequests", pendingRequests);
        cut.doStop();

        verify(entrypointConnectorResolver).preStop();
        verify(entrypointConnectorResolver).stop();
        verify(endpointManager).preStop();
        verify(endpointManager).stop();
        verify(resourceLifecycleManager).stop();
        verify(policyManager).stop();
    }

    @Test
    void shouldIgnoreErrorAndContinueWhenErrorOccurredDuringStop() throws Exception {
        when(node.lifecycleState()).thenReturn(STOPPED);
        when(entrypointConnectorResolver.stop()).thenThrow(new RuntimeException("Mock exception"));
        cut.stop();

        verify(entrypointConnectorResolver).preStop();
        verify(entrypointConnectorResolver).stop();
        verify(endpointManager).preStop();
        verify(endpointManager, never()).stop();
        verify(resourceLifecycleManager, never()).stop();
        verify(policyManager, never()).stop();
    }

    private InOrder getInOrder() {
        return inOrder(
            spyRequestPlatformFlowChain,
            spySecurityChain,
            spyBeforeHandleProcessors,
            spyAfterHandleProcessors,
            spyBeforeApiFlowsProcessors,
            spyEntrypointRequest,
            spyRequestPlanFlowChain,
            spyRequestApiFlowChain,
            spyMessageRequestPlatformFlowChain,
            spyMessageRequestPlanFlowChain,
            spyMessageRequestApiFlowChain,
            spyInvokerChain,
            spyResponsePlanFlowChain,
            spyResponseApiFlowChain,
            spyMessageResponsePlanFlowChain,
            spyMessageResponseApiFlowChain,
            spyResponsePlatformFlowChain,
            spyMessageResponsePlatformFlowChain,
            spyOnMessageProcessors,
            spyAfterApiFlowsProcessors,
            spyOnErrorProcessors,
            spyEntrypointResponse,
            spyResponseEnd
        );
    }
}
