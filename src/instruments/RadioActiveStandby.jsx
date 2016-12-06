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
            frequencyActive: props.dataRefValues[0] / 100,
            frequencyStandby: props.dataRefValues[1] / 100
        };
        this.dataRefActive = props.dataRefs[0];
        this.dataRefStandby= props.dataRefs[1];
    }

    componentWillReceiveProps(nextProps) {
        this.setState({frequencyActive: nextProps.dataRefValues[0] / 100, frequencyStandby: nextProps.dataRefValues[1] / 100});
    }

    getDataRefs() {
        return [this.props.dataRefActive, this.props.dataRefStandby];
    }

    onNewKnobValue(newValue) {
        // this.props.onChangedOnClient(this.dataRefStandby, (this.state.frequencyStandby + changedBy) * 100);
        this.props.onChangedOnClient(this.dataRefStandby, (newValue) * 100);
    }

    switchFrequencies() {
        this.props.onChangedOnClient(this.dataRefStandby, this.state.frequencyActive * 100);
        this.props.onChangedOnClient(this.dataRefActive, this.state.frequencyStandby * 100);
    }

    renderCollapsed() {
        return (
            <SevenSegmentNumber max={999.99} numDecimals={2} dataRef={this.dataRefActive}>{this.state.frequencyActive}</SevenSegmentNumber>
        )
    }

    renderExpanded() {
        return (
            <radio-active-standby>
                <SevenSegmentNumber dataRef={this.dataRefActive} max={999.99} numDecimals={2}
                                    nanText="NaN">{this.state.frequencyActive}</SevenSegmentNumber>
                <button className="switchButton" onClick={this.switchFrequencies.bind(this)}/>
                <SevenSegmentNumber dataRef={this.dataRefStandby} max={999.99} numDecimals={2}
                                    nanText="NaN">{this.state.frequencyStandby}</SevenSegmentNumber>
                <DualShaftKnob max={this.props.max} min={this.props.min}
                               onChange={this.onNewKnobValue.bind(this)} value={this.state.frequencyStandby}/>
            </radio-active-standby>
        )
    }

    render() {
        return this.context.expanded ? this.renderExpanded() : this.renderCollapsed();
    }
}
function model(state, ownProps) {
    return {}
}

export default connect(model)(subscribeToDatarefs(RadioActiveStandby));

RadioActiveStandby.propTypes = {
    max: React.PropTypes.number,
    min: React.PropTypes.number
};

RadioActiveStandby.defaultProps = {
    dataRefs: ["sim/cockpit/radios/nav1_freq_hz", "sim/cockpit/radios/nav1_stdby_freq_hz"],
    max: 117.95,
    min: 108.00
};

RadioActiveStandby.contextTypes = {
    expanded: React.PropTypes.bool
};