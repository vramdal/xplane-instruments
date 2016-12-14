import React from 'react';
import './Panel.scss';
import classNames from 'classnames';
import {expandPanel, collapsePanel} from "../../reducers/layout";
import { connect } from 'react-redux';
import SpeechCommandHOC from '../Speech/SpeechCommandHOC.jsx';
import * as Constants from "../../definitions/constants";

export class Panel extends React.Component {


    constructor() {
        super();
        this.refsToChildren = [];
    }

    expand() {
        if (!this.props.expanded) {
            this.props.dispatch(expandPanel(this.props.id));
        }
    }

    collapse() {
        if (this.props.expanded) {
            this.props.dispatch(collapsePanel(this.props.id));
        }
    }

    componentWillMount() {
        this.keyReceptors = [];
    }

    componentDidMount() {
        this.backdropClickEventListener = this.dialog.addEventListener('click', (event) => {
            var rect = this.dialog.getBoundingClientRect();
            var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                this.dialog.close();
            }
        });
        this.dialogCloseListener = this.dialog.addEventListener('close', () => {
            this.collapse();
        });
        this.keypressListener = function(evt) {
            if (this.props.expanded) {
                for (let identificator in this.keyReceptors) {
                    this.keyReceptors[identificator](evt);
                }
            }
        }.bind(this);
        window.addEventListener("keydown", this.keypressListener, false);
    }

    componentWillUnmount() {
        this.dialog.removeEventListener('click', this.backdropClickEventListener);
        this.dialog.removeEventListener('close', this.dialogCloseListener);
        window.removeEventListener("keydown", this.keypressListener);
        this.keyReceptors = [];
    }

    componentDidUpdate() {
        if (this.props.expanded && !this.dialog.open) {
            this.dialog.showModal();
        } else if (!this.props.expanded && this.dialog.open) {
            this.dialog.close();
        }
    }

    componentWillUpdate() {
        this.refsToChildren = [];
    }

    toggleExpand() {
        if (this.props.expanded) {
            this.props.dispatch(collapsePanel(this.props.id));
        } else {
            this.props.dispatch(expandPanel(this.props.id));
        }
    }

    getSpeechCommandStr() {
        return this.props.title;
    }

    onSpeechCommand(userSaid, commandText, phrases) {
        if (commandText === this.getSpeechCommandStr()) {
            this.expand();
        }
    }


    renderDialog() {
        return (
            <dialog className={classNames("expanded-panel-dialog", "expanded")} ref={dialog => this.dialog = dialog}>
                {this.renderCommon()}
            </dialog>
        );
    }

    render() {
        return (
            <section>
                {this.renderDialog()}
                {this.renderCollapsed()}
            </section>
        )
    }

    registerKeyReceptor(identificator, keyReceptor) {
        this.keyReceptors[identificator] = keyReceptor;
    }

    renderCollapsed() {
        return this.renderCommon();
    }

    renderCommon() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child, i) => React.cloneElement(child, {
                expanded: this.props.expanded,
                registerKeyReceptor: this.registerKeyReceptor.bind(this, `child-${i}`)
            })
        );
        let titleEl = this.props.title ?
                <legend className="panel-title" onClick={this.toggleExpand.bind(this)}>{this.props.title}</legend>
                : undefined;
        return (
                <fieldset className={classNames("panel", {expanded: this.props.expanded})} onClick={this.expand.bind(this)}>
                    {titleEl}
                    {childrenWithProps}
                </fieldset>
        );
    }
}

function model(state, ownProps) {
    return {
        expanded: state.layout.panels.find(panel => panel.expanded && panel.id === ownProps.id) !== undefined
    }
}

export default connect(model)(SpeechCommandHOC(Panel));

Panel.propTypes = {
    children: React.PropTypes.any,
    title: React.PropTypes.string,
    expanded: React.PropTypes.bool,
    id: React.PropTypes.string.isRequired
};

Panel.defaultProps = {
    expanded: false
};