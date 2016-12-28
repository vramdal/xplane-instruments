import * as React from 'react';
import './StatusLight.scss';
import classNames from 'classnames';

export default class StatusLight extends React.Component {


    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className={classNames("status-light", this.props.status)}></div>
        );
    }
}

StatusLight.propTypes = {
    status: React.PropTypes.oneOf(["on", "off", "no"])
};