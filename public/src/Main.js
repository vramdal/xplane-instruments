import React from 'react';
import ReactDOM from 'react-dom';
import DME from './instruments/DME.jsx';
import Panel from './components/Panel/Panel.jsx';
import NavRadio from './instruments/NavRadio.jsx';
import Transponder from './instruments/Transponder.jsx';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import combinedReducer from './reducers';
import {onWebsocketStatusChange, onWebsocketMessage} from './actions/WebsocketAction';
import {dataRefValueChangedOnClient, subscribeToDataRef} from './actions/DataRefActions';
import { connect } from 'react-redux';
import XPlane from './components/XPlane/XPlane.jsx';

import './Main.scss';

export default class Main extends React.Component {

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

/*
    subscribeInstrument(instrumentRef) {
        let internalId = this.instrumentsCounter++;
        let dataRef = instrumentRef.getDataRef();
        this.instrumentsDataRefs.push({
             dataRef: dataRef, internalId: internalId
        });
        store.dispatch(subscribeToDataRef(this.websocket, instrumentRef.getDataRef(), 1, internalId));
    }
*/

    render() {
        return (
                <Provider store={store}>
                    <div id="Main">
                        <h1>Dashboard</h1>
                        <XPlane/>
                        <Panel title="Transponder">
                           <Transponder dataRef="Sim/cockpit/radios/transponder code"/>
                        </Panel>
                        <Panel title="Nav 1">
                            USE:
                            <NavRadio dataRef="sim/cockpit/radios/nav1_freq_hz"/>
                            STBY:
                            <NavRadio dataRef="sim/cockpit/radios/nav1_stdby_freq_hz"/>
                        </Panel>
                        <Panel title="DME">
                            <DME dataRef="sim/cockpit/radios/adf1_dme_dist_m"></DME>
                            <DME dataRef="sim/cockpit/radios/adf2_dme_dist_m"></DME>
                            {/*<DME dataRef="sim/cockpit/radios/transponder_code"></DME>*/}

                        </Panel>
                    </div>
                </Provider>
        );
    }

}

const store = createStore(combinedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());;
ReactDOM.render(<Main/>, document.getElementById('app'));