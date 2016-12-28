import * as React from 'react';
import { connect } from 'react-redux';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';

class Altitude extends React.Component {


    constructor() {
        super();
        this.state = {}
    }

    /* Mounting */
    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    /* Updating */
    componentWillReceiveProps(nextProps) {
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    getDataRef() {
        return "sim/cockpit2/gauges/altitude_ft_pilot";
    }

    render() {
        return (
            <div className="altitude">
                Altitude (ft):
                <SevenSegmentNumber className="altitude" max={99999.99} numDecimals={2} nanText="NaN" zeroPadding={false}>{this.props.datarefValue}</SevenSegmentNumber>
            </div>
        );
    }

}

function model() {
    return {};
}

export default connect(model)(subscribeToDataref(Altitude));