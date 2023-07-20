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
package io.gravitee.rest.api.service.v4.impl;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

import io.gravitee.plugin.core.api.PluginManifest;
import io.gravitee.plugin.endpoint.EndpointConnectorPlugin;
import io.gravitee.plugin.endpoint.EndpointConnectorPluginManager;
import io.gravitee.rest.api.model.platform.plugin.PlatformPluginEntity;
import io.gravitee.rest.api.service.JsonSchemaService;
import io.gravitee.rest.api.service.exceptions.PluginNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

@RunWith(MockitoJUnitRunner.class)
public class EndpointServiceImplTest {

    private static final String PLUGIN_ID = "my-test-plugin";
    private static final String CONFIGURATION = "my-test-configuration";
    private static final String SCHEMA = "my-test-schema";

    @InjectMocks
    private EndpointPluginServiceImpl endpointService;

    @Mock
    private JsonSchemaService jsonSchemaService;

    @Mock
    private EndpointConnectorPluginManager pluginManager;

    @Mock
    private EndpointConnectorPlugin mockPlugin;

    @Mock
    private PluginManifest mockPluginManifest;

    @Before
    public void setup() {
        ReflectionTestUtils.setField(endpointService, "pluginManager", pluginManager);
        when(mockPlugin.manifest()).thenReturn(mockPluginManifest);
        when(mockPlugin.id()).thenReturn(PLUGIN_ID);
    }

    @Test
    public void shouldValidateConfiguration() throws IOException {
        when(pluginManager.get(PLUGIN_ID)).thenReturn(mockPlugin);
        when(pluginManager.getSchema(PLUGIN_ID)).thenReturn(SCHEMA);
        when(jsonSchemaService.validate(SCHEMA, CONFIGURATION)).thenReturn("fixed-configuration");

        String resultConfiguration = endpointService.validateEndpointConfiguration(PLUGIN_ID, CONFIGURATION);

        assertEquals("fixed-configuration", resultConfiguration);
    }

    @Test
    public void shouldValidateConfigurationWhenNullConfiguration() throws IOException {
        when(pluginManager.get(PLUGIN_ID)).thenReturn(mockPlugin);

        String resultConfiguration = endpointService.validateEndpointConfiguration(PLUGIN_ID, null);

        assertNull(resultConfiguration);
    }

    @Test(expected = PluginNotFoundException.class)
    public void shouldFailToValidateConfigurationWhenNoPlugin() {
        when(pluginManager.get(PLUGIN_ID)).thenReturn(null);

        endpointService.validateEndpointConfiguration(PLUGIN_ID, CONFIGURATION);
    }

    @Test
    public void shouldFindById() {
        when(mockPlugin.id()).thenReturn(PLUGIN_ID);
        when(mockPlugin.manifest()).thenReturn(mockPluginManifest);
        when(pluginManager.get(PLUGIN_ID)).thenReturn(mockPlugin);

        PlatformPluginEntity result = endpointService.findById(PLUGIN_ID);

        assertNotNull(result);
        assertEquals(PLUGIN_ID, result.getId());
    }

    @Test(expected = PluginNotFoundException.class)
    public void shouldNotFindById() {
        when(pluginManager.get(PLUGIN_ID)).thenReturn(null);

        endpointService.findById(PLUGIN_ID);
    }

    @Test
    public void shouldFindAll() {
        when(mockPlugin.id()).thenReturn(PLUGIN_ID);
        when(mockPlugin.manifest()).thenReturn(mockPluginManifest);
        when(pluginManager.findAll()).thenReturn(List.of(mockPlugin));

        Set<PlatformPluginEntity> result = endpointService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(PLUGIN_ID, result.iterator().next().getId());
    }
}