/* tslint:disable */
/* eslint-disable */
/**
 * Gravitee.io - Management API
 * Some news resources are in alpha version. This implies that they are likely to be modified or even removed in future versions. They are marked with the 🧪 symbol
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  ClientRegistrationProviderEntity,
  ClientRegistrationProviderListItem,
  NewClientRegistrationProviderEntity,
  UpdateClientRegistrationProviderEntity,
} from '../models';
import {
    ClientRegistrationProviderEntityFromJSON,
    ClientRegistrationProviderEntityToJSON,
    ClientRegistrationProviderListItemFromJSON,
    ClientRegistrationProviderListItemToJSON,
    NewClientRegistrationProviderEntityFromJSON,
    NewClientRegistrationProviderEntityToJSON,
    UpdateClientRegistrationProviderEntityFromJSON,
    UpdateClientRegistrationProviderEntityToJSON,
} from '../models';

export interface CreateClientRegistrationProviderRequest {
    envId: string;
    orgId: string;
    newClientRegistrationProviderEntity: NewClientRegistrationProviderEntity;
}

export interface DeleteClientRegistrationProviderRequest {
    clientRegistrationProvider: string;
    envId: string;
    orgId: string;
}

export interface GetClientRegistrationProviderRequest {
    clientRegistrationProvider: string;
    envId: string;
    orgId: string;
}

export interface GetClientRegistrationProvidersRequest {
    envId: string;
    orgId: string;
}

export interface UpdateClientRegistrationProviderRequest {
    clientRegistrationProvider: string;
    envId: string;
    orgId: string;
    updateClientRegistrationProviderEntity: UpdateClientRegistrationProviderEntity;
}

/**
 * 
 */
export class ClientRegistrationProvidersApi extends runtime.BaseAPI {

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[CREATE] permission to use this service
     * Create a client registration provider
     */
    async createClientRegistrationProviderRaw(requestParameters: CreateClientRegistrationProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ClientRegistrationProviderEntity>> {
        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling createClientRegistrationProvider.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling createClientRegistrationProvider.');
        }

        if (requestParameters.newClientRegistrationProviderEntity === null || requestParameters.newClientRegistrationProviderEntity === undefined) {
            throw new runtime.RequiredError('newClientRegistrationProviderEntity','Required parameter requestParameters.newClientRegistrationProviderEntity was null or undefined when calling createClientRegistrationProvider.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/applications/registration/providers`.replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NewClientRegistrationProviderEntityToJSON(requestParameters.newClientRegistrationProviderEntity),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ClientRegistrationProviderEntityFromJSON(jsonValue));
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[CREATE] permission to use this service
     * Create a client registration provider
     */
    async createClientRegistrationProvider(requestParameters: CreateClientRegistrationProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ClientRegistrationProviderEntity> {
        const response = await this.createClientRegistrationProviderRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[DELETE] permission to use this service
     * Delete a client registration provider
     */
    async deleteClientRegistrationProviderRaw(requestParameters: DeleteClientRegistrationProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.clientRegistrationProvider === null || requestParameters.clientRegistrationProvider === undefined) {
            throw new runtime.RequiredError('clientRegistrationProvider','Required parameter requestParameters.clientRegistrationProvider was null or undefined when calling deleteClientRegistrationProvider.');
        }

        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling deleteClientRegistrationProvider.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling deleteClientRegistrationProvider.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/applications/registration/providers/{clientRegistrationProvider}`.replace(`{${"clientRegistrationProvider"}}`, encodeURIComponent(String(requestParameters.clientRegistrationProvider))).replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[DELETE] permission to use this service
     * Delete a client registration provider
     */
    async deleteClientRegistrationProvider(requestParameters: DeleteClientRegistrationProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteClientRegistrationProviderRaw(requestParameters, initOverrides);
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[READ] permission to use this service
     * Get a client registration provider
     */
    async getClientRegistrationProviderRaw(requestParameters: GetClientRegistrationProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ClientRegistrationProviderEntity>> {
        if (requestParameters.clientRegistrationProvider === null || requestParameters.clientRegistrationProvider === undefined) {
            throw new runtime.RequiredError('clientRegistrationProvider','Required parameter requestParameters.clientRegistrationProvider was null or undefined when calling getClientRegistrationProvider.');
        }

        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling getClientRegistrationProvider.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling getClientRegistrationProvider.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/applications/registration/providers/{clientRegistrationProvider}`.replace(`{${"clientRegistrationProvider"}}`, encodeURIComponent(String(requestParameters.clientRegistrationProvider))).replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ClientRegistrationProviderEntityFromJSON(jsonValue));
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[READ] permission to use this service
     * Get a client registration provider
     */
    async getClientRegistrationProvider(requestParameters: GetClientRegistrationProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ClientRegistrationProviderEntity> {
        const response = await this.getClientRegistrationProviderRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[READ] permission to use this service
     * Get the list of client registration providers
     */
    async getClientRegistrationProvidersRaw(requestParameters: GetClientRegistrationProvidersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ClientRegistrationProviderListItem>>> {
        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling getClientRegistrationProviders.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling getClientRegistrationProviders.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/applications/registration/providers`.replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ClientRegistrationProviderListItemFromJSON));
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[READ] permission to use this service
     * Get the list of client registration providers
     */
    async getClientRegistrationProviders(requestParameters: GetClientRegistrationProvidersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ClientRegistrationProviderListItem>> {
        const response = await this.getClientRegistrationProvidersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[UPDATE] permission to use this service
     * Update a client registration provider
     */
    async updateClientRegistrationProviderRaw(requestParameters: UpdateClientRegistrationProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ClientRegistrationProviderEntity>> {
        if (requestParameters.clientRegistrationProvider === null || requestParameters.clientRegistrationProvider === undefined) {
            throw new runtime.RequiredError('clientRegistrationProvider','Required parameter requestParameters.clientRegistrationProvider was null or undefined when calling updateClientRegistrationProvider.');
        }

        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling updateClientRegistrationProvider.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling updateClientRegistrationProvider.');
        }

        if (requestParameters.updateClientRegistrationProviderEntity === null || requestParameters.updateClientRegistrationProviderEntity === undefined) {
            throw new runtime.RequiredError('updateClientRegistrationProviderEntity','Required parameter requestParameters.updateClientRegistrationProviderEntity was null or undefined when calling updateClientRegistrationProvider.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/applications/registration/providers/{clientRegistrationProvider}`.replace(`{${"clientRegistrationProvider"}}`, encodeURIComponent(String(requestParameters.clientRegistrationProvider))).replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateClientRegistrationProviderEntityToJSON(requestParameters.updateClientRegistrationProviderEntity),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ClientRegistrationProviderEntityFromJSON(jsonValue));
    }

    /**
     * User must have the PORTAL_CLIENT_REGISTRATION_PROVIDER[UPDATE] permission to use this service
     * Update a client registration provider
     */
    async updateClientRegistrationProvider(requestParameters: UpdateClientRegistrationProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ClientRegistrationProviderEntity> {
        const response = await this.updateClientRegistrationProviderRaw(requestParameters, initOverrides);
        return await response.value();
    }

}