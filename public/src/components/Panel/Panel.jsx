import React from 'react';
import './Panel.scss';

export default class Panel extends React.Component {

    render() {
        let titleEl = this.props.title ?
                <legend className="panel-title">{this.props.title}</legend>
                : undefined;
        return (
                <fieldset className="panel">
                    {titleEl}
                    {this.props.children}
                </fieldset>
        );
    }

}

Panel.propTypes = {
    children: React.PropTypes.any,
    title: React.PropTypes.string
};