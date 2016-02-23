import React from 'react';
import './style.scss';

export default class SevenSegment extends React.Component {

    render() {
        var clazz = this.props.children == "." ? "dot": undefined;
        return (
                <seven-segment class={clazz}>{this.props.children}</seven-segment>
        );
    }

}

SevenSegment.propTypes = {
    children: React.PropTypes.string
};