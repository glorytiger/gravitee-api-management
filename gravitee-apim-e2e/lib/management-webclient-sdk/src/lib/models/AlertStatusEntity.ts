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
 * @interface AlertStatusEntity
 */
export interface AlertStatusEntity {
    /**
     * 
     * @type {number}
     * @memberof AlertStatusEntity
     */
    available_plugins?: number;
    /**
     * 
     * @type {boolean}
     * @memberof AlertStatusEntity
     */
    enabled?: boolean;
}

/**
 * Check if a given object implements the AlertStatusEntity interface.
 */
export function instanceOfAlertStatusEntity(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function AlertStatusEntityFromJSON(json: any): AlertStatusEntity {
    return AlertStatusEntityFromJSONTyped(json, false);
}

export function AlertStatusEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): AlertStatusEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'available_plugins': !exists(json, 'available_plugins') ? undefined : json['available_plugins'],
        'enabled': !exists(json, 'enabled') ? undefined : json['enabled'],
    };
}

export function AlertStatusEntityToJSON(value?: AlertStatusEntity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'available_plugins': value.available_plugins,
        'enabled': value.enabled,
    };
}
