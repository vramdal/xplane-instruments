import * as React from 'react';
import {store} from 'redux';
import './ScrollKnob.scss';

export const DIRECTION_HORIZONTAL = 0;
export const DIRECTION_VERTICAL = 1;
const INCREASE = 0;
const DECREASE = 1;

export default class ScrollKnob extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            rotation: props.startRotation,
            scrollSize: this._scrollSize(props)
        };
        this.accurateValue = props.value;
        this.totalScrolled = 0;
        this.previousScroll = 0;
    }

    _scrollSize(props) {
        return props.size * 10; // (props.max - props.min) / props.precision;
    }

    componentWillReceiveProps(nextProps) {
        let scrollSize = this._scrollSize(nextProps);
        this.setState({scrollSize: scrollSize, value: nextProps.value});
        this.accurateValue = nextProps.value;
    }

    static restrain(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    static round(value, precision) {
        const exponent = 1/precision;
        return Math.round(value * exponent) / exponent;
    }

    calculateNewValue(oldValue, rotationChangeDeg) {
        return oldValue + (rotationChangeDeg * (this.props.reverse ? 1 : -1)) / 360 * (this.props.max - this.props.min) / this.props.numberOfTurns
    }

    dir(horizontal, vertical) {
        if (this.props.axis === DIRECTION_HORIZONTAL) {
            return horizontal;
        } else {
            return vertical;
        }
    }

    handleScroll(evt) {
        if (this.dontHandle) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        let element = evt.target;
        let deltaPx = {
            left: (element.scrollLeft - this.previousScroll) * this.props.turnSpeed,
            top: (element.scrollTop - this.previousScroll) * this.props.turnSpeed
        };
        let axis = Math.abs(deltaPx.left) > Math.abs(deltaPx.top) ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL;
        if (axis !== this.props.axis) {
            return;
        }
        let totalScrolled = (this.totalScrolled + this.dir(deltaPx.left, deltaPx.top)) % this.state.scrollSize;
        let deltaValue = this.dir(deltaPx.left, deltaPx.top);
        let direction = deltaValue < 0 ? DECREASE : INCREASE;
        let rotation = totalScrolled / this.state.scrollSize * 360 + this.props.startRotation;
        if (rotation < 0) {
            rotation = 360 + rotation;
        }
        let rotationChangeDeg = this.state.rotation - rotation;
        if (Math.abs(rotationChangeDeg) >= 180) {
            if (direction === INCREASE) {
                rotationChangeDeg = rotationChangeDeg - 360;
            } else {
                rotationChangeDeg = 360 + rotationChangeDeg;
            }
        }
        let unrestrainedValue = this.calculateNewValue(this.accurateValue, rotationChangeDeg);
        if (this.props.circular && unrestrainedValue !== accurateValue) {
            if (unrestrainedValue < this.props.min) {
                unrestrainedValue = this.props.max + unrestrainedValue;
            } else if (unrestrainedValue > this.props.max) {
                unrestrainedValue = unrestrainedValue - this.props.max
            }
        }
        let accurateValue = ScrollKnob.restrain(unrestrainedValue, this.props.min, this.props.max);
        // let outOfBounds = unrestrainedValue != accurateValue; // TODO
        let newValue = ScrollKnob.round(accurateValue, this.props.precision);
        this.accurateValue = accurateValue;
        this.totalScrolled = totalScrolled;
        let wasChanged = this.state.value !== newValue;
        this.setState({value: newValue, rotation: rotation});
        this.previousScroll = this.dir(element.scrollLeft, element.scrollTop);

        window.setTimeout(() => {
            if (this.dontHandle) {
                return;
            }
            this.dontHandle = true;
            let neutral = this.state.scrollSize / 4;
            this.previousScroll = neutral;
            element.scrollLeft = neutral;
            element.scrollTop = neutral;
            this.dontHandle = false;
            if (wasChanged && this.props.onChange) {
                console.log("this.state.value", this.state.value);
                this.props.onChange(this.state.value);
            }
        }, 5);
    }

    render() {
        return (
            <scroll-knob>
                {/*<div className="label" style={{color: "white"}}>{`Verdi: ${this.state.value}`}</div>*/}
                {/*<div className="label" style={{color: "white"}}>{`TotalScrolled: ${this.totalScrolled}`}</div>*/}
                {/*<div className="label" style={{color: "white"}}>{`Rotation: ${Math.round(this.state.rotation, 1)}`}</div>*/}
                <div className="scroll-container knob" style={{
                    height: `${this.props.size}px`,
                    width: `${this.props.size}px`,
                    overflow: 'scroll',
                    WebkitOverflowScrolling: 'auto',
                    transform: `rotate(${this.state.rotation}deg)`
                }} onScroll={this.handleScroll.bind(this)}>
                    <div className="moveable" style={{height: `${this.state.scrollSize}px`, width: `${this.state.scrollSize}px`}}></div>
                </div>
            </scroll-knob>
        );
    }
}

ScrollKnob.propTypes = {
    max: React.PropTypes.number.isRequired,
    min: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    precision: React.PropTypes.number.isRequired,
    turnSpeed: React.PropTypes.number.isRequired,
    allowScrollPastBoundaries: React.PropTypes.bool.isRequired,
    axis: React.PropTypes.oneOf([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]),
    size: React.PropTypes.number.isRequired,
    startRotation: React.PropTypes.number.isRequired,
    numberOfTurns: React.PropTypes.number.isRequired,
    reverse: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func,
    circular: React.PropTypes.bool,
    captureAll: React.PropTypes.bool
};

ScrollKnob.defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    precision: 0.05,
    scrollSize: 2000,
    // turnSpeed: 0.25,
    turnSpeed: 1,
    allowScrollPastBoundaries: false,
    axis: DIRECTION_VERTICAL,
    size: 200,
    startRotation: -90,
    numberOfTurns: 1,
    reverse: false,
    circular: false,
    captureAll: false
};