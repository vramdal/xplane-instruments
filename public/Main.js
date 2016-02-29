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
import {dataRefValueChangedOnClient, subscribeToDataRef} from './actions/DataRefActions';
import { connect } from 'react-redux';

import './Main.scss';

export default class Main extends React.Component {

    constructor() {
        super();
        this.instrumentsCounter = 0;
        this.instrumentsDataRefs = [];
    }

    handleWebSocketStatusChange(status) {
        store.dispatch(onWebsocketStatusChange(status));
    }

    handleWebSocketMessage(msgStr) {
        store.dispatch(onWebsocketMessage(msgStr));
    }

    onUserChangedInstrument(instrument, value) {
        let dataRef = instrument.getDataRef();
        store.dispatch(dataRefValueChangedOnClient(this.websocket, dataRef, value));
    }

    subscribeInstrument(instrumentRef) {
        let internalId = this.instrumentsCounter++;
        let dataRef = instrumentRef.getDataRef();
        this.instrumentsDataRefs.push({
             dataRef: dataRef, internalId: internalId
        });
        store.dispatch(subscribeToDataRef(this.websocket, instrumentRef.getDataRef(), 1, internalId));
    }

    render() {
        return (
                <Provider store={store}>
                    <div id="Main">
                        <WebSocket url="ws://localhost:8080"
                                   protocol="xplane"
                                   handleStatusChange={this.handleWebSocketStatusChange.bind(this)}
                                   handleMessage={this.handleWebSocketMessage.bind(this)}
                                   displayStatus={true} ref={ref => this.websocket = ref}
                        />
                        <h1>Dashboard</h1>
                        <Panel title="Nav 1">
                            <NavRadio dataRefId="Sim/cockpit/radios/nav1 freq hz"
                                      onuserchanged={this.onUserChangedInstrument.bind(this)}
                                      ref={ref => this.subscribeInstrument(ref)}
                            />
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