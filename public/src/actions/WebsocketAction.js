export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE';
export const WEBSOCKET_CONNECTED = 'WEBSOCKET_CONNECTED';
export const WEBSOCKET_DISCONNECTED = 'WEBSOCKET_DISCONNECTED';
export const WEBSOCKET_CONNECTING = 'WEBSOCKET_CONNECTING';

export function onWebsocketStatusChange(statusStr) {
    console.log("statusStr =", statusStr);
    if ((statusStr) === "connected") {
        return onWebsocketConnect();
    } else if ((statusStr) === "disconnected") {
        return onWebsocketDisconnect();
    } else if (statusStr === "connecting") {
        return onWebsocketConnecting();
    } else {
        console.log("statusStr =", statusStr);
        return {};
    }

}

export function onWebsocketMessage(msgStr) {
    var msg = JSON.parse(msgStr);
    return {
        type: WEBSOCKET_MESSAGE,
        dataIndex: msg.dataIndex,
        payload: msg.payload
    }
}

function onWebsocketConnect() {
    return {
        type: WEBSOCKET_CONNECTED
    }
}

function onWebsocketDisconnect() {
    return {
        type: WEBSOCKET_DISCONNECTED
    }
}

function onWebsocketConnecting() {
    return {
        type: WEBSOCKET_CONNECTING
    }
}