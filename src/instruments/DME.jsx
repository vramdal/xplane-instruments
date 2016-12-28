import React from 'react';
import { connect } from 'react-redux';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';

class DME extends React.Component {

    render() {
        return (
                <instrument className="DME">
                    {this.props.title}:
                    <SevenSegmentNumber className="DME" max={999} numDecimals={2} nanText="NaN" zeroPadding={false}>{this.props.datarefValue}</SevenSegmentNumber>
                </instrument>
        );
    }

}

function model(state, ownProps) {
    return {
        //value: state.dataIndex && state.dataIndex[102] ? state.dataIndex[102][3] : undefined
        datarefValue:  state.xplane.values[ownProps.dataRef] && state.xplane.values[ownProps.dataRef].value
    }
}

DME.propTypes = {
    title: React.PropTypes.string
};

export default connect(model)(subscribeToDataref(DME));
