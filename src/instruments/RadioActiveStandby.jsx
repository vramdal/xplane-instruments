import React from 'react';
import './RadioActiveStandby.scss';
// import Knob from '../components/Knob/Knob.jsx';
import { connect } from 'react-redux';
// import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';
import DualShaftKnob from '../components/ScrollKnob/DualShaftKnob.jsx';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
import { subscribeToDatarefs } from '../components/Lang/MultiDatarefHOC.jsx';
import SpeechCommandHOC from '../components/Speech/SpeechCommandHOC.jsx';
import * as Constants from '../definitions/constants';

export class RadioActiveStandby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            frequencyActive: props.dataRefValues && props.dataRefValues[0] || 0,
            frequencyStandby: props.dataRefValues && props.dataRefValues[1] || 0
        };
        this.dataRefActive = props.dataRefs[0];
        this.dataRefStandby= props.dataRefs[1];
    }

    componentDidMount() {
        this.props.registerKeyReceptor(this.handleKey.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({frequencyActive: nextProps.dataRefValues[0], frequencyStandby: nextProps.dataRefValues[1]});
    }

    getDataRefs() {
        return [this.props.dataRefs[0], this.props.dataRefs[1]];
    }


    onNewKnobValue(newValue) {
        // this.props.onChangedOnClient(this.dataRefStandby, (this.state.frequencyStandby + changedBy) * 100);
        this.props.onChangedOnClient(this.dataRefStandby, (newValue));
    }

    switchFrequencies() {
        let frequencyActive = this.state.frequencyActive;
        let frequencyStandby = this.state.frequencyStandby;
        this.props.onChangedOnClient(this.dataRefStandby, frequencyActive);
        this.props.onChangedOnClient(this.dataRefActive, frequencyStandby);
    }

    onSpeechCommand(userSaid, commandText, phrases, dataRef) {
        console.trace("RadioActiveStandby.onSpeechCommand", arguments);
    }

    handleKey(evt) {
        if (evt.keyCode === 32) {
            this.switchFrequencies();
            evt.preventDefault();
            evt.stopPropagation();
        } else {
            this.keyReceptor(evt);
        }
    }

    registerKeyReceptor(keyReceptor) {
        this.keyReceptor = keyReceptor;
    }

    render() {
        return (
            <div className="radio-active-standby" ref={root => this.root = root}>
                {this.props.title}:
                <SevenSegmentNumber dataRef={this.dataRefActive} max={999.99} numDecimals={2}
                                    nanText="NaN">{this.state.frequencyActive}</SevenSegmentNumber>

                {this.props.expanded &&    <button className="switchButton" onClick={this.switchFrequencies.bind(this)}/>}
                {this.props.expanded &&    <SevenSegmentNumber dataRef={this.dataRefStandby} max={999.99} numDecimals={this.props.decimals} readOnly={false}
                                                               onChange={this.onNewKnobValue.bind(this)}
                                                               nanText="NaN">{this.state.frequencyStandby}</SevenSegmentNumber>}
                {this.props.expanded &&    <DualShaftKnob max={this.props.max} min={this.props.min} captureAll={this.props.expanded}
                                                          onChange={this.onNewKnobValue.bind(this)} value={this.state.frequencyStandby}
                                                          ref={knob => this.knob = knob}
                                                          registerKeyReceptor={this.registerKeyReceptor.bind(this)}
                /> }
            </div>
        )

    }
}
function model(state, ownProps) {
    return {}
}

export default connect(model)(subscribeToDatarefs(SpeechCommandHOC(RadioActiveStandby)));

RadioActiveStandby.propTypes = {
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    expanded: React.PropTypes.bool,
    registerKeyReceptor: React.PropTypes.func,
    title: React.PropTypes.string,
    decimals: React.PropTypes.number
};

RadioActiveStandby.defaultProps = {
    dataRefs: ["sim/cockpit/radios/nav1_freq_hz", "sim/cockpit/radios/nav1_stdby_freq_hz"],
    max: 117.95,
    min: 108.00,
    expanded: true,
    decimals: 2
};