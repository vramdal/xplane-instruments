import React from 'react';
import './Panel.scss';
import classNames from 'classnames';
import {expandPanel, collapsePanel} from "../../reducers/layout";
import { connect } from 'react-redux';

export class Panel extends React.Component {

    getChildContext() {
        return {expanded: this.props.expanded};
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
    }

    componentWillUnmount() {
        this.dialog.removeEventListener('click', this.backdropClickEventListener);
        this.dialog.removeEventListener('close', this.dialogCloseListener);
    }

    componentDidUpdate() {
        if (this.props.expanded && !this.dialog.open) {
            this.dialog.showModal();
        } else if (!this.props.expanded && this.dialog.open) {
            this.dialog.close();
        }
    }

    toggleExpand() {
        if (this.props.expanded) {
            this.props.dispatch(collapsePanel(this.props.id));
        } else {
            this.props.dispatch(expandPanel(this.props.id));
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

    renderCollapsed() {
        return this.renderCommon();
    }

    renderCommon() {
        let titleEl = this.props.title ?
                <legend className="panel-title" onClick={this.toggleExpand.bind(this)}>{this.props.title}</legend>
                : undefined;
        return (
                <fieldset className={classNames("panel", {expanded: this.props.expanded})} onClick={this.expand.bind(this)}>
                    {titleEl}
                    {this.props.children}
                </fieldset>
        );
    }
}

function model(state, ownProps) {
    return {
        expanded: state.layout.panels.find(panel => panel.expanded && panel.id === ownProps.id) !== undefined
    }
}

export default connect(model)(Panel);

Panel.propTypes = {
    children: React.PropTypes.any,
    title: React.PropTypes.string,
    expanded: React.PropTypes.bool,
    id: React.PropTypes.string.isRequired
};

Panel.defaultProps = {
    expanded: false
};

Panel.childContextTypes = {
    expanded: React.PropTypes.bool
};