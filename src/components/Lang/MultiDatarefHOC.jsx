import React from 'react';
import {subscribeToDataRef, dataRefValueChangedOnClient} from '../../actions/DataRefActions.js';
import { connect } from 'react-redux';
import PulsingOrb from '../PulsingOrb/PulsingOrb.jsx';


export function subscribeToDatarefs(ComponentClass) {


    let datarefHOCClass = class MultiDatarefHOC extends React.Component {

        constructor(props) {
            super(props);
            this.dataRefs = Array.isArray(props.dataRefs) ? [props.dataRefs] : [props.dataRefs];
        }

        componentDidMount() {
            for (let dataRef of this.dataRefs) {
                this.props.subscribeToDataRef(dataRef, 1);
            }
        }

        componentWillUnmount() {
            console.log("Unmounter ", ComponentClass, this.dataRefs);
        }

        componentDidUpdate(prevProps, prevState) {
            if (!prevProps.orbState || prevProps.orbState.lastUpdate < this.props.orbState.lastUpdate) {
                this.orb.pulse();
            }
        }

        getDatarefStrings() {
            return this.props.dataRefs;
        }

        onChangedOnClient(dataRef, value) {
            console.log("value", value);
            this.props.dataRefValueChangedOnClient(dataRef, value);
        }

        render() {
            const hocProps = {
                datarefValues: this.props.datarefValues,
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
        dataRefs: React.PropTypes.arrayOf(React.PropTypes.string),
        dataRefValues: React.PropTypes.arrayOf(React.PropTypes.number)
    };

    function mapStateToProps(state, ownProps) {
        let dataRefValues = ownProps.dataRefs.map(dataRef => state.xplane.values[dataRef] && state.xplane.values[dataRef].value);
        let confirmed = ownProps.dataRefs
            .map(dataRef => state.xplane.values[dataRef] && state.xplane.values[dataRef.confirmed])
            .reduce((confirmed1, confirmed2) => confirmed1 && confirmed2, true);
        let timestamps = ownProps.dataRefs
            .map(dataRef => state.xplane.datarefTimestamps[dataRef] || 0)
            .reduce((timestamp1, timestamp2) => Math.min(timestamp1, timestamp2));
        return {
            dataRefValues: dataRefValues,
            orbState: {
                confirmed: confirmed,
                lastUpdate: timestamps,
            }
        }
    }

    return connect(mapStateToProps, {dataRefValueChangedOnClient, subscribeToDataRef})(datarefHOCClass);
}