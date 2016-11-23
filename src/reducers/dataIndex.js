import { WEBSOCKET_MESSAGE } from '../actions/WebsocketAction';

export function dataIndex(state = {}, action) {
    let result = Object.assign({}, state);
    switch (action.type) {
        case WEBSOCKET_MESSAGE: {
            result[action.dataIndex] = action.payload;
            return result;
        }
    }
    return state;
}