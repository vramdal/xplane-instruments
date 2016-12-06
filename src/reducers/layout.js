export const EXPAND_PANEL = "EXPAND_PANEL";
export const COLLAPSE_PANEL = "COLLAPSE_PANEL";

export function layoutState(state = {panels: []}, action) {
    let result = Object.assign({}, state);
    switch (action.type) {
        case EXPAND_PANEL: {
            let panelId = action.panelId;
            let panels = state.panels.map(
                panel => {
                    if (panel.expanded && panel.id !== action.panelId) {
                        return Object.assign({}, panel, {expanded: false});
                    } else if (!panel.expanded && panel.id === action.panelId) {
                        return Object.assign({}, panel, {expanded: true});
                    } else {
                        return panel;
                    }
                }
            );
            if (!panels.find(panel => panel.id === panelId)) {
                panels.push({id: panelId, expanded: true});
            }
            result.panels = panels;
            return result;
        }
        case COLLAPSE_PANEL: {
            result.panels = state.panels.map(panel => panel.expanded ? Object.assign({}, panel, {expanded: false}) : panel);
            return result;
        }
    }
    return state;
}

export function expandPanel(panelId) {
    return {type: EXPAND_PANEL, panelId};
}

export function collapsePanel(panelId) {
    return {type: COLLAPSE_PANEL, panelId};
}