import React from 'react';
import './NavRadio.scss';
import Knob from '../components/Knob/Knob.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { connect } from 'react-redux';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';

export class NavRadio extends React.Component {

    onMajorKnobChange(changedAmount) {
        let newValue = this.props.datarefValue + changedAmount;
        newValue = Math.min(newValue, this.props.max);
        newValue = Math.max(newValue, this.props.min);
        console.log("Major knob change");
        this.onNewValue(newValue);
    }

    onMinorKnobChange(changedAmount) {
        let oldFraction = this.props.datarefValue - Math.floor(this.props.datarefValue);
        let movedFraction = Math.sign(changedAmount) * 5 / 100;
        let newFraction = oldFraction + movedFraction;
        if (newFraction > 95) {
            newFraction = 95;
        } else if (newFraction < 0) {
            newFraction = 0;
        }
        let newValue = this.props.datarefValue - oldFraction + newFraction;
        this.onNewValue(newValue);
    }

    getDataRef() {
        return this.props.dataRef;
    }

    onNewValue(newValue) {
        this.props.onChangedOnClient(newValue);
    }

    render() {
        return (
                <nav-radio>
                    <SevenSegmentNumber max={this.props.max} numDecimals={2} nanText="NaN">{this.props.datarefValue}</SevenSegmentNumber>
                    <dual-knob>
                        <Knob axis="horizontal" className="major" onchange={this.onMajorKnobChange.bind(this)}/>
                        <Knob axis="vertical" className="minor" onchange={this.onMinorKnobChange.bind(this)}/>
                    </dual-knob>
                </nav-radio>
        );
    }

}

function model(state, ownProps) {
    return {
        // value: state.xplane.values[ownProps.dataRef] && state.xplane.values[ownProps.dataRef].value
    }
}

NavRadio.propTypes = {
    onchange: React.PropTypes.func,
    onuserchanged: React.PropTypes.func,
    max: React.PropTypes.number,
    min: React.PropTypes.number
};

NavRadio.defaultProps = {
    max: 199,
    min: 100
};

export default connect(model)(subscribeToDataref(NavRadio));
//export default NavRadio;