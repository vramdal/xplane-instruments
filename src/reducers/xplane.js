import { SUBSCRIBING_TO_DATAREF, DATAREF_VALUE_CHANGED_ON_CLIENT, DATAREF_VALUE_CHANGED_IN_XPLANE, DATA_VALUE_CHANGED_IN_XPLANE } from '../actions/DataRefActions';
import DatarefDefintions, {Conversions} from '../definitions/datarefs';

function saveValueFromXPlane(result, dataRef, newValue, timestamp) {
    let changed = false;
    if (Conversions[dataRef] && Conversions[dataRef].in) {
        newValue = Conversions[dataRef].in(newValue);
    }

    if (result.values[dataRef] !== newValue) {
        result.values[dataRef] = Object.assign({}, {
            value: newValue,
            timestamp: timestamp,
            confirmed: true
        });
        if (result.dirtyValues[dataRef] && (result.datarefTimestamps[dataRef] || 0) < timestamp) {
            let dirtyValues = Object.assign({}, result.dirtyValues);
            delete dirtyValues[dataRef];
            result.dirtyValues = dirtyValues;
        }
        changed = true;
    }
    result.datarefTimestamps = Object.assign({}, result.datarefTimestamps, {[dataRef]: timestamp});
    result.values = Object.assign({}, result.values);
    return changed;
}

export function xplane(state = {
    subscriptions: [] ,
    dataIdxs: {},
    values: {"sim/cockpit/radios/nav1_freq_hz": {value: 123, confirmed: true}, "sim/cockpit/radios/nav1_stdby_freq_hz": {value: 135.95, confirmed: true}},
    dirtyValues: {},
    datarefTimestamps: {}
}, action) {
    let result = Object.assign({}, state);
    switch (action.type) {
        case SUBSCRIBING_TO_DATAREF: {
            for (let internalId = 0; internalId < state.subscriptions.length; internalId++) {
                if (state.subscriptions[internalId].dataRef === action.dataRef) {
                    if (state.subscriptions[internalId].frequency < action.frequency) {
                        result.subscriptions[internalId].frequency = action.frequency;
                        return result;
                    } else {
                        return state;
                    }
                }
            }
            let internalId = state.subscriptions.length + 1;
            result.subscriptions.push({
                dataRef: action.dataRef,
                frequency: action.frequency,
                internalId: internalId
            });
            return result;
        }
        case DATA_VALUE_CHANGED_IN_XPLANE : {
            let dataIdx = action.dataIdx;
            let valuesArr = action.valuesArr;
            let definition = DatarefDefintions[dataIdx];
            let changed = false;
            if (definition) {
                for (let i = 0; i < definition.length; i++) {
                    let dataref = definition[i];
                    if (dataref) {
                        changed = saveValueFromXPlane(result, dataref, valuesArr[i], action.timestamp) || changed;
                    }
                }
            }
            if (changed) {
                return result;
            } else {
                return state;
            }
        }
        case DATAREF_VALUE_CHANGED_IN_XPLANE: {
            let changed = false;
            let internalId = action.internalId;
            let matchingSubscriptions = state.subscriptions.filter(subscription => subscription.internalId === internalId);
            matchingSubscriptions.forEach(subscription => {
                saveValueFromXPlane(result, subscription.dataRef, action.newValue, action.timestamp);
                changed = true;
            });
            if (changed) {
                return result;
            } else {
                return state;
            }
        }
        case DATAREF_VALUE_CHANGED_ON_CLIENT: {
            let value = action.value;
            result.values[action.dataRef] = Object.assign({}, {
                value: action.value,
                timestamp: action.timestamp,
                confirmed: false
            });
            if (Conversions[action.dataRef] && Conversions[action.dataRef].out) {
                value = Conversions[action.dataRef].out(value);
            }
            result.dirtyValues = Object.assign({}, {
                [action.dataRef]: {
                    value: value,
                    timestamp: action.timestamp
                }
            });

            return result;
        }
    }
    return state;
}