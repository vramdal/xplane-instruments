import * as React from 'react';
import {store} from 'redux';
import './ScrollKnob.scss';

export default class ScrollKnob extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vertical: 0,
            horizontal: 0,
            rotationVertical: -90,
            rotationHorizontal: -90,
            scrollSize: (props.max - props.min) / props.precision
        };
        this.previousScroll = {
            left: 0,
            top: 0
        };
        this.totalScrolled = {
            left: 0,
            top: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        let scrollSize = (this.props.max - this.props.min) / this.props.precision;
        this.setState({scrollSize: scrollSize});
    }

    handleWheel(evt) {
        let deltaX =  evt.deltaX;
        let deltaY =  evt.deltaY;
        this.setState({horizontal: this.state.horizontal + deltaX, vertical: this.state.vertical + deltaY});
    }

    static restrain(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    static round(value, precision) {
        const exponent = 1/precision;
        return Math.round(value * exponent) / exponent;
    }

    handleScroll(evt) {
        if (this.dontHandle) {
            return;
        }
        let element = evt.target;
        let deltaPx = {
            x: (element.scrollLeft - this.previousScroll.left) * this.props.turnSpeed,
            y: (element.scrollTop - this.previousScroll.top) * this.props.turnSpeed
        };
        let deltaValue = {
            x: deltaPx.x * this.props.precision,
            y: deltaPx.y * this.props.precision
        };
        this.totalScrolled = {
            left: (this.totalScrolled.left + deltaPx.x) % this.state.scrollSize,
            top: (this.totalScrolled.top + deltaPx.y) % this.state.scrollSize
        };
        let newValue = {
            x: ScrollKnob.round(ScrollKnob.restrain(this.state.horizontal + deltaValue.x, this.props.min, this.props.max), this.props.precision),
            y: ScrollKnob.round(ScrollKnob.restrain(this.state.vertical + deltaValue.y, this.props.min, this.props.max), this.props.precision)
        };
        let rotation = {
            x: this.totalScrolled.left / this.state.scrollSize * 360 * this.props.turnFactor - 90,
            y: this.totalScrolled.top / this.state.scrollSize * 360 * this.props.turnFactor - 90
        };
        this.setState({horizontal: newValue.x, vertical: newValue.y, rotationVertical: rotation.y, rotationHorizontal: rotation.x});
        this.previousScroll = {left: element.scrollLeft, top: element.scrollTop};
        window.setTimeout(() => {
            if (this.dontHandle) {
                return;
            }
            this.dontHandle = true;
            this.previousScroll.left = 500;
            this.previousScroll.top = 500;
            element.scrollLeft = 500;
            element.scrollTop = 500;
            this.dontHandle = false;
        }, 20);
    }

    render() {
        return (
            <scroll-knob>
                <div className="label" style={{color: "white"}}>{`${this.state.horizontal} / ${this.state.vertical} - ${this.state.msg}`}</div>
                <div className="scroll-container" style={{
                    height: '200px',
                    width: '200px',
                    overflow: 'scroll',
                    WebkitOverflowScrolling: 'auto',
                    transform: `rotate(${this.state.rotationVertical}deg)`
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
    turnFactor: React.PropTypes.number.isRequired,
    turnSpeed: React.PropTypes.number.isRequired,
    allowScrollPastBoundaries: React.PropTypes.bool.isRequired
};

ScrollKnob.defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    precision: 0.05,
    scrollSize: 2000,
    turnFactor: 2,
    // turnSpeed: 0.25,
    turnSpeed: 2,
    allowScrollPastBoundaries: false
};