import { combineReducers } from 'redux';
import { dataIndex } from './dataIndex';
import { connectionState } from './connectionState';
import { dataRef } from './dataRef';
import { subscriptions } from './subscriptions';
import { xplane } from './xplane';

export default combineReducers({connectionState, xplane});
