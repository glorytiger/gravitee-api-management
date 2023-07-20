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
 * @interface PathOperator
 */
export interface PathOperator {
    /**
     * 
     * @type {string}
     * @memberof PathOperator
     */
    operator?: PathOperatorOperatorEnum;
    /**
     * 
     * @type {string}
     * @memberof PathOperator
     */
    path?: string;
}


/**
 * @export
 */
export const PathOperatorOperatorEnum = {
    STARTS_WITH: 'STARTS_WITH',
    EQUALS: 'EQUALS'
} as const;
export type PathOperatorOperatorEnum = typeof PathOperatorOperatorEnum[keyof typeof PathOperatorOperatorEnum];


/**
 * Check if a given object implements the PathOperator interface.
 */
export function instanceOfPathOperator(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function PathOperatorFromJSON(json: any): PathOperator {
    return PathOperatorFromJSONTyped(json, false);
}

export function PathOperatorFromJSONTyped(json: any, ignoreDiscriminator: boolean): PathOperator {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'operator': !exists(json, 'operator') ? undefined : json['operator'],
        'path': !exists(json, 'path') ? undefined : json['path'],
    };
}

export function PathOperatorToJSON(value?: PathOperator | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'operator': value.operator,
        'path': value.path,
    };
}
