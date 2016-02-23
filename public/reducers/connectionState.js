import { WEBSOCKET_CONNECTED, WEBSOCKET_DISCONNECTED, WEBSOCKET_CONNECTING } from '../actions/WebsocketAction';

export function connectionState(state = {connected: false}, action) {
    let result = Object.assign({}, state);
    switch (action.type) {
        case WEBSOCKET_CONNECTED: {
            result.connected = true;
            result.status = "connected";
            return result;
        }
        case WEBSOCKET_DISCONNECTED: {
            result.connected = false;
            result.status = "disconnected";
            return result;
        }
        case WEBSOCKET_CONNECTING: {
            result.connected = false;
            result.status = "connecting";
            return result;
        }
    }
    return state;
}