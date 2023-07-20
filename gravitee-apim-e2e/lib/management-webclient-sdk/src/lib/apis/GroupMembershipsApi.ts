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
  GroupMemberEntity,
  GroupMembership,
} from '../models';
import {
    GroupMemberEntityFromJSON,
    GroupMemberEntityToJSON,
    GroupMembershipFromJSON,
    GroupMembershipToJSON,
} from '../models';

export interface AddOrUpdateGroupMemberRequest {
    group: string;
    envId: string;
    orgId: string;
    groupMembership: Array<GroupMembership>;
}

export interface DeleteGroupMemberRequest {
    member: string;
    group: string;
    envId: string;
    orgId: string;
}

export interface GetGroupMembersRequest {
    group: string;
    envId: string;
    orgId: string;
}

export interface GetGroupMembers1Request {
    size?: number;
    page?: number;
    group: string;
    envId: string;
    orgId: string;
}

/**
 * 
 */
export class GroupMembershipsApi extends runtime.BaseAPI {

    /**
     * Add or update a group member
     */
    async addOrUpdateGroupMemberRaw(requestParameters: AddOrUpdateGroupMemberRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.group === null || requestParameters.group === undefined) {
            throw new runtime.RequiredError('group','Required parameter requestParameters.group was null or undefined when calling addOrUpdateGroupMember.');
        }

        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling addOrUpdateGroupMember.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling addOrUpdateGroupMember.');
        }

        if (requestParameters.groupMembership === null || requestParameters.groupMembership === undefined) {
            throw new runtime.RequiredError('groupMembership','Required parameter requestParameters.groupMembership was null or undefined when calling addOrUpdateGroupMember.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/groups/{group}/members`.replace(`{${"group"}}`, encodeURIComponent(String(requestParameters.group))).replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.groupMembership.map(GroupMembershipToJSON),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Add or update a group member
     */
    async addOrUpdateGroupMember(requestParameters: AddOrUpdateGroupMemberRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addOrUpdateGroupMemberRaw(requestParameters, initOverrides);
    }

    /**
     * Remove a group member
     */
    async deleteGroupMemberRaw(requestParameters: DeleteGroupMemberRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.member === null || requestParameters.member === undefined) {
            throw new runtime.RequiredError('member','Required parameter requestParameters.member was null or undefined when calling deleteGroupMember.');
        }

        if (requestParameters.group === null || requestParameters.group === undefined) {
            throw new runtime.RequiredError('group','Required parameter requestParameters.group was null or undefined when calling deleteGroupMember.');
        }

        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling deleteGroupMember.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling deleteGroupMember.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/groups/{group}/members/{member}`.replace(`{${"member"}}`, encodeURIComponent(String(requestParameters.member))).replace(`{${"group"}}`, encodeURIComponent(String(requestParameters.group))).replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Remove a group member
     */
    async deleteGroupMember(requestParameters: DeleteGroupMemberRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteGroupMemberRaw(requestParameters, initOverrides);
    }

    /**
     * List group members
     */
    async getGroupMembersRaw(requestParameters: GetGroupMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<GroupMemberEntity>>> {
        if (requestParameters.group === null || requestParameters.group === undefined) {
            throw new runtime.RequiredError('group','Required parameter requestParameters.group was null or undefined when calling getGroupMembers.');
        }

        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling getGroupMembers.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling getGroupMembers.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/groups/{group}/members`.replace(`{${"group"}}`, encodeURIComponent(String(requestParameters.group))).replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GroupMemberEntityFromJSON));
    }

    /**
     * List group members
     */
    async getGroupMembers(requestParameters: GetGroupMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<GroupMemberEntity>> {
        const response = await this.getGroupMembersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List group members with pagination
     */
    async getGroupMembers1Raw(requestParameters: GetGroupMembers1Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<GroupMemberEntity>>> {
        if (requestParameters.group === null || requestParameters.group === undefined) {
            throw new runtime.RequiredError('group','Required parameter requestParameters.group was null or undefined when calling getGroupMembers1.');
        }

        if (requestParameters.envId === null || requestParameters.envId === undefined) {
            throw new runtime.RequiredError('envId','Required parameter requestParameters.envId was null or undefined when calling getGroupMembers1.');
        }

        if (requestParameters.orgId === null || requestParameters.orgId === undefined) {
            throw new runtime.RequiredError('orgId','Required parameter requestParameters.orgId was null or undefined when calling getGroupMembers1.');
        }

        const queryParameters: any = {};

        if (requestParameters.size !== undefined) {
            queryParameters['size'] = requestParameters.size;
        }

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/organizations/{orgId}/environments/{envId}/configuration/groups/{group}/members/_paged`.replace(`{${"group"}}`, encodeURIComponent(String(requestParameters.group))).replace(`{${"envId"}}`, encodeURIComponent(String(requestParameters.envId))).replace(`{${"orgId"}}`, encodeURIComponent(String(requestParameters.orgId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GroupMemberEntityFromJSON));
    }

    /**
     * List group members with pagination
     */
    async getGroupMembers1(requestParameters: GetGroupMembers1Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<GroupMemberEntity>> {
        const response = await this.getGroupMembers1Raw(requestParameters, initOverrides);
        return await response.value();
    }

}