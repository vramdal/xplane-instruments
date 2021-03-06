export const DATAREF_VALUE_CHANGED_ON_CLIENT = 'DATAREF_VALUE_CHANGED_ON_CLIENT';
export const SUBSCRIBING_TO_DATAREF = 'SUBSCRIBING_TO_DATAREF';
export const DATAREF_VALUE_CHANGED_IN_XPLANE = 'DATAREF_VALUE_CHANGED_IN_XPLANE';
export const DATA_VALUE_CHANGED_IN_XPLANE = 'DATA_VALUE_CHANGED_IN_XPLANE';

import datarefDefinitions from '../definitions/datarefs';

export function subscribeToDataRef( dataRefIdString, frequency, internalId) {
    //webSocket.send(JSON.stringify(
    //        {"RREF":
    //        { "dataRefIdString": dataRefIdString, frequency: frequency, internalId: internalId}
    //        }
    //));
    return {
        type: SUBSCRIBING_TO_DATAREF,
        dataRef: dataRefIdString,
        frequency: frequency
    }

}

export function dataRefValueChangedOnClient(dataRefIdString, newValue) {
    //webSocket.send(JSON.stringify(
    //        {"DREF":
    //        { "dataRefIdString": dataRefIdString, "value": newValue}
    //        }
    //));
    return {
        type: DATAREF_VALUE_CHANGED_ON_CLIENT,
        dataRef: dataRefIdString,
        value: newValue,
        timestamp: new Date().getTime()
    }
}

export function dataRefValueChangedInXPlane(internalId, newValue) {
    return {
        type: DATAREF_VALUE_CHANGED_IN_XPLANE,
        internalId: internalId,
        newValue: newValue,
        timestamp: new Date().getTime()
    }
}

export function dataValueChangedInXPlane(dataIdx, valuesArr) {
    return {
        type: DATA_VALUE_CHANGED_IN_XPLANE,
        dataIdx,
        valuesArr,
        timestamp: new Date().getTime()
    }
}