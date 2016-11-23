import React from 'react';
import WebSocket from '../WebSocket/WebSocket.jsx';
import { connect } from 'react-redux';
import {onWebsocketStatusChange} from '../../actions/WebsocketAction';
import {dataRefValueChangedInXPlane, dataValueChangedInXPlane} from '../../actions/DataRefActions';

class XPlane extends React.Component {

    constructor(props) {
        super(props);
        console.log("arguments =", arguments);
        console.log("props =", props);
        let nextSubscriptions = props.subscriptions;
        let addedSubscriptions = this.findAddedSubscriptions(nextSubscriptions, []);
        console.log("addedSubscriptions on constructor =", addedSubscriptions, nextSubscriptions);
        this.state = {};
    }


    handleWebSocketStatusChange(status) {
        this.props.onWebsocketStatusChange(status);
    }

    componentWillMount() {
        this.dummyValue = 1;
/*
        this.dummyInterval = window.setInterval(() => {
            this.props.dataRefValueChangedInXPlane(3, this.dummyValue++);
        }, 1000);
*/
    }

    componentWillUnmount() {
        window.clearInterval(this.dummyInterval);
    }

    componentWillReceiveProps(nextProps) {
        // TODO: Skille ut subscriptions i egen komponent (SubscriberRegistry?)
        let nextSubscriptions = nextProps.subscriptions;
        let oldSubscriptions = this.props.subscriptions;

        if (nextSubscriptions !== oldSubscriptions) {
            console.warn("Nye subscriptions");

            var addedSubscriptions = this.findAddedSubscriptions(nextSubscriptions, oldSubscriptions);
            let removedSubscriptions = this.findRemovedSubscriptions(nextSubscriptions, oldSubscriptions);

            for (let subscription of addedSubscriptions) {
                //this.websocket.send(413, "RREF\0", subscription.frequency, subscription.internalId, subscription.dataRef + "\0");
            }

            for (let subscription of removedSubscriptions) {
                this.websocket.send("RREF", 0, subscription.internalId, subscription.dataRef);
            }

            console.log("addedSubscriptions =", addedSubscriptions, nextSubscriptions);
            console.log("removedSubscriptions =", removedSubscriptions);
        }

        let nextDirtyValues = nextProps.dirtyValues;
        let oldDirtyValues = this.props.dirtyValues;

        if (nextDirtyValues !== oldDirtyValues) {

            for (let dataref in nextProps.dirtyValues) {
                if (!nextProps.dirtyValues.hasOwnProperty(dataref)) {
                    continue;
                }
                let value = nextProps.dirtyValues[dataref].value;
                // TODO: DREF0+(4byte byte value of 1)+ sim/cockpit/switches/anti_ice_surf_heat_left+0+spaces to complete to 509 bytes
                this.websocket.send(509, "DREF\0", value, dataref + "\0");
            }
        }
    }

    findAddedSubscriptions(nextSubscriptions, oldSubscriptions) {
        let addedSubscriptions = [];
        for (let i = 0; i < nextSubscriptions.length; i++) {
            if (oldSubscriptions.length > i && oldSubscriptions[i]) {
                continue;
            }
            addedSubscriptions.push(nextSubscriptions[i]);
        }
        return addedSubscriptions;
    }

    findRemovedSubscriptions(nextSubscriptions, oldSubscriptions) {
        let removedSubscriptions = [];
        for (let i = 0; i < oldSubscriptions.length; i++) {
            if (nextSubscriptions.length > i && nextSubscriptions[i]) {
                continue;
            }
            removedSubscriptions.push(oldSubscriptions[i]);
        }
        return removedSubscriptions;
    }


    handleWebSocketMessage(data) {
        data = JSON.parse(data);
        if (data.type === "PROXY-META") {
            this.setState({"websocketText": "Assuming X-Plane at " + data.XPLANE_IP + ":" + data.XPLANE_PORT + ", listening to " + data.LOCAL_UDP_PORT })
        } else {
            //console.log("Melding fra webSocket", data);
            let msgType = data[0];
            switch(msgType) {
                case "DREF": this.props.dataRefValueChangedInXPlane(data[1], data[2]); break;
                case "DATA": this.props.dataValueChangedInXPlane(data[1], data[2])
            }
        }
    }

    render() {
        var subscriptions = [];
        for (let internalId in this.props.subscriptions) {
            if (!this.props.subscriptions.hasOwnProperty(internalId)) {
                continue;
            }
            subscriptions.push(<li key={internalId}>{this.props.subscriptions[internalId].dataRef}</li>)
        }
        let dirtyValues = [];
        for (let dataRef in this.props.dirtyValues) {
            if (!this.props.subscriptions.hasOwnProperty(dataRef)) {
                continue;
            }
            dirtyValues.push(<li key={dataRef}>{this.props.dirtyValues[dataRef]}</li>)

        }
        return (
                <div>
                    <ol>
                        {subscriptions}
                    </ol>
                    <ol>
                        {dirtyValues}
                    </ol>
                    <WebSocket url="ws://localhost:8080"
                               protocol="xplane"
                               handleStatusChange={this.handleWebSocketStatusChange.bind(this)}
                               handleMessage={this.handleWebSocketMessage.bind(this)}
                               displayStatus={true} ref={ref => this.websocket = ref}
                               websocketStatus={this.props.websocketStatus}
                    >{this.state.websocketText}</WebSocket>
                </div>

        );
    }

}

function model(state) {
    return {
        subscriptions: state.xplane.subscriptions,
        numSubscriptions: state.xplane.subscriptions.length,
        dirtyValues: state.xplane.dirtyValues,
        websocketStatus: state.connectionState.status
    }

}

XPlane.propTypes = {
    subscriptions: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    dirtyValues: React.PropTypes.object
};

export default connect(model, {onWebsocketStatusChange, dataRefValueChangedInXPlane, dataValueChangedInXPlane})(XPlane);