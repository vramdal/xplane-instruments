import React from 'react';
import ReactDOM from 'react-dom';
import DME from './instruments/DME.jsx';
import Panel from './components/Panel/Panel.jsx';
import NavRadio from './instruments/NavRadio.jsx';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import WebSocket from './components/WebSocket/WebSocket.jsx';
import combinedReducer from './reducers';
import {onWebsocketStatusChange, onWebsocketMessage} from './actions/WebsocketAction';
import {dataRefValueChangedOnClient} from './actions/DataRefActions';
import { connect } from 'react-redux';

import './Main.scss';

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
                    <div id="Main">
                        <WebSocket url="ws://localhost:8080"
                                   protocol="xplane"
                                   handleStatusChange={this.handleWebSocketStatusChange.bind(this)}
                                   handleMessage={this.handleWebSocketMessage.bind(this)}
                                   displayStatus={true}
                        />
                        <h1>Dashboard</h1>
                        <Panel title="Nav 1">
                            <NavRadio dataRefId="Sim/cockpit/radios/nav1 freq hz" />
                        </Panel>
                        <Panel title="DME">
                            <DME></DME>

                        </Panel>
                    </div>
                </Provider>
        );
    }

}

let store = createStore(combinedReducer);
ReactDOM.render(<Main/>, document.getElementById('app'));