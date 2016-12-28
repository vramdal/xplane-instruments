import * as React from 'react';
import { connect } from 'react-redux';
import { subscribeToDataref } from '../components/Lang/DatarefHOC.jsx';
import StatusLight from '../components/Light/StatusLight.jsx';

class LandingGear extends React.Component {


    constructor() {
        super();
        this.state = {}
    }

    valueToStatus() {
        switch (this.props.datarefValue) {
            case 0: return "off";
            case 1: return "on";
            case 2: return "no";
        }
    }

    render() {
        return (
            <StatusLight status={this.valueToStatus()}/>
        );
    }

}

function model() {
    return {};
}

export default connect(model)(subscribeToDataref(LandingGear));