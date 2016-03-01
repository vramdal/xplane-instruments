import { SUBSCRIBING_TO_DATAREF, DATAREF_VALUE_CHANGED_ON_CLIENT, DATAREF_VALUE_CHANGED_IN_XPLANE } from '../actions/DataRefActions';

export function xplane(state = {subscriptions: [] , values: {}}, action) {
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
            let internalId = state.subscriptions.length;
            result.subscriptions.push({
                dataRef: action.dataRef,
                frequency: action.frequency,
                internalId: internalId
            });
            return result;
        }
        case DATAREF_VALUE_CHANGED_IN_XPLANE: {
            let internalKey = action.internalKey + "";
            if (state.subscriptions[internalKey]) {
                let dataRef = state.subscriptions[internalKey].dataRef;
                if (action.newValue !== result.values[dataRef]) {
                    result.values[dataRef] = action.newValue;
                    return result;
                }
            }
            return state;
        }
    }
    return state;
}