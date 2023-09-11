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
import type { CompareConditionAllOf } from './CompareConditionAllOf';
import {
    CompareConditionAllOfFromJSON,
    CompareConditionAllOfFromJSONTyped,
    CompareConditionAllOfToJSON,
} from './CompareConditionAllOf';
import type { Condition } from './Condition';
import {
    ConditionFromJSON,
    ConditionFromJSONTyped,
    ConditionToJSON,
} from './Condition';
import type { Projection } from './Projection';
import {
    ProjectionFromJSON,
    ProjectionFromJSONTyped,
    ProjectionToJSON,
} from './Projection';

/**
 * 
 * @export
 * @interface CompareCondition
 */
export interface CompareCondition extends Condition {
    /**
     * 
     * @type {string}
     * @memberof CompareCondition
     */
    property: string;
    /**
     * 
     * @type {string}
     * @memberof CompareCondition
     */
    operator: CompareConditionOperatorEnum;
    /**
     * 
     * @type {number}
     * @memberof CompareCondition
     */
    multiplier: number;
    /**
     * 
     * @type {string}
     * @memberof CompareCondition
     */
    property2: string;
}


/**
 * @export
 */
export const CompareConditionOperatorEnum = {
    LT: 'LT',
    LTE: 'LTE',
    GTE: 'GTE',
    GT: 'GT'
} as const;
export type CompareConditionOperatorEnum = typeof CompareConditionOperatorEnum[keyof typeof CompareConditionOperatorEnum];


/**
 * Check if a given object implements the CompareCondition interface.
 */
export function instanceOfCompareCondition(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "property" in value;
    isInstance = isInstance && "operator" in value;
    isInstance = isInstance && "multiplier" in value;
    isInstance = isInstance && "property2" in value;

    return isInstance;
}

export function CompareConditionFromJSON(json: any): CompareCondition {
    return CompareConditionFromJSONTyped(json, false);
}

export function CompareConditionFromJSONTyped(json: any, ignoreDiscriminator: boolean): CompareCondition {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        ...ConditionFromJSONTyped(json, ignoreDiscriminator),
        'property': json['property'],
        'operator': json['operator'],
        'multiplier': json['multiplier'],
        'property2': json['property2'],
    };
}

export function CompareConditionToJSON(value?: CompareCondition | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        ...ConditionToJSON(value),
        'property': value.property,
        'operator': value.operator,
        'multiplier': value.multiplier,
        'property2': value.property2,
    };
}
