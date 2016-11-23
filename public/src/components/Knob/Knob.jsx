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

    onDragStart(evt) {
        let lastReportedMovement = 0;
        let clientSize = this.props.axis === AXIS_HORIZONTAL ? evt.clientX : evt.clientY;
        let dragStart = {x: evt.clientX, y: evt.clientY};
        console.log("dragStart =", dragStart);
        let startMoveFrom0 = this.props.axis === AXIS_HORIZONTAL ? evt.offsetX : evt.offsetY;
        let startMoveFromCenter = Math.abs(startMoveFrom0 - clientSize/2);
        let mouseMoveEventListener = function(evt) {
            if (evt.buttons == 0) {
                window.removeEventListener("mousemove", mouseMoveEventListener, true);
            } else {
                let deltaAxis = Math.abs(evt.movementX) > Math.abs(evt.movementY) ? AXIS_HORIZONTAL : AXIS_VERTICAL;
                if (deltaAxis == this.props.axis) {
                    //let delta = this.props.axis === AXIS_HORIZONTAL ? evt.movementX : evt.movementY * -1;
                    let delta = deltaAxis == AXIS_HORIZONTAL ? evt.clientX - dragStart.x : evt.clientY - dragStart.y;
                    if (Math.abs(delta - lastReportedMovement) > 10) {
                        let movedPoints = Math.round((delta - lastReportedMovement) / 10);
                        lastReportedMovement = delta;
                        console.log("movedPoints =", movedPoints);
                        this.onChange(movedPoints);
                    }
                    this.rotation += (0.001 * (deltaAxis == AXIS_HORIZONTAL ? evt.movementX : evt.movementY) );

                }
                if(evt.stopPropagation) evt.stopPropagation();
                if(evt.preventDefault) evt.preventDefault();
                evt.cancelBubble=true;
                evt.returnValue=false;
                return false;
            }
        }.bind(this);
        window.addEventListener("mousemove", mouseMoveEventListener, true);
        return true;
    }

    onChange(changedAmount) {
        if (this.props.onchange) {
            this.props.onchange(changedAmount);
        }
    }

    set rotation(turns) {
        this._rotation = turns;
        if (this.element) {
            this.element.style.transform = "rotate(" + this._rotation + "turn)";
        }
    }

    get rotation() {
        return this._rotation;
    }

    componentDidMount() {
        this.element.addEventListener("mousedown", event => this.onDragStart(event));
        this.rotation = 0;
    }

    onScroll(evt) {
        console.log("evt", evt);
    }

    componentDidUpdate() {
        //this.rotation = this.props.rotation;
    }

    render() {
        let rotation = this.rotation;
        return (
                <knob className={this.props.className + ' ' + this.props.axis+'-axis'} ref={ref => this.element = ref}
                      style={{transform: 'rotate(' + rotation + 'turn)'}} onScroll={this.onScroll.bind(this)}
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
    className: React.PropTypes.string,
    deadZone: React.PropTypes.number.isRequired
};

Knob.defaultProps = {
    //rotation: 0.2,
    axis: "horizontal",
    deadZone: 90
};