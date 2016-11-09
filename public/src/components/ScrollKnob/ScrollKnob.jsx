import * as React from 'react';
import {store} from 'redux';

export default class ScrollKnob extends React.Component {

    constructor() {
        super();
        this.state = {
            vertical: 0,
            horizontal: 0
        };
        this.previousScroll = {
            left: 0,
            top: 0
        };
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
            x: element.scrollLeft - this.previousScroll.left,
            y: element.scrollTop - this.previousScroll.top
        };
        let deltaValue = {
            x: deltaPx.x * this.props.precision,
            y: deltaPx.y * this.props.precision
        };
        let newValue = {
            x: ScrollKnob.round(ScrollKnob.restrain(this.state.horizontal + deltaValue.x, this.props.min, this.props.max), this.props.precision),
            y: ScrollKnob.round(ScrollKnob.restrain(this.state.vertical + deltaValue.y, this.props.min, this.props.max), this.props.precision)
        };
        this.setState({horizontal: newValue.x, vertical: newValue.y});
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
        let scrollSize = (this.props.max - this.props.min) / this.props.precision;
        return (
            <div className="scroll-knob">
                <div className="label" style={{color: "white"}}>{`${this.state.horizontal} / ${this.state.vertical} - ${this.state.msg}`}</div>
                <div className="scroll-container" style={{height: '200px', width: '200px', border: '1px solid white', overflow: 'scroll'}} onScroll={this.handleScroll.bind(this)}>
                    <div className="moveable" style={{height: `${scrollSize}px`, width: `${scrollSize}px`, backgroundColor: 'yellow'}}></div>
                </div>
            </div>

        );
    }
}

ScrollKnob.propTypes = {
    max: React.PropTypes.number.isRequired,
    min: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    precision: React.PropTypes.number.isRequired,
    scrollSize: React.PropTypes.number.isRequired
};

ScrollKnob.defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    precision: 0.05,
    scrollSize: 2000
};