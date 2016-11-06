import { DATAREF_VALUE_CHANGED_ON_CLIENT, SUBSCRIBING_TO_DATAREF } from '../actions/DataRefActions';

export function dataRef(state = {"Sim/cockpit/radios/nav1 freq hz": 111.90}, action) {
    let result = Object.assign({}, state);
    switch (action.type) {
        case DATAREF_VALUE_CHANGED_ON_CLIENT: {
            result[action.dataRef] = action.value;
            return result;
        }
    }
    return state;
}