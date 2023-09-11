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
import type { MetadataFormat } from './MetadataFormat';
import {
    MetadataFormatFromJSON,
    MetadataFormatFromJSONTyped,
    MetadataFormatToJSON,
} from './MetadataFormat';

/**
 * 
 * @export
 * @interface MetadataEntity
 */
export interface MetadataEntity {
    /**
     * 
     * @type {MetadataFormat}
     * @memberof MetadataEntity
     */
    format?: MetadataFormat;
    /**
     * 
     * @type {string}
     * @memberof MetadataEntity
     */
    key?: string;
    /**
     * 
     * @type {string}
     * @memberof MetadataEntity
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof MetadataEntity
     */
    value?: string;
}

/**
 * Check if a given object implements the MetadataEntity interface.
 */
export function instanceOfMetadataEntity(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function MetadataEntityFromJSON(json: any): MetadataEntity {
    return MetadataEntityFromJSONTyped(json, false);
}

export function MetadataEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): MetadataEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'format': !exists(json, 'format') ? undefined : MetadataFormatFromJSON(json['format']),
        'key': !exists(json, 'key') ? undefined : json['key'],
        'name': json['name'],
        'value': !exists(json, 'value') ? undefined : json['value'],
    };
}

export function MetadataEntityToJSON(value?: MetadataEntity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'format': MetadataFormatToJSON(value.format),
        'key': value.key,
        'name': value.name,
        'value': value.value,
    };
}
