import React from 'react';
import { connect } from 'react-redux';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';
// import ScrollKnob from '../components/ScrollKnob/ScrollKnob.jsx';
import './Transponder.scss';

class Transponder extends React.Component {

    onChange(knobIdx, value) {
        console.trace("Transponder.onChange", arguments);
    }

    render() {
        return (
            <instrument className="Transponder">
                <SevenSegmentNumber className="Transponder" digits={4} max={9999} numDecimals={0} nanText="NaN" zeroPadding={true}>{this.props.datarefValue}</SevenSegmentNumber>
            </instrument>
        );
    }
}

function model(/*state, ownProps*/) {
    return {
    }
}

export default connect(model)(subscribeToDataref(Transponder));
