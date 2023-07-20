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
 * @interface HttpRequest
 */
export interface HttpRequest {
    /**
     * 
     * @type {string}
     * @memberof HttpRequest
     */
    body?: string;
    /**
     * 
     * @type {{ [key: string]: Array<string>; }}
     * @memberof HttpRequest
     */
    headers?: { [key: string]: Array<string>; };
    /**
     * 
     * @type {string}
     * @memberof HttpRequest
     */
    method?: string;
    /**
     * 
     * @type {string}
     * @memberof HttpRequest
     */
    path?: string;
}

/**
 * Check if a given object implements the HttpRequest interface.
 */
export function instanceOfHttpRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function HttpRequestFromJSON(json: any): HttpRequest {
    return HttpRequestFromJSONTyped(json, false);
}

export function HttpRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): HttpRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'body': !exists(json, 'body') ? undefined : json['body'],
        'headers': !exists(json, 'headers') ? undefined : json['headers'],
        'method': !exists(json, 'method') ? undefined : json['method'],
        'path': !exists(json, 'path') ? undefined : json['path'],
    };
}

export function HttpRequestToJSON(value?: HttpRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'body': value.body,
        'headers': value.headers,
        'method': value.method,
        'path': value.path,
    };
}
