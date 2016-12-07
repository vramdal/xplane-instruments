import React from 'react';
import './RadioActiveStandby.scss';
// import Knob from '../components/Knob/Knob.jsx';
import { connect } from 'react-redux';
// import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';
import DualShaftKnob from '../components/ScrollKnob/DualShaftKnob.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { subscribeToDatarefs } from '../components/Lang/MultiDatarefHOC.jsx';

export class RadioActiveStandby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            frequencyActive: props.dataRefValues[0],
            frequencyStandby: props.dataRefValues[1]
        };
        this.dataRefActive = props.dataRefs[0];
        this.dataRefStandby= props.dataRefs[1];
    }

    componentWillReceiveProps(nextProps) {
        this.setState({frequencyActive: nextProps.dataRefValues[0], frequencyStandby: nextProps.dataRefValues[1]});
    }

    getDataRefs() {
        return [this.props.dataRefActive, this.props.dataRefStandby];
    }

    onNewKnobValue(newValue) {
        // this.props.onChangedOnClient(this.dataRefStandby, (this.state.frequencyStandby + changedBy) * 100);
        this.props.onChangedOnClient(this.dataRefStandby, (newValue));
    }

    switchFrequencies() {
        this.props.onChangedOnClient(this.dataRefStandby, this.state.frequencyActive);
        this.props.onChangedOnClient(this.dataRefActive, this.state.frequencyStandby);
    }

    render() {
        return (
            <radio-active-standby>
                <SevenSegmentNumber dataRef={this.dataRefActive} max={999.99} numDecimals={2}
                                    nanText="NaN">{this.state.frequencyActive}</SevenSegmentNumber>

                {this.props.expanded &&    <button className="switchButton" onClick={this.switchFrequencies.bind(this)}/>}
                {this.props.expanded &&    <SevenSegmentNumber dataRef={this.dataRefStandby} max={999.99} numDecimals={2}
                                                               nanText="NaN">{this.state.frequencyStandby}</SevenSegmentNumber>}
                {this.props.expanded &&    <DualShaftKnob max={this.props.max} min={this.props.min} captureAll={this.props.expanded}
                                                          onChange={this.onNewKnobValue.bind(this)} value={this.state.frequencyStandby}/> }
            </radio-active-standby>
        )

    }
}
function model(state, ownProps) {
    return {}
}

export default connect(model)(subscribeToDatarefs(RadioActiveStandby));

RadioActiveStandby.propTypes = {
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    expanded: React.PropTypes.bool
};

RadioActiveStandby.defaultProps = {
    dataRefs: ["sim/cockpit/radios/nav1_freq_hz", "sim/cockpit/radios/nav1_stdby_freq_hz"],
    max: 117.95,
    min: 108.00,
    expanded: true
};