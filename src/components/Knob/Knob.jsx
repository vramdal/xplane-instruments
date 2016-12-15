import React from 'react';
import './Knob.scss';
import './Knob.png';
import Rotation from 'react-rotation';

const AXIS_HORIZONTAL = "horizontal";
const AXIS_VERTICAL = "vertical";

export default class Knob extends React.Component {


    constructor() {
        super();
    }


    onChange(changedAmount) {
        if (this.props.onchange) {
            this.props.onchange(changedAmount);
        }
    }

    render() {
        let rotation = this.rotation;
        return (
            <Rotation className="rotation major" cycle>
                <div><div className="knob" style={{transform: 'rotate(0deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(36deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(72deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(108deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(144deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(180deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(216deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(252deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(288deg)', width: '100px', height: '100px'}}></div></div>
                <div><div className="knob" style={{transform: 'rotate(324deg)', width: '100px', height: '100px'}}></div></div>
            </Rotation>
        );
    }

}

Knob.propTypes = {
    //rotation: React.PropTypes.number,
    axis: React.PropTypes.oneOf([AXIS_HORIZONTAL, AXIS_VERTICAL]).isRequired,
    children: React.PropTypes.any,
    onchange: React.PropTypes.func,
    className: React.PropTypes.string,
    deadZone: React.PropTypes.number.isRequired
};

Knob.defaultProps = {
    //transform: 'rotate(0.2)',
    axis: "horizontal",
    deadZone: 90
};