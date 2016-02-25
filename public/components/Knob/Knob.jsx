import React from 'react';
import './Knob.scss';
import './Knob.png';

const AXIS_HORIZONTAL = "horizontal";
const AXIS_VERTICAL = "vertical";

export default class Knob extends React.Component {


    constructor() {
        super();
        this._rotation = 0;
    }

    onDragStart() {
        //console.log("dragStart");
        let lastReportedMovement = 0;
        let moved = 0;
        let mouseMoveEventListener = function(evt) {
            if (evt.buttons == 0) {
                window.removeEventListener("mousemove", mouseMoveEventListener, true);
            } else {
                let deltaAxis = Math.abs(evt.movementX) > Math.abs(evt.movementY) ? AXIS_HORIZONTAL : AXIS_VERTICAL;
                if (deltaAxis == this.props.axis) {
                    let delta = this.props.axis === AXIS_HORIZONTAL ? evt.movementX : evt.movementY;
                    moved += delta;
                    if (Math.abs(moved - lastReportedMovement) > 10) {
                        lastReportedMovement = moved;
                        this.onChange(Math.round(moved / 10));
                    }
                    this.rotation += (0.01 * delta);
                    //console.log("Rotasjon", this.rotation, "akse", this.props.axis, evt.movementX, evt.movementY);

                }
                if(evt.stopPropagation) evt.stopPropagation();
                if(evt.preventDefault) evt.preventDefault();
                evt.cancelBubble=true;
                evt.returnValue=false;
                return false;
            }
        }.bind(this);
        window.addEventListener("mousemove", mouseMoveEventListener, true);
    }

    onChange(changedAmount) {
        console.log("changedAmount =", changedAmount);
        if (this.props.onchange) {
            this.props.onchange(changedAmount);
        }
    }

    set rotation(turns) {
        this._rotation = turns;
        this.element.style.transform = "rotate(" + this._rotation + "turn)";
    }

    get rotation() {
        return this._rotation;
    }

    componentDidMount() {
        this.element.addEventListener("mousedown", this.onDragStart.bind(this, event));
        this.rotation = 0;
    }

    componentDidUpdate() {
        //this.rotation = this.props.rotation;
    }

    render() {
        let rotation = this.rotation;
        return (
                <knob className={this.props.className} ref={ref => this.element = ref}
                      style={{transform: 'rotate(' + rotation + 'turn)'}}
                >{this.props.children}
                </knob>
        );
    }

}

Knob.propTypes = {
    //rotation: React.PropTypes.number,
    axis: React.PropTypes.oneOf([AXIS_HORIZONTAL, AXIS_VERTICAL]).isRequired,
    children: React.PropTypes.any,
    onchange: React.PropTypes.func,
    className: React.PropTypes.string
};

Knob.defaultProps = {
    //rotation: 0.2,
    axis: "horizontal"
};