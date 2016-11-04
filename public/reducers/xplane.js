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
            let internalId = state.subscriptions.length + 1;
            result.subscriptions.push({
                dataRef: action.dataRef,
                frequency: action.frequency,
                internalId: internalId
            });
            return result;
        }
        case DATAREF_VALUE_CHANGED_IN_XPLANE: {
            let internalId = action.internalId;
            let matchingSubscriptions = state.subscriptions.filter(subscription => subscription.internalId === internalId);
            matchingSubscriptions.forEach(subscription => {
                if (result.values[subscription.dataRef] === undefined || action.newValue !== result.values[subscription.dataRef].value) {
                    result.values[subscription.dataRef] = Object.assign({}, {value: action.newValue});
                }
            });
            result.values = Object.assign({}, result.values);
            return result;
        }
    }
    return state;
}