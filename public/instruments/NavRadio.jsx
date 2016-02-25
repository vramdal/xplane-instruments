import React from 'react';
import './NavRadio.scss';
import Knob from '../components/Knob/Knob.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { connect } from 'react-redux';
import { dataRefValueChangedOnClient } from '../actions/DataRefActions';

class NavRadio extends React.Component {

    onMajorKnobChange(changedAmount) {
        let newValue = this.props.frequency + changedAmount;
        this.onNewValue(newValue);
    }

    onMinorKnobChange(changedAmount) {
        let fractions = this.props.frequency - Math.floor(this.props.frequency);
        let newValue = this.props.frequency + fractions + changedAmount / 100
        this.onNewValue(newValue);
    }

    onNewValue(newValue) {
        newValue = Math.min(newValue, this.props.max);
        newValue = Math.max(newValue, this.props.min);
        this.props.dispatch(
                dataRefValueChangedOnClient(this.props.dataRefId, newValue)
        );
    }

    render() {
        return (
                <nav-radio>
                    <SevenSegmentNumber max={this.props.max} numDecimals={2} nanText="NaN">{this.props.frequency}</SevenSegmentNumber>
                    <Knob axis="horizontal" onchange={this.onMajorKnobChange.bind(this)}>
                        <Knob axis="vertical" onchange={this.onMinorKnobChange.bind(this)}/>
                    </Knob>

                </nav-radio>
        );
    }

}

function model(state, ownProps) {
    console.log("state =", state);
    let dataRefId = ownProps["dataRefId"];
    if (dataRefId) {
        return {
            frequency: state.dataRef[dataRefId]
        }
    }
    return {};
}

NavRadio.propTypes = {
    frequency: React.PropTypes.number,
    onchange: React.PropTypes.func,
    dataRefId: React.PropTypes.string,
    dispatch: React.PropTypes.func,
    max: React.PropTypes.number,
    min: React.PropTypes.number
};

NavRadio.defaultProps = {
    max: 199,
    min: 100
};

export default connect(model)(NavRadio);