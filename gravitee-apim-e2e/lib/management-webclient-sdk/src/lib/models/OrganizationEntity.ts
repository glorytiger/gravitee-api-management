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

import { exists, mapValues } from '../runtime';
import type { Flow } from './Flow';
import {
    FlowFromJSON,
    FlowFromJSONTyped,
    FlowToJSON,
} from './Flow';

/**
 * 
 * @export
 * @interface OrganizationEntity
 */
export interface OrganizationEntity {
    /**
     * 
     * @type {string}
     * @memberof OrganizationEntity
     */
    cockpitId?: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationEntity
     */
    description?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationEntity
     */
    domainRestrictions?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationEntity
     */
    flowMode?: OrganizationEntityFlowModeEnum;
    /**
     * 
     * @type {Array<Flow>}
     * @memberof OrganizationEntity
     */
    flows?: Array<Flow>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationEntity
     */
    hrids?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationEntity
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationEntity
     */
    name: string;
}


/**
 * @export
 */
export const OrganizationEntityFlowModeEnum = {
    DEFAULT: 'DEFAULT',
    BEST_MATCH: 'BEST_MATCH'
} as const;
export type OrganizationEntityFlowModeEnum = typeof OrganizationEntityFlowModeEnum[keyof typeof OrganizationEntityFlowModeEnum];


/**
 * Check if a given object implements the OrganizationEntity interface.
 */
export function instanceOfOrganizationEntity(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function OrganizationEntityFromJSON(json: any): OrganizationEntity {
    return OrganizationEntityFromJSONTyped(json, false);
}

export function OrganizationEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): OrganizationEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'cockpitId': !exists(json, 'cockpitId') ? undefined : json['cockpitId'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'domainRestrictions': !exists(json, 'domainRestrictions') ? undefined : json['domainRestrictions'],
        'flowMode': !exists(json, 'flowMode') ? undefined : json['flowMode'],
        'flows': !exists(json, 'flows') ? undefined : ((json['flows'] as Array<any>).map(FlowFromJSON)),
        'hrids': !exists(json, 'hrids') ? undefined : json['hrids'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
    };
}

export function OrganizationEntityToJSON(value?: OrganizationEntity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'cockpitId': value.cockpitId,
        'description': value.description,
        'domainRestrictions': value.domainRestrictions,
        'flowMode': value.flowMode,
        'flows': value.flows === undefined ? undefined : ((value.flows as Array<any>).map(FlowToJSON)),
        'hrids': value.hrids,
        'id': value.id,
        'name': value.name,
    };
}
