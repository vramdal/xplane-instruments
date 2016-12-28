import * as React from 'react';
import { connect } from 'react-redux';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';

class VerticalVelocity extends React.Component {


    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className="vertical-velocity">
                Vertical Velocity (fpm):
                <SevenSegmentNumber className="vertical-velocity" max={9999} numDecimals={0} nanText="NaN" zeroPadding={false}>{this.props.datarefValue}</SevenSegmentNumber>
            </div>
        );
    }

}

function model() {
    return {};
}

export default connect(model)(subscribeToDataref(VerticalVelocity));