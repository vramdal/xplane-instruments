import { SUBSCRIBING_TO_DATAREF, DATAREF_VALUE_CHANGED_ON_CLIENT, DATAREF_VALUE_CHANGED_IN_XPLANE } from '../actions/DataRefActions';

export function xplane(state = {
    subscriptions: [] ,
    values: {"sim/cockpit/radios/nav1_freq_hz": {value: 123, confirmed: true}},
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
        case DATAREF_VALUE_CHANGED_IN_XPLANE: {
            let changed = false;
            let internalId = action.internalId;
            let matchingSubscriptions = state.subscriptions.filter(subscription => subscription.internalId === internalId);
            matchingSubscriptions.forEach(subscription => {
                if (result.values[subscription.dataRef] !== action.newValue) {
                    result.values[subscription.dataRef] = Object.assign({}, {
                        value: action.newValue,
                        timestamp: action.timestamp,
                        confirmed: true
                    });
                    if (result.dirtyValues[subscription.dataRef] && (state.datarefTimestamps[subscription.dataRef] || 0) < action.timestamp) {
                        let dirtyValues = Object.assign({}, result.dirtyValues);
                        delete dirtyValues[subscription.dataRef];
                        result.dirtyValues = dirtyValues;
                    }
                }
                result.datarefTimestamps = Object.assign({}, state.datarefTimestamps, {[subscription.dataRef]: action.timestamp});
                result.values = Object.assign({}, result.values);
                changed = true;
            });
            if (changed) {
                return result;
            } else {
                return state;
            }
        }
        case DATAREF_VALUE_CHANGED_ON_CLIENT: {
            result.values[action.dataRef] = Object.assign({}, {
                value: action.value,
                timestamp: action.timestamp,
                confirmed: false
            });
            result.dirtyValues = Object.assign({}, {
                [action.dataRef]: {
                    value: action.value,
                    timestamp: action.timestamp
                }
            });

            return result;
        }
    }
    return state;
}