import React from 'react';
import './ConnectionStatus.scss';

export default class ConnectionStatus extends React.Component {

    render() {
        return (
                <connection-status class={this.props.status}>{this.props.children} {this.props.status}</connection-status>
        );
    }

}

ConnectionStatus.propTypes = {
    status: React.PropTypes.oneOf(["disconnected", "connecting", "connected"])
};
