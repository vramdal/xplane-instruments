import React from 'react';
import './NavRadio.scss';
import Knob from '../components/Knob/Knob.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { connect } from 'react-redux';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';

export class NavRadio extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({frequency: nextProps.datarefValue / 100});
    }

    onMajorKnobChange(changedAmount) {
        let newValue = this.state.frequency + changedAmount;
        newValue = Math.min(newValue, this.props.max);
        newValue = Math.max(newValue, this.props.min);
        console.log("Major knob change", changedAmount);
        this.onNewValue(newValue);
    }

    onMinorKnobChange(changedAmount) {
        let oldFraction = this.state.frequency - Math.floor(this.state.frequency);
        let movedFraction = Math.sign(changedAmount) * 5 / 100;
        let newFraction = oldFraction + movedFraction;
        if (newFraction > 95) {
            newFraction = 95;
        } else if (newFraction < 0) {
            newFraction = 0;
        }
        let newValue = this.state.frequency - (oldFraction + newFraction);
        console.log("Minor knob change", changedAmount);
        this.onNewValue(newValue);
    }

    getDataRef() {
        return this.props.dataRef;
    }

    onNewValue(newValue) {
        this.props.onChangedOnClient(newValue * 100);
    }

    render() {
        return (
                <nav-radio>
                    <SevenSegmentNumber max={this.props.max} numDecimals={2} nanText="NaN">{this.state.frequency}</SevenSegmentNumber>
                    <dual-knob>
                        <Knob axis="horizontal" className="major" onchange={this.onMajorKnobChange.bind(this)}/>
                        <Knob axis="vertical" className="minor" onchange={this.onMinorKnobChange.bind(this)}/>
                    </dual-knob>
                </nav-radio>
        );
    }

}

function model(state, ownProps) {
    return {}
}

NavRadio.propTypes = {
    onchange: React.PropTypes.func,
    onuserchanged: React.PropTypes.func,
    max: React.PropTypes.number,
    min: React.PropTypes.number
};

NavRadio.defaultProps = {
    max: 117.95,
    min: 108.00
};

export default connect(model)(subscribeToDataref(NavRadio));
//export default NavRadio;