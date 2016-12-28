import * as React from 'react';
import './Autopilot.scss';
import { connect } from 'react-redux';
import SevenSegmentNumber from '../components/SevenSegment/SevenSegmentNumber.jsx';
//import classNames from 'classnames';
import { subscribeToDatarefs } from '../components/Lang/MultiDatarefHOC.jsx';

class Autopilot extends React.Component {


    constructor(props) {
        super(props);
        this.state = this.calcState(props);
    }

    calcState(props) {
        return {
            heading: props.dataRefValues && props.dataRefValues[0] || 0,
            vspeed: props.dataRefValues && props.dataRefValues[1] || 0,
            altitude: props.dataRefValues && props.dataRefValues[2] || 0
        };
    }

    /* Mounting */
    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    /* Updating */
    componentWillReceiveProps(nextProps) {
        this.setState(this.calcState(nextProps));
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    getDataRefs() {
        return [this.props.dataRefs[0], this.props.dataRefs[1], this.props.dataRefs[2]];
    }

    onInput(dataref, newValue) {
        // this.props.onChangedOnClient(this.dataRefStandby, (this.state.frequencyStandby + changedBy) * 100);
        this.props.onChangedOnClient(dataref, newValue);
    }


    render() {
        return (
            <div className="autopilot">
                Heading:
                <SevenSegmentNumber dataRef={this.getDataRefs()[0]} max={360} numDecimals={0} readOnly={false}
                                    nanText="NaN"
                onChange={this.onInput.bind(this, this.getDataRefs()[0])}>{this.state.heading}</SevenSegmentNumber>
                Altitude:
                <SevenSegmentNumber dataRef={this.getDataRefs()[2]} max={99999.99} numDecimals={0} readOnly={false}
                                                               nanText="NaN"
                                    onChange={this.onInput.bind(this, this.getDataRefs()[2])}>{this.state.altitude}</SevenSegmentNumber>
                Vertical speed:
                <SevenSegmentNumber dataRef={this.getDataRefs()[1]} max={9999} min={-9999} numDecimals={0} readOnly={false}
                                                               nanText="NaN"
                                    onChange={this.onInput.bind(this, this.getDataRefs()[1])}>{this.state.vspeed}</SevenSegmentNumber>
            </div>
        );
    }

}

function model(state, ownProps) {
    return {}
}

export default connect(model)(subscribeToDatarefs(Autopilot));

Autopilot.propTypes = {
};


Autopilot.defaultProps = {
    dataRefs: ["sim/cockpit/autopilot/heading_mag", "sim/cockpit/autopilot/vertical_velocity", "sim/cockpit/autopilot/altitude"]
};