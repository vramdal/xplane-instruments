import React from 'react';
import ConnectionStatus from '../ConnectionStatus/ConnectionStatus.jsx';
import { connect } from 'react-redux';

class WebSocket extends React.Component {

    constructor() {
        super();
        this.queue = [];
    }

    componentDidMount() {
        this.props.handleStatusChange("connecting");
        this.ws = new window.WebSocket(this.props.url, this.props.protocol);
        this.ws.onmessage = event => {if (this.props.handleMessage) {this.props.handleMessage(event.data)}};
        this.ws.onopen = event => {
            this.props.handleStatusChange("connected");
            var queued = this.queue.shift();
            while (queued) {
                this.ws.send(queued);
                queued = this.queue.shift();
            }
            this.queue = undefined;
        };
        this.ws.onclose = event => {this.props.handleStatusChange("disconnected")};
    }

    render() {
        console.log("this.props.status =", this.props.websocketStatus);
        return this.props.displayStatus ? (
                <ConnectionStatus status={this.props.websocketStatus}>WebSocket </ConnectionStatus>
        ) : <div></div>;
    }

    send() {
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
    websocketStatus: React.PropTypes.string
};

WebSocket.defaultProps = {
    displayStatus: false
};

export default WebSocket;