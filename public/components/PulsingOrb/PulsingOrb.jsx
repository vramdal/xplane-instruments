import React from 'react';
import './PulsingOrb.scss';
import classNames from 'classnames';

export default class PulsingOrb extends React.Component {

    pulse() {
        if (!this.isPulsing) {
            this.isPulsing = window.setTimeout(() => {
                this.orb.classList.remove("single-pulse");
                window.clearTimeout(this.isPulsing);
                this.isPulsing = false;
            }, 1000);
            this.orb.classList.add("single-pulse");
        }
    }

    render() {
        return (
            <pulsing-orb ref={(orb) => this.orb = orb}
                         class={classNames({pulsing: this.props.pulsing, visible: this.props.visible})}
                         pulsing={this.props.pulsing}
                         visible={this.props.visible}
                         color={this.props.color}
            >◉︎</pulsing-orb>
        );
    }

}

PulsingOrb.propTypes = {
    visible: React.PropTypes.bool,
    pulsing: React.PropTypes.bool,
    color: React.PropTypes.string
};

PulsingOrb.defaultProps = {
    visible: true,
    pulsing: true,
    color: 'white'
};
