import React from 'react';
import SevenSegment from './SevenSegment.jsx';
import './style.scss';

export default class SevenSegmentNumber extends React.Component {

    render() {

        const maxDigits = Math.log(this.props.max) * Math.LOG10E + 1 | 0;
        let paddingChar = this.props.zeroPadding ? "0": " ";
        let value = parseFloat(this.props.children);
        let numModules = maxDigits + 1 + this.props.numDecimals;
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
    }

}

SevenSegmentNumber.propTypes = {
    max: React.PropTypes.number.isRequired,
    numDecimals: React.PropTypes.number.isRequired,
    zeroPadding: React.PropTypes.bool,
    nanText: React.PropTypes.string,
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
    zeroPadding: true
};