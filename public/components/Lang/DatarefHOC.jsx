import React from 'react';
import {subscribeToDataRef, dataRefValueChangedOnClient} from '../../actions/DataRefActions.js';
import { connect } from 'react-redux';
import PulsingOrb from '../PulsingOrb/PulsingOrb.jsx';

export function subscribeToDataref(ComponentClass) {


    let datarefHOCClass = class DatarefHOC extends React.Component {

        componentDidMount() {
            this.props.subscribeToDataRef(this.props.dataRef, 1);
        }

        componentWillUnmount() {
            console.log("Unmounter ", ComponentClass, this.props.dataRef);
        }

        componentDidUpdate(prevProps, prevState) {
            if (!prevProps.orbState || prevProps.orbState.lastUpdate < this.props.orbState.lastUpdate) {
                this.orb.pulse();
            }
        }

        getDatarefString() {
            return this.props.dataRef;
        }

        onChangedOnClient(value) {
            console.log("value", value);
            this.props.dataRefValueChangedOnClient(this.props.dataRef, value);
        }

        render() {
            const hocProps = {
                datarefValue: this.props.datarefValue,
                onChangedOnClient: this.onChangedOnClient.bind(this)
            };
            return (
                <div>
                    <PulsingOrb
                        ref={(orb) => this.orb = orb}
                        color={!this.props.orbState.confirmed ? 'blue': 'white'}
                        pulsing={this.props.orbState.confirmed}
                        visible={!this.props.orbState.confirmed}>
                    </PulsingOrb>
                    <ComponentClass {...this.props} {...hocProps}>
                        {this.props.children}
                    </ComponentClass>
                </div>
            );
        }
    };
    datarefHOCClass.propTypes = {
        dataRef: React.PropTypes.string,
        datarefValue: React.PropTypes.number
    };

    function mapStateToProps(state, ownProps) {
        return {
            datarefValue: state.xplane.values[ownProps.dataRef] && state.xplane.values[ownProps.dataRef].value,
            orbState: {
                confirmed: state.xplane.values[ownProps.dataRef] && state.xplane.values[ownProps.dataRef].confirmed,
                lastUpdate: state.xplane.datarefTimestamps[ownProps.dataRef] || 0,
            }
        }
    }

    return connect(mapStateToProps, {dataRefValueChangedOnClient, subscribeToDataRef})(datarefHOCClass);
}