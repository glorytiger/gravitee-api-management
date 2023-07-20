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
export const WorkflowState = {
    DRAFT: 'DRAFT',
    IN_REVIEW: 'IN_REVIEW',
    REQUEST_FOR_CHANGES: 'REQUEST_FOR_CHANGES',
    REVIEW_OK: 'REVIEW_OK'
} as const;
export type WorkflowState = typeof WorkflowState[keyof typeof WorkflowState];


export function WorkflowStateFromJSON(json: any): WorkflowState {
    return WorkflowStateFromJSONTyped(json, false);
}

export function WorkflowStateFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkflowState {
    return json as WorkflowState;
}

export function WorkflowStateToJSON(value?: WorkflowState | null): any {
    return value as any;
}
