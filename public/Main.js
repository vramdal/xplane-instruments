import React from 'react';
import ReactDOM from 'react-dom';
import DME from './instruments/DME.jsx';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus.jsx';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import WebSocket from './components/WebSocket/WebSocket.jsx';
import combinedReducer from './reducers';
import {onWebsocketStatusChange, onWebsocketMessage} from './actions/WebsocketAction';
import { connect } from 'react-redux';

export default class Main extends React.Component {

    handleWebSocketStatusChange(status) {
        store.dispatch(onWebsocketStatusChange(status));
    }

    handleWebSocketMessage(msgStr) {
        store.dispatch(onWebsocketMessage(msgStr));
    }

    render() {
        return (
                <Provider store={store}>
                    <div>
                        <WebSocket url="ws://localhost:8080"
                                   protocol="xplane"
                                   handleStatusChange={this.handleWebSocketStatusChange.bind(this)}
                                   handleMessage={this.handleWebSocketMessage.bind(this)}
                                   displayStatus={true}
                                   status={this.props.websocketStatus}
                        />
                        <h1>Dashboard</h1>
                        <DME></DME>
                    </div>
                </Provider>
        );
    }

}

export default Main;

let store = createStore(combinedReducer);
ReactDOM.render(<Main/>, document.getElementById('app'));