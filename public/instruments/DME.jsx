import React from 'react';
import { connect } from 'react-redux';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';

class DME extends React.Component {

    render() {
        return (
            <SevenSegmentNumber max={999} numDecimals={2} nanText="NaN" zeroPadding={false}>{this.props.value}</SevenSegmentNumber>
        );
    }

}

function model(state) {
    return {
        value: state.dataIndex && state.dataIndex[102] ? state.dataIndex[102][3] : undefined
    }
}

DME.propTypes = {
    value: React.PropTypes.number
};

export default connect(model)(DME);
