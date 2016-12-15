import React from 'react';
import ReactDOM from 'react-dom';
import DME from './instruments/DME.jsx';
import Panel from './components/Panel/Panel.jsx';
import Knob from './components/Knob/Knob.jsx';
// import ScrollKnob from './components/ScrollKnob/ScrollKnob.jsx';
import RadioActiveStandby from './instruments/RadioActiveStandby.jsx';
import Transponder from './instruments/Transponder.jsx';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import combinedReducer from './reducers';
import {onWebsocketStatusChange, onWebsocketMessage} from './actions/WebsocketAction';
import {dataRefValueChangedOnClient, subscribeToDataRef} from './actions/DataRefActions';
import XPlane from './components/XPlane/XPlane.jsx';
//import Speech from './components/Speech/Speech.jsx';

import './Main.scss';

if (module.hot) {
    module.hot.accept();
}

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
                        <XPlane simulate={false}/>
                        <Knob/>
                        {/*<Speech/>*/}
                        <Panel title="Transponder" id="transponder">
                           <Transponder dataRef="Sim/cockpit/radios/transponder code"/>
                        </Panel>
                        <Panel title="Navigation Radio" id="nav1">
                            <RadioActiveStandby dataRefs={["sim/cockpit/radios/nav1_freq_hz", "sim/cockpit/radios/nav1_stdby_freq_hz"]}/>
                            <RadioActiveStandby dataRefs={["sim/cockpit/radios/nav2_freq_hz", "sim/cockpit/radios/nav2_stdby_freq_hz"]}/>
                        </Panel>
                        <Panel title="DME" id="dme">
                            <DME dataRef="sim/cockpit/radios/adf1_dme_dist_m"/>
                            <DME dataRef="sim/cockpit/radios/adf2_dme_dist_m"/>
                        </Panel>
                    </div>
                </Provider>
        );
    }

}

const store = createStore(combinedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());;
ReactDOM.render(<Main/>, document.getElementById('app'));