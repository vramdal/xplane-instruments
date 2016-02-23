import React from 'react';
import ConnectionStatus from '../ConnectionStatus/ConnectionStatus.jsx';
import { connect } from 'react-redux';

class WebSocket extends React.Component {

    componentDidMount() {
        this.props.handleStatusChange("connecting");
        this.ws = new window.WebSocket(this.props.url, this.props.protocol);
        this.ws.onmessage = event => {if (this.props.handleMessage) {this.props.handleMessage(event.data)}};
        this.ws.onopen = event => {this.props.handleStatusChange("connected")};
        this.ws.onclose = event => {this.props.handleStatusChange("disconnected")};
    }

    render() {
        console.log("this.props.status =", this.props.websocketStatus);
        return this.props.displayStatus ? (
                <ConnectionStatus status={this.props.websocketStatus}>WebSocket </ConnectionStatus>
        ) : <div></div>;
    }

}

WebSocket.propTypes = {
    handleMessage: React.PropTypes.func,
    url: React.PropTypes.string.isRequired,
    handleStatusChange: React.PropTypes.func.isRequired,
    displayStatus: React.PropTypes.bool,
    protocol: React.PropTypes.string
};

WebSocket.defaultProps = {
    displayStatus: false
};

function model(state) {
    return {
        websocketStatus: state.connectionState.status
    }
}

export default connect(model)(WebSocket);