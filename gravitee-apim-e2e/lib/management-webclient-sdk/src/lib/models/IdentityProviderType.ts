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


/**
 * 
 * @export
 */
export const IdentityProviderType = {
    GOOGLE: 'GOOGLE',
    GITHUB: 'GITHUB',
    GRAVITEEIO_AM: 'GRAVITEEIO_AM',
    OIDC: 'OIDC'
} as const;
export type IdentityProviderType = typeof IdentityProviderType[keyof typeof IdentityProviderType];


export function IdentityProviderTypeFromJSON(json: any): IdentityProviderType {
    return IdentityProviderTypeFromJSONTyped(json, false);
}

export function IdentityProviderTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): IdentityProviderType {
    return json as IdentityProviderType;
}

export function IdentityProviderTypeToJSON(value?: IdentityProviderType | null): any {
    return value as any;
}
