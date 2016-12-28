import * as React from 'react';
import { connect } from 'react-redux';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';

class Airspeed extends React.Component {


    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className="altitude">
                Airspeed (kt):
                <SevenSegmentNumber className="airspeed" max={999} numDecimals={0} nanText="NaN" zeroPadding={false}>{this.props.datarefValue}</SevenSegmentNumber>
            </div>
        );
    }

}

function model() {
    return {};
}

export default connect(model)(subscribeToDataref(Airspeed));