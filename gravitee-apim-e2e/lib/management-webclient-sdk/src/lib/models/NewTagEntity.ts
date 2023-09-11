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
/**
 * 
 * @export
 * @interface NewTagEntity
 */
export interface NewTagEntity {
    /**
     * 
     * @type {string}
     * @memberof NewTagEntity
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof NewTagEntity
     */
    name: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof NewTagEntity
     */
    restricted_groups?: Array<string>;
}

/**
 * Check if a given object implements the NewTagEntity interface.
 */
export function instanceOfNewTagEntity(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function NewTagEntityFromJSON(json: any): NewTagEntity {
    return NewTagEntityFromJSONTyped(json, false);
}

export function NewTagEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewTagEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'description': !exists(json, 'description') ? undefined : json['description'],
        'name': json['name'],
        'restricted_groups': !exists(json, 'restricted_groups') ? undefined : json['restricted_groups'],
    };
}

export function NewTagEntityToJSON(value?: NewTagEntity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'description': value.description,
        'name': value.name,
        'restricted_groups': value.restricted_groups,
    };
}
