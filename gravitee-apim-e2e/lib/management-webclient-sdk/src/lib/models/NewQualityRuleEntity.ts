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
 * @interface NewQualityRuleEntity
 */
export interface NewQualityRuleEntity {
    /**
     * 
     * @type {string}
     * @memberof NewQualityRuleEntity
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof NewQualityRuleEntity
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof NewQualityRuleEntity
     */
    weight?: number;
}

/**
 * Check if a given object implements the NewQualityRuleEntity interface.
 */
export function instanceOfNewQualityRuleEntity(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function NewQualityRuleEntityFromJSON(json: any): NewQualityRuleEntity {
    return NewQualityRuleEntityFromJSONTyped(json, false);
}

export function NewQualityRuleEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewQualityRuleEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'description': json['description'],
        'name': json['name'],
        'weight': !exists(json, 'weight') ? undefined : json['weight'],
    };
}

export function NewQualityRuleEntityToJSON(value?: NewQualityRuleEntity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'description': value.description,
        'name': value.name,
        'weight': value.weight,
    };
}
