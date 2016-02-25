export const DATAREF_VALUE_CHANGED_ON_CLIENT = 'DATAREF_VALUE_CHANGED_ON_CLIENT';

export function dataRefValueChangedOnClient(dataRefIdString, newValue) {
    return {
        type: DATAREF_VALUE_CHANGED_ON_CLIENT,
        dataRef: dataRefIdString,
        value: newValue
    }
}