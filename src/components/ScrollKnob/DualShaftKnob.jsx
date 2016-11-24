import * as React from 'react';
import {store} from 'redux';
import ScrollKnob, {DIRECTION_VERTICAL, DIRECTION_HORIZONTAL} from './ScrollKnob.jsx';
import './DualShaftKnob.scss';

export default class DualShaftKnob extends React.Component {


    constructor(props) {
        super(props);
        this.value = props.value;
    }

    onMinorKnobChange(newValue) {
        this.value = Math.floor(this.value) + newValue;
        if (this.props.onChange) {
            this.props.onChange(this.value);
        }
    }

    onMajorKnobChange(newValue) {
        this.value = this.value - Math.floor(this.value) + newValue;
        if (this.props.onChange) {
            this.props.onChange(this.value);
        }
    }

    render() {
        let fraction = this.props.value - Math.floor(this.props.value);
        let integer = Math.floor(this.props.value);
        return (
            <dual-shaft-knob>
                <ScrollKnob max={this.props.max}
                            min={this.props.min}
                            value={integer}
                            precision={1}
                            axis={DIRECTION_HORIZONTAL}
                            allowScrollPastBoundaries={this.props.allowScrollPastBoundaries}
                            onChange={this.onMajorKnobChange.bind(this)}
                />
                <ScrollKnob max={0.95}
                            min={0}
                            size={100}
                            value={fraction}
                            precision={this.props.precision}
                            axis={DIRECTION_VERTICAL}
                            allowScrollPastBoundaries={this.props.allowScrollPastBoundaries}
                            onChange={this.onMinorKnobChange.bind(this)}
                />
            </dual-shaft-knob>
        );
    }

}

DualShaftKnob.propTypes = {
    max: React.PropTypes.number.isRequired,
    min: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    precision: React.PropTypes.number.isRequired,
    allowScrollPastBoundaries: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func
};

DualShaftKnob.defaultProps = {
    value: 195.95,
    min: 0,
    max: 200,
    precision: 0.05,
    // turnFactor: 1,
    // turnSpeed: 0.25,
    // turnSpeed: 2,
    allowScrollPastBoundaries: true
};