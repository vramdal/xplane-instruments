import React from 'react';
import { connect } from 'react-redux';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';

class Transponder extends React.Component {

    render() {
        return (
            <instrument className="Transponder">
                <SevenSegmentNumber className="Transponder" max={999} numDecimals={0} nanText="NaN" zeroPadding={true}>{this.props.datarefValue}</SevenSegmentNumber>
            </instrument>
        );
    }
}

function model(/*state, ownProps*/) {
    return {
    }
}

export default connect(model)(subscribeToDataref(Transponder));
