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
import type { Page } from './Page';
import {
    PageFromJSON,
    PageFromJSONTyped,
    PageToJSON,
} from './Page';
import type { UserEntity } from './UserEntity';
import {
    UserEntityFromJSON,
    UserEntityFromJSONTyped,
    UserEntityToJSON,
} from './UserEntity';

/**
 * 
 * @export
 * @interface UserPageResult
 */
export interface UserPageResult {
    /**
     * 
     * @type {Array<UserEntity>}
     * @memberof UserPageResult
     */
    data?: Array<UserEntity>;
    /**
     * 
     * @type {{ [key: string]: { [key: string]: any; }; }}
     * @memberof UserPageResult
     */
    metadata?: { [key: string]: { [key: string]: any; }; };
    /**
     * 
     * @type {Page}
     * @memberof UserPageResult
     */
    page?: Page;
}

/**
 * Check if a given object implements the UserPageResult interface.
 */
export function instanceOfUserPageResult(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UserPageResultFromJSON(json: any): UserPageResult {
    return UserPageResultFromJSONTyped(json, false);
}

export function UserPageResultFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserPageResult {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': !exists(json, 'data') ? undefined : ((json['data'] as Array<any>).map(UserEntityFromJSON)),
        'metadata': !exists(json, 'metadata') ? undefined : json['metadata'],
        'page': !exists(json, 'page') ? undefined : PageFromJSON(json['page']),
    };
}

export function UserPageResultToJSON(value?: UserPageResult | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': value.data === undefined ? undefined : ((value.data as Array<any>).map(UserEntityToJSON)),
        'metadata': value.metadata,
        'page': PageToJSON(value.page),
    };
}
