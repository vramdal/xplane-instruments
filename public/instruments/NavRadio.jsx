import React from 'react';
import './NavRadio.scss';
import Knob from '../components/Knob/Knob.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { connect } from 'react-redux';
import { dataRefValueChangedOnClient, subscribeToDataRef } from '../actions/DataRefActions';

class NavRadio extends React.Component {

    componentDidMount() {
        this.props.dispatch(subscribeToDataRef(this.props.dataRef, 1));
    }

    onMajorKnobChange(changedAmount) {
        let newValue = this.props.frequency + changedAmount;
        newValue = Math.min(newValue, this.props.max);
        newValue = Math.max(newValue, this.props.min);
        console.log("Major knob change");
        this.onNewValue(newValue);
    }

    onMinorKnobChange(changedAmount) {
        let oldFraction = this.props.frequency - Math.floor(this.props.frequency);
        let movedFraction = Math.sign(changedAmount) * 5 / 100;
        let newFraction = oldFraction + movedFraction;
        //console.log("changedAmount", changedAmount, "oldFraction", oldFraction, "movedFraction", movedFraction, "newFraction", newFraction);
        if (newFraction > 95) {
            newFraction = 95;
        } else if (newFraction < 0) {
            newFraction = 0;
        }
        let newValue = this.props.frequency - oldFraction + newFraction;
        this.onNewValue(newValue);
    }

    getDataRef() {
        return this.props.dataRef;
    }

    onNewValue(newValue) {
        this.props.onuserchanged(this, newValue);
    }

    render() {
        return (
                <nav-radio>
                    <SevenSegmentNumber max={this.props.max} numDecimals={2} nanText="NaN">{this.props.frequency}</SevenSegmentNumber>
                    <dual-knob>
                        <Knob axis="horizontal" className="major" onchange={this.onMajorKnobChange.bind(this)}/>
                        <Knob axis="vertical" className="minor" onchange={this.onMinorKnobChange.bind(this)}/>
                    </dual-knob>
                </nav-radio>
        );
    }

}

function model(state, ownProps) {
    console.log("state =", state);
    let dataRefId = ownProps["dataRefId"];
    if (dataRefId) {
        return {
            value: state.xplane.subscriptions[dataRefId] ? state.xplane.subscriptions[dataRefId].value : undefined
        }
    }
    return {};
}

NavRadio.propTypes = {
    frequency: React.PropTypes.number,
    onchange: React.PropTypes.func,
    dataRef: React.PropTypes.string,
    onuserchanged: React.PropTypes.func,
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    value: React.PropTypes.number
};

NavRadio.defaultProps = {
    max: 199,
    min: 100
};

export default connect(model)(NavRadio);
//export default NavRadio;