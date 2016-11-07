import React from 'react';
import ConnectionStatus from '../ConnectionStatus/ConnectionStatus.jsx';
import {connect} from 'react-redux';

class WebSocket extends React.Component {

    constructor() {
        super();
        this.queue = [];
    }

    componentDidMount() {
        this.props.handleStatusChange("connecting");
        this._createAndOpenWebsocket();
    }

    _createAndOpenWebsocket() {
        this.ws = new window.WebSocket(this.props.url, this.props.protocol);
        this.ws.onmessage = event => {
            console.log("Mottok WS-melding: ", event.data);
            if (this.props.handleMessage) {
                this.props.handleMessage(event.data)
            }
        };
        this.ws.onopen = event => {
            this.props.handleStatusChange("connected");
            var queued = this.queue.shift();
            while (queued) {
                this.ws.send(queued);
                queued = this.queue.shift();
            }
            this.queue = undefined;
        };
        this.ws.onclose = event => {
            this.props.handleStatusChange("disconnected");
            if (this.props.reOpenOnClose) {
                window.setTimeout(() => this._createAndOpenWebsocket(), 2000);
            }

        };
    }

    render() {
        console.log("this.props.status =", this.props.websocketStatus);
        return this.props.displayStatus ? (
            <ConnectionStatus status={this.props.websocketStatus}>{this.props.children}</ConnectionStatus>
        ) : <div></div>;
    }

    send() {
        console.trace("WebSocket.send", arguments);
        if (this.queue) {
            this.queue.push(JSON.stringify(Array.prototype.slice.call(arguments)));
        } else {
            this.ws.send(JSON.stringify(Array.prototype.slice.call(arguments)));
        }
    }

}

WebSocket.propTypes = {
    handleMessage: React.PropTypes.func,
    url: React.PropTypes.string.isRequired,
    handleStatusChange: React.PropTypes.func.isRequired,
    displayStatus: React.PropTypes.bool,
    protocol: React.PropTypes.string,
    websocketStatus: React.PropTypes.string,
    reOpenOnClose: React.PropTypes.bool
};

WebSocket.defaultProps = {
    displayStatus: false,
    reOpenOnClose: true
};

export default WebSocket;