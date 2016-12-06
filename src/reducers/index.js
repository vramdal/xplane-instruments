import { combineReducers } from 'redux';
import { dataIndex } from './dataIndex';
import { connectionState } from './connectionState';
import { dataRef } from './dataRef';
import { subscriptions } from './subscriptions';
import { xplane } from './xplane';
import { layoutState as layout } from './layout';

export default combineReducers({connectionState, xplane, layout});
