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
 * @interface UpdateMetadataEntity
 */
export interface UpdateMetadataEntity {
    /**
     * 
     * @type {MetadataFormat}
     * @memberof UpdateMetadataEntity
     */
    format?: MetadataFormat;
    /**
     * 
     * @type {boolean}
     * @memberof UpdateMetadataEntity
     */
    hidden?: boolean;
    /**
     * 
     * @type {string}
     * @memberof UpdateMetadataEntity
     */
    key?: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateMetadataEntity
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateMetadataEntity
     */
    value?: string;
}

/**
 * Check if a given object implements the UpdateMetadataEntity interface.
 */
export function instanceOfUpdateMetadataEntity(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function UpdateMetadataEntityFromJSON(json: any): UpdateMetadataEntity {
    return UpdateMetadataEntityFromJSONTyped(json, false);
}

export function UpdateMetadataEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateMetadataEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'format': !exists(json, 'format') ? undefined : MetadataFormatFromJSON(json['format']),
        'hidden': !exists(json, 'hidden') ? undefined : json['hidden'],
        'key': !exists(json, 'key') ? undefined : json['key'],
        'name': json['name'],
        'value': !exists(json, 'value') ? undefined : json['value'],
    };
}

export function UpdateMetadataEntityToJSON(value?: UpdateMetadataEntity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'format': MetadataFormatToJSON(value.format),
        'hidden': value.hidden,
        'key': value.key,
        'name': value.name,
        'value': value.value,
    };
}
