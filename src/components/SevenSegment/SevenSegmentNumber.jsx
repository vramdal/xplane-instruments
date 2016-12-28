import React from 'react';
import SevenSegment from './SevenSegment.jsx';
import './style.scss';

export default class SevenSegmentNumber extends React.Component {


    constructor(props) {
        super(props);
        this.state = {unsavedValue: props.children + ""}
    }

    componentWillReceiveProps(nextProps) {
        if (!this.hasUnsavedChanges) {
            this.setState({unsavedValue: nextProps.children})
        }
    }

    render() {
        if (this.props.readOnly) {

            let digitsForMaxNumber = Math.log(this.props.max) * Math.LOG10E + 1 | 0;
            let maxDigits = this.props.digits || digitsForMaxNumber;
            let paddingChar = this.props.zeroPadding ? "0": " ";
            let value = parseFloat(this.props.children);
            let numModules = maxDigits + this.props.numDecimals;
            let formatted;
            if (isNaN(value)) {
                formatted = "NaN";
                while (formatted.length < numModules) {
                    formatted = " " + formatted;
                }
            } else {
                formatted = value.toFixed(this.props.numDecimals);
                while (formatted.length < numModules) {
                    formatted = paddingChar + formatted;
                }
            }
            let elements = [];
            for (let i = 0; i < formatted.length; i++) {
                elements.push(
                    <SevenSegment key={"seven-segment-" + i}>{formatted[i]}</SevenSegment>
                )
            }

            return (
                <seven-segment-number>
                    {elements}
                </seven-segment-number>
            );
        } else {
            return <input type="number"
                          min={this.props.min}
                          max={this.props.max}
                          value={this.state.unsavedValue}
                          onChange={(evt) => this.onChanged(evt)}
                          onKeyPress={(evt) => this.onChanged(evt)}
            />;
        }
    }

    onChanged(evt) {
        let value = evt.target.value;
        if (evt.key === "-") {
            evt.preventDefault();
            value = value * -1;
        }
        this.setState({unsavedValue: value + ""});
        console.log("evt.target.value", value, "unsavedValue", this.state.unsavedValue);
        this.hasUnsavedChanges = true;
        window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(() => {
            this.hasUnsavedChanges = false;
            this.props.onChange(parseFloat(this.state.unsavedValue));
        }, 2000);
    }

}

SevenSegmentNumber.propTypes = {
    max: React.PropTypes.number.isRequired,
    numDecimals: React.PropTypes.number.isRequired,
    zeroPadding: React.PropTypes.bool,
    digits: React.PropTypes.number,
    nanText: React.PropTypes.string,
    readOnly: React.PropTypes.bool.isRequired,
    min: React.PropTypes.number,
    onChange: React.PropTypes.func,
    children: function(props, propName, componentName) {
        let val = props[propName];
        if (val === undefined && props["nanText"] === undefined) {
            return new Error("The value property is required, cannot be undefined");
        }
        if (val === undefined) {
            return;
        }
        if (isNaN(val)) {
            return new Error("The value must be a number, not " + val);
        }
        if (val > props.max) {
            return new Error("The value " + val + " is greater than the max value " + props.max);
        }
    }

};

SevenSegmentNumber.defaultProps = {
    numDecimals: 0,
    zeroPadding: true,
    readOnly: true
};