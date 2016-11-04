import React from 'react';
import {subscribeToDataRef} from '../../actions/DataRefActions.js';
import { connect } from 'react-redux';

export function subscribeToDataref(ComponentClass) {


    let datarefHOCClass = class DatarefHOC extends React.Component {

        componentDidMount() {
            this.props.dispatch(subscribeToDataRef(this.props.dataRef, 1));
        }

        componentWillUnmount() {
            console.log("Unmounter ", ComponentClass, this.props.dataRef);
        }

        getDatarefString() {
            return this.props.dataRef;
        }

        render() {
            const hocProps = {
                datarefValue: this.props.datarefValue
            };
            return (
                <ComponentClass {...this.props} {...hocProps}>
                    {this.props.children}
                </ComponentClass>
            );
        }
    };
    datarefHOCClass.propTypes = {
        dataRef: React.PropTypes.string,
        datarefValue: React.PropTypes.number
    };

    function mapStateToProps(state, ownProps) {
        return {
            datarefValue:  state.xplane.values[ownProps.dataRef] && state.xplane.values[ownProps.dataRef].value
        }
    }

    return connect(mapStateToProps)(datarefHOCClass);
}