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
 * @interface Consumer
 */
export interface Consumer {
    /**
     * 
     * @type {string}
     * @memberof Consumer
     */
    consumerId?: string;
    /**
     * 
     * @type {string}
     * @memberof Consumer
     */
    consumerType?: ConsumerConsumerTypeEnum;
}


/**
 * @export
 */
export const ConsumerConsumerTypeEnum = {
    TAG: 'TAG'
} as const;
export type ConsumerConsumerTypeEnum = typeof ConsumerConsumerTypeEnum[keyof typeof ConsumerConsumerTypeEnum];


/**
 * Check if a given object implements the Consumer interface.
 */
export function instanceOfConsumer(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ConsumerFromJSON(json: any): Consumer {
    return ConsumerFromJSONTyped(json, false);
}

export function ConsumerFromJSONTyped(json: any, ignoreDiscriminator: boolean): Consumer {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'consumerId': !exists(json, 'consumerId') ? undefined : json['consumerId'],
        'consumerType': !exists(json, 'consumerType') ? undefined : json['consumerType'],
    };
}

export function ConsumerToJSON(value?: Consumer | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'consumerId': value.consumerId,
        'consumerType': value.consumerType,
    };
}
