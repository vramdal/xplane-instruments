export const DATAREF_VALUE_CHANGED_ON_CLIENT = 'DATAREF_VALUE_CHANGED_ON_CLIENT';
export const SUBSCRIBING_TO_DATAREF = 'SUBSCRIBING_TO_DATAREF';

export function subscribeToDataRef(webSocket, dataRefIdString, frequency, internalId) {
    webSocket.send(JSON.stringify(
            {"RREF":
            { "dataRefIdString": dataRefIdString, frequency: frequency, internalId: internalId}
            }
    ));
    return {
        type: SUBSCRIBING_TO_DATAREF,
        dataRef: dataRefIdString,
        internalId: internalId
    }

}

export function dataRefValueChangedOnClient(webSocket, dataRefIdString, newValue) {
    webSocket.send(JSON.stringify(
            {"DREF":
            { "dataRefIdString": dataRefIdString, "value": newValue}
            }
    ));
    return {
        type: DATAREF_VALUE_CHANGED_ON_CLIENT,
        dataRef: dataRefIdString,
        value: newValue
    }
}