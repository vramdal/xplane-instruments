import React from 'react';
import WebSocket from '../WebSocket/WebSocket.jsx';
import { connect } from 'react-redux';
import {onWebsocketStatusChange} from '../../actions/WebsocketAction';
import {dataRefValueChangedInXPlane} from '../../actions/DataRefActions';

class XPlane extends React.Component {

    constructor(props) {
        super(props);
        console.log("arguments =", arguments);
        console.log("props =", props);
        let nextSubscriptions = props.subscriptions;
        let addedSubscriptions = this.findAddedSubscriptions(nextSubscriptions, []);
        console.log("addedSubscriptions on constructor =", addedSubscriptions, nextSubscriptions);
    }

    handleWebSocketStatusChange(status) {
        this.props.dispatch(onWebsocketStatusChange(status));
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        let nextSubscriptions = nextProps.subscriptions.slice();
        let oldSubscriptions = this.props.subscriptions.slice();

        var addedSubscriptions = this.findAddedSubscriptions(nextSubscriptions, oldSubscriptions);
        let removedSubscriptions = this.findRemovedSubscriptions(nextSubscriptions, oldSubscriptions);

        for (let subscription of addedSubscriptions) {
            this.websocket.send(413, "RREF\0", subscription.frequency, subscription.internalId, subscription.dataRef + "\0");
        }

        for (let subscription of removedSubscriptions) {
            this.websocket.send("RREF", 0, subscription.internalId, subscription.dataRef);
        }

        console.log("addedSubscriptions =", addedSubscriptions, nextSubscriptions);
        console.log("removedSubscriptions =", removedSubscriptions);
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
        //console.log("Melding fra webSocket", data);
        this.props.dispatch(dataRefValueChangedInXPlane(data[1], data[2]));
    }

    render() {
        var subscriptions = [];
        for (let internalId in this.props.subscriptions) {
            if (!this.props.subscriptions.hasOwnProperty(internalId)) {
                continue;
            }
            subscriptions.push(<li key={internalId}>{this.props.subscriptions[internalId].dataRef}</li>)
        }
        return (
                <div>
                    <ol>
                        {subscriptions}
                    </ol>
                    <WebSocket url="ws://localhost:8080"
                               protocol="xplane"
                               handleStatusChange={this.handleWebSocketStatusChange.bind(this)}
                               handleMessage={this.handleWebSocketMessage.bind(this)}
                               displayStatus={true} ref={ref => this.websocket = ref}
                    />
                </div>

        );
    }

}

function model(state) {
    return {
        subscriptions: state.xplane.subscriptions.slice(),
        numSubscriptions: state.xplane.subscriptions.length
    }

}

XPlane.propTypes = {
    //host: React.PropTypes.string.isRequired,
    subscriptions: React.PropTypes.array,
    dispatch: React.PropTypes.func
};

export default connect(model)(XPlane);