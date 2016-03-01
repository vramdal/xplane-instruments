import { SUBSCRIBING_TO_DATAREF } from '../actions/DataRefActions';

export function subscriptions(state = {"Sim/cockpit/radios/nav1 freq hz": 111.90}, action) {
    let result = Object.assign({}, state);
    switch (action.type) {
        case SUBSCRIBING_TO_DATAREF: {
            let keys = Object.keys(state);
            for (let key of keys) {
                if (state[key].dataRef === action.dataRef) {
                    result[key] = Object.assign({}, ...state[key]);
                    if (action.frequency > state[key].frequency) {
                        result[key].frequency = action.frequency;
                        return result;
                    } else {
                        break;
                    }
                }
            }
            let key = keys.length;
            result[key] = {
                dataRef: action.dataRef,
                frequency: action.frequency
            };
            return result;
        }
    }
    return state;
}