import React from 'react';
import ReactDOM from 'react-dom';
import DME from './instruments/DME.jsx';
import Panel from './components/Panel/Panel.jsx';
import Knob from './components/Knob/Knob.jsx';
import Autopilot from './instruments/Autopilot.jsx';
import Altitude from './instruments/Altitude.jsx';
import Airspeed from './instruments/Airspeed.jsx';
import Compass from './instruments/Compass.jsx';
import LandingGear from './instruments/LandingGear.jsx';
import VerticalVelocity from './instruments/VerticalVelocity.jsx';
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
                           <Transponder dataRef="sim/cockpit/radios/transponder code"/>
                        </Panel>
                        <Panel title="Navigation Radio" id="nav1">
                            <RadioActiveStandby title="NAV 1" dataRefs={["sim/cockpit/radios/nav1_freq_hz", "sim/cockpit/radios/nav1_stdby_freq_hz"]}/>
                            <RadioActiveStandby title="NAV 2" dataRefs={["sim/cockpit/radios/nav2_freq_hz", "sim/cockpit/radios/nav2_stdby_freq_hz"]}/>
                        </Panel>
                        <Panel title="ADF" id="adf">
                            <RadioActiveStandby title="ADF 1" decimals={0} dataRefs={["sim/cockpit/radios/adf1_freq_hz", "sim/cockpit/radios/adf1_stdby_freq_hz"]}/>
                            <RadioActiveStandby title="ADF 2" decimals={0} dataRefs={["sim/cockpit/radios/adf2_freq_hz", "sim/cockpit/radios/adf2_stdby_freq_hz"]}/>
                        </Panel>
                        <Panel title="DME" id="dme">
                            <DME title="NAV 1" dataRef="sim/cockpit/radios/nav1_dme_distance_nm"/>
                            <DME title="NAV 2" dataRef="sim/cockpit/radios/nav2_dme_distance_nm"/>
                        </Panel>
                        <Panel title="Auto pilot" id="autopilot">
                            <Autopilot dataRefs={["sim/cockpit/autopilot/heading_mag", "sim/cockpit/autopilot/vertical_velocity", "sim/cockpit/autopilot/altitude"]}/>
                        </Panel>
                        <Panel title="Speed and altitude" id="speed-and-altitude">
                            <Altitude dataRef="sim/cockpit2/gauges/altitude_ft_pilot"/>
                            <Airspeed dataRef="sim/cockpit2/gauges/indicators/airspeed_kts_pilot"/>
                            <Compass dataRef="sim/cockpit2/gauges/indicators/compass_heading_deg_mag"/>
                            <VerticalVelocity dataRef="sim/cockpit2/gauges/indicators/vvi_fpm_pilot"/>
                        </Panel>
                        <Panel title="Landing" id="landing">
                            <LandingGear dataRef="sim_aircraft/parts/acf_gear_deploy"/>
                        </Panel>
                    </div>
                </Provider>
        );
    }

}

const store = createStore(combinedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());;
ReactDOM.render(<Main/>, document.getElementById('app'));