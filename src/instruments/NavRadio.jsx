import React from 'react';
import './NavRadio.scss';
// import Knob from '../components/Knob/Knob.jsx';
import DualShaftKnob from '../components/ScrollKnob/DualShaftKnob.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { connect } from 'react-redux';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';

export class NavRadio extends React.Component {

    constructor(props) {
        super();
        this.state = {frequency: props.datarefValue / 100};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({frequency: nextProps.datarefValue / 100});
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
                    <DualShaftKnob max={this.props.max} min={this.props.min} onChange={this.onNewValue.bind(this)} value={this.state.frequency}/>
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